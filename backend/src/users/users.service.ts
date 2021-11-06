import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './models/user.medel';
import { schema } from 'src/utils/envs';
import { sqlEscaper } from 'src/utils/sqlescaper.utils';
import { Channel } from 'src/channels/models/channel.medel';

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
<<<<<<< HEAD
        site_role
=======
        site_role,
        DENSE_RANK() OVER (
          ORDER BY
            rank_score DESC
        ) rank
>>>>>>> 0364a2076146118118c874ab0a660257b0b7a39d
      FROM
        ${schema}.user
      WHERE
        id = ${id};
      `);
    return array.length ? array[0] : null;
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
        ${schema}.user
      WHERE
        nickname = '${nickname}';
    `);
    return array.length ? array[0] : null;
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
        ${schema}.user
      ${ladder ? 'ORDER BY rank_score DESC' : ''}
      ${limit ? `LIMIT ${limit} ${offset ? `OFFSET ${offset}` : ''}` : ''}
    `);
  }

  async createUser(nickname: string): Promise<User | null> {
    nickname = sqlEscaper(nickname);
    const existingUser = await this.databaseService.executeQuery(`
      SELECT
        id
      FROM
        ${schema}.user
      WHERE
        nickname = '${nickname}'
      `);

    if (existingUser.length) return null;
    const users = await this.databaseService.executeQuery(`
      INSERT INTO
        ${schema}.user(
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

  async addFriend(user_id: string, friend_id: string): Promise<boolean> {
    if (user_id === friend_id)
      throw new Error("One cannot be their's own friend");
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${schema}.friend( my_id, friend_id )
      VALUES
        (
          ( SELECT id from ${schema}.user WHERE id = ${user_id} ),
          ( SELECT id from ${schema}.user WHERE id = ${friend_id} )
        ),
        (
          ( SELECT id from ${schema}.user WHERE id = ${friend_id} ),
          ( SELECT id from ${schema}.user WHERE id = ${user_id} )
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
      throw new Error('One cannot have themself as a friend');
    const array: Array<User> = await this.databaseService.executeQuery(`
      DELETE FROM
        ${schema}.friend f
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
        ${schema}.user u
      INNER JOIN
        ${schema}.friend f
          ON
        u.id = f.friend_id
      WHERE f.my_id = ${id};
    `);
  }

  async addToBlackList(user_id: string, black_id: string): Promise<boolean> {
    if (user_id === black_id) throw new Error('One cannot block themself');
    const array: Array<User> = await this.databaseService.executeQuery(`
      INSERT INTO ${schema}.block( blocker_id, blocked_id )
      VALUES
        (
          ( SELECT id from ${schema}.user WHERE id = ${user_id} ),
          ( SELECT id from ${schema}.user WHERE id = ${black_id} )
        )
      ON CONFLICT
        ON CONSTRAINT block_pk
      DO NOTHING
      RETURNING *;
    `);
    return array.length === 0 ? false : true;
  }

  async deleteFromBlackList(
    user_id: string,
    black_id: string,
  ): Promise<boolean> {
    if (user_id === black_id) throw new Error('One cannot block themself');
    const array: Array<User> = await this.databaseService.executeQuery(`
      DELETE FROM
        ${schema}.friend f
      WHERE
        ( f.user_id = ${user_id} AND f.friend_id = ${black_id} )
      RETURNING *;
    `);

    return array.length === 0 ? false : true;
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
        ${schema}.user
      WHERE
        id = ${id}
      INNER JOIN
        id ON ${schema}.user.id = ${schema}.friend.my_id;
    `);
  }

  async getBlackList(id: string): Promise<User[]> {
    return await this.databaseService.executeQuery(`
      SELECT
        id,
        nickname,
        avatar,
        status_message,
        rank_score,
        site_role
      FROM
        ${schema}.user u
      WHERE
          id = (
            SELECT
              blocked_id
            FROM
              ${schema}.block b
            WHERE
              blocker_id = ${id}
          )
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
        ${schema}.channel c
      INNER JOIN
        ${schema}.channel_user cu
          ON
            cu.user_id = ${id}
              AND
            cu.channel_id = c.id
    `);
    return array.length ? array[0] : null;
  }
}
