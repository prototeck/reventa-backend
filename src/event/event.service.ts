import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError } from '../utils';

import { Event, IEvent } from './interfaces/event.interface';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';

const USER_ERRORS = {
  EVENT_NOT_FOUND: 'event does not exist',
} as const;

@Injectable()
export class EventService {
  constructor(@InjectModel('Event') private EventModel: Model<Event>) {}

  /**
   *
   */
  async findAll(): Promise<IEvent[]> {
    try {
      const events = await this.EventModel.find({}).lean();

      return events;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * create a new event in the database from the provided input
   * @param input - event details input object
   * @return new Event type record
   *
   * @public
   */
  async createEvent(input: CreateEventInput) {
    try {
      const event = await new this.EventModel({
        ...input,
      }).save();

      return event;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * * update an existing Event in the database
   * @param id - event's mongo id
   * @param updateInput - event details to update
   * @returns updated Event type record
   *
   * @public
   */
  async updateEvent(
    id: string,
    updateInput: UpdateEventInput,
  ): Promise<IEvent> {
    try {
      const existingEvent = await this.EventModel.findOne({ _id: id }).lean();

      if (!existingEvent) {
        throw new HttpException(
          USER_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const updatedEvent = await this.EventModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: { ...updateInput, updatedOn: Date.now() },
        },
        {
          new: true,
        },
      );

      return updatedEvent;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * * delete an existing event in the database
   * @param id - mongo id of the event to be deleted
   * @returns - deleted event
   *
   * @public
   */
  async deleteEvent(id: string): Promise<IEvent> {
    try {
      const existingEvent = await this.EventModel.findOne({ _id: id }).lean();

      if (!existingEvent) {
        throw new HttpException(
          USER_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const deletedEvent = await this.EventModel.findOneAndDelete({
        _id: id,
      });

      return deletedEvent;
    } catch (error) {
      throw makeError(error);
    }
  }
}
