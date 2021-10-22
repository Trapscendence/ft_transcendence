import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChannelsService } from './channels.service';
import { Channel } from './models/channel.medel';

@Resolver((of) => Channel)
export class ChannelsResolver {
  constructor(private channelsService: ChannelsService) {}

  @Query((returns) => Channel)
  async channel(@Args('id', { type: () => String! }) id: string) {
    return this.channelsService.findOneById(id);
  }

  @Query((returns) => [Channel])
  async channels(@Args('isPrivate', { nullable: true }) isPrivate?: boolean) {
    return this.channelsService.findAll(isPrivate);
  }
}
