import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError } from '../utils';
import { Mutable } from '../types';

import { Event, IEvent } from './interfaces/event.interface';
import { Ticket, ITicket } from './interfaces/ticket.interface';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';
import { CreateTicketInput } from './inputs/create-ticket.input';

const EVENT_ERRORS = {
  EVENT_NOT_FOUND: 'event does not exist',
} as const;

@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private EventModel: Model<Event>,
    @InjectModel('Ticket') private TicketModel: Model<Ticket>,
  ) {}

  /**
   *
   */
  async findAll(): Promise<IEvent[]> {
    try {
      // {
      //   location: {
      //     $near: {
      //       $maxDistance: 100,
      //       $geometry: {
      //         type: 'Point',
      //         coordinates: [-74.005974, 40.712776],
      //       },
      //     },
      //   },
      // }
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
        location: {
          type: 'Point',
          coordinates: [input.location.longitude, input.location.latitude],
        },
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
          EVENT_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const { location, ...updateWithoutLocation } = updateInput;

      const updateDocument: Partial<Mutable<IEvent>> = {
        ...updateWithoutLocation,
      };

      if (location) {
        updateDocument.location = {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        };
      }

      const updatedEvent = await this.EventModel.findOneAndUpdate(
        {
          _id: id,
        },
        {
          $set: { ...updateDocument, updatedOn: Date.now() },
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
          EVENT_ERRORS.EVENT_NOT_FOUND,
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

  async createTicketForEvent(
    eventId: string,
    ticketInput: CreateTicketInput,
  ): Promise<ITicket> {
    try {
      const event = await this.EventModel.findOne({ _id: eventId });

      if (!event) {
        throw new HttpException(
          EVENT_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const ticket = new this.TicketModel({ ...ticketInput });

      event.tickets.push(ticket);

      event.save();

      return ticket;
    } catch (error) {
      throw makeError(error);
    }
  }
}
