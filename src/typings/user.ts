import { Document } from 'mongoose';

export interface IUserLean {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdOn: number;
}

/** User Mongo Document */
export interface IUser extends IUserLean, Document {
  _id: string;
}

export interface IAuthInfo {
  idToken: string;
  accessToken: string;
  refreshToken: string;
}

export interface ICreateUserInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUpdateUserInput {
  firstName?: string;
  lastName?: string;
}

export interface IConfirmUserInput {
  email: string;
  code: string;
}

export interface ILoginUserInput {
  email: string;
  password: string;
}
