import { ArgsType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@ArgsType()
export class GetContentViewArgs {
  @Field()
  @IsNotEmpty()
  content_id: string;

  @Field()
  @IsNotEmpty()
  user_id: string;
}
