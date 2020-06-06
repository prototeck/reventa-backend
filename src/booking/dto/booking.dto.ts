import { ObjectType, ID, Field, Float } from '@nestjs/graphql';

import { Location, Address } from '../../event/interfaces/event.interface';
import { LocationDTO } from '../../event/dto/location.dto';
import { AddressDTO } from '../../event/dto/address.dto';

@ObjectType('Booking', { description: 'The Booking Model' })
export class BookingDto {
  @Field(() => ID)
  readonly _id: string;

  @Field(() => ID)
  readonly eventId: string;

  @Field(() => ID)
  readonly ticketId: string;

  @Field(() => ID)
  readonly userId: string;

  @Field({ nullable: true })
  readonly firstName?: string;

  @Field({ nullable: true })
  readonly lastName?: string;

  @Field({ nullable: true })
  readonly email?: string;

  @Field({ nullable: true })
  readonly eventTitle?: string;

  @Field(() => LocationDTO)
  readonly location: Location;

  @Field(() => AddressDTO, { nullable: true })
  readonly address?: Address;

  @Field({ nullable: true })
  readonly ticketName?: string;

  @Field(() => Float)
  readonly startsOn: number;

  @Field(() => Float)
  readonly endsOn: number;

  @Field()
  readonly status: string;

  @Field()
  readonly cancellationReason: string;
}
