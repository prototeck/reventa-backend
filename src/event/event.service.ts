import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError, prepareSubdocumentUpdate } from '../utils';
import { Mutable } from '../types';

import { Event, IEvent } from './interfaces/event.interface';
import { Ticket, ITicket } from './interfaces/ticket.interface';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';
import { CreateTicketInput } from './inputs/create-ticket.input';
import { UpdateTicketInput } from './inputs/update-ticket.input';

const EVENT_ERRORS = {
  EVENT_NOT_FOUND: 'Event does not exist',
} as const;

const TICKET_ERRORS = {
  TICKET_NOT_FOUND: 'Ticket does not exist',
  EMPTY: 'Price and Currency must be empty for free ticket type ',
  ENDTIME_LESS_THAN_STARTTIME: 'End time cannot be less than Start time',
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

  async findOne(id: string, ticketId: string): Promise<IEvent> {
    try {
      const event = await this.EventModel.findOne({
        _id: id,
        'tickets._id': ticketId,
      }).lean();

      return event;
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
  async createEvent(userId: string, input: CreateEventInput) {
    try {
      const event = await new this.EventModel({
        ...input,
        createdBy: userId,
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

  async updateTicketForEvent(
    eventId: string,
    ticketId: string,
    ticketInput: UpdateTicketInput,
  ) {
    try {
      const event = await this.EventModel.findOne({ _id: eventId });
      if (!event) {
        throw new HttpException(
          EVENT_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      // const ticket = await this.EventModel.find({
      //   tickets: {
      //     $elemMatch: {
      //       _id: ticketId,
      //     },
      //   },
      // });
      // console.log(event)
      // const ticket = await this.EventModel.find().elemMatch('tickets', {
      //   _id: ticketId,
      // });
      // console.log(ticket);
      // eslint-disable-next-line no-underscore-dangle
      const ticket = event.tickets.filter(ele => ele._id == ticketId)[0];
      console.log(ticket);
      if (!ticket) {
        throw new HttpException(
          TICKET_ERRORS.TICKET_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      // if (ticket.type === 'free' && (ticket.currency || ticket.price)) {

      //   throw new HttpException(TICKET_ERRORS.EMPTY, HttpStatus.NOT_FOUND);
      // } else if (ticket.type === 'free') {
      //   console.log('free');
      // }

      if (ticketInput.endsOn < ticketInput.startsOn) {
        throw new HttpException(
          TICKET_ERRORS.ENDTIME_LESS_THAN_STARTTIME,
          HttpStatus.NOT_FOUND,
        );
      }
      const newUpdatedInput = prepareSubdocumentUpdate(
        { ...ticketInput },
        'tickets',
      );
      console.log(newUpdatedInput);
      const updatedTicket = await this.EventModel.findOneAndUpdate(
        {
          _id: eventId,
          // tickets: [{ _id: ticketId }],
        },
        {
          $set: { ...newUpdatedInput },
        },
      );

      return updatedTicket;
    } catch (error) {
      throw makeError(error);
    }
  }
}
