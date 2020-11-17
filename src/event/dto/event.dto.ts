import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

import { LocationDTO } from './location.dto';
import { AddressDTO } from './address.dto';
import { TicketDTO } from './ticket.dto';

@ObjectType('Event', { description: 'The Event Model' })
export class EventDTO {
  @Field(() => ID)
  readonly _id!: string;

  @Field()
  readonly title!: string;

  @Field({ nullable: true })
  readonly description?: string;

  @Field(() => Float)
  readonly startsOn!: number;

  @Field(() => Float)
  readonly endsOn!: number;

  @Field(() => LocationDTO)
  readonly location!: LocationDTO;

  @Field(() => AddressDTO, { nullable: true })
  readonly address?: AddressDTO;

  @Field()
  readonly category!: string;

  @Field(() => [String], { nullable: true })
  readonly tags?: string[];

  @Field()
  readonly createdBy!: string;

  @Field({ nullable: true })
  readonly mainImageUrl?: string;

  @Field(() => [String], { nullable: true })
  readonly secondaryImageUrls?: string[];

  @Field(() => [TicketDTO], { nullable: true })
  readonly tickets?: TicketDTO[];

  @Field(() => Float)
  readonly createdOn!: number;

  @Field(() => Float)
  readonly updatedOn!: number;
}
