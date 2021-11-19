import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DatabaseService } from 'src/database/database.service';
import { PUB_SUB } from 'src/pubsub.module';
import { UsersService } from 'src/users/users.service';
import { Game, GameType } from './models/game.model';

@Injectable()
export class GamesService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {
    this.queue = [];
    this.games = new Map<string, Game>();
  }

  private games: Map<string, Game>;
  private queue: string[];

  // NOTE: 임시
  makeCanvasInfo() {
    return {
      ball_x: 250,
      ball_y: 250,
      ball_dx: 1,
      ball_dy: 1,
      left_paddle_y: 250,
      right_paddle_y: 250,
    };
  }

  // NOTE: 임시
  async makeGame(leftId: string, rightId: string) {
    return {
      id: new Date().getTime().toString(),
      canvas_info: this.makeCanvasInfo(),
      game_type: GameType.RANK,
      left_score: 0,
      right_score: 0,
      left_player: await this.usersService.getUserById(leftId),
      right_player: await this.usersService.getUserById(rightId),
      observers: [],
      obstacles: [],
    };
  }

  async registerMatch(user_id: string): Promise<boolean> {
    if (this.queue.find((val) => val === user_id))
      throw Error(`this user(${user_id}) already registered.`);

    this.queue.push(user_id);

    if (this.queue.length < 2) return true;

    const leftId = this.queue.pop();
    const rightId = this.queue.pop();
    const newGame = await this.makeGame(leftId, rightId);
    this.games.set(newGame.id, newGame);

    this.pubSub.publish(`registered_${leftId}`, { subscribeMatch: newGame.id });
    this.pubSub.publish(`registered_${rightId}`, {
      subscribeMatch: newGame.id,
    });

    console.log('published', leftId);
    console.log('published', rightId);
    return true;
  }

  async cancelRegister(user_id: string): Promise<boolean> {
    if (!this.queue.find((val) => val === user_id)) {
      return false;
    } // NOTE: 큐에 없으면 false

    this.queue = this.queue.filter((val) => val !== user_id);
    return true;
  }
}
