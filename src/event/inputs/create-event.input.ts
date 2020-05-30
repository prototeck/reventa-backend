import { InputType, Field, Float } from '@nestjs/graphql';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { LocationInput } from './location.input';
/**
 * defines the input schema for event creation
 */
@InputType()
export class CreateEventInput {
  /** event's title - an all alphabet string */
  @Field()
  readonly title: string;

  /** event's description - an all alphabet string */
  @Field()
  readonly description: string;

  /** event's starting date */
  @Field(() => Float)
  readonly startsOn: number;

  /** event's ending date */
  @Field(() => Float)
  readonly endsOn: number;

  /** event's location  */
  @Field(() => LocationInput)
  // these decorators are required for nested validation
  @Type(() => LocationInput)
  @ValidateNested()
  readonly location: LocationInput;

  /** event's category - an all alphabet string */
  @Field()
  readonly category: string;

  /** event's tags - an array of all alphabet string */
  @Field(() => [String])
  readonly tags: string[];
}
