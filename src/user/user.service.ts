import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthenticationService } from '../authentication/authentication.service';
import { makeError } from '../utils';

import { User, IUser } from './interfaces/user.interface';
import { CreateUserInput } from './inputs/create-user.input';
import { ConfirmUserInput } from './inputs/confirm-user.input';

const USER_ERRORS = {
  USER_EXISTS: 'an user with the email already exists',
  USER_NOT_FOUND: 'user with the provided email not found',
} as const;

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private UserModel: Model<User>,
    private readonly authenticationService: AuthenticationService,
  ) {}

  /**
   * * finds all the users in the database
   * @returns an array of all the User type records
   */
  async findAll(): Promise<IUser[]> {
    try {
      const users = await this.UserModel.find({}).lean();

      return users;
    } catch (error) {
      throw makeError(error);
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    const user = await this.UserModel.findOne({ email }).lean();

    return user;
  }

  /**
   * * create a new user in the database from the provided input
   * * creates a cognito user and links it to database record
   * @param input - user details input object
   * @returns new User type record
   *
   * @public
   */
  async createUser(input: CreateUserInput) {
    try {
      const existingUser = await this.findByEmail(input.email);

      if (existingUser) {
        throw new HttpException(USER_ERRORS.USER_EXISTS, HttpStatus.CONFLICT);
      }

      const user = await new this.UserModel({ ...input }).save();

      await this.authenticationService.userSignup(user, input.password);

      return user;
    } catch (error) {
      throw makeError(error);
    }
  }

  async confirmUser(input: ConfirmUserInput) {
    try {
      const existingUser = await this.findByEmail(input.email);

      if (!existingUser) {
        throw new HttpException(
          USER_ERRORS.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await this.authenticationService.confirmCode(
        existingUser,
        input.code,
      );

      return result;
    } catch (error) {
      throw makeError(error);
    }
  }
}
