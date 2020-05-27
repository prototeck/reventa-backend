import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType('location')
export class LocationDTO {
    @Field(() => ID)
    readonly _id: string;

    @Field(() => Float)
    readonly latitude: number;

    @Field(() => Float)
    readonly longitude: number;
}
