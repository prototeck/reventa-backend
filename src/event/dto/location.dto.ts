import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType('Location')
export class LocationDTO {
  @Field()
  readonly latitude: string;

  @Field()
  readonly longitude: string;
}
