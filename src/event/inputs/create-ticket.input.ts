import { InputType, Field, Float, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, ValidateIf } from 'class-validator';

@InputType()
export class CreateTicketInput {
  @Field()
  readonly name!: string;

  @Field()
  @IsIn(['free', 'paid'])
  readonly type!: string;

  @Field(() => Int)
  readonly quantity!: number;

  @Field(() => Float)
  readonly startsOn!: number;

  @Field(() => Float)
  readonly endsOn!: number;

  @Field({ nullable: true })
  @ValidateIf(input => input.type === 'paid')
  @IsNotEmpty()
  readonly currency?: string;

  @Field(() => Int, { nullable: true })
  @ValidateIf(input => input.type === 'paid')
  @IsNotEmpty()
  readonly price?: string;
}
