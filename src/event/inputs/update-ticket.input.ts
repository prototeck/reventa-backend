import { InputType, Field, Int, Float } from '@nestjs/graphql';

@InputType()
export class UpdateTicketInput {
  @Field(() => Int, { nullable: true })
  readonly quantity?: number;

  @Field({ nullable: true })
  readonly currency?: string;

  @Field(() => Int, { nullable: true })
  readonly price?: string;

  @Field(() => Float, { nullable: true })
  readonly startsOn?: number;

  @Field(() => Float, { nullable: true })
  readonly endsOn?: number;
}
