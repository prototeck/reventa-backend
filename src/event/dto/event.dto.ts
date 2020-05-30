import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { Location, Address } from '../interfaces/event.interface';

import { LocationDTO } from './location.dto';
import { AddressDTO } from './address.dto';

@ObjectType('Event', { description: 'The Event Model' })
export class EventDTO {
  @Field(() => ID)
  readonly _id: string;

  @Field()
  readonly title: string;

  @Field({ nullable: true })
  readonly description?: string;

  @Field(() => Float)
  readonly startsOn: number;

  @Field(() => Float)
  readonly endsOn: number;

  @Field(() => LocationDTO)
  readonly location: Location;

  @Field(() => AddressDTO, { nullable: true })
  readonly address?: Address;

  @Field()
  readonly category: string;

  @Field(() => [String], { nullable: true })
  readonly tags?: string[];

  @Field(() => Float)
  readonly createdOn: number;

  @Field(() => Float)
  readonly updatedOn: number;
}
