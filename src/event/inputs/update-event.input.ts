import { InputType, Field, Float } from '@nestjs/graphql';
import { IsAlpha } from 'class-validator';

import { Location } from '../interfaces/event.interface';

import { LocationInput } from './location.input';

/**
 * defines the input schema for event updation
 */
@InputType()
export class UpdateEventInput {
  /** event's title - an all alphabet string */
  @Field({ nullable: true })
  @IsAlpha()
  readonly title: string;

  /** event's description - an all alphabet string */
  @Field({ nullable: true })
  @IsAlpha()
  readonly description: string;

  /** event's starting date */
  @Field(() => Float, { nullable: true })
  readonly startsOn: number;

  /** event's ending date */
  @Field(() => Float, { nullable: true })
  readonly endsOn: number;

  /** event's location - an all alphabet string */
  @Field(() => LocationInput, { nullable: true })
  readonly location: Location;

  /** event's category - an all alphabet string */
  @Field({ nullable: true })
  @IsAlpha()
  readonly category: string;

  /** event's tags - an all alphabet string */
  @Field(() => [String], { nullable: true })
  readonly tags: string[];
}
