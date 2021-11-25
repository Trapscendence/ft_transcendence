import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Image {
  @Field()
  filename: string;

  @Field()
  mimetype: string;

  @Field()
  encoding: string;
}
