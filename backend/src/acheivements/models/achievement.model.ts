import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Achievement {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  time_stamp: string;
}
