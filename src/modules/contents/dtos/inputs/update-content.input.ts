import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateContentInput {
  @Field()
  @IsNotEmpty()
  id: string;

  @Field()
  name?: string;

  @Field()
  description?: string;

  @Field()
  content_type_id?: number;
}
