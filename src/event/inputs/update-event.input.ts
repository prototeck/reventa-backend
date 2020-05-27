import { InputType, Field } from '@nestjs/graphql';
import { IsAlpha, IsDate } from 'class-validator';

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
    @Field({ nullable: true })
    readonly startOn: number;

    /** event's ending date */
    @Field({ nullable: true })
    readonly endsOn: number;

    /** event's location - an all alphabet string */
    @Field({ nullable: true })
    @IsAlpha()
    readonly location: LocationInput;

    /** event's category - an all alphabet string */
    @Field({ nullable: true })
    @IsAlpha()
    readonly category: string;

    /** event's tags - an all alphabet string */
    @Field(() => [String], { nullable: true })
    readonly tags: [string];
}
