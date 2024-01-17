import { Field, Int, ObjectType } from '@nestjs/graphql';
import { content_types as ContentTypeDB } from '@prisma/client';

export type IValidContentTypes = 'video' | 'pdf' | 'image';

export const VALID_CONTENT_TYPES: IValidContentTypes[] = [
  'video',
  'pdf',
  'image',
];

@ObjectType('contentType')
export class ContentType {
  @Field(() => Int)
  id: ContentTypeDB['id'];

  @Field(() => String)
  title: ContentTypeDB['title'];
}
