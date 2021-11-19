import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

export enum GameType {
  RANK = 'RANK',
  CUSTOM = 'CUSTOM',
}

registerEnumType(GameType, {
  name: 'GameType',
});

@ObjectType()
export class Game {
  @Field((type) => ID)
  id: string;

  @Field((type) => GameType)
  game_type: GameType;

  @Field() // TODO: int? float?
  ball_x: number;

  @Field()
  ball_y: number;

  @Field()
  ball_dx: number;

  @Field()
  ball_dy: number;

  @Field()
  left_paddle_y: number;

  @Field()
  right_paddle_y: number;

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

  @Field()
  game_speed: number;
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
