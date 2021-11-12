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
import { GqlUser } from 'src/auth/decorator/gql-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Channel } from 'src/channels/models/channel.model';
import { User, UserRole } from './models/user.model';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /*
   ** ANCHOR: User
   */

  @Query((returns) => Int)
  async whoAmI(@GqlUser() user: any) {
    return user.id;
  }

  @Query((returns) => User, { nullable: true })
  async user(
    @GqlUser() user: any,
    @Args('id', { type: () => ID, nullable: true }) id?: string,
    @Args('nickname', { nullable: true }) nickname?: string,
  ): Promise<User | null> {
    if (id && nickname)
      throw new Error('You must put exactly one parameter to the query.');
    if (id) return await this.usersService.getUserById(id);
    if (nickname) return await this.usersService.getUserByNickname(nickname);
    return await this.usersService.getUserById(user.id);
  }

  @Query((returns) => [User])
  async users(
    @Args('ladder') ladder: boolean,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ): Promise<User[]> {
    return await this.usersService.getUsers(ladder, offset, limit); // NOTE 임시
  }

  @Mutation((returns) => User, { nullable: true })
  async createUser(@Args('nickname') nickname: string): Promise<User | null> {
    return await this.usersService.createUser(nickname);
  }

  /*
   ** ANCHOR: Social
   */
  // NOTE: 나중에 분리할 수도...?

  @Mutation((returns) => Boolean, { nullable: true })
  async addFriend(
    @GqlUser() user: any,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    // NOTE 여기서 할것인가?
    return this.usersService.addFriend(user.id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFriend(
    @GqlUser() user: any,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    return await this.usersService.deleteFriend(user.id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async addToBlackLIst(
    @GqlUser() user: any,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    return await this.usersService.addToBlackList(user.id, black_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFromBlackList(
    @GqlUser() user: any,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    // NOTE 여기서 할것인가?
    return await this.usersService.deleteFromBlackList(user.id, black_id);
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
}
