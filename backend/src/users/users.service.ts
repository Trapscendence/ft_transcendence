import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './models/user.medel';
import { schema } from 'src/utils/envs';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async getUser(id: string): Promise<User[]> {
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
  id = ${id};`);
  }

  async getUsers(ladder: boolean, offset: number, limit: number): Promise<User[]> {
    return this.databaseService.executeQuery(`
SELECT
  id,
  nickname,
  avatar,
  status_message,
  rank_score,
  site_role
FROM
  ${schema}.user
${
  ladder ?
  'ORDER BY rank_score DESC' : ''
}
${
  limit ?
  `LIMIT ${limit} ${offset ? `OFFSET ${offset}`: ''}` : ''
}
    `);
  }

  async createUser(nickname: string): Promise<any> { // NOTE 일단 몰라서 Promise<any>로
    return await this.databaseService.executeQuery(`
INSERT INTO ${schema}.user( nickname, oauth_id, oauth_type )
VALUES ( '${nickname}', 'mock_id', 'FORTYTWO' )
RETURNING *;
    `); // NOTE oauth_id, oauth_type, fta_secret는 일단 제외함. database.service에도 완성 전까지는 주석처리 해야할 듯?
  }

  async addFriend(user_id: string, friend_id: string): Promise<boolean> {
    const array = await this.databaseService.executeQuery(`
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
    `)
    return array.length === 0 ? false : true;
  }

  async deleteFriend(user_id: string, friend_id: string): Promise<any> {
    return await this.databaseService.executeQuery(`
DELETE FROM
  ${schema}.friend f
WHERE
  ( f.user_id = ${user_id} AND f.friend_id = ${friend_id} )
  OR
  ( f.user_id = ${friend_id} AND f.friend_id = ${user_id} )
RETURNING *;
    `)
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

  async addToBlackList(user_id: string, black_id: string): Promise<any> {
    // const black = await this.user.getBlackList.findOne({ black_id });
    // if (black) {
    // return { ok: false, error: 'this user is already added' };
    // }
    // const exists = await this.user.findOne({ black_id });
    // if (!exists) {
    // return { ok: false, error: 'this user does not exist' };
    // }

    return new Promise(() => {});
  }

  async deleteFromBlackList(user_id: string, black_id: string): Promise<any> {
    // const black = await this.user.getBlackList.findOne({ black_id });
    // if (!black) {
    // return { ok: false, error: 'black user not found' };
    // }

    return new Promise(() => {});
  }

  /*
   ** ANCHOR: ResolveField
   */

  getFriend(id: string): Promise<User[]> {
    return this.databaseService.executeQuery(`
      SELECT id, nickname, avatar, status_message, rank_score, site_role
      FROM ${schema}.user
      WHERE id = ${id}
      INNER JOIN id ON ${schema}.user.id = ${schema}.friend.my_id;
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
}
