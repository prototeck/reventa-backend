import { Document } from 'mongoose';

type Longitude = number;
type Latitude = number;

export interface Location {
  type: string;
  coordinates: [Longitude, Latitude];
}

export interface IEvent {
  _id: string;
  title: string;
  createdBy: string;
  description: string;
  startOn: number;
  endsOn: number;
  location: Location;
  category: string;
  tags: string[];
  createdOn: number;
  updatedOn: number;
}

export interface Event extends IEvent, Document {
  _id: string;
}
