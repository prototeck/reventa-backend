/* eslint-disable max-classes-per-file */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { AuthenticationService } from '../authentication/authentication.service';

import { UserService } from './user.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { IUser, IUserLean, IAuthInfo } from './interfaces/user.interface';
import { LoginUserInput } from './inputs/login-user.input';

class UserModelMock {
  data: any;

  constructor(data) {
    this.data = { ...data };
  }

  async save(): Promise<any> {
    return this.data;
  }

  static findOne: jest.Mock<any> = jest.fn();

  static find: jest.Mock<any> = jest.fn();

  static findOneAndUpdate: jest.Mock<any> = jest.fn();

  static updateMany: jest.Mock<any> = jest.fn();

  static findOneAndDelete: jest.Mock<any> = jest.fn();
}

describe('UserService', () => {
  let service: UserService;
  let spyAuthenticationService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken('User'),
          useValue: UserModelMock,
        },
        {
          provide: AuthenticationService,
          useFactory: () => ({
            userSignup: jest.fn(),
            confirmCode: jest.fn(),
            userSignin: jest.fn(),
          }),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    spyAuthenticationService = module.get<AuthenticationService>(
      AuthenticationService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find all function', () => {
    let result: IUserLean[];
    let mockedLean: jest.Mock<any[]>;

    beforeEach(async () => {
      // mocked lean function
      mockedLean = jest.fn(() => []);

      // find function implementation with reference to mocked lean
      const mockedWithLean = () => ({ lean: mockedLean });

      jest.spyOn(UserModelMock, 'find').mockImplementationOnce(mockedWithLean);

      result = await service.findAll();
    });

    it('should return the result array', () => {
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);
    });

    it('should call the UserModel.find method', () => {
      expect(UserModelMock.find).toHaveBeenCalled();
    });

    it('should call find.lean method', () => {
      expect(mockedLean).toHaveBeenCalled();
    });
  });

  describe('find by email function', () => {
    const email = 'aditya.loshali@gmail.com';
    let mockedLean: jest.Mock<any>;

    beforeEach(async () => {
      mockedLean = jest.fn(() => undefined);

      // findOne function implementation with reference to mocked lean
      const mockedWithLean = () => ({ lean: mockedLean });

      jest.spyOn(UserModelMock, 'findOne').mockImplementation(mockedWithLean);

      await service.findByEmail(email);
    });

    it('should call the UserModel.findOne method', () => {
      expect(UserModelMock.findOne).toHaveBeenCalledWith({ email });
    });

    it('should call findOne.lean method', () => {
      expect(mockedLean).toHaveBeenCalled();
    });
  });

  describe('create user function', () => {
    const createInput: CreateUserInput = {
      firstName: 'Aditya',
      lastName: 'Loshali',
      email: 'aditya.loshali@gmail.com',
      password: 'Gibberish@123',
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should call service.findByEmail to check existing user', async done => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);

      await service.createUser(createInput);

      expect(service.findByEmail).toHaveBeenCalledWith(createInput.email);

      done();
    });

    it('should throw error when an user with same email exists', async done => {
      jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(async () => (createInput as any) as IUserLean);

      service
        .createUser(createInput)
        .then(() => done.fail('did not throw any error'))
        .catch(error => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.CONFLICT);
          expect(error.message).toContain('exists');

          done();
        });
    });

    describe('when called with correct data', () => {
      const mongoId = Types.ObjectId();
      let result: IUser;

      beforeEach(async () => {
        jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);
        jest
          .spyOn(UserModelMock.prototype, 'save')
          .mockResolvedValue({ _id: mongoId, ...createInput });

        result = await service.createUser(createInput);
      });

      it('should call the UserModel save method and return correct result', () => {
        expect(UserModelMock.prototype.save).toHaveBeenCalled();
        expect(result).toMatchObject(createInput);
        expect(result._id).toBeDefined();
      });

      it('should call AuthenticationService userSignup method with expected values', () => {
        expect(spyAuthenticationService.userSignup).toBeCalledWith(
          { _id: mongoId, ...createInput },
          createInput.password,
        );
      });
    });
  });

  describe('sign in user function', () => {
    // input test data
    const loginInput: LoginUserInput = {
      email: 'aditya.loshali@gmail.com',
      password: 'Password@1',
    };

    // mocked to resolve for findByEmail
    const mockedUser: IUserLean = {
      _id: Types.ObjectId().toHexString(),
      firstName: 'Aditya',
      lastName: 'Loshali',
      email: 'aditya.loshali@gmail.com',
      createdOn: Date.now(),
    };

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    // we should check for both succes and error cases
    // when user not found we need to check for error case
    it('should throw error when user with email not found', done => {
      // since we are just testing if the findByEmail is called or not
      // we can simply return undefined. also since findByEmail is already
      // unit tested we do not need to test it's implementation here
      // just knowing that it is called is enough

      // this allows to mock user not found
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);

      service
        .loginUser(loginInput)
        .then(() => done.fail('did not throw any error'))
        .catch(error => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toContain('not exist');

          done();
        });
    });

    // apart from failure cases we also check sucess case
    // we expect some functions to be called with certain values
    // we expect service to return seccess data
    // we expect no error to be thrown
    describe('when input data is correct', () => {
      // dummy tokens to return as mocked result
      // and to be used in expect
      const tokens: IAuthInfo = ({} as any) as IAuthInfo;
      let result: IAuthInfo;

      // mock the functions / business logic inside the login service
      // to emulate success data with no error
      beforeEach(async () => {
        jest.spyOn(service, 'findByEmail').mockResolvedValue(mockedUser);

        jest
          .spyOn(spyAuthenticationService, 'userSignin')
          .mockResolvedValue(tokens);

        result = await service.loginUser(loginInput);
      });

      /** first business rule is checking for existence of user */
      it('should call service.findByEmail to check existing user', () => {
        expect(service.findByEmail).toHaveBeenCalledWith(loginInput.email);
      });

      /** second business rule - when a user is found check that his details are send to cognito login service */
      it('should call AuthenticationService userSignin method with expected values', () => {
        expect(spyAuthenticationService.userSignin).toBeCalledWith(
          mockedUser,
          loginInput.password,
        );
      });

      /** third business rule - after cognito login successfully resolves. login service return tokens */
      it('should return authentication tokens', () => {
        expect(result).toMatchObject(tokens);
      });
    });
  });

  describe('update user function', () => {
    const mongoId = Types.ObjectId().toHexString();
    let mockedLean: jest.Mock<any>;

    const updateInput: UpdateUserInput = {
      firstName: 'aditya',
      lastName: 'loshali',
    };

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw error when user not found', done => {
      mockedLean = jest.fn(() => undefined);

      const mockedWithLean = () => ({ lean: mockedLean });

      jest.spyOn(UserModelMock, 'findOne').mockImplementation(mockedWithLean);

      service
        .updateUser(mongoId, updateInput)
        .then(() => done.fail('did not throw any error'))
        .catch(error => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toContain('not exist');

          done();
        });
    });

    describe('when input data is correct', () => {
      let result: IUser;

      beforeEach(async () => {
        mockedLean = jest.fn(() => ({}));

        const mockedWithLean = () => ({ lean: mockedLean });

        jest.spyOn(UserModelMock, 'findOne').mockImplementation(mockedWithLean);

        jest.spyOn(UserModelMock, 'findOneAndUpdate').mockResolvedValue({
          ...updateInput,
          _id: mongoId,
        });

        result = await service.updateUser(mongoId, updateInput);
      });

      it('should call UserModelMock.findOne to check existing user', () => {
        expect(UserModelMock.findOne).toBeCalledWith({ _id: mongoId });
      });

      it('should call UserModelMock.findOneAndUpdate to update user', () => {
        expect(UserModelMock.findOneAndUpdate).toBeCalledWith(
          { _id: mongoId },
          { $set: { ...updateInput } },
          { new: true },
        );
      });

      it('should return the updated record as result', () => {
        expect(result).toMatchObject(updateInput);
        expect(result._id).toBeDefined();
      });
    });
  });

  describe('delete user function', () => {
    const mongoId = Types.ObjectId().toHexString();
    let mockedLean: jest.Mock<any>;

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw error when user not found', done => {
      mockedLean = jest.fn(() => undefined);

      const mockedWithLean = () => ({ lean: mockedLean });

      jest.spyOn(UserModelMock, 'findOne').mockImplementation(mockedWithLean);

      service
        .deleteUser(mongoId)
        .then(() => done.fail('did not throw any error'))
        .catch(error => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toContain('not exist');

          done();
        });
    });

    describe('when input data is correct', () => {
      let result: IUser;

      beforeEach(async () => {
        mockedLean = jest.fn(() => ({}));

        const mockedWithLean = () => ({ lean: mockedLean });

        jest.spyOn(UserModelMock, 'findOne').mockImplementation(mockedWithLean);

        jest
          .spyOn(UserModelMock, 'findOneAndDelete')
          .mockResolvedValue({ _id: mongoId });

        result = await service.deleteUser(mongoId);
      });

      it('should call UserModelMock.findOne to check existing user', () => {
        expect(UserModelMock.findOne).toBeCalledWith({ _id: mongoId });
      });

      it('should call UserMocdelMock.findOneAndDelete to check user deletion', () => {
        expect(UserModelMock.findOneAndDelete).toBeCalledWith({ _id: mongoId });
      });

      it('should return the result of findOneAndDelete', () => {
        expect(result._id).toBeDefined();
      });
    });
  });
});
