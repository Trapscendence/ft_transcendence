import {
  Directive,
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Channel } from 'src/channels/models/channel.medel';
import { Achivement } from '../../achivements/models/achivement.model';
import { Match } from '../../matchs/models/match.model';

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

registerEnumType(UserStatus, {
  name: 'UserStatus',
});

registerEnumType(UserRole, {
  name: 'UserRole',
});

@Directive('@key(fields: "id")')
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

  @Field({ nullable: true })
  status_message: string;

  @Field((type) => UserStatus) // TODO enum? 수정 필요한가?
  status: UserStatus;

  @Field((type) => [User], { nullable: true })
  friends: User[];

  @Field((type) => [User], { nullable: true })
  blacklist: User[];

  @Field((type) => Int)
  rank_score: number;

  @Field((type) => Int)
  rank: number;

  @Field((type) => [Match])
  match_history: Match[];

  @Field((type) => [Achivement])
  achivements: Achivement[];

  @Field((type) => Channel, { nullable: true })
  channel: Channel;

  @Field((type) => UserRole)
  role: UserRole;
}
