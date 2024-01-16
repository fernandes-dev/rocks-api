import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetContentArgs {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  content_types?: boolean;

  @Field()
  content_views?: boolean;
}
