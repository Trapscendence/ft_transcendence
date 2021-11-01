import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { User } from 'src/users/models/user.medel';
import { UsersService } from 'src/users/users.service';
import { schema } from 'src/utils/envs';
import { Channel } from './models/channel.medel';

@Injectable()
export class ChannelsService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
  ) {}
  private mutedUsers: { channel_id: string; user: User }[] = []; // TODO: 이렇게? 아직 확신이 없다.

  /*
   ** ANCHOR: Query
   */

  // TODO: 메모리상의 cache도 구현해서 성능 더 빠르게 개선할 수도?
  // TODO: await를 병렬처리해서 성능 개선해야
  async getChannel(channel_id: string): Promise<Channel> {
    const [selectedChannel] = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.channel
        WHERE id = ${channel_id};
    `);

    if (!selectedChannel) return null;

    const { id, title, password } = selectedChannel;

    const [owner] = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_user cu
          ON u.id = cu.user_id
        WHERE cu.channel_id = ${channel_id} AND cu.channel_role = 'OWNER';
    `);

    // TODO: 따로 안하고 sql 문에서 합쳐서 결과를 리턴하는걸로 수정중...

    // return {
    //   id,
    //   title,
    //   private: password ? true : false,
    //   owner,
    // };
  }

  // TODO: 임시 구현. 성능 상의 문제로 getChannel, getChannel은 sql 쿼리 수정해야 할 듯
  async getChannels(isPrivate: boolean): Promise<Channel[]> {
    const channelIds: { id: number }[] = await this.databaseService
      .executeQuery(`
      SELECT id
        FROM ${schema}.channel;
    `);

    return Promise.all(
      channelIds.map((val) => this.getChannel(val.id.toString())),
    );
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
    `);

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
      participants: [],
      bannedUsers: [],
      mutedUsers: [],
    };
  }

  async editChannel(channel_id: string, title: string, password: string) {}

  async deleteChannel(channel_id: string): Promise<boolean> {
    // TODO: 여러 쿼리를 아마 하나의 쿼리로 합칠 수 있을 듯

    await this.databaseService.executeQuery(`
      DELETE
        FROM ${schema}.channel_user
        WHERE channel_id = ${channel_id};
    `);

    await this.databaseService.executeQuery(`
      DELETE
        FROM ${schema}.channel_ban
        WHERE channel_id = ${channel_id};
    `);

    await this.databaseService.executeQuery(`
      DELETE
        FROM ${schema}.channel
        WHERE id = ${channel_id};
    `);

    return true; // TODO: 임시로 true만 반환하도록 함. 오류가 발생하면 (쿼리 실패하면) false 반환하게 어떻게 하지?
  }

  async muteUserFromChannel(
    user_id: string,
    channel_id: string,
    mute_time: number,
  ): Promise<User> {
    const user = await this.usersService.getUserById(user_id);

    this.mutedUsers.push({ channel_id, user });

    setTimeout(() => {
      this.mutedUsers = this.mutedUsers.filter(
        (val) => val.channel_id !== channel_id && val.user.id !== user_id,
      );
    }, mute_time * 1000); // TODO: subscription도... 언젠가...

    return user;
  }

  async kickUserFromChannel(
    user_id: string,
    channel_id: string,
  ): Promise<User> {
    const user = await this.usersService.getUserById(user_id);

    await this.databaseService.executeQuery(`
      DELETE
        FROM ${schema}.channel_user
        WHERE channel_id = ${channel_id} AND user_id = ${user_id};
    `);

    // TODO: subscription...

    return user;
  }

  async banUserFromChannel(user_id: string, channel_id: string): Promise<User> {
    const user = await this.usersService.getUserById(user_id);

    await this.databaseService.executeQuery(`
      DELETE
        FROM ${schema}.channel_user
        WHERE channel_id = ${channel_id} AND user_id = ${user_id};
    `);

    await this.databaseService.executeQuery(`
      INSERT INTO ${schema}.channel_ban (channel_id, banned_user)
        VALUES (${channel_id}, ${user_id});
    `);
    // TODO: db의 banned_user 변수명을 user_id로 바꾸고싶다.

    return user;
  }

  // async chatMessage(): Promise<boolean> {}

  /*
   ** ANCHOR: ResolveField
   */

  async getAdministrators(id: string): Promise<User[]> {
    const administrators = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_user cu
          ON u.id = cu.user_id
        WHERE cu.channel_id = ${id} AND cu.channel_role = 'ADMIN';
    `);

    return administrators;
  }

  // NOTE: owner, admin 제외한 참가자. db role enum의 user을 participant로 바꾸는게 나을 듯
  async getParticipants(id: string): Promise<User[]> {
    const participants = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_user cu
          ON u.id = cu.user_id
        WHERE cu.channel_id = ${id} AND cu.channel_role = 'USER';
    `);

    return participants;
  }

  async getBannedUsers(id: string): Promise<User[]> {
    const bannedUsers = await this.databaseService.executeQuery(`
      SELECT *
        FROM ${schema}.user u
        INNER JOIN ${schema}.channel_ban cb
          ON u.id = cb.banned_user
        WHERE cb.channel_id = ${id};
    `);

    return bannedUsers;
  }

  // async getMutedUsers(id: string): Promise<User[]> {

  // }
}
