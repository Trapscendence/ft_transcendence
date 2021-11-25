import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User, UserRole } from './models/user.model';
import { env } from 'src/utils/envs';
import { sqlEscaper } from 'src/utils/sqlescaper.utils';
import { Channel } from 'src/channels/models/channel.model';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async getUserById(id: string): Promise<User | null> {
    const array = await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user
      WHERE
        id = '${id}';
      `);
    if (array.length) return array[0];
    throw new NotFoundException('No such user.');
  }

  async getUserByNickname(nickname: string): Promise<User | null> {
    nickname = sqlEscaper(nickname);
    const array = await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user
      WHERE
        nickname = '${nickname}';
    `);
    if (array.length) return array[0];
    throw new NotFoundException('No such user.');
  }

  async getUserByOAuth(
    oauth_type: string,
    oauth_id: string,
  ): Promise<{ id: string; tfa_secret: string } | null> {
    const selectQueryResult = await this.databaseService.executeQuery(`
      SELECT
        id,
        tfa_secret
      FROM
        ${env.database.schema}.user
      WHERE
        oauth_id = '${oauth_id}'
      AND
        oauth_type = '${oauth_type}';
    `);

    if (selectQueryResult.length === 1) return selectQueryResult[0];
    else if (selectQueryResult.length === 0) return null;
  }

  async createUserByOAuth(
    oauth_type: string,
    oauth_id: string,
  ): Promise<{ id: string; tfa_secret: string }> {
    const insertQueryResult = await this.databaseService.executeQuery(`
    INSERT INTO ${env.database.schema}.user(
      nickname,
      oauth_id,
      oauth_type
    ) VALUES (
      '${oauth_type}-${oauth_id}',
      '${oauth_id}',
      '${oauth_type}'
    ) RETURNING id, tfa_secret;
    `);

    if (insertQueryResult.length === 1) return insertQueryResult[0];
    else
      throw new ConflictException(
        `Conflict with oauth data (oauth_type: ${oauth_type}, oauth_id: ${oauth_id})`,
      );
  }

  async getUsers(
    ladder: boolean,
    offset: number,
    limit: number,
  ): Promise<User[]> {
    return this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user
      ${ladder ? 'ORDER BY rank_score DESC' : ''}
      ${limit ? `LIMIT ${limit} ${offset ? `OFFSET ${offset}` : ''}` : ''}
    `);
  }

  async createUser(nickname: string): Promise<User | null> {
    // Deprecated
    nickname = sqlEscaper(nickname);
    const existingUser = await this.databaseService.executeQuery(`
      SELECT
        id
      FROM
        ${env.database.schema}.user
      WHERE
        nickname = '${nickname}'
      `);

    if (existingUser.length) return null;
    const users = await this.databaseService.executeQuery(`
      INSERT INTO
        ${env.database.schema}.user(
          nickname,
          oauth_id,
          oauth_type
        )
      VALUES (
        '${nickname}',
        'mock_id', /* 적절한 변환 필요 */
        'FORTYTWO' )
      RETURNING *;
    `); // NOTE oauth_id, oauth_type는 일단 제외함. database.service에도 완성 전까지는 주석처리 해야할 듯?
    return users[0];
  }

  async setNickname(user_id: string, nickname: string): Promise<boolean> {
    const existence = await this.databaseService.executeQuery(
      `
      SELECT
        id
      FROM
        ${env.database.schema}.user
      WHERE
        nickname = ($1);
    `,
      [nickname],
    );
    if (existence.length) return false;

    const array = await this.databaseService.executeQuery(
      `
      UPDATE
        ${env.database.schema}.user
      SET
        nickname = ($1)
      WHERE
        id = ($2)
      RETURNING *;
    `,
      [nickname, user_id],
    );
    return array.length ? true : null;
  }

  async addFriend(user_id: string, friend_id: string): Promise<boolean> {
    if (user_id === friend_id)
      throw new BadRequestException('One cannot be their own friend');
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${env.database.schema}.friend( my_id, friend_id )
      VALUES
        (
          ( SELECT id from ${env.database.schema}.user WHERE id = ${user_id} ),
          ( SELECT id from ${env.database.schema}.user WHERE id = ${friend_id} )
        ),
        (
          ( SELECT id from ${env.database.schema}.user WHERE id = ${friend_id} ),
          ( SELECT id from ${env.database.schema}.user WHERE id = ${user_id} )
        )
      ON CONFLICT
        ON CONSTRAINT friend_pk
      DO NOTHING
      RETURNING *;
    `);
    return !(array.length === 0);
  }

  async deleteFriend(user_id: string, friend_id: string): Promise<boolean> {
    if (user_id === friend_id)
      throw new BadRequestException('One cannot have themself as a friend');
    const array: Array<User> = await this.databaseService.executeQuery(`
      DELETE FROM
        ${env.database.schema}.friend f
      WHERE
        ( f.my_id = ${user_id} AND f.friend_id = ${friend_id} )
        OR
        ( f.my_id = ${friend_id} AND f.friend_id = ${user_id} )
      RETURNING *;
    `);
    return !(array.length === 0);
  }

  async getFriends(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        u.id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role
      FROM
        ${env.database.schema}.user u
      INNER JOIN
        ${env.database.schema}.friend f
          ON
        u.id = f.friend_id
      WHERE f.my_id = '${id}';
    `);
  }

  async addToBlackList(user_id: string, black_id: string): Promise<boolean> {
    if (user_id === black_id)
      throw new BadRequestException('One cannot block themself');
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${env.database.schema}.block( blocker_id, blocked_id )
      VALUES
      (
        ( SELECT id from ${env.database.schema}.user WHERE id = ${user_id} ),
        ( SELECT id from ${env.database.schema}.user WHERE id = ${black_id} )
      )
      ON CONFLICT
        ON CONSTRAINT block_pk
      DO NOTHING
      RETURNING *;
    `);
    if (!array.length) throw new BadRequestException('No such user.');
    return true;
  }

  async deleteFromBlackList(
    user_id: string,
    black_id: string,
  ): Promise<boolean> {
    if (user_id === black_id)
      throw new BadRequestException('One cannot block themself');

    const array: Array<User> = await this.databaseService.executeQuery(`
      DELETE FROM
        ${env.database.schema}.block b
      WHERE
        ( b.blocker_id = ${user_id} AND b.blocked_id = ${black_id} )
      RETURNING *;
    `);

    return !!array.length;
  }

  /*
   ** ANCHOR: ResolveField
   */

  async getFriend(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role
      FROM
        ${env.database.schema}.user
      WHERE
        id = '${id}'
      INNER JOIN
        id ON ${env.database.schema}.user.id = ${env.database.schema}.friend.my_id;
    `);
  }

  async getBlackList(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      WITH b as (
        SELECT
          blocked_id id
        FROM
          ${env.database.schema}.block
        WHERE
          blocker_id = ${id}
      )
      SELECT
        u.id,
        u.nickname,
        u.avatar,
        u.status_message,
        u.rank_score,
        u.site_role,
        DENSE_RANK() OVER (
          ORDER BY
            u.rank_score DESC
        ) rank
      FROM
        ${env.database.schema}.user u
      INNER JOIN
        b
      ON
        u.id = b.id;
    `);
  }

  async getChannelByUserId(id: string): Promise<Channel | null> {
    const array: Channel[] = await this.databaseService.executeQuery(`
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
        ${env.database.schema}.channel c
      INNER JOIN
        ${env.database.schema}.channel_user cu
          ON
            cu.user_id = '${id}'
              AND
            cu.channel_id = c.id
    `);
    return array.length ? array[0] : null;
  }

  async getChannelIdByUserId(id: string): Promise<string | null> {
    const selectChannelId: { channel_id: string }[] = await this.databaseService
      .executeQuery(`
      SELECT
        channel_id
      FROM
        ${env.database.schema}.channel_user
      WHERE
        user_id = '${id}'
    `);
    return selectChannelId.length ? selectChannelId[0].channel_id : null;
  }

  async getChannelRole(id: string): Promise<UserRole | null> {
    const select_channel_role: { channel_role: UserRole }[] = await this
      .databaseService.executeQuery(`
      SELECT
        channel_role
      FROM
        ${env.database.schema}.channel_user
      WHERE
        user_id = '${id}';
    `);

    if (select_channel_role.length === 0) {
      throw new ConflictException(`This user(id: '${id}') is not in a channel`);
    } else {
      return select_channel_role[0].channel_role;
    }
  }

  async getSiteRole(id: string): Promise<UserRole> {
    const select_site_role: User[] = await this.databaseService.executeQuery(`
      SELECT
        site_role
      FROM
        ${env.database.schema}.user
      WHERE
        id = '${id}';
    `);

    if (select_site_role.length === 0) {
      throw new ConflictException(`The user(id: ${id}) does not exist`);
    } else if (select_site_role.length !== 1) {
      throw `FATAL ERROR: User with (id: ${id}) is not only one`;
    } else {
      return select_site_role[0].site_role;
    }
  }

  async setSiteRole(
    setter: string,
    target: string,
    role: UserRole,
  ): Promise<boolean> {
    const setter_role = await this.getSiteRole(setter);
    const target_role = await this.getSiteRole(target);
    if (
      setter_role === 'USER' ||
      setter_role === target_role ||
      (setter_role === 'ADMIN' && target_role === 'OWNER') ||
      (setter_role !== 'ADMIN' && role === 'OWNER')
    )
      return false;
    const result: any = await this.databaseService.executeQuery(
      `
      UPDATE ${env.database.schema}.user
        SET
        site_role
          =
        ($1)
      WHERE
        id = ($2)
      RETURNING *;
    `,
      [role, target],
    );
    return !!result;
  }
}
