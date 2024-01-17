import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateContentViewInput {
  @Field()
  @IsNotEmpty()
  content_id: string;

  @Field()
  @IsNotEmpty()
  user_id: string;
}
