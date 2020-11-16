import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AuthenticationService } from '@/authentication/authentication.service';
import { makeError } from '@/utils';
import { USER_ERRORS } from '@errors/index';
import {
  IUserLean,
  IUser,
  ICreateUserInput,
  IConfirmUserInput,
  ILoginUserInput,
  IUpdateUserInput,
} from '@typings/index';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private _userModel: Model<IUser>,
    private readonly _authenticationService: AuthenticationService,
  ) {}

  /**
   * * finds all the users in the database
   * @returns an array of all the User type records
   */
  async findAll(): Promise<IUserLean[]> {
    try {
      const users = await this._userModel.find({}).lean();

      return users;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * * find the user in database by unique id
   * @param id - database unique id of user
   * @returns found User type record
   */
  async findOne(id: string): Promise<IUserLean> {
    try {
      const user = await this._userModel.findOne({ _id: id }).lean();

      if (!user) {
        throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

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
  async findByEmail(email: string): Promise<IUserLean | null> {
    const user = await this._userModel.findOne({ email }).lean();

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
  async createUser(input: ICreateUserInput) {
    try {
      const existingUser = await this.findByEmail(input.email);

      if (existingUser) {
        throw new HttpException(
          USER_ERRORS.ALREADY_EXISTS_WITH_EMAIL,
          HttpStatus.CONFLICT,
        );
      }

      const user = await new this._userModel({ ...input }).save();

      await this._authenticationService.userSignup(user, input.password);

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
  async updateUser(id: string, updateInput: IUpdateUserInput): Promise<IUser> {
    try {
      const existingUser = await this._userModel.findOne({ _id: id }).lean();

      if (!existingUser) {
        throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const updatedUser = await this._userModel.findOneAndUpdate(
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

      return updatedUser!;
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
      const existingUser = await this._userModel.findOne({ _id: id }).lean();

      if (!existingUser) {
        throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const deletedUser = await this._userModel.findOneAndDelete({
        _id: id,
      });

      return deletedUser!;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * * confirm the registered (pending verification) user by code
   * @param input - confirm user input including the verification code
   * @returns success message string
   */
  async confirmUser(input: IConfirmUserInput) {
    try {
      const existingUser = await this.findByEmail(input.email);

      if (!existingUser) {
        throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const result = await this._authenticationService.confirmCode(
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

  async loginUser(input: ILoginUserInput) {
    try {
      const existingUser = await this.findByEmail(input.email);

      if (!existingUser) {
        throw new HttpException(USER_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const result = await this._authenticationService.userSignin(
        existingUser,
        input.password,
      );

      return result;
    } catch (error) {
      throw makeError(error);
    }
  }
}
