import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Achivement {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field((type) => Int)
  date: number;
}
