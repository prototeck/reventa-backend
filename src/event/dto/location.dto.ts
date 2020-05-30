import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType('Location')
export class LocationDTO {
  @Field()
  readonly type: string;

  @Field(() => [Float])
  readonly coordinates: number[];
}
