import { Document } from 'mongoose';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  createdOn: number;
}

export interface User extends IUser, Document {
  _id: string;
}
