import { Args, Query, Resolver } from '@nestjs/graphql';
import { ChannelsService } from './channels.service';
import { Channel } from './models/channel.medel';

@Resolver((of) => Channel)
export class ChannelsResolver {
  constructor(private channelsService: ChannelsService) {}

  @Query((returns) => Channel) // TODO nullable인지... Channel! 인데 이게 정확히 뭔지 찾아봐야...
  async channel(@Args('id', { type: () => String! }) id: string) {
    return this.channelsService.findOneById(id);
  }

  @Query((returns) => [Channel])
  async channels(@Args('isPrivate', { nullable: true }) isPrivate?: boolean) {
    return this.channelsService.findAll(isPrivate);
  }
}
