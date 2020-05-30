import { InputType, Field, Float } from '@nestjs/graphql';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

import { Location } from '../interfaces/event.interface';

import { LocationInput } from './location.input';

/**
 * defines the input schema for event updation
 */
@InputType()
export class UpdateEventInput {
  /** event's title - an all alphabet string */
  @Field({ nullable: true })
  readonly title?: string;

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
  @Type(() => LocationInput)
  @ValidateNested()
  @IsOptional()
  readonly location?: Location;

  /** event's category - an all alphabet string */
  @Field({ nullable: true })
  readonly category?: string;

  /** event's tags - an all alphabet string */
  @Field(() => [String], { nullable: true })
  readonly tags?: string[];
}
