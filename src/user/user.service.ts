import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthenticationService } from '../authentication/authentication.service';
import { makeError } from '../utils';

import { User, IUser } from './interfaces/user.interface';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { ConfirmUserInput } from './inputs/confirm-user.input';
import { LoginUserInput } from './inputs/login-user.input';

const USER_ERRORS = {
  USER_EXISTS: 'an user with the email already exists',
  USER_NOT_FOUND: 'user does not exist',
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

  async findOne(id: string): Promise<IUser> {
    try {
      const user = await this.UserModel.findOne({ _id: id }).lean();

      return user;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * * find the user in database by unique email
   * @param email - email id of user
   * @returns found User type record
   */
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

  /**
   * * update an existing User in the database
   * @param id - user's mongo id
   * @param updateInput - user details to update
   * @returns updated User type record
   *
   * @public
   */
  async updateUser(id: string, updateInput: UpdateUserInput): Promise<IUser> {
    try {
      const existingUser = await this.UserModel.findOne({ _id: id }).lean();

      if (!existingUser) {
        throw new HttpException(
          USER_ERRORS.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

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
   * * delete an existing user in the database
   * @param id - mongo id of the user to be deleted
   * @returns - deleted user
   *
   * @public
   */
  async deleteUser(id: string): Promise<IUser> {
    try {
      const existingUser = await this.UserModel.findOne({ _id: id }).lean();

      if (!existingUser) {
        throw new HttpException(
          USER_ERRORS.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const deletedUser = await this.UserModel.findOneAndDelete({
        _id: id,
      });

      return deletedUser;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * * confirm the registered (pending verification) user by code
   * @param input - confirm user input including the verification code
   * @returns success message string
   */
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

  /**
   * * login the user using cognito and return tokens
   * @param input - user authentication details
   * @returns authorization tokens
   *
   * @public
   */

  async loginUser(input: LoginUserInput) {
    try {
      const existingUser = await this.findByEmail(input.email);

      if (!existingUser) {
        throw new HttpException(
          USER_ERRORS.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const result = await this.authenticationService.userSignin(
        existingUser,
        input.password,
      );

      return result;
    } catch (error) {
      throw makeError(error);
    }
  }
}
