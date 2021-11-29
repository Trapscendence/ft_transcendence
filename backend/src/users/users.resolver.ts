import { forwardRef, Inject } from '@nestjs/common';
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
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { Channel } from 'src/channels/models/channel.model';
import { User, UserRole } from './models/user.model';
import { UsersService } from './users.service';
import { UserID } from './decorators/user-id.decorator';
import { GamesService } from 'src/games/games.service';
import { Game } from 'src/games/models/game.model';

@Resolver((of) => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    // private readonly gamesService: GamesService,
    // @Inject(forwardRef(() => GamesService)) private gamesService: GamesService,
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
   ** ANCHOR: Social
   */

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
  // @ResolveField('match_history', (returns) => [Match])
  // async getMatchHistory(@Parent() user: User): Promise<Match[]> {
  //   const { id } = user;
  //   return await this.matchService
  // }

  @ResolveField('game', (returns) => Game, { nullable: true })
  async getGame(@Parent() user: User): Promise<Game | null> {
    const { id } = user;
    return await this.usersService.getGameByUserId(id);
  }
}
