import { ArgsType, Field, Int } from '@nestjs/graphql';
import { IsArray } from 'class-validator';

@ArgsType()
export class GetContentsArgs {
  @Field(() => [String])
  @IsArray()
  ids?: string[];

  @Field(() => String)
  name?: string;

  @Field(() => String)
  description?: string;

  @Field(() => [Int])
  @IsArray()
  content_type_ids?: number[];

  @Field(() => Int)
  page?: number;

  @Field(() => Int)
  per_page?: number;
}
