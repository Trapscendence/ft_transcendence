import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/users/models/user.medel';
import { schema } from 'src/utils/envs';
import { Channel } from './models/channel.medel';

@Injectable()
export class ChannelsService {
  constructor(private databaseService: DatabaseService) {}
  private readonly mutedUsers: User[] = []; // TODO: 이렇게?

  /*
   ** ANCHOR: Query
   */

  // TODO: 메모리상의 cache도 구현해서 성능 더 빠르게 개선할 수도...?
  // TODO: await를 병렬처리해서 성능 개선해야!
  async getChannel(channel_id: string): Promise<Channel> {
    const [selectedChannel] = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.channel
        WHERE id = ${channel_id}
    `);

    if (!selectedChannel) return null;

    const { id, title, password } = selectedChannel;

    const [owner] = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_user cu
          ON u.id = cu.user_id
        WHERE cu.channel_id = ${channel_id} AND cu.channel_role = 'OWNER'
    `);

    const administrators = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_user cu
          ON u.id = cu.user_id
        WHERE cu.channel_id = ${channel_id} AND cu.channel_role = 'ADMIN'
    `);

    const participants = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_user cu
          ON u.id = cu.user_id
        WHERE cu.channel_id = ${channel_id} AND cu.channel_role = 'USER'
    `);

    const bannedUsers = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_ban cb
          ON u.id = cb.banned_user
        WHERE cb.channel_id = ${channel_id}
    `); // TODO: 이 부분 전혀 모르겠다... 나중에 무조건 확인 필요...

    return {
      id,
      title,
      private: password ? true : false,
      owner,
      administrators,
      participants,
      bannedUsers,
      mutedUsers: this.mutedUsers,
    };
  }

  async getChannels(isPrivate: boolean): Promise<Channel[]> {
    // TODO: 임시임... 구현 아직 안함!

    return await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.channel
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
    const [{ id }] = password
      ? await this.databaseService.executeQuery(`
        INSERT INTO ${schema}.channel (title, password)
          VALUES ('${title}', '${password}')
          RETURNING id;
      `)
      : await this.databaseService.executeQuery(`
        INSERT INTO ${schema}.channel (title, password)
          VALUES ('${title}', NULL)
          RETURNING id;
      `);

    await this.databaseService.executeQuery(`
      INSERT INTO ${schema}.channel_user (user_id, channel_id, channel_role)
          VALUES (${owner_user_id}, ${id}, 'OWNER');
    `); // TODO: 왜 아래 sql 문에 합치면 에러가 날까? executeQuery의 리턴은 어떻게 결정될까? owner가 제대로 리턴이 안돼서 생기는 오류같은데...

    const [owner] = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user
        WHERE id = ${owner_user_id};
    `);

    return {
      id,
      title,
      private: password ? true : false,
      owner,
      administrators: [],
      participants: [], // NOTE: owner, admin 제외한 참가자로 하자... (논의 필요)
      bannedUsers: [],
      mutedUsers: [],
    };
  }

  async editChannel(channel_id: string, title: string, password: string) {}

  async deleteChannel(channel_id: string): Promise<boolean> {
    // TODO
    // * 여러 쿼리를 아마 하나의 쿼리로 합칠 수 있을 듯...
    // * 에러가 발생하면 어떻게 되는걸까? 리턴 값이 뭐지?

    await this.databaseService.executeQuery(`
      DELETE
        FROM ${schema}.channel_user
        WHERE channel_id = ${channel_id}
    `);

    await this.databaseService.executeQuery(`
      DELETE
        FROM ${schema}.channel_ban
        WHERE channel_id = ${channel_id}
    `);

    await this.databaseService.executeQuery(`
    DELETE
      FROM ${schema}.channel
      WHERE id = ${channel_id}
  `);

    return true; // TODO: 임시로 true만 반환하도록 함. 수정 필요!
  }

  async muteUserFromChannel(user_id: string, mute_time: number): Promise<any> {
    // TODO: any 수정해야
  }

  async kickUserFromChannel(): Promise<any> {}

  async banUserFromChannel(): Promise<any> {}

  async chatMessage(): Promise<any> {}
}
