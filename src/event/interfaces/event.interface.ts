import { Document } from 'mongoose';

export interface Location {
  latitude: number;
  longitude: number;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  startOn: number;
  endsOn: number;
  location: Location;
  category: string;
  tags: Array<string>;
  createdOn: number;
  updatedOn: number;
}

export interface Event extends IEvent, Document {
  _id: string;
}
