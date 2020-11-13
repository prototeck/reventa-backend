import { Document } from 'mongoose';

export interface IUserLean {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdOn: number;
}

export interface IUser extends IUserLean, Document {
  _id: string;
}

export interface IAuthInfo {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}
