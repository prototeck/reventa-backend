import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';

@ObjectType('Ticket')
export class TicketDTO {
  @Field(() => ID)
  readonly _id!: string;

  @Field()
  readonly name!: string;

  @Field()
  readonly type!: string;

  @Field(() => Int)
  readonly quantity!: number;

  @Field(() => Int)
  readonly sold!: number;

  @Field(() => Float)
  readonly startsOn!: number;

  @Field(() => Float)
  readonly endsOn!: number;

  @Field({ nullable: true })
  readonly currency?: string;

  @Field(() => Int, { nullable: true })
  readonly price?: string;
}
