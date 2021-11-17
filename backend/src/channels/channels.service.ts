import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { PUB_SUB } from 'src/pubsub.module';
import { UsersService } from 'src/users/users.service';
import { schema } from 'src/utils/envs';
import { Notify, Channel } from './models/channel.model';
import { PubSub } from 'graphql-subscriptions';
import { MutedUsers } from './classes/mutedusers.class';
import { User, UserRole } from 'src/users/models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChannelsService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {
    this.muted_users = new MutedUsers();
  }

  private muted_users: MutedUsers;

  /*
   ** ANCHOR: Query
   */

  async getChannel(channel_id: string): Promise<Channel> {
    const array = await this.databaseService.executeQuery(`
      SELECT
        c.id
          AS id,
        c.title
          AS title,
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
        ${schema}.channel c
      WHERE
        c.id = ${channel_id};
    `);

    if (!array.length) throw new BadRequestException('No such channel id.');
    return array[0];
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
      LIMIT ${limit ? limit : 'ALL'};
    `);
  }

  /*
   ** ANCHOR: Mutation
   */

  async enterChannel(
    user_id: string,
    channel_id: string,
  ): Promise<Channel | null> {
    const users = await this.databaseService.executeQuery(`
      SELECT
        banned_user
      FROM
        ${schema}.channel_ban
      WHERE
        banned_user = ${user_id}
          AND
        channel_id = ${channel_id};
    `); // ban 되어있는지 확인
    if (users.length)
      throw new ForbiddenException('The user is banned from channel.');

    const channels = await this.databaseService.executeQuery(`
      INSERT INTO
        ${schema}.channel_user(
          user_id,
          channel_id,
          channel_role
        )
      VALUES (
        (
          SELECT
            id
          FROM
            ${schema}.user
          WHERE
            id = ${user_id}
        ),
        (
          SELECT
            id
          FROM
            ${schema}.channel
          WHERE
            id = ${channel_id}
        ),
        'USER'
      )
      ON CONFLICT ( user_id )
        DO NOTHING
      RETURNING *;
    `);
    if (!channels.length)
      throw new ConflictException('user may already in a channel.');

    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.ENTER,
        participant: await this.usersService.getUserById(user_id),
        text: null,
        check: true,
      },
    });
    return await this.getChannel(channel_id);
  }

  async leaveChannel(user_id: string): Promise<boolean> {
    const myChannel = await this.databaseService.executeQuery(`
    DELETE FROM
    ${schema}.channel_user
    WHERE
    user_id = ${user_id}
    RETURNING channel_id, channel_role
    `);

    if (myChannel.length === 0) {
      throw new ConflictException(
        `This user(id: ${user_id}) does not belong to any channel`,
      );
    }

    const { channel_id, channel_role } = myChannel[0];

    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.ENTER,
        participant: await this.usersService.getUserById(user_id),
        text: null,
        check: false,
      },
    }); // 'user_id가 나갔습니다' 정보 전송

    if (channel_role !== UserRole.OWNER) {
      return true;
    }

    const participantsResult = await this.databaseService.executeQuery(`
      SELECT
        user_id,
        channel_role
      FROM
        ${schema}.channel_user
      WHERE
        channel_id = ${channel_id}
      ORDER BY
        channel_role DESC
    ;`);

    const successor = participantsResult[0]?.user_id;

    if (successor === undefined) {
      return this.deleteChannel(channel_id);
    } else {
      return this.updateChannelRole(successor, UserRole.OWNER);
    }
  }

  async addChannel(title: string, password: string): Promise<string> {
    const insertChannel: { id }[] = await this.databaseService.executeQuery(`
      INSERT INTO
        ${schema}.channel(
          title,
          password
        )
      VALUES (
        '${title}',
        '${password ? `${await this.hashPassword(password)}` : 'NULL'}'
      )
      RETURNING id;
    `);
    const { id: channel_id } = insertChannel[0] ?? {};

    if (channel_id === undefined) {
      throw new InternalServerErrorException(
        `Failed to insert channel(title: ${title}, hashed-password: -)`,
      );
    } else {
      this.muted_users.pushChannel(channel_id);
      return channel_id;
    }
  }

  async editChannel(
    channel_id: string,
    title: string,
    password: string,
  ): Promise<Channel> {
    const array = await this.databaseService.executeQuery(`
      UPDATE
        ${schema}.channel
      SET (
        title,
        password
      ) = (
        '${title}',
        '${password ? `${await this.hashPassword(password)}` : 'NULL'}'
      )
      WHERE
        id = ${channel_id}
      RETURNING
        id,
        title,
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
    if (!array.length)
      throw new ConflictException('The channel does not exist.');
    this.muted_users.popChannel(channel_id);
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

  async updateChannelMute(
    channel_id: string,
    user_id: string,
    mute: boolean,
  ): Promise<void> {
    if (this.muted_users.hasUser(channel_id, user_id) === mute) {
      throw new ConflictException(
        `The user(id: ${user_id}) is already ${
          mute ? 'muted' : 'unmuted'
        } in this channel(id: ${channel_id})`,
      );
    }

    if (mute) {
      this.muted_users.pushUser(channel_id, user_id);
    } else {
      this.muted_users.popUser(channel_id, user_id);
    }

    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.MUTE,
        participant: this.usersService.getUserById(user_id),
        text: null,
        check: mute,
      },
    });
  }

  async kickUser(channel_id: string, user_id: string): Promise<boolean> {
    const array = await this.databaseService.executeQuery(`
      DELETE FROM
        ${schema}.channel_user
      WHERE
        channel_id = ${channel_id}
          AND
        user_id = ${user_id}
      RETURNING
        user_id;
    `);

    if (array.length === 0) {
      throw new ConflictException(
        `The user(id: ${user_id}) is not in the channel(id: ${channel_id})`,
      );
    }
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.KICK,
        participant: this.usersService.getUserById(user_id),
        text: null,
        check: true,
      },
    });
    return true;
  }

  async updateChannelBan(
    channel_id: string,
    user_id: string,
    ban: boolean,
  ): Promise<boolean> {
    if (ban) {
      this.banUserFromChannel(channel_id, user_id);
      this.kickUser(channel_id, user_id);
      return true;
    } else {
      return this.unbanUserFromChannel(channel_id, user_id);
    }
  }

  async chatMessage(user_id: string, message: string): Promise<boolean> {
    const { id: channel_id } = await this.usersService.getChannelByUserId(
      user_id,
    );
    if (this.muted_users.hasUser(channel_id, user_id))
      throw new ForbiddenException('The user is muted');
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

  async updateChannelRole(user_id: string, role: UserRole): Promise<boolean> {
    const updateChannel = await this.databaseService.executeQuery(`
      UPDATE
        ${schema}.channel_user
      SET
        channel_role = '${role}'
      WHERE
        user_id = '${user_id}'
      RETURNING
        channel_id
    ;`);

    if (updateChannel.length === 0) {
      throw new ConflictException(
        `The user(id: ${user_id}) is not on any channel`,
      );
    } else {
      return true;
    }
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
    if (!array) throw new ConflictException('No such channel id.');

    return array[0];
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
    const array = await this.databaseService.executeQuery(`
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
    if (!array.length) throw new ConflictException('No such channel id.');
    return array;
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
      [this.muted_users.getUsers(channel_id)],
    );
  }

  // ANCHOR: private functions

  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Recommended (~10 hashes/sec), see https://www.npmjs.com/package/bcrypt#a-note-on-rounds
    const hashedPassword: string = await bcrypt.hash(password, saltRounds);

    return hashedPassword;
  }

  private async banUserFromChannel(
    channel_id: string,
    user_id: string,
  ): Promise<boolean> {
    if ((await this.usersService.getChannelRole(user_id)) !== UserRole.USER)
      throw new ForbiddenException('Inappropriate role');

    const array = await this.databaseService.executeQuery(`
      INSERT INTO
        ${schema}.channel_ban(
          channel_id,
          banned_user
        )
      VALUES (
        ${channel_id},
        ${user_id}
      )
      ON CONFLICT
        ON CONSTRAINT
          ban_constraint
      DO NOTHING
      RETURNING
        *;
    `);
    if (!array.length)
      throw new ConflictException(
        'The user is already banned from the channel',
      );
    this.pubSub.publish(`to_channel_${channel_id}`, {
      subscribeChannel: {
        type: Notify.BAN,
        participant: this.usersService.getUserById(user_id),
        text: null,
        check: true,
      },
    });
    return true;
  }

  private async unbanUserFromChannel(
    channel_id: string,
    user_id: string,
  ): Promise<boolean> {
    const array = await this.databaseService.executeQuery(`
      DELETE FROM
        ${schema}.channel_ban cb
      WHERE
        cb.channel_id = ${channel_id}
          AND
        cb.banned_user = ${user_id}
      RETURNING
        *
    `);
    if (!array.length)
      throw new ConflictException('The user is not banned from the channel.');
    return true;
  }
}
