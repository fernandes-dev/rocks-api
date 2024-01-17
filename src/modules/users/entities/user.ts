import { Field, Int, ObjectType } from '@nestjs/graphql';
import { users as UserDB } from '@prisma/client';

@ObjectType('user')
export class User {
  @Field(() => Int)
  id: UserDB['id'];

  @Field(() => String)
  name: UserDB['name'];

  @Field(() => String)
  email: UserDB['email'];

  @Field(() => String)
  token: UserDB['token'];

  @Field(() => Int)
  user_type_id: UserDB['user_type_id'];

  // @Field(() => UserType)
  // user_type: UserType;

  @Field(() => Date)
  created_at: UserDB['created_at'];

  @Field(() => Date)
  updated_at: UserDB['updated_at'];

  // @Field(() => [ContentView])
  // content_views: ContentView[];
}
