import {
  Directive,
  Field,
  ID,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Channel } from 'src/channels/models/channel.model';
import { Achievement } from '../../acheivements/models/achievement.model';
import { Match } from 'src/games/models/match.model';

export enum UserStatus {
  ONLINE = 'ONLINE',
  IN_RANK_GAME = 'IN_RANK_GAME',
  IN_NORMAL_GAME = 'IN_NORMAL_GAME',
  OFFLINE = 'OFFLINE',
}

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  OWNER = 'OWNER',
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
  nickname: string;

  @Field((type) => UserStatus)
  status: UserStatus;

  @Field({ nullable: true })
  status_message: string;

  @Field((type) => Int)
  rank: number;

  @Field((type) => Int)
  rank_score: number;

  @Field((type) => UserRole)
  site_role: UserRole;

  @Field({ nullable: true })
  avatar: string;

  @Field((type) => [User], { nullable: true })
  friends: User[];

  @Field((type) => [User], { nullable: true })
  blacklist: User[];

  @Field((type) => [Match])
  match_history: Match[];

  @Field((type) => [Achievement])
  achievements: Achievement[];

  @Field((type) => Channel, { nullable: true })
  channel: Channel;

  @Field((type) => UserRole, { nullable: true })
  channel_role: UserRole;
}
