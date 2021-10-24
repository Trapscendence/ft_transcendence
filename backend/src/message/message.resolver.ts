import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { MessageService } from './message.service';
import { DM, Message } from './model/message.model';

@Resolver((of) => DM)
export class DmResolver {
  constructor(private readonly messageService: MessageService) {}

  @Query((returns) => [DM])
  async DM(@Args('id', { type: () => ID }) id: string): Promise<any> {
    return this.messageService.getDm(id);
  }
}

@Resolver((of) => Message)
export class MessageResolver {
  constructor(private readonly messageService: MessageService) {}
}
