import { Inject } from '@nestjs/common';
import {
  Args,
  ID,
  Mutation,
  Query,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { PUB_SUB } from 'src/pubsub.module';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { UsersService } from 'src/users/users.service';
import { GamesService } from './games.service';
import { Game, GameNotify } from './models/game.model';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  /*
   ** ANCHOR: Query
   */

  // @Query((returns) => Game)
  // async game(@Args('game_id', { type: () => ID! }) game_id: string) {
  // }

  /*
   ** ANCHOR: Mutation
   */

  @Mutation((returns) => Boolean) // NOTE: null, void가 불가능? 어떻게 하는지 모르겠다.
  async registerMatch(@UserID() user_id: string): Promise<boolean> {
    return await this.gamesService.registerMatch(user_id);
  }

  @Mutation((returns) => Boolean)
  async cancelRegister(@UserID() user_id: string): Promise<boolean> {
    return await this.gamesService.cancelRegister(user_id);
  }

  @Mutation((returns) => Boolean)
  async joinGame(
    @UserID() user_id: string,
    @Args('game_id', { type: () => ID! }) game_id: string,
  ): Promise<boolean> {
    return await this.gamesService.joinGame(user_id, game_id);
  }

  @Mutation((returns) => Boolean)
  async notJoinGame(
    @UserID() user_id: string,
    @Args('game_id', { type: () => ID! }) game_id: string,
  ): Promise<boolean> {
    return await this.gamesService.notJoinGame(user_id, game_id);
  }

  /*
   ** ANCHOR: Subscription
   */

  @Subscription((returns) => GameNotify)
  subscribeMatch(@UserID() user_id: string) {
    return this.pubSub.asyncIterator(`registered_${user_id}`);
  }
}
