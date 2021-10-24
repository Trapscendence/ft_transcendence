import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './models/user.medel';
import { schema } from 'src/utils/envs';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  /*
   ** ANCHOR: User
   */

  // NOTE: INNER JOIN ${schema}.friend f ON f.my_id = ${id}; // 혹시 이거 아닌가?
  async getUser(id: string): Promise<any> {
    const user = await this.databaseService.executeQuery(`
      SELECT id, nickname, avatar, status_message, rank_score, site_role
      FROM ${schema}.user
      WHERE id = ${id};
    `);

    // const friendArray = await this.databaseService.executeQuery(`
    //   SELECT ${schema}.user.id
    //   FROM ${schema}.user
    //   INNER JOIN ${schema}.user u ON u.id = ${id}
    //   INNER JOIN ${schema}.friend f ON u.id = f.my_id;
    // `);

    return user[0];
  }

  async getUsers(): Promise<User[]> {
    //     return this.databaseService.executeQuery(`
    // SELECT (id, nickname, status_message, )
    //     `);
    return new Promise(() => {});
  }

  createUser(nickname: string): Promise<any> {
    return this.databaseService.executeQuery(`
      INSERT INTO ${schema}.user( nickname, oauth_id, oauth_type )
      VALUES ( '${nickname}', 'mock_id', 'FORTYTWO' )
      RETURNING *;
    `);
  }

  /*
   ** ANCHOR: Social
   */

  async addFriend(user_id: string, frined_id: string): Promise<any> {
    // const friend = await this.user.getFriendList.findOne({ frined_id });
    // if (friend) {
    // return { ok: false, error: 'this user is already registered' };
    // }
    // const exists = await this.user.findOne({ frined_id });
    // if (!exists) {
    // return { ok: false, error: 'this user does not exist' };
    // }

    return new Promise(() => {});
  }

  async deleteFriend(user_id: string, frined_id: string): Promise<any> {
    // const friend = await this.user.getFriendList.findOne({ frined_id });
    // if (!friend) {
    // return { ok: false, error: 'friend not found' };
    // }

    return new Promise(() => {});
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
}
