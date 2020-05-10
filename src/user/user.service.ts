import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError } from '../utils';

import { User, IUser } from './interfaces/user.interface';
import { CreateUserInput } from './inputs/create-user.input';

const USER_ERRORS = {
  USER_EXISTS: 'an user with the email already exists',
} as const;

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private UserModel: Model<User>) {}

  async findAll(): Promise<IUser[]> {
    try {
      const users = await this.UserModel.find({}).lean();

      return users;
    } catch (error) {
      throw makeError(error);
    }
  }

  async createUser(input: CreateUserInput) {
    try {
      const existingUser = await this.UserModel.findOne({ email: input.email });

      if (existingUser) {
        throw new HttpException(USER_ERRORS.USER_EXISTS, HttpStatus.CONFLICT);
      }

      const user = await new this.UserModel({ ...input }).save();

      return user;
    } catch (error) {
      throw makeError(error);
    }
  }
}
