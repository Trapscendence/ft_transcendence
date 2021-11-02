import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PUB_SUB } from 'src/pubsub.module';
import { UsersService } from 'src/users/users.service';
import { schema } from 'src/utils/envs';
import { Notify, ChannelNotify, Channel } from './models/channel.medel';
import { PubSub } from 'graphql-subscriptions';
import { MutedUsers } from './classes/mutedusers.class';
import { User } from 'src/users/models/user.medel';

@Injectable()
export class ChannelsService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {
    this.mutedUsers = new MutedUsers();
  }
  private mutedUsers: MutedUsers;

  /*
   ** ANCHOR: Query
   */

  // TODO: 메모리상의 cache도 구현해서 성능 더 빠르게 개선할 수도?
  // TODO: await를 병렬처리해서 성능 개선해야
  async getChannel(channel_id: string): Promise<Channel> {
    const array = await this.databaseService.executeQuery(`
      SELECT
        c.id
          AS id
        c.title
          AS title
        CASE
          WHEN
            c.password IS NULL
          THEN
            false
          ELSE
            true
        END
          AS is_private
      FROM
        ${schema}.channel
      WHERE
        c.id = ${channel_id};
    `);

    return !array.length ? null : array[0];
  }

  async getChannels(offset: number, limit: number): Promise<Channel[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        title,
        CASE
          WHEN
            password IS NULL
          THEN
            false
          ELSE
            true
        END
          AS is_private
        FROM ${schema}.channel
      OFFSET ${offset} ROWS
      LIMIT ${!limit ? 'ALL' : `${limit}`};
    `);
  }

  /*
   ** ANCHOR: Mutation
   */

  async addChannel(
    title: string,
    password: string,
    owner_user_id: string,
  ): Promise<Channel> {
    const inChannel = await this.databaseService.executeQuery(`
      SELECT
        cu.user_id
      FROM
        ${schema}.channel_user cu
      WHERE
        cu.user_id = ${owner_user_id};
    `);
    if (inChannel.length > 0) return null;

    const [{ id }] = password
      ? await this.databaseService.executeQuery(`
        INSERT INTO
          ${schema}.channel(
            title,
            password
          )
          VALUES (
            '${title}',
            '${password}'
          )
          RETURNING id;
      `)
      : await this.databaseService.executeQuery(`
        INSERT INTO
          ${schema}.channel(
            title,
            password
          )
        VALUES (
          '${title}',
          NULL
        )
        RETURNING id;
      `);

    await this.databaseService.executeQuery(`
      INSERT INTO
        ${schema}.channel_user(
          user_id,
          channel_id,
          channel_role
        )
      VALUES(
        ${owner_user_id},
        ${id},
        'OWNER'
      )
      ON CONFLICT
        ON CONSTRAINT
          uniq_user_id
      DO NOTHING;
    `);

    return {
      id,
      title,
      is_private: password ? true : false,
      owner: null,
      administrators: [],
      participants: [], // NOTE: owner, admin 포함한 참가자로 하자...
      bannedUsers: [],
      mutedUsers: [],
    };
  }

  async editChannel(
    channel_id: string,
    title: string,
    password: string,
  ): Promise<Channel> {
    const array = await this.databaseService.executeQuery(`
      UPDATE
        ${schema}.channel c
      SET (
        c.title,
        c.password
      ) = (
        ${title}
        ${password === '' ? 'NULL' : password}
      )
      WHERE
        c.id = ${channel_id}
      RETURNING
        c.id id,
        c.title title,
        ${password === '' ? 'false' : 'true'} is_private;
    `);
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.EDIT,
        participant: null,
        text: array[0].title,
        check: array[0].is_private,
      },
    });
    return array[0];
  }

  async deleteChannel(channel_id: string): Promise<boolean> {
    // TODO: 여러 쿼리를 아마 하나의 쿼리로 합칠 수 있을 듯

    const array = await this.databaseService.executeQuery(`
    WITH
      del1
        AS (
          DELETE FROM
            ${schema}.channel_ban cb
          WHERE
            cb.channel_id
              IN (
                SELECT
                  c.id id
                FROM
                  ${schema}.channel c
                WHERE
                  c.id = ${channel_id}
              )
          RETURNING
            cb.channel_id id
        ),
        del2
          AS (
            DELETE FROM
              ${schema}.channel_user cu
            WHERE
              cu.channel_id
              IN (
                SELECT
                  c.id id
                FROM
                  ${schema}.channel c
                WHERE
                  c.id = ${channel_id}
              )
          )
    DELETE FROM
      ${schema}.channel c
    WHERE
       c.id = ${channel_id}
    RETURNING
      *
    `);
    if (array.length === 0) return false;
    this.mutedUsers.popChannel(channel_id);
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.DELETE,
        participant: null,
        text: null,
        check: null,
      },
    });
    return true; // TODO: 임시로 true만 반환하도록 함. 수정 필요!
  }

  muteUserOnChannel(
    channel_id: string,
    user_id: string,
    mute_time: number,
  ): boolean {
    this.mutedUsers.pushUser(channel_id, user_id);
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.MUTE,
        participant: this.usersService.getUserById(user_id),
        text: null,
        check: true,
      },
    });
    setTimeout((): void => {
      if (!this.mutedUsers.popUser(channel_id, user_id)) return;
      this.pubSub.publish(`to_channel_${channel_id}`, {
        subscribeChannel: {
          type: Notify.MUTE,
          participant: this.usersService.getUserById(user_id),
          text: null,
          check: false,
        },
      });
    }, mute_time * 1000);
    return true;
  }

  unmuteUserFromChannel(channel_id: string, user_id: string): boolean {
    if (!this.mutedUsers.popUser(channel_id, user_id)) return false;
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.MUTE,
        participant: this.usersService.getUserById(user_id),
        text: null,
        check: false,
      },
    });
    return true;
  }

  async kickUserFromChannel(
    channel_id: string,
    user_id: string,
  ): Promise<boolean> {
    const array = await this.databaseService.executeQuery(`
      DELETE FROM
        ${schema}.channel_user
      WHERE
        channel_id = ${channel_id}
          AND
        user_id = ${user_id}
      RETURNING
        *;
    `);
    if (!array.length) return false;
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.KICK,
        participant: user_id,
        text: null,
        check: true,
      },
    });
  }

  async banUserFromChannel(
    channel_id: string,
    user_id: string,
  ): Promise<boolean> {
    const array = await this.databaseService.executeQuery(`
      WITH
        banned
          AS (
            DELETE FROM
              ${schema}.channel_user
            WHERE
              channel_id = ${channel_id}
                AND
              user_id = ${user_id}
            RETURNING
              channel_id,
              user_id
          )
      INSERT INTO
        ${schema}.channel_ban(
          channel_id,
          banned_user
        )
      VALUES (
        banned.channel_id,
        banned.user_id
      )
      ON CONSTRAINT
        UNIQUE (
          ${schema}.channel_ban.channel_id,
          ${schema}.channel_ban.banned_user
        )
      RETURNING
        *;
    `);
    if (!array.length) return false;
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.BAN,
        participant: user_id,
        text: null,
        check: true,
      },
    });
    return true;
  }

  async unbanUserFromChannel(
    channel_id: string,
    user_id: string,
  ): Promise<boolean> {
    const array = await this.databaseService.executeQuery(`
      DELETE FROM
        ${schema}.channel_ban cb
      WHERE
        cb.channel_id = ${channel_id}
          AND
        cb.user_id = ${user_id}
      RETURNING
        *
    `);
    return !!array.length;
  }

  async chatMessage(
    channel_id: string,
    user_id: string,
    message: string,
  ): Promise<boolean> {
    if (message.length > 10000) throw new Error('message too long');
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.CHAT,
        participant: await this.usersService.getUserById(user_id),
        text: message,
        check: true,
      },
    });
    return true;
  }

  /*
   ** ANCHOR: ResolveField
   */

  async getOwner(channel_id: string): Promise<User> {
    const array = await this.databaseService.executeQuery(`
      SELECT
        u.id id,
        u.nickname nickname,
        u.avatar avatar,
        u.status_message status_message,
        u.rank_score rank_score,
        u.site_role site_role
      FROM
        ${schema}.user u
      INNER JOIN
        ${schema}.channel_user cu
          ON
            u.id = cu.user_id
      WHERE
        cu.channel_id = ${channel_id}
          AND
        cu.channel_role = 'OWNER';
    `);
    return array.length === 0 ? null : array[0];
  }

  async getAdministrators(channel_id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
    SELECT
      u.id,
      u.nickname,
      u.avatar,
      u.status_message,
      u.rank_score,
      u.site_role
    FROM
      ${schema}.user u
    INNER JOIN
      ${schema}.channel_user cu
        ON
          u.id = cu.user_id
    WHERE
      cu.channel_id = ${channel_id}
        AND
      cu.channel_role = 'ADMIN';
    `);
  }

  async getParticipants(channel_id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        u.id,
        u.nickname,
        u.avatar,
        u.status_message,
        u.rank_score,
        u.site_role
      FROM
        ${schema}.user u
      INNER JOIN
        ${schema}.channel_user cu
          ON
            u.id = cu.user_id
      WHERE
        cu.channel_id = ${channel_id}
    `);
  }

  async getBannedUsers(channel_id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        u.id id,
        u.nickname nickname,
        u.avatar avatar,
        u.status_message status_message,
        u.rank_score rank_score,
        u.site_role site_role
      FROM
        ${schema}.user u
        WHERE
          u.id
        IN (
          SELECT
            cb.banned_user
          FROM
            ${schema}.channel_ban cb
          WHERE
            cb.channel_id = ${channel_id}
        );
    `);
  }

  async getMutedUsers(channel_id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(
      `
      SELECT
        u.id id,
        u.nickname nickname,
        u.avatar avatar,
        u.status_message status_message,
        u.rank_score rank_score,
        u.site_role site_role
      FROM
        ${schema}.user u
      WHERE
        id = ANY ($1);
        `,
      [this.mutedUsers.getUserIds(channel_id)],
    );
  }
}
