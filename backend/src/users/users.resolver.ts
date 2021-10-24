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
import { User } from './models/user.medel';
import { UsersService } from './users.service';

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  /*
   ** ANCHOR: User
   */

  @Query((returns) => User)
  async user(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return await this.usersService.getUser(id);
  }

  // NOTE: [User!]! 반환하게 수정했습니다. 확인 후 코멘트 삭제해주세요. -gmoon
  @Query((returns) => [User])
  async users(
    @Args('ladder') ladder: boolean,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ): Promise<any> {
    return new Promise(() => {});
  }

  @Mutation((returns) => User)
  async createUser(@Args('nickname') nickname: string): Promise<User> {
    const users = await this.usersService.createUser(nickname);
    return users[0];
  }

  /*
   ** ANCHOR: Social
   */
  // NOTE: 나중에 분리할 수도...?

  @Mutation((returns) => User)
  async addFriend(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('friend_id', { type: () => ID }) friend_id: string,
  ): Promise<User> {
    return this.usersService.addFriend(user_id, friend_id);
  }

  @Mutation((returns) => User)
  async deleteFriend(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('frined_id', { type: () => ID }) friend_id: string,
  ): Promise<boolean> {
    return this.usersService.deleteFriend(user_id, friend_id);
  }

  @Mutation((returns) => User)
  async addToBlackLIst(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<User> {
    return this.usersService.addToBlackList(user_id, black_id);
  }

  @Mutation((returns) => User)
  async deleteFromBlackList(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('black_id', { type: () => ID }) black_id: string,
  ): Promise<User> {
    return this.usersService.deleteFromBlackList(user_id, black_id);
  }

  /*
   ** ANCHOR: ResolveField
   */

  @ResolveField('friends', (returns) => [User])
  async getFriends(@Parent() user: User) {
    const { id } = user;
    return this.usersService.getFriend(id);
  }
}
