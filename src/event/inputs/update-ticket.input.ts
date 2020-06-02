import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class UpdateTicketInput {
  @Field(() => Int)
  readonly quantity?: number;

  @Field({ nullable: true })
  readonly currency?: string;

  @Field(() => Int, { nullable: true })
  readonly price?: string;

  @Field(() => Float)
  readonly startsOn?: number;

  @Field(() => Float)
  readonly endsOn?: number;
}