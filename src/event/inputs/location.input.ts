import { InputType, Field } from '@nestjs/graphql';
import { IsLatitude, IsLongitude } from 'class-validator';

/**
 * defines the input schema for location
 */
@InputType()
export class LocationInput {
  /** location's latitude of type number */
  @Field()
  @IsLatitude()
  readonly latitude: string;

  /** location's longitude of type number */
  @Field()
  @IsLongitude()
  readonly longitude: string;
}
