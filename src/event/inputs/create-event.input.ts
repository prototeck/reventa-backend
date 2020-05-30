import { InputType, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

import { Location } from '../interfaces/event.interface';

import { LocationInput } from './location.input';

/**
 * defines the input schema for event creation
 */
@InputType()
export class CreateEventInput {
  /** event's title - an all alphabet string */
  @Field()
  @IsAlpha()
  readonly title: string;

  /** event's description - an all alphabet string */
  @Field()
  @IsAlpha()
  readonly description: string;

  /** event's starting date */
  @Field(() => Float)
  readonly startsOn: number;

  /** event's ending date */
  @Field(() => Float)
  readonly endsOn: number;

  /** event's location  */
  @Field(() => LocationInput)
  readonly location: Location;

  /** event's category - an all alphabet string */
  @Field()
  @IsAlpha()
  readonly category: string;

  /** event's tags - an all alphabet string */
  @Field(() => [String])
  readonly tags: string[];
}
