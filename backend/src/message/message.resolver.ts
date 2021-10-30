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
import { User } from 'src/users/models/user.medel';
import { UsersService } from 'src/users/users.service';
import { MessageService } from './message.service';
import { DM, Message } from './model/message.model';
import { PostgresPubSub } from 'graphql-postgres-subscriptions';

export const pubsub: PostgresPubSub = new PostgresPubSub({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  password: process.env.POSTGRES_PASSWORD,
  port: +process.env.POSTGRES_LOCAL_PORT,
});

@Resolver((of) => DM)
export class MessageResolver {
  constructor(
    private readonly messageService: MessageService,
    private readonly usersService: UsersService,
  ) {}

  /*
   ** ANCHOR: DM query
   */

  @Query((returns) => [DM], { nullable: true })
  async DM(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('other_id', { type: () => ID }) other_id: string,
  ): Promise<DM[]> {
    return await this.messageService.getDM(user_id, other_id);
  }

  /*
   ** ANCHOR: DM resolveField
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
  async dmUsers(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('offset', { type: () => Int }) offset: number,
    @Args('limit', { type: () => Int }) limit: number,
  ): Promise<User[]> {
    return await this.messageService.getDmUsers(user_id, offset, limit);
  }

  /*
   ** ANCHOR: DM mutation
   */

  @Mutation((returns) => Boolean)
  async sendMessage(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('other_id', { type: () => ID }) other_id: string,
    @Args('text') text: string,
  ): Promise<boolean> {
    return await this.messageService.insertMessage(user_id, other_id, text);
  }

  /*
   ** ANCHOR: DM subscription
   */

  @Subscription((returns) => Message)
  // filter: (payload, variables) =>
  //   payload.receiveMessage.user_id === variables.user_id &&
  //   payload.receiveMessage.other_id === variables.other_id,
  async receiveMessage(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('other_id', { type: () => ID }) other_id: string,
  ) {
    return await this.messageService.listenMessage(user_id, other_id);
  }
}

// @Resolver((of) => Message)
// export class MessageResolver {
//   constructor(private readonly messageService: MessageService) {}
