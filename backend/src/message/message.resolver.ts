import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { MessageService } from './message.service';
import { DM, Message } from './model/message.model';

@Resolver((of) => DM)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
  ) {}

  /*
   ** ANCHOR: DM
   */

  @Query((returns) => [DM], { nullable: true })
  async DM(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('other_user', { type: () => ID }) other_user: string,
  ): Promise<DM[]> {
    return await this.messageService.getDM(user_id, other_user);
  }

  /*
   ** ANCHOR: ResolveField
   */

  @ResolveField('messages', (returns) => [Message])
  async messages(
    @Parent() dm: DM,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<Message[]> {
    const { user_id, other_id } = dm;
    return await this.messageService.getMessages(
      user_id,
      other_id,
      offset,
      limit,
    );
  }

  @ResolveField('other_user', (returns) => User)
  async getUser(@Parent() dm: DM): Promise<User> {
    const { other_id } = dm;
    return await this.usersService.getUserById(other_id);
  }

  /*
   ** ANCHOR: DMUSER
   */

  @Query((returns) => [User])
  async DmUsers(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('offset') offset: number,
    @Args('limit') limit: number,
  ): Promise<User[]> {
    return await this.messageService.getDmUsers(user_id, offset, limit);
  }
}

// @Resolver((of) => Message)
// export class MessageResolver {
//   constructor(private readonly messageService: MessageService) {}
// }
