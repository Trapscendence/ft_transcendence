import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/users/models/user.model';

@ObjectType()
export class Channel {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

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

  @Field((type) => [User]!)
  mutedUsers: User[];
}
