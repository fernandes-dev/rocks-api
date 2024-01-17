import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateContentTypeInput {
  @Field()
  @IsNotEmpty()
  title: string;
}
