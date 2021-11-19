import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@Directive('@key(fields: "user_id other_user { id }")')
@ObjectType()
export class DM {
  @Field((type) => ID)
  user_id: string;

  @Field((type) => ID)
  other_id: string;

  @Field((type) => User, { nullable: true })
  other_user: User;

  @Field((type) => [Message], { nullable: true })
  messages: [Message];

  @Field()
  checked_date: string;
}

@Directive('@key(field: "id")')
@ObjectType()
export class Message {
  @Field((type) => ID)
  id: string;

  @Field()
  received: boolean;

  @Field()
  content: string;

  @Field()
  checked: boolean;

  @Field()
  time_stamp: string;
}
