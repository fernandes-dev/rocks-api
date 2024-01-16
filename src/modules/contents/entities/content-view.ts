import { Field, Int, ObjectType } from '@nestjs/graphql';
import { content_views as ContentViewDB } from '@prisma/client';
import { Content } from './content';
import { User } from 'src/modules/users/entities/user';

@ObjectType('content-view')
export class ContentView {
  @Field(() => Int)
  id: ContentViewDB['id'];

  @Field(() => String)
  content_id: ContentViewDB['content_id'];

  @Field(() => Content)
  content: Content;

  @Field(() => String)
  user_id: ContentViewDB['user_id'];

  @Field(() => User)
  user: User;
}
