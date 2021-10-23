import { forwardRef, Inject } from '@nestjs/common';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Achivement } from './achivements.model';
import { Match } from './matchs.model';

enum UserStatus {
  ONLINE,
  IN_RANK_GAME,
  IN_NORMAL_GAME,
  OFFLINE,
}

enum UserRole {
  USER,
  MODERATOR,
  OWNER,
}

@ObjectType()
export class User {
  @Field((type) => ID)
  id: string;

  @Field()
  intra_id: string;

  @Field()
  nickname: string;

  @Field()
  avatar: string;

  @Field()
  status_message: string;

  @Field()
  status: UserStatus;

  @Field((type) => [User])
  friends: User[];

  @Field((type) => [User])
  blacklist: User[];

  @Field((type) => Int)
  rank_score: number;

  @Field((type) => Int)
  rank: number;

  // @Inject(forwardRef(() => Match))
  @Field((type) => [Match])
  match_history: Match[];

  @Field((type) => [Achivement])
  achivements: Achivement[];

  @Field()
  role: UserRole;
}
