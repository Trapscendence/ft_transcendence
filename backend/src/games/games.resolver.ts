import { forwardRef, Inject } from '@nestjs/common';
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
import { PUB_SUB } from 'src/pubsub.module';
import { UserID } from 'src/users/decorators/user-id.decorator';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { GamesService } from './games.service';
import {
  CanvasNotify,
  Game,
  GameNotify,
  RegisterNotify,
} from './models/game.model';
import { Match } from './models/match.model';

@Resolver((of) => Game)
export class GamesResolver {
  constructor(
    private readonly gamesService: GamesService,
    // private readonly usersService: UsersService,
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
  async registerGame(@UserID() user_id: string): Promise<boolean> {
    return await this.gamesService.registerGame(user_id);
  }

  @Mutation((returns) => Boolean)
  async unregisterGame(@UserID() user_id: string): Promise<boolean> {
    return await this.gamesService.unregisterGame(user_id);
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
    @Args('isLeftWin', { type: () => Boolean! }) isLeftWin: boolean,
  ) {
    return await this.gamesService.winRound(user_id, game_id, isLeftWin);
  }

  @Mutation((returns) => Boolean)
  async surrenderGame(
    // @UserID() user_id: string,
    @Args('game_id', { type: () => ID! }) game_id: string,
    @Args('isLeft', { type: () => Boolean! }) isLeft: boolean,
  ) {
    return await this.gamesService.surrenderGame(game_id, isLeft);
  }

  @Mutation((returns) => Boolean)
  async makeCustomGame(
    @UserID() user_id: string,
    @Args('target_id', { type: () => ID! }) target_id: string,
    @Args('isBallNormal', { type: () => Boolean! }) isBallNormal: boolean,
    @Args('isPaddleNormal', { type: () => Boolean! }) isPaddleNormal: boolean,
  ) {
    return await this.gamesService.makeCustomGame(
      user_id,
      target_id,
      isBallNormal,
      isPaddleNormal,
    );
  }

  /*
   ** ANCHOR: Subscription
   */

  @Subscription((returns) => RegisterNotify)
  subscribeRegister(@UserID() user_id: string) {
    return this.pubSub.asyncIterator(`register_${user_id}`);
  }

  @Subscription((returns) => GameNotify)
  subscribeGame(
    // @UserID() user_id: string, // NOTE: 나중에 필요하면 추가
    @Args('game_id', { type: () => ID! }) game_id: string,
  ) {
    // return this.pubSub.asyncIterator(`ingame_${game_id}_${user_id}`);
    return this.pubSub.asyncIterator(`game_${game_id}`); // NOTE: 이렇게 해도 될까? 아 나중에 고치자...
  }

  @Subscription((returns) => CanvasNotify)
  subscribeCanvas(
    // @UserID() user_id: string, // NOTE: 나중에 필요하면 추가
    @Args('game_id', { type: () => ID! }) game_id: string,
  ) {
    // return this.pubSub.asyncIterator(`ingame_${game_id}_${user_id}`);
    return this.pubSub.asyncIterator(`canvas_${game_id}`);
  }
}

@Resolver((of) => Match)
export class MatchResolver {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
  ) {}

  @ResolveField('winner', (returns) => User)
  async getWinner(@Parent() match: Match): Promise<User> {
    const { winner_id } = match;
    return await this.usersService.getUserById(winner_id);
  }

  @ResolveField('loser', (returns) => User)
  async getLoser(@Parent() match: Match): Promise<User> {
    const { loser_id } = match;
    return await this.usersService.getUserById(loser_id);
  }
}
