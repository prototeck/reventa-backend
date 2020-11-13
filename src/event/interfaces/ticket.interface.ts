import { Document } from 'mongoose';

export interface ITicketLean {
  readonly _id: string;
  readonly name: string;
  readonly type: string;
  readonly quantity: number;
  readonly sold: number;
  readonly currency?: string;
  readonly price?: string;
  readonly startsOn: number;
  readonly endsOn: number;
}

export interface ITicket extends ITicketLean, Document {
  _id: string;
}
