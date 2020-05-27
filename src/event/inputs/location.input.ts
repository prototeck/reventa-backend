import { InputType, Field } from '@nestjs/graphql';
import { IsInt } from 'class-validator';

/**
 * defines the input schema for location
 */
@InputType()
export class LocationInput {
    /** location's latitude of type number */
    @Field()
    @IsInt()
    readonly latitude: number;

    /** location's longitude of type number */
    @Field()
    @IsInt()
    readonly longitude: number;
}
