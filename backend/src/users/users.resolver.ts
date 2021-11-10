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
import { Channel } from 'src/channels/models/channel.model';
import { User, UserRole } from './models/user.model';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /*
   ** ANCHOR: User
   */

  @Query((returns) => User, { nullable: true })
  async user(
    @Args('id', { type: () => ID, nullable: true }) id?: string,
    @Args('nickname', { nullable: true }) nickname?: string,
  ): Promise<User | null> {
    if ((id && nickname) || !(id || nickname))
      throw new Error('You must put exactly one parameter to the query.');
    if (id) return await this.usersService.getUserById(id);
    return await this.usersService.getUserByNickname(nickname);
  }

  // NOTE: [User!]! 반환하게 수정했습니다. 확인 후 코멘트 삭제해주세요. -gmoon
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
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    // NOTE 여기서 할것인가?
    return this.usersService.addFriend(user_id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFriend(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    return await this.usersService.deleteFriend(user_id, friend_id);
  }

  @Mutation((returns) => Boolean)
  async addToBlackLIst(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    return await this.usersService.addToBlackList(user_id, black_id);
  }

  @Mutation((returns) => Boolean)
  async deleteFromBlackList(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<boolean> {
    // NOTE 여기서 할것인가?
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
}
