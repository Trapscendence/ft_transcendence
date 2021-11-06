import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.medel';

export enum Notify {
  ENTER, // check가 true면 입장, false면 퇴장.
  CHAT,
  MUTE,
  KICK,
  BAN,
  EDIT,
  DELETE,
}

registerEnumType(Notify, {
  name: 'Notify',
});

@ObjectType()
export class Channel {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  // @Field({ nullable: true }) // NOTE: password가 없으면 public
  // password: string;

  @Field()
  is_private: boolean;

  @Field()
  owner: User;

  @Field((type) => [User])
  administrators: User[];

  @Field((type) => [User])
  participants: User[];

  @Field((type) => [User]!)
  bannedUsers: User[];

  @Field((type) => [User])
  mutedUsers: User[];
}

@ObjectType()
export class ChannelNotify {
  @Field((type) => Notify)
  type: Notify;

  @Field((type) => User, { nullable: true })
  participant: User;

  @Field({ nullable: true })
  text: string;

  @Field({ nullable: true })
  check: boolean;
}
