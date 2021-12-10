import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

export enum UseFor {
  NOTICE = 'NOTICE',
  PATCH = 'PATCH',
}

@Directive('@key(fields: "time_stamp")')
@ObjectType()
export class Notice {
  @Field((type) => ID)
  writer_id: string;

  @Field((type) => User)
  writer: User;

  @Field((type) => ID)
  title: string;

  @Field({ nullable: true })
  contents: string;

  @Field()
  time_stamp: string;
}

@Directive('@key(fields: "time_stamp")')
@ObjectType()
export class PatchNote {
  @Field((type) => ID)
  writer_id: string;

  @Field((type) => ID)
  writer: User;

  @Field((type) => ID)
  title: string;

  @Field({ nullable: true })
  content: string;

  @Field()
  time_stamp: string;
}
