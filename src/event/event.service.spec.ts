/* eslint-disable no-underscore-dangle */
/* eslint-disable max-classes-per-file */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { EventService } from './event.service';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';
import { IEvent } from './interfaces/event.interface';

class EventModelMock {
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

describe('Event Service', () => {
  let service: EventService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        {
          provide: getModelToken('Event'),
          useValue: EventModelMock,
        },
      ],
    }).compile();

    service = module.get<EventService>(EventService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('find all function', () => {
    let result: IEvent[];
    let mockedLean: jest.Mock<any[]>;

    beforeEach(async () => {
      mockedLean = jest.fn(() => []);

      const mockedWithLean = () => ({ lean: mockedLean });

      jest.spyOn(EventModelMock, 'find').mockImplementationOnce(mockedWithLean);

      result = await service.findAll();
    });

    it('should return the result array', () => {
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toEqual(0);
    });

    it('should call the EventModel.find method', () => {
      expect(EventModelMock.find).toHaveBeenCalled();
    });

    it('should call find.lean method', () => {
      expect(mockedLean).toHaveBeenCalled();
    });
  });

  describe('create event function', () => {
    const createInput: CreateEventInput = {
      title: 'Dance Show',
      description: 'This is a dance show',
      tags: ['abc'],
      category: 'dance',
      startOn: 3975375,
      endsOn: 38758375,
      location: {
        latitude: 764726472462,
        longitude: 36486348364,
      },
    };

    beforeEach(() => {
      jest.resetAllMocks();
    });

    describe('when called with correct data', () => {
      const mongoId = Types.ObjectId();
      let result: IEvent;

      beforeEach(async () => {
        jest.spyOn(EventModelMock.prototype, 'save').mockResolvedValue({
          _id: mongoId,
          ...createInput,
          createdOn: Date.now(),
        });

        result = await service.createEvent(createInput);
      });

      it('should call the EventModel save method and return correct result', () => {
        expect(EventModelMock.prototype.save).toHaveBeenCalled();
        expect(result).toMatchObject(createInput);
        // eslint-disable-next-line no-underscore-dangle
        expect(result._id).toBeDefined();
      });
    });
  });

  describe('update event function', () => {
    const mongoId = Types.ObjectId().toHexString();
    let mockedLean: jest.Mock<any>;

    const updateInput: UpdateEventInput = {
      title: 'Dance Show',
      description: 'This is a dance show',
      tags: ['abc'],
      category: 'dance',
      startOn: 3975375,
      endsOn: 38758375,
      location: {
        latitude: 764726472462,
        longitude: 36486348364,
      },
    };

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw error when event not found', done => {
      mockedLean = jest.fn(() => undefined);

      const mockedWithLean = () => ({ lean: mockedLean });

      jest.spyOn(EventModelMock, 'findOne').mockImplementation(mockedWithLean);

      service
        .updateEvent(mongoId, updateInput)
        .then(() => done.fail('did not throw any error'))
        .catch(error => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toContain('not exist');

          done();
        });
    });

    describe('when input data is correct', () => {
      let result: IEvent;

      beforeEach(async () => {
        mockedLean = jest.fn(() => ({}));

        const mockedWithLean = () => ({ lean: mockedLean });

        jest
          .spyOn(EventModelMock, 'findOne')
          .mockImplementation(mockedWithLean);

        jest.spyOn(EventModelMock, 'findOneAndUpdate').mockResolvedValue({
          ...updateInput,
          _id: mongoId,
          updatedOn: Date.now(),
        });

        result = await service.updateEvent(mongoId, updateInput);
      });

      it('should call EventModelMock.findOne to check existing event', () => {
        expect(EventModelMock.findOne).toBeCalledWith({ _id: mongoId });
      });

      it('should call EventModelMock.findOneAndUpdate to update event', () => {
        expect(EventModelMock.findOneAndUpdate).toBeCalledWith(
          { _id: mongoId },
          { $set: { ...updateInput, updatedOn: Date.now() } },
          { new: true },
        );
      });

      it('should return the updated record as result', () => {
        expect(result).toMatchObject(updateInput);
        expect(result._id).toBeDefined();
      });
    });
  });

  describe('delete event function', () => {
    const mongoId = Types.ObjectId().toHexString();
    let mockedLean: jest.Mock<any>;

    beforeEach(() => {
      jest.restoreAllMocks();
    });

    it('should throw error when event not found', done => {
      mockedLean = jest.fn(() => undefined);

      const mockedWithLean = () => ({ lean: mockedLean });

      jest.spyOn(EventModelMock, 'findOne').mockImplementation(mockedWithLean);

      service
        .deleteEvent(mongoId)
        .then(() => done.fail('did not throw any error'))
        .catch(error => {
          expect(error).toBeInstanceOf(HttpException);
          expect(error.status).toBe(HttpStatus.NOT_FOUND);
          expect(error.message).toContain('not exist');

          done();
        });
    });

    describe('when input data is correct', () => {
      let result: IEvent;

      beforeEach(async () => {
        mockedLean = jest.fn(() => ({}));

        const mockedWithLean = () => ({ lean: mockedLean });

        jest
          .spyOn(EventModelMock, 'findOne')
          .mockImplementation(mockedWithLean);

        jest
          .spyOn(EventModelMock, 'findOneAndDelete')
          .mockResolvedValue({ _id: mongoId });

        result = await service.deleteEvent(mongoId);
      });

      it('should call EventModelMock.findOne to check existing event', () => {
        expect(EventModelMock.findOne).toBeCalledWith({ _id: mongoId });
      });

      it('should call EventModelMock.findOneAndDelete to deleted event', () => {
        expect(EventModelMock.findOneAndDelete).toBeCalledWith({
          _id: mongoId,
        });
      });

      it('should return the result of findOneAndDelete', () => {
        expect(result._id).toBeDefined();
      });
    });
  });
});
