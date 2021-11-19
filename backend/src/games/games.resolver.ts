import { Inject } from '@nestjs/common';
import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { ChannelsService } from 'src/channels/channels.service';
import { PUB_SUB } from 'src/pubsub.module';
import { UsersService } from 'src/users/users.service';
import { Game } from './models/game.model';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(
    // private readonly channelsService: ChannelsService,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query((returns) => Game)
  async game(@Args('game_id', { type: () => ID! }) game_id: string) {
    // return await
  }
}
