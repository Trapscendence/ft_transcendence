import { Field, ID, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from '../../users/models/user.medel';

// TODO
// enum도 파일 분리해야 할 것 같은데...
enum MatchType {
  RANK,
  CUSTOM,
}

// TODO
// 이거 도대체 어디서 쓰라는거지...? 이렇게 전역으로 바로 쓴다고...?
// https://docs.nestjs.kr/graphql/unions-and-enums
registerEnumType(MatchType, {
  name: 'MatchType',
});

@ObjectType()
export class Match {
  @Field((type) => ID)
  id: string;

  @Field((type) => User)
  winner: User;

  @Field((type) => Int)
  winner_point: number;

  @Field((type) => User)
  loser: User;

  @Field((type) => Int)
  loser_point: number;

  @Field((type) => MatchType)
  type: MatchType;

  // graphql이 bigint를 지원하지 않아서 string으로 보냄.
  @Field()
  time_stamp: string;
}
