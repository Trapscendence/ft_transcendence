import { Inject, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { MessageService } from './message.service';
import { DM, Message } from './model/message.model';
import { PUB_SUB } from '../pubsub.module';
import { UserID } from 'src/users/decorators/user-id.decorator';

@Resolver((of) => DM)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  /*
   ** ANCHOR: DM query
   */

  @Query((returns) => DM, { nullable: true })
  async DM(
    @UserID() user_id: any,
    @Args('other_id', { type: () => ID }) other_id: string,
  ): Promise<DM> {
    return await this.messageService.getDM(user_id, other_id);
  }

  /*
   ** ANCHOR: DM resolveField
   */

  @ResolveField('messages', (returns) => [Message])
  async messages(
    @Parent() dm: DM,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
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
  async dmUsers(
    @UserID() user_id: string,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ): Promise<User[]> {
    return await this.messageService.getDmUsers(user_id, offset, limit);
  }

  /*
   ** ANCHOR: DM mutation
   */

  @Mutation((returns) => Message, { nullable: true })
  async sendMessage(
    @UserID() user_id: any,
    @Args('other_id', { type: () => ID }) other_id: string,
    @Args('text') text: string,
  ): Promise<Message> {
    return await this.messageService.insertMessage(user_id, other_id, text);
  }

  @Mutation((returns) => Boolean, { nullable: true })
  updateCheckdate(
    @UserID() user_id: any,
    @Args('other_id', { type: () => ID }) other_id: string,
  ): null {
    this.messageService.setCheckDate(user_id, other_id);
    return null;
  }

  /*
   ** ANCHOR: DM subscription
   */

  @Subscription((returns) => Message)
  async receiveMessage(@UserID() user_id: any) {
    return this.pubSub.asyncIterator(`message_to_${user_id}`);
  }

  @Subscription((returns) => User)
  newDmUser(@UserID() user_id: any) {
    return this.pubSub.asyncIterator(`new_message_to_${user_id}`);
  }
}
