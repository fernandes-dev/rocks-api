import { Field, Int, ObjectType } from '@nestjs/graphql';
import { content_types as ContentTypeDB } from '@prisma/client';
import { Content } from './content';

@ObjectType('content-type')
export class ContentType {
  @Field(() => Int)
  id: ContentTypeDB['id'];

  @Field(() => String)
  title: ContentTypeDB['title'];

  @Field(() => [Content])
  contents: Content[];
}
