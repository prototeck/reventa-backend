import { Document } from 'mongoose';

type Longitude = number;
type Latitude = number;

export interface ILocation {
  type: string;
  coordinates: [Longitude, Latitude];
}

export interface IAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IEventLean {
  _id: string;
  title: string;
  description?: string;
  startOn: number;
  endsOn: number;
  location: ILocation;
  address?: IAddress;
  category: string;
  tags?: string[];
  createdBy: string;
  mainImageUrl?: string;
  secondaryImageUrls?: string[];
  tickets: ITicketLean[];
  createdOn: number;
  updatedOn: number;
}

export interface IEvent extends IEventLean, Document {
  _id: string;
}

export interface ITicketLean {
  _id: string;
  name: string;
  type: string;
  quantity: number;
  sold: number;
  startsOn: number;
  endsOn: number;
  currency?: string;
  price?: string;
}

export interface ITicket extends ITicketLean, Document {
  _id: string;
}
