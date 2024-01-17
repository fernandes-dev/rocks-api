import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Content } from '../../entities/content';
import { IsArray } from 'class-validator';

@ObjectType()
export class GetContentsOutput {
  @Field(() => [Content])
  @IsArray()
  list: Content[];

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  per_page: number;
}
