import { Directive, Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@Directive('@key(fields: "user_id other_user { id }")')
@ObjectType()
export class MyProfile {
  @Field((type) => User)
  user: User;

  @Field((type) => Image)
  profile_pic: User;
}

