import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { ILocation, IAddress } from '../interfaces/event.interface';
import { ITicket } from '../interfaces/ticket.interface';

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
  readonly location: ILocation;

  @Field(() => AddressDTO, { nullable: true })
  readonly address?: IAddress;

  @Field()
  readonly category: string;

  @Field(() => [String], { nullable: true })
  readonly tags?: string[];

  @Field({ nullable: true })
  readonly mainImageUrl?: string;

  @Field(() => [String], { nullable: true })
  readonly secondaryImageUrls?: string[];

  @Field(() => [TicketDTO], { nullable: true })
  readonly tickets?: ITicket[];

  @Field(() => Float, { nullable: true })
  readonly createdOn: number;

  @Field(() => Float, { nullable: true })
  readonly updatedOn: number;
}
