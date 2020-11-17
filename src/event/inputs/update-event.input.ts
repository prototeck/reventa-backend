import { InputType, Field, Float } from '@nestjs/graphql';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// import { Ticket } from '../interfaces/ticket.interface';

import { LocationInput } from './location.input';
// import { CreateTicketInput } from './create-ticket.input';

/**
 * defines the input schema for event updation
 */
@InputType()
export class UpdateEventInput {
  /** event's title - an all alphabet string */
  @Field({ nullable: true })
  readonly title?: string;

  /** user's id */
  // @Field()
  // readonly createdBy: string;

  /** event's description - an all alphabet string */
  @Field({ nullable: true })
  readonly description?: string;

  /** event's starting date */
  @Field(() => Float, { nullable: true })
  readonly startsOn?: number;

  /** event's ending date */
  @Field(() => Float, { nullable: true })
  readonly endsOn?: number;

  /** event's location - an all alphabet string */
  @Field(() => LocationInput, { nullable: true })
  readonly location?: LocationInput;

  /** event's category - an all alphabet string */
  @Field({ nullable: true })
  readonly category?: string;

  @Field({ nullable: true })
  readonly mainImageUrl?: string;

  @Field(() => [String], { nullable: true })
  readonly secondaryImageUrls?: string[];

  /** event's tags - an all alphabet string */
  @Field(() => [String], { nullable: true })
  readonly tags?: string[];
}
