import { Document } from 'mongoose';

import { Ticket } from './ticket.interface';

type Longitude = number;
type Latitude = number;

export interface Location {
  readonly type: string;
  readonly coordinates: [Longitude, Latitude];
}

export interface Address {
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
}

export interface IEvent {
  readonly _id: string;
  readonly title: string;
  readonly createdBy: string;
  readonly description?: string;
  readonly startOn: number;
  readonly endsOn: number;
  readonly location: Location;
  readonly address?: Address;
  readonly category: string;
  readonly tags?: string[];
  readonly mainImageUrl?: string;
  readonly secondaryImageUrls?: string[];
  readonly tickets: Ticket[];
  readonly createdOn: number;
  readonly updatedOn: number;
}

export interface Event extends IEvent, Document {
  _id: string;
}
