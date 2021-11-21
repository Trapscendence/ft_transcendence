import { Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DatabaseService } from 'src/database/database.service';
import { PUB_SUB } from 'src/pubsub.module';
import { UsersService } from 'src/users/users.service';
import {
  CanvasNotifyType,
  Game,
  GameNotifyType,
  GameType,
  InGameNotifyType,
} from './models/game.model';

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
  makeBallInfo() {
    return {
      ball_x: 250,
      ball_y: 470, // NOTE: 상수화 필요
      ball_dx: 2,
      ball_dy: 2,
    };
  }

  makePaddleInfo() {
    return {
      left_paddle_y: 250,
      left_paddle_dy: 0,
      right_paddle_y: 250,
      right_paddle_dy: 0,
    };
  }

  // NOTE: 임시
  async makeGame(leftId: string, rightId: string) {
    return {
      // id: new Date().getTime().toString(),
      id: '1',
      // canvas_info: this.makeCanvasInfo(),
      ball_info: this.makeBallInfo(),
      paddle_info: this.makePaddleInfo(),
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

  async getGame(game_id: string) {
    const game = this.games.get(game_id);

    if (!game) throw Error('This game is not available.');

    return game;
  }

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

    const game = this.games.get(game_id);
    if (!game) throw Error('game is not vailable.');

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

    this.pubSub.publish(`ingame_canvas_${game_id}`, {
      subscribeInGameCanvas: {
        game_id,
        ball_info: game.ball_info,
        paddle_info: game.paddle_info,
      },
    });

    setTimeout(() => {
      this.pubSub.publish(`ingame_canvas_${game_id}`, {
        subscribeInGameCanvas: {
          game_id,
          type: CanvasNotifyType.START,
          ball_info: this.makeBallInfo(),
          paddle_info: this.makePaddleInfo(),
        },
      });
    }, 3000); // NOTE: 3초 후 게임 시작

    return true;
  }

  async notJoinGame(user_id: string, game_id: string): Promise<boolean> {
    if (!this.waiting.get(game_id)) throw Error('game is not vailable.');

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

  // NOTE: 시간 남으면 나중에 user_id로 검증도 추가해야... 그 의도로 user_id 받음
  async movePaddle(
    user_id: string,
    game_id: string,
    y: number,
    dy: number,
    isLeft: boolean,
  ) {
    const game = this.games.get(game_id);
    if (!game) throw Error('This game is not available.');

    if (isLeft) {
      game.paddle_info = {
        ...game.paddle_info,
        left_paddle_y: y,
        left_paddle_dy: dy,
      };
    } else {
      game.paddle_info = {
        ...game.paddle_info,
        right_paddle_y: y,
        right_paddle_dy: dy,
      };
    }

    this.pubSub.publish(`ingame_canvas_${game_id}`, {
      subscribeInGameCanvas: {
        game_id,
        type: CanvasNotifyType.PADDLE,
        paddle_info: game.paddle_info,
      },
    });

    return true;
  } // NOTE: 프론트에서 눌렀는지 안눌렀는지, 어느 방향인지를 dy로 포괄적으로 보내줌

  async ballCollision(
    user_id: string,
    game_id: string,
    x: number,
    y: number,
    dx: number,
    dy: number,
    // isLeft: string,
  ) {
    const game = this.games.get(game_id);
    if (!game) throw Error('This game is not available.');

    console.log('ball', x, y, dx, dy);

    this.pubSub.publish(`ingame_canvas_${game_id}`, {
      subscribeInGameCanvas: {
        game_id, // NOTE: game_id는 필요할까?
        type: CanvasNotifyType.BALL,
        ball_info: {
          ball_x: x,
          ball_y: y,
          ball_dx: dx,
          ball_dy: dy,
        },
      },
    });

    return true;
  } // NOTE: 프론트에서 왼쪽인 사람만 보낸다. 공이 충돌이 일어나면 위치와 속도를 보낸다.

  async winRound(
    user_id: string,
    game_id: string,
    isLeftWin: boolean,
  ): Promise<boolean> {
    const game = this.games.get(game_id);
    if (!game) throw Error('This game is not available.');

    if (isLeftWin) {
      game.left_score += 1;
      console.log('left', game.left_score, game.right_score);
    } else {
      game.right_score += 1;
      console.log('right', game.left_score, game.right_score);
    }

    game.ball_info = this.makeBallInfo();
    game.paddle_info = this.makePaddleInfo();

    this.pubSub.publish(`ingame_${game_id}`, {
      subscribeInGame: {
        type: InGameNotifyType.WINLOSE,
        game_id,
      },
    });

    setTimeout(() => {
      this.pubSub.publish(`ingame_canvas_${game_id}`, {
        subscribeInGameCanvas: {
          game_id,
          type: CanvasNotifyType.START,
          ball_info: this.makeBallInfo(),
          paddle_info: this.makePaddleInfo(),
        },
      });
    }, 3000); // NOTE: 3초 후 게임 재시작

    return true;
  }
}
