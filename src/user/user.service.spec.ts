/* eslint-disable max-classes-per-file */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { AuthenticationService } from '../authentication/authentication.service';

import { UserService } from './user.service';
import { CreateUserInput } from './inputs/create-user.input';
import { UpdateUserInput } from './inputs/update-user.input';
import { IUser } from './interfaces/user.interface';
import { LoginUserInput } from './inputs/login-user.input';

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

  static findOneAndDelete: jest.Mock<any> = jest.fn(() => ({
    lean: jest.fn(),
  }));
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
        .mockImplementation(async () => (createInput as any) as IUser);

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
        // eslint-disable-next-line no-underscore-dangle
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
  // describe('get all users function', () => {
  //   beforeEach(() => {
  //     jest.restoreAllMocks();
  //   });

  //   it('should call UserModel.findall to get all users', async done =>{
  //     const userArray =
  //   })
  // }
  describe('update user function', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should call UserModel.findOne to check existing user', async done => {
      const createInput: CreateUserInput = {
        firstName: 'Aditya',
        lastName: 'Loshali',
        email: 'aditya.loshali@gmail.com',
        password: 'Password@1',
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);

      await service.createUser(createInput);

      expect(service.findByEmail).toHaveBeenCalledWith(createInput.email);

      done();
    });

    it('should call UserModel.findOneAndUpdate to update user', async done => {
      const id = '1';
      const updateInput: UpdateUserInput = {
        firstName: 'aditya',
        lastName: 'loshali',
      };

      jest
        .spyOn(UserModelMock, 'findOneAndUpdate')
        .mockResolvedValue(updateInput);

      await service.updateUser(id, updateInput);

      expect(UserModelMock.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: id },
        { $set: { ...updateInput } },
        { new: true },
      );
      done();
    });
  });

  describe('delete user function', () => {
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should call UserModel.findOne to check existing user', async done => {
      const createInput: CreateUserInput = {
        firstName: 'Aditya',
        lastName: 'Loshali',
        email: 'aditya.loshali@gmail.com',
        password: 'Password@1',
      };
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);

      await service.createUser(createInput);

      expect(service.findByEmail).toHaveBeenCalledWith(createInput.email);

      done();
    });
    it('should call UserModel.findOneAndDelete to delete user', async done => {
      const id = '1';

      jest.spyOn(UserModelMock, 'findOneAndDelete').mockResolvedValue(id);

      await service.deleteUser(id);

      expect(UserModelMock.findOneAndDelete).toHaveBeenCalledWith({
        _id: id,
      });
      done();
    });
  });

  describe('signin user function', () => {
    const createInput: CreateUserInput = {
      firstName: 'Aditya',
      lastName: 'Loshali',
      email: 'aditya.loshali@gmail.com',
      password: 'Password@1',
    };
    const loginInput: LoginUserInput = {
      email: 'aditya.loshali@gmail.com',
      password: 'Password@1',
    };
    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should call UserModel.findOne to check existing user', async done => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(undefined);

      await service.createUser(createInput);

      expect(service.findByEmail).toHaveBeenCalledWith(loginInput.email);

      done();
    });

    it('should call AuthenticationService userSignin method with expected values', () => {
      expect(spyAuthenticationService.userSignin).toBeCalledWith({
        ...loginInput,
      });
    });
  });
});
