import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.medel';

@Directive('@key(field: "id")')
@ObjectType()
export class Message {
  @Field((type) => ID)
  id: number;

  @Field()
  received: boolean;

  @Field()
  content: string;

  @Field()
  checked: boolean;

  @Field((type) => Int)
  date: number;
}

@Directive('@key(fields: "id other_user { id }")')
@ObjectType()
export class DM {
  @Field((type) => Int)
  user_id: number;

  @Field((type) => User)
  other_user: User;

  @Field()
  content: string;

  @Field((type) => [Message])
  messages: [Message];

  @Field((type) => Int)
  checked_date: number;
}
