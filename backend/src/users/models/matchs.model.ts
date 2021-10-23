import { forwardRef, ForwardReference, Inject } from '@nestjs/common';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from './users.medel';

enum MatchType {
  RANK,
  CUSTOM,
}

@ObjectType()
export class Match {
  @Field((type) => ID)
  id: string;

  // @Inject(forwardRef(() => User))
  @Field()
  winner: User;
  // winner: string;

  @Field((type) => Int)
  winner_point: number;

  // @Inject(forwardRef(() => User))
  @Field()
  loser: User;
  // loser: string;

  @Field((type) => Int)
  loser_point: number;

  @Field()
  type: MatchType;

  @Field((type) => Int) // NOTE Date가 있지 않나?
  time: number; // NOTE Date 객체의 integer?
}
