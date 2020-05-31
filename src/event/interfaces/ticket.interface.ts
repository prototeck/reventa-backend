import { Document } from 'mongoose';

export interface ITicket {
  readonly _id: string;
  readonly name: string;
  readonly type: string;
  readonly quantity: number;
  readonly currency?: string;
  readonly price?: string;
  readonly startsOn: number;
  readonly endsOn: number;
}

export interface Ticket extends ITicket, Document {
  _id: string;
}
