import { Inject } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
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
import {
  CanvasNotify,
  Game,
  GameNotify,
  InGameNotify,
} from './models/game.model';

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

  @Query((returns) => Game)
  async game(@Args('game_id', { type: () => ID! }) game_id: string) {
    return await this.gamesService.getGame(game_id);
  }

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

  @Mutation((returns) => Boolean)
  async movePaddle(
    @UserID() user_id: string,
    @Args('game_id', { type: () => ID! }) game_id: string,
    @Args('y', { type: () => Int! }) y: number,
    @Args('dy', { type: () => Int! }) dy: number,
    @Args('isLeft', { type: () => Boolean! }) isLeft: boolean,
  ) {
    return await this.gamesService.movePaddle(user_id, game_id, y, dy, isLeft);
  }

  @Mutation((returns) => Boolean)
  async ballCollision(
    @UserID() user_id: string,
    @Args('game_id', { type: () => ID! }) game_id: string,
    @Args('x', { type: () => Int! }) x: number,
    @Args('y', { type: () => Int! }) y: number,
    @Args('dx', { type: () => Int! }) dx: number,
    @Args('dy', { type: () => Int! }) dy: number,
  ) {
    return await this.gamesService.ballCollision(
      user_id,
      game_id,
      x,
      y,
      dx,
      dy,
    );
  }

  @Mutation((returns) => Boolean)
  async winRound(
    @UserID() user_id: string,
    @Args('game_id', { type: () => ID! }) game_id: string,
    @Args('isLeft', { type: () => Boolean! }) isLeft: boolean,
  ) {
    return await this.gamesService.winRound(user_id, game_id, isLeft);
  }

  /*
   ** ANCHOR: Subscription
   */

  @Subscription((returns) => GameNotify)
  subscribeMatch(@UserID() user_id: string) {
    return this.pubSub.asyncIterator(`registered_${user_id}`);
  }

  @Subscription((returns) => InGameNotify)
  subscribeInGame(
    // @UserID() user_id: string, // NOTE: 나중에 필요하면 추가
    @Args('game_id', { type: () => ID! }) game_id: string,
  ) {
    // return this.pubSub.asyncIterator(`ingame_${game_id}_${user_id}`);
    return this.pubSub.asyncIterator(`ingame_${game_id}`); // NOTE: 이렇게 해도 될까? 아 나중에 고치자...
  }

  @Subscription((returns) => CanvasNotify)
  subscribeInGameCanvas(
    // @UserID() user_id: string, // NOTE: 나중에 필요하면 추가
    @Args('game_id', { type: () => ID! }) game_id: string,
  ) {
    // return this.pubSub.asyncIterator(`ingame_${game_id}_${user_id}`);
    return this.pubSub.asyncIterator(`ingame_canvas_${game_id}`);
  }
}
