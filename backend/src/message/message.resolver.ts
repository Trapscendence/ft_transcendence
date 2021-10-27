import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { DM, Message } from './model/message.model';

@Resolver((of) => DM)
export class DmResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query((returns) => [DM])
  async DM(
    @Args('user_id', { type: () => ID }) user_id: string,
    @Args('other_id', { type: () => ID }) other_id: string
  ): Promise<DM> {
    return this.messageService.getDMs(user_id, other_id);
  }
}

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}
}
