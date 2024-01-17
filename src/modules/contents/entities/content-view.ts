import { Field, Int, ObjectType } from '@nestjs/graphql';
import { content_views as ContentViewDB } from '@prisma/client';
import { User } from '../../../modules/users/entities/user';
import { Content } from './content';

@ObjectType('contentView')
export class ContentView {
  @Field(() => Int)
  id: ContentViewDB['id'];

  @Field(() => String)
  content_id: ContentViewDB['content_id'];

  @Field(() => String)
  user_id: ContentViewDB['user_id'];

  @Field(() => User)
  users?: User;

  @Field(() => Content)
  contents?: Content;
}
