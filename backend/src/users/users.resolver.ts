import { Inject, InternalServerErrorException } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
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
import { User, UserRole, UserStatus } from './models/user.model';
import { UsersService } from './users.service';
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

  @Mutation((returns) => Boolean, { nullable: true })
  async addFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    return this.usersService.addFriend(user_id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFriend(
    @UserID() user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
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
}
