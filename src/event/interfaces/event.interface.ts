import { Document } from 'mongoose';

import { ITicketLean } from './ticket.interface';

type Longitude = number;
type Latitude = number;

export interface ILocation {
  readonly type: string;
  readonly coordinates: [Longitude, Latitude];
}

export interface IAddress {
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly state: string;
  readonly zipCode: string;
  readonly country: string;
}

export interface IEventLean {
  readonly _id: string;
  readonly title: string;
  readonly createdBy: string;
  readonly description?: string;
  readonly startOn: number;
  readonly endsOn: number;
  readonly location: ILocation;
  readonly address?: IAddress;
  readonly category: string;
  readonly tags?: string[];
  readonly mainImageUrl?: string;
  readonly secondaryImageUrls?: string[];
  readonly tickets: ITicketLean[];
  readonly createdOn?: number;
  readonly updatedOn?: number;
}

export interface IEvent extends IEventLean, Document {
  _id: string;
}
