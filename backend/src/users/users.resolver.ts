import { Inject, InternalServerErrorException } from '@nestjs/common';
import {
  Query,
  Args,
  Int,
  Resolver,
  Mutation,
  ID,
  ResolveField,
  Parent,
  Subscription,
} from '@nestjs/graphql';
import { Channel } from 'src/channels/models/channel.model';
import { UserID } from 'src/users/decorators/user-id.decorator';
import {
  FriendReqRes,
  FriendRequest,
  User,
  UserRole,
  UserStatus,
} from './models/user.model';
import { UsersService } from './users.service';
import { Achievement } from 'src/acheivements/models/achievement.model';
import { StatusService } from 'src/status/status.service';
import { PUB_SUB } from 'src/pubsub.module';
import { PubSub } from 'graphql-subscriptions';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly statusService: StatusService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  /*
   ** ANCHOR: User
   */

  @Query((returns) => ID)
  async getMyID(@UserID() user_id: string) {
    return user_id;
  }

  @Query((returns) => User, { nullable: true })
  async user(
    @UserID() user_id: string,
    @Args('id', { type: () => ID, nullable: true }) id?: string,
    @Args('nickname', { nullable: true }) nickname?: string,
  ): Promise<User | null> {
    if (id && nickname)
      throw new Error('You must put exactly one parameter to the query.');
    if (id) return await this.usersService.getUserById(id);
    if (nickname) return await this.usersService.getUserByNickname(nickname);
    return await this.usersService.getUserById(user_id);
  }

  @Query((returns) => [User])
  async users(
    @Args('ladder') ladder: boolean,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ): Promise<User[]> {
    return await this.usersService.getUsers(ladder, offset, limit); // NOTE 임시
  }

  @Mutation((returns) => Boolean)
  async deleteAvatar(@UserID() user_id: string): Promise<Boolean> {
    if (await this.usersService.deleteAvatar(user_id)) return true;
    else
      throw new InternalServerErrorException(
        `Error occured during delete avatar (id: ${user_id})`,
      );
  }

  @Mutation((returns) => ID)
  async createDummyUser(): Promise<string> {
    while (true) {
      try {
        const { id } = await this.usersService.createUserByOAuth(
          'DUMMY',
          `${Math.floor(Math.random() * 100000)}`,
        );
        return id;
      } catch (err) {}
    }
  }

  /*
   ** ANCHOR: User mutation
   */

  @Mutation((returns) => Boolean, { nullable: true })
  async changeNickname(
    @UserID() user_id: string,
    @Args('new_nickname') new_nickname: string,
  ): Promise<boolean> {
    return await this.usersService.setNickname(user_id, new_nickname);
  }

  @Mutation((returns) => Boolean)
  async requestFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ) {
    const request = new FriendRequest();
    request.id = friend_id;
    request.ReqRes = FriendReqRes.REQUEST;
    this.pubSub.publish(`friend_request_of_${friend_id}`, {
      recieveFriendRequest: request,
    });
  }

  @Mutation((returns) => Boolean)
  async acceptFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ) {
    const request = new FriendRequest();
    request.id = friend_id;
    request.ReqRes = FriendReqRes.CONSENT;
    this.pubSub.publish(`friend_request_of_${friend_id}`, {
      recieveFriendRequest: request,
    });
    return this.usersService.addFriend(user_id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async rejectFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ) {
    const request = new FriendRequest();
    request.id = friend_id;
    request.ReqRes = FriendReqRes.REJECT;
    this.pubSub.publish(`friend_request_of_${friend_id}`, {
      recieveFriendRequest: request,
    });
  }

  @Mutation((returns) => Boolean)
  async deleteFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    const request = new FriendRequest();
    request.id = friend_id;
    request.ReqRes = FriendReqRes.DELETE;
    this.pubSub.publish(`friend_request_of_${friend_id}`, {
      recieveFriendRequest: request,
    });
    return await this.usersService.deleteFriend(user_id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async addToBlackList(
    @UserID() user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    return await this.usersService.addToBlackList(user_id, black_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFromBlackList(
    @UserID() user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    return await this.usersService.deleteFromBlackList(user_id, black_id);
  }

  @Mutation((returns) => Boolean)
  async setSiteRole(
    @UserID() user_id: string,
    @Args('target_id', { type: () => ID }) target_id: string,
    @Args('role', { type: () => UserRole }) role: UserRole,
  ): Promise<boolean> {
    return await this.usersService.setSiteRole(user_id, target_id, role);
  }

  @Mutation((returns) => String)
  setAvatar(
    @UserID() user_id: string,
    @Args('file') file: string,
  ): Promise<boolean> {
    return this.usersService.setAvatar(user_id, file);
  }

  @Mutation((returns) => Boolean)
  async achieveOne(
    @UserID() user_id: string,
    @Args('achievement_id') achievement_id: string,
  ): Promise<boolean> {
    return await this.usersService.achieveOne(user_id, achievement_id);
  }

  @Mutation((returns) => Boolean)
  setStatus(
    @UserID() user_id: string,
    @Args('status', { type: () => UserStatus }) status: UserStatus,
  ): boolean {
    this.statusService.setStatus(user_id, status);
    return true;
  }

  /*
   ** ANCHOR: ResolveField
   */

  @ResolveField('friends', (returns) => [User])
  async getFriends(@Parent() user: User): Promise<User[]> {
    const { id } = user;
    return await this.usersService.getFriends(id);
  }

  @ResolveField('blacklist', (returns) => [User])
  async getBlackList(@Parent() user: User): Promise<User[]> {
    const { id } = user;
    return await this.usersService.getBlackList(id);
  }

  @ResolveField('channel', (returns) => Channel, { nullable: true })
  async getChannelByUserId(@Parent() user: User): Promise<Channel | null> {
    const { id } = user;
    return await this.usersService.getChannelByUserId(id);
  }

  @ResolveField('channel_role', (returns) => UserRole, { nullable: true })
  async getChannelRole(@Parent() user: User): Promise<UserRole | null> {
    const { id } = user;
    return await this.usersService.getChannelRole(id);
  }

  @ResolveField('avatar', (returns) => String, { nullable: true })
  async getAvatar(@Parent() user: User): Promise<string> {
    const { id } = user;
    return await this.usersService.getAvatar(id);
  }

  @ResolveField('achievement', (returns) => [Achievement], { nullable: true })
  async getAchieved(
    @Parent() user: User,
    @Args('user_id', { nullable: true }) user_id: string,
  ): Promise<Achievement[]> {
    if (user_id) return await this.usersService.getAchieved(user_id);
    return await this.usersService.getAchieved(user.id);
  }

  @ResolveField('status', (returns) => UserStatus)
  getStatus(@Parent() user: User): UserStatus {
    const { id } = user;
    return this.statusService.getStatus(id);
  }
  // @ResolveField('match_history', (returns) => [Match])
  // async getMatchHistory(@Parent() user: User): Promise<Match[]> {
  //   const { id } = user;
  //   return await this.matchService
  // }

  /*
   ** ANCHOR: User Subscription
   */

  @Subscription((returns) => UserStatus)
  statusChange(@Args('user_id', { type: () => ID }) user_id: string) {
    return this.pubSub.asyncIterator(`status_of_${user_id}`);
  }

  @Subscription((returns) => FriendRequest)
  listenFriend(@UserID() user_id: string) {
    return this.pubSub.asyncIterator(`friend_request_of_${user_id}`);
  }
}
