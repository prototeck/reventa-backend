import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError } from '../utils';

import { User, IUser } from './interfaces/user.interface';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';

const USER_ERRORS = {
  USER_EXISTS: 'an user with the email already exists',
} as const;

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private UserModel: Model<User>) { }

  /**
   * * finds all the users in the database
   * @returns an array of all the User type records
   */
  async findAll(): Promise<IUser[]> {
    try {
      const users = await this.UserModel.find({}).lean();
      console.log('users', users);
      return users;
    } catch (error) {
      console.log('errorrrr', error);
      throw makeError(error);
    }
  }

  /**
   * * create a new user in the database from the provided input
   * @param input - user details input object
   * @returns new User type record
   *
   * @public
   */
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

  /**
   * * update an existing User in the database
   * @param input - existing user details
   * @returns updated User type record
   *
   * @public
   */
  async updateUser(id: string, updateInput: UpdateUserInput) {
    try {
      const updatedUser = await this.UserModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: { ...updateInput },
        },
        {
          new: true,
        },
      );
      return updatedUser;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * delete an existing user in the database
   * @param userId - id of the user to be deleted
   * @returns - deleted user
   */
  async deleteUser(id: string): Promise<IUser> {
    try {
      const deletedUser = await this.UserModel.findOneAndDelete({
        _id: id,
      });
      return deletedUser;
    } catch (error) {
      throw makeError(error);
    }
  }
}
