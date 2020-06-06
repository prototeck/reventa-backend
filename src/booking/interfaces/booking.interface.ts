import { Document } from 'mongoose';

import { Location, Address } from '../../event/interfaces/event.interface';

// export interface BookingStatus {
//   CANCELLED: string;
//   PENDING: string;
//   CONFIRMED: string;
// }

export interface IBooking {
  readonly eventId: string;
  readonly ticketId?: string;
  readonly userId: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly eventTitle: string;
  readonly location: Location;
  readonly address?: Address;
  readonly ticketName: string;
  readonly startsOn: number;
  readonly endsOn: number;
  status: string;
  readonly cancellationReason: string;
}

export interface Booking extends IBooking, Document {
  _id: string;
}
