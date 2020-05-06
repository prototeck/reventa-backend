import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User, IUser } from './interfaces/user.interface';
import { CreateUserInput } from './inputs/create-user.input';

// const USER_ERRORS = {

// } as const;

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private UserModel: Model<User>) {}

  async findAll(): Promise<IUser[]> {
    try {
      const users = await this.UserModel.find({}).lean();

      return users;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createUser(input: CreateUserInput) {
    try {
      const user = await new this.UserModel({ ...input }).save();

      return user;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
