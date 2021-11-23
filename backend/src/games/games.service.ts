import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { DatabaseService } from 'src/database/database.service';
import { PUB_SUB } from 'src/pubsub.module';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import {
  CanvasNotifyType,
  Game,
  RegisterNotifyType,
  GameType,
  GameNotifyType,
} from './models/game.model';

const START_DELAY = 2000;

@Injectable()
export class GamesService {
  constructor(
    private databaseService: DatabaseService,
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {
    this.queue = [];
    this.games = new Map<string, Game>();
    this.waiting = new Map<string, string[]>();
    this.userMap = new Map<string, Game>();
  }

  private queue: string[];
  private games: Map<string, Game>;
  private waiting: Map<string, string[]>;
  private userMap: Map<string, Game>; // NOTE: user_id - game_id

  // NOTE: 임시
  normalBallInfo() {
    return {
      ball_x: 250,
      ball_y: 470, // NOTE: 상수화 필요
      ball_dx: 2,
      ball_dy: 2,
    };
  }

  paddleInfo() {
    return {
      left_paddle_y: 250,
      left_paddle_dy: 0,
      right_paddle_y: 250,
      right_paddle_dy: 0,
    };
  }

  hardBallInfo() {
    return {
      ball_x: 250,
      ball_y: 470, // NOTE: 상수화 필요
      ball_dx: 5,
      ball_dy: 5,
    };
  }

  async rankGame(leftId: string, rightId: string) {
    return {
      id: new Date().getTime().toString(),
      ball_info: this.normalBallInfo(),
      paddle_info: this.paddleInfo(),
      game_type: GameType.RANK,
      left_score: 0,
      right_score: 0,
      left_player: await this.usersService.getUserById(leftId),
      right_player: await this.usersService.getUserById(rightId),
      paddle_height: 75,
    };
  }

  async customGame(
    leftId: string,
    rightId: string,
    isBallNormal: boolean,
    isPaddleNormal: boolean,
  ) {
    return {
      id: new Date().getTime().toString(),
      ball_info: isBallNormal ? this.normalBallInfo() : this.hardBallInfo(),
      paddle_info: this.paddleInfo(),
      game_type: GameType.CUSTOM,
      left_score: 0,
      right_score: 0,
      left_player: await this.usersService.getUserById(leftId),
      right_player: await this.usersService.getUserById(rightId),
      // observers: [],
      // obstacles: [],
      paddle_height: isPaddleNormal ? 75 : 35,
    };
  }

  // TODO: observers, obstacles 필드 삭제

  /*
   ** ANCHOR: Query
   */

  async getGame(game_id: string) {
    const game = this.games.get(game_id);
    if (!game) throw Error('This game is not available.');
    return game;
  }

  getGameByUserId(user_id: string): Game {
    // console.log(this.userMap);
    const game = this.userMap.get(user_id);
    if (!game) return null;
    return game;
  }

  /*
   ** ANCHOR: Mutation
   */

  async registerGame(user_id: string): Promise<boolean> {
    if (this.queue.find((val) => val === user_id))
      throw Error(`this user(${user_id}) already registered.`);

    this.queue.push(user_id.toString()); // NOTE: number로 들어옵니다... 😡

    if (this.queue.length < 2) return true;

    const leftId = this.queue.shift();
    const rightId = this.queue.shift();

    const newGame = await this.rankGame(leftId, rightId);
    this.games.set(newGame.id, newGame);
    this.waiting.set(newGame.id, [
      newGame.left_player.id.toString(),
      newGame.right_player.id.toString(),
    ]);
    this.userMap.set(leftId, newGame);
    this.userMap.set(rightId, newGame); // NOTE: 아마 위치를 옮겨야 할듯. 너무 이른 시점에 세팅하는 것 같다.

    // await setTimeout(() => {
    this.pubSub.publish(`register_${leftId}`, {
      subscribeRegister: {
        type: RegisterNotifyType.MATCHED,
        game_id: newGame.id,
      },
    });
    this.pubSub.publish(`register_${rightId}`, {
      subscribeRegister: {
        type: RegisterNotifyType.MATCHED,
        game_id: newGame.id,
      },
    });
    // }, 3000);

    return true;
  }

  async unregisterGame(user_id: string): Promise<boolean> {
    if (!this.queue.find((val) => val === user_id.toString())) {
      // NOTE: ToString... 😡
      return false;
    } // NOTE: 큐에 없으면 false

    this.queue = this.queue.filter((val) => val !== user_id.toString());
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

    this.pubSub.publish(`register_${leftId}`, {
      subscribeRegister: { type: RegisterNotifyType.JOIN, game_id: game_id },
    });
    this.pubSub.publish(`register_${rightId}`, {
      subscribeRegister: { type: RegisterNotifyType.JOIN, game_id: game_id },
    });

    setTimeout(() => {
      this.pubSub.publish(`canvas_${game_id}`, {
        subscribeCanvas: {
          game_id,
          type: CanvasNotifyType.START,
          ball_info: game.ball_info,
          paddle_info: game.paddle_info,
        },
      });
    }, START_DELAY); // NOTE: 딜레이 후 게임 시작

    return true;
  }

  async notJoinGame(user_id: string, game_id: string): Promise<boolean> {
    if (!this.waiting.get(game_id)) throw Error('game is not vailable.');

    const leftId = this.games.get(game_id).left_player.id;
    const rightId = this.games.get(game_id).right_player.id;

    this.pubSub.publish(`register_${leftId}`, {
      subscribeRegister: { type: RegisterNotifyType.BOOM, game_id: game_id },
    });
    this.pubSub.publish(`register_${rightId}`, {
      subscribeRegister: { type: RegisterNotifyType.BOOM, game_id: game_id },
    });

    this.waiting.delete(game_id);
    this.games.delete(game_id);

    return true;
  }

  // NOTE: 추후 user_id로 검증도 추가해야... 현재는 user_id 미사용
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

    this.pubSub.publish(`canvas_${game_id}`, {
      subscribeCanvas: {
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

    // console.log('ball', x, y, dx, dy);

    this.pubSub.publish(`canvas_${game_id}`, {
      subscribeCanvas: {
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
    } else {
      game.right_score += 1;
    }

    // TODO: 끝나는 점수도 상수화해야
    if (game.left_score > 2 || game.right_score > 2) {
      const winner = game.left_score > 2 ? game.left_player : game.right_player;
      this.endGame(game, winner);
      return true;
    } // NOTE: 일단은 3점 얻으면 승리

    this.pubSub.publish(`game_${game_id}`, {
      subscribeGame: {
        type: GameNotifyType.WINLOSE,
        game_id,
      },
    });

    game.ball_info = { ...game.ball_info, ball_x: 250, ball_y: 470 }; // TODO: 상수화 필요
    game.paddle_info = this.paddleInfo();

    setTimeout(() => {
      this.pubSub.publish(`canvas_${game_id}`, {
        subscribeCanvas: {
          game_id,
          type: CanvasNotifyType.START,
          ball_info: game.ball_info,
          paddle_info: game.paddle_info,
        },
      });
    }, START_DELAY); // NOTE: 딜레이 후 게임 재시작

    return true;
  }

  async endGame(game: Game, winner: User) {
    this.userMap.delete(game.left_player.id.toString());
    this.userMap.delete(game.right_player.id.toString()); // NOTE: number 타입... 😡
    this.games.delete(game.id);
    this.pubSub.publish(`game_${game.id}`, {
      subscribeGame: {
        type: GameNotifyType.END,
        game_id: game.id,
        winner,
      },
    });
  }

  async surrenderGame(
    // user_id: string,
    game_id: string,
    isLeft: boolean,
  ): Promise<boolean> {
    const game = this.games.get(game_id);
    if (!game) throw Error('This game is not available.');

    const winner = isLeft ? game.right_player : game.left_player;
    this.endGame(game, winner);
    return true;
  }

  async makeCustomGame(
    user_id: string,
    target_id: string,
    isBallNormal: boolean,
    isPaddleNormal: boolean,
  ) {
    const newGame = await this.customGame(
      user_id,
      target_id,
      isBallNormal,
      isPaddleNormal,
    );
    this.games.set(newGame.id, newGame);
    this.waiting.set(newGame.id, [newGame.right_player.id.toString()]);
    this.userMap.set(user_id, newGame);
    this.userMap.set(target_id, newGame);

    this.pubSub.publish(`register_${target_id}`, {
      subscribeRegister: {
        type: RegisterNotifyType.ASKED,
        game_id: newGame.id,
        custom_host_nickname: newGame.left_player.nickname,
      },
    });

    return true;
  } // NOTE: target(right_player)만 join 혹은 notJoin을 한다?
}
