import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

export enum Notify {
  ENTER = 'ENTER', // check가 true면 입장, false면 퇴장.
  CHAT = 'CHAT',
  MUTE = 'MUTE',
  KICK = 'KICK',
  BAN = 'BAN',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  TRANSFER = 'TRANSFER',
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

  @Field()
  is_private: boolean;

  @Field()
  owner?: User;

  @Field((type) => [User])
  administrators?: User[];

  @Field((type) => [User])
  participants?: User[];

  @Field((type) => [User]!)
  banned_users?: User[];

  @Field((type) => [User])
  muted_users?: User[];
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
