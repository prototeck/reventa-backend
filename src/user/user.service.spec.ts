/* eslint-disable max-classes-per-file */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';

import { AuthenticationService } from '../authentication/authentication.service';

import { UserService } from './user.service';
import { CreateUserInput } from './inputs/create-user.input';
import { IUser } from './interfaces/user.interface';

class UserModelMock {
  data: any;

  constructor(data) {
    this.data = { ...data };
  }

  async save(): Promise<any> {
    return this.data;
  }

  static findOne: jest.Mock<any> = jest.fn(() => []);

  static find: jest.Mock<any> = jest.fn(() => []);

  static findOneAndUpdate: jest.Mock<any> = jest.fn(() => []);

  static updateMany: jest.Mock<any> = jest.fn();
}

class AuthenticationServiceMock {
  userSignup = jest.fn();

  confirmCode = jest.fn();
}

describe('UserService', () => {
  let service: UserService;

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
          useValue: AuthenticationServiceMock,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find all function', () => {
    let result: IUser[];
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

  describe('find by email function', async () => {
    const email = 'aditya.loshali@gmail.com';

    jest.spyOn(UserModelMock, 'findOne').mockResolvedValue(undefined);

    await service.findByEmail(email);

    expect(UserModelMock.findOne).toHaveBeenCalledWith({ email });
  });

  describe('create user function', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should call service.findByEmail to check existing user', async done => {
      const createInput: CreateUserInput = {
        firstName: 'Aditya',
        lastName: 'Loshali',
        email: 'aditya.loshali@gmail.com',
        password: 'Gibberish@123',
      };

      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);

      await service.createUser(createInput);

      expect(service.findByEmail).toHaveBeenCalledWith(createInput.email);

      done();
    });

    it('should throw error when an user with same email exists', async done => {
      const createInput: CreateUserInput = {
        firstName: 'Aditya',
        lastName: 'Loshali',
        email: 'aditya.loshali@gmail.com',
        password: 'Gibberish@123',
      };

      jest
        .spyOn(service, 'findByEmail')
        .mockImplementation(async () => createInput as any as User);

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

    // it('should throw error when the input email is wrong', done => {
    //   const createInput: CreateUserInput = {
    //     firstName: 'Aditya',
    //     lastName: 'Loshali',
    //     email: 'aditya.loshali',
    //   };

    //   service
    //     .createUser(createInput)
    //     .then(() => done.fail('did not throw any error'))
    //     .catch(error => {
    //       console.log(error);

    //       done();
    //     });
    // });
  });
});
