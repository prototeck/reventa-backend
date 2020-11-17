import { InputType, Field, Float } from '@nestjs/graphql';
import { IsLatitude, IsLongitude } from 'class-validator';

/**
 * defines the input schema for location
 */
@InputType()
export class LocationInput {
  /** location's latitude of type number */
  @Field(() => Float)
  @IsLatitude()
  readonly latitude!: number;

  /** location's longitude of type number */
  @Field(() => Float)
  @IsLongitude()
  readonly longitude!: number;
}
