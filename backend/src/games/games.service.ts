import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DatabaseService } from 'src/database/database.service';
import { PUB_SUB } from 'src/pubsub.module';
import { UsersService } from 'src/users/users.service';
import { Game, GameNotifyType, GameType } from './models/game.model';

@Injectable()
export class GamesService {
  constructor(
    private databaseService: DatabaseService,
    private usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {
    this.queue = [];
    this.games = new Map<string, Game>();
    this.waiting = new Map<string, string[]>();
  }

  private queue: string[];
  private games: Map<string, Game>;
  private waiting: Map<string, string[]>;

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
      // id: new Date().getTime().toString(),
      id: '1',
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

  /*
   ** ANCHOR: Query
   */

  /*
   ** ANCHOR: Mutation
   */

  async registerMatch(user_id: string): Promise<boolean> {
    if (this.queue.find((val) => val === user_id))
      throw Error(`this user(${user_id}) already registered.`);

    this.queue.push(user_id);

    if (this.queue.length < 2) return true;

    const leftId = this.queue.pop();
    const rightId = this.queue.pop();
    const newGame = await this.makeGame(leftId, rightId);
    this.games.set(newGame.id, newGame);
    this.waiting.set(newGame.id, [
      newGame.left_player.id.toString(),
      newGame.right_player.id.toString(),
    ]);

    this.pubSub.publish(`registered_${leftId}`, {
      subscribeMatch: { type: GameNotifyType.MATCHED, game_id: newGame.id },
    });
    this.pubSub.publish(`registered_${rightId}`, {
      subscribeMatch: { type: GameNotifyType.MATCHED, game_id: newGame.id },
    });

    return true;
  }

  async cancelRegister(user_id: string): Promise<boolean> {
    if (!this.queue.find((val) => val === user_id)) {
      return false;
    } // NOTE: 큐에 없으면 false

    this.queue = this.queue.filter((val) => val !== user_id);
    return true;
  }

  async joinGame(user_id: string, game_id: string): Promise<boolean> {
    if (!this.waiting.get(game_id)) throw Error('game is not vailable.');

    this.waiting.set(
      game_id,
      this.waiting.get(game_id).filter((val) => {
        return +val !== +user_id; // NOTE: val, user_id 둘 다 number로 들어오는 경우가 각각 있다... ㅠㅠ
      }),
    );

    if (this.waiting.get(game_id).length !== 0) {
      return true;
    }

    const leftId = this.games.get(game_id).left_player.id;
    const rightId = this.games.get(game_id).right_player.id;

    this.pubSub.publish(`registered_${leftId}`, {
      subscribeMatch: { type: GameNotifyType.JOIN, game_id: game_id },
    });
    this.pubSub.publish(`registered_${rightId}`, {
      subscribeMatch: { type: GameNotifyType.JOIN, game_id: game_id },
    });

    return true;
  }

  async notJoinGame(user_id: string, game_id: string): Promise<boolean> {
    const leftId = this.games.get(game_id).left_player.id;
    const rightId = this.games.get(game_id).right_player.id;

    this.pubSub.publish(`registered_${leftId}`, {
      subscribeMatch: { type: GameNotifyType.BOOM, game_id: game_id },
    });
    this.pubSub.publish(`registered_${rightId}`, {
      subscribeMatch: { type: GameNotifyType.BOOM, game_id: game_id },
    });

    this.waiting.delete(game_id);
    this.games.delete(game_id);

    return true;
  }
}
