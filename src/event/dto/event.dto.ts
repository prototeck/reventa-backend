import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { Location, Address } from '../interfaces/event.interface';
import { Ticket } from '../interfaces/ticket.interface';

import { LocationDTO } from './location.dto';
import { AddressDTO } from './address.dto';
import { TicketDTO } from './ticket.dto';

@ObjectType('Event', { description: 'The Event Model' })
export class EventDTO {
  @Field(() => ID)
  readonly _id: string;

  @Field()
  readonly createdBy: string;

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

  @Field({ nullable: true })
  readonly mainImageUrl?: string;

  @Field(() => [String], { nullable: true })
  readonly secondaryImageUrls?: string[];

  @Field(() => [TicketDTO], { nullable: true })
  readonly tickets?: Ticket[];

  @Field(() => Float)
  readonly createdOn: number;

  @Field(() => Float)
  readonly updatedOn: number;
}
