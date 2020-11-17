import { InputType, Field, Float } from '@nestjs/graphql';

import { LocationInput } from './location.input';
import { AddressInput } from './address.input';

/**
 * defines the input schema for event creation
 */
@InputType()
export class CreateEventInput {
  /** event's title - an all alphabet string */
  @Field()
  readonly title!: string;

  /** event's description - an all alphabet string */
  @Field({ nullable: true })
  readonly description?: string;

  /** event's starting date */
  @Field(() => Float)
  readonly startsOn!: number;

  /** event's ending date */
  @Field(() => Float)
  readonly endsOn!: number;

  /** event's location  */
  @Field(() => LocationInput)
  readonly location!: LocationInput;

  @Field(() => AddressInput, { nullable: true })
  readonly address?: AddressInput;

  /** event's category - an all alphabet string */
  @Field()
  readonly category!: string;

  /** event's tags - an array of all alphabet string */
  @Field(() => [String], { nullable: true })
  readonly tags?: string[];
}
