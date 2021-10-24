import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from './models/user.medel';
import { schema } from 'src/utils/envs';
import { resolve } from 'path/posix';

@Injectable()
export class UsersService {
  constructor(private databaseService: DatabaseService) {}

  async getUser(id: string): Promise<any> {
    const user = await this.databaseService.executeQuery(`
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
  id = ${id};`)[0];

    const friendArray = await this.databaseService.executeQuery(`
SELECT
  id,
  nickname,
  avatar,
  status_message
FROM
  ${schema}.user
WHERE
  id = ${id};
INNER JOIN id ON ${schema}.user.id = ${schema}.friend.my_id;
    `);

    const userSchema = { ...user, friends: friendArray };

    // TODO Promise.all 적용을 통한 병렬 실행 최적화

    return userSchema;
  }

  getFriend(id: string): Promise<any[]> {
    return this.databaseService.executeQuery(`
SELECT
  id,
  avatar,
  nickname,
  status_message
FROM
  trap.user
WHERE
  id = ${id}
INNER JOIN id ON trap.user.id = trap.friend.my_id;
    `);
  }

//   async getUsers(): Promise<User[]> {
//     return this.databaseService.executeQuery(`
// SELECT (id, nickname, status_message, )
//     `);
//   }

  async createUser(nickname: string): Promise<any> { // NOTE 일단 몰라서 Promise<any>로
    return this.databaseService.executeQuery(`
INSERT INTO ${schema}.user (id, nickname, rank_score, site_role) VALUES (tmpId, ${nickname}, DEFAULT, DEFAULT);
    `); // NOTE oauth_id, oauth_type, fta_secret는 일단 제외함. database.service에도 완성 전까지는 주석처리 해야할 듯?
  }

  async addFriend(user_id: string, frined_id: string): Promise<any> {
    // const friend = await this.user.getFriendList.findOne({ frined_id });
    // if (friend) {
      // return { ok: false, error: 'this user is already registered' };
    // }
    // const exists = await this.user.findOne({ frined_id });
    // if (!exists) {
      // return { ok: false, error: 'this user does not exist' };
    // }
    return (new Promise(() => {}));
  }

  async deleteFriend(user_id: string, frined_id: string): Promise<any> {
    // const friend = await this.user.getFriendList.findOne({ frined_id });
    // if (!friend) {
      // return { ok: false, error: 'friend not found' };
    // }
    return (new Promise(() => {}));
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
    return (new Promise(() => {}));
  }

  async deleteFromBlackList(user_id: string, black_id: string): Promise<any> {
    // const black = await this.user.getBlackList.findOne({ black_id });
    // if (!black) {
      // return { ok: false, error: 'black user not found' };
    // }
    return (new Promise(() => {}));
  }
}