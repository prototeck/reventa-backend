import { Document } from 'mongoose';

import { Location, Address } from '../../event/interfaces/event.interface';

export interface IBooking {
  readonly eventId: string;
  readonly ticketId: string;
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly eventTitle: string;
  readonly location: Location;
  readonly address?: Address;
  readonly ticketName: string;
  readonly startsOn: string;
  readonly endsOn: string;
}

export interface Booking extends IBooking, Document {
  _id: string;
}
