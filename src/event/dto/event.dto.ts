import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { Location } from '../interfaces/event.interface';

import { LocationDTO } from './location.dto';

@ObjectType('Event', { description: 'The Event Model' })
export class EventDTO {
    @Field(() => ID)
    readonly _id: string;

    @Field()
    readonly title: string;

    @Field()
    readonly description: string;

    @Field(() => Float)
    readonly startOn: number;

    @Field(() => Float)
    readonly endsOn: number;

    @Field(() => LocationDTO)
    readonly location: Location;

    @Field()
    readonly category: string;

    @Field(() => [String])
    readonly tags: [string];

    @Field(() => Float)
    readonly createdOn: number;

    @Field(() => Float)
    readonly updatedOn: number;
}
