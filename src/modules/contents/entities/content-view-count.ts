import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('contentViewCount')
export class ContentViewCount {
  @Field(() => Int)
  content_views: number;
}
