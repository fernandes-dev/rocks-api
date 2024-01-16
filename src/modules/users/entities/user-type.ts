import { Field, Int, ObjectType } from '@nestjs/graphql';
import { user_types as UserTypeDB } from '@prisma/client';

@ObjectType('user-type')
export class UserType {
  @Field(() => Int)
  id: UserTypeDB['id'];

  @Field(() => String)
  title: UserTypeDB['title'];
}
