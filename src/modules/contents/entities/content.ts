import { Field, Int, ObjectType } from '@nestjs/graphql';
import { contents as ContentDB } from '@prisma/client';
// import { ContentType } from './content-type';
// import { ContentView } from './content-view';

@ObjectType('content')
export class Content {
  @Field(() => String)
  id: ContentDB['id'];

  @Field(() => String)
  name: ContentDB['name'];

  @Field(() => String)
  description: ContentDB['description'];

  @Field(() => Int)
  content_type_id: ContentDB['content_type_id'];

  // @Field(() => ContentType)
  // content_types: ContentType;

  // @Field(() => [ContentView])
  // content_views: ContentView[];
}
