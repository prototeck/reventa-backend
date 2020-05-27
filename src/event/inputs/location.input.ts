import { InputType, Field } from '@nestjs/graphql';
import { IsNumberString } from 'class-validator';

/**
 * defines the input schema for location
 */
@InputType()
export class LocationInput {
  /** location's latitude of type number */
  @Field()
  @IsNumberString()
  readonly latitude: string;

  /** location's longitude of type number */
  @Field()
  @IsNumberString()
  readonly longitude: string;
}
