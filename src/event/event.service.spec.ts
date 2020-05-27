/* eslint-disable max-classes-per-file */
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Types } from 'mongoose';

import { EventService } from './event.service';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';
import { Event, IEvent } from './interfaces/event.interface';

class EventModelMock {
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

  static findOneAndDelete: jest.Mock<any> = jest.fn(() => []);
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

  
});
