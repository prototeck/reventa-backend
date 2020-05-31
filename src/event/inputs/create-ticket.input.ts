import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsIn } from 'class-validator';

@InputType()
export class CreateTicketInput {
  @Field()
  readonly name: string;

  @Field()
  @IsIn(['free', 'paid'])
  readonly type: string;

  @Field(() => Int)
  readonly quantity: number;

  @Field({ nullable: true })
  readonly currency?: string;

  @Field(() => Int, { nullable: true })
  readonly price?: string;

  @Field(() => Float)
  readonly startsOn: number;

  @Field(() => Float)
  readonly endsOn: number;
}
