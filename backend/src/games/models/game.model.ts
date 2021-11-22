import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

export enum GameType {
  RANK = 'RANK',
  CUSTOM = 'CUSTOM',
}

registerEnumType(GameType, {
  name: 'GameType',
});

export enum RegisterNotifyType {
  MATCHED = 'MATCHED',
  JOIN = 'JOIN',
  BOOM = 'BOOM',
}

registerEnumType(RegisterNotifyType, {
  name: 'RegisterNotifyType',
});

export enum GameNotifyType {
  // BALL = 'BALL',
  // PADDLE = 'PADDLE',
  WINLOSE = 'WINLOSE',
  OBSERVER = 'OBSERVER',
  END = 'END',
}

registerEnumType(GameNotifyType, {
  name: 'GameNotifyType',
});

export enum CanvasNotifyType {
  BALL = 'BALL',
  PADDLE = 'PADDLE',
  // END = 'END',
  START = 'START',
}

registerEnumType(CanvasNotifyType, {
  name: 'CanvasNotifyType',
});

@ObjectType()
export class BallInfo {
  @Field() // TODO: int? float?
  ball_x: number;

  @Field()
  ball_y: number;

  @Field()
  ball_dx: number;

  @Field()
  ball_dy: number;
}

@ObjectType()
export class PaddleInfo {
  @Field()
  left_paddle_y: number;

  @Field()
  left_paddle_dy: number;

  @Field()
  right_paddle_y: number;

  @Field()
  right_paddle_dy: number;
}

@ObjectType()
export class RegisterNotify {
  @Field((type) => RegisterNotifyType)
  type: RegisterNotifyType;

  @Field((type) => ID)
  game_id: string;
}

@ObjectType()
export class GameNotify {
  @Field((type) => GameNotifyType)
  type: GameNotifyType;

  @Field((type) => ID)
  game_id: string;

  // @Field((type) => CanvasInfo, { nullable: true })
  // canvas_info: CanvasInfo;
}

@ObjectType()
export class CanvasNotify {
  @Field((type) => ID)
  game_id: string;

  @Field((type) => CanvasNotifyType)
  type: CanvasNotifyType;

  @Field((type) => BallInfo, { nullable: true })
  ball_info: BallInfo;

  @Field((type) => PaddleInfo, { nullable: true })
  paddle_info: PaddleInfo;
}

@ObjectType()
export class Obstacle {
  @Field()
  x: number;

  @Field()
  y: number;

  @Field()
  width: number;

  @Field()
  height: number;
}

@ObjectType()
export class Game {
  @Field((type) => ID)
  id: string;

  // @Field((type) => CanvasInfo)
  // canvas_info: CanvasInfo; // NOTE: 저장용... 실제로 사용하는 일은 없을 듯?

  @Field((type) => GameType)
  game_type: GameType;

  @Field()
  ball_info: BallInfo;

  @Field()
  paddle_info: PaddleInfo;

  @Field()
  left_score: number;

  @Field()
  right_score: number;

  @Field()
  left_player: User;

  @Field()
  right_player: User;

  @Field((type) => [User])
  observers: User[];

  @Field((type) => [Obstacle])
  obstacles: Obstacle[];

  // @Field()
  // game_speed: number; // NOTE: dx, dy와 겹치나?
}
