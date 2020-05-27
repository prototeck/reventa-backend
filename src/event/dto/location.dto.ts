import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType('location')
export class LocationDTO {
  @Field(() => Float)
  readonly latitude: number;

  @Field(() => Float)
  readonly longitude: number;
}
