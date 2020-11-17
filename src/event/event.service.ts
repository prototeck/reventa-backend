import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError, prepareSubdocumentUpdate } from '@/utils';
import {
  Mutable,
  IEvent,
  IEventLean,
  ITicket,
  ITicketLean,
} from '@typings/index';
import {
  EVENT_ERRORS,
  TICKET_ERRORS,
  FIELD_REQUIRED,
  FIELD_NOT_ALLOWED,
} from '@errors/index';

import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';
import { CreateTicketInput } from './inputs/create-ticket.input';
import { UpdateTicketInput } from './inputs/update-ticket.input';
import {
  validateCreateEventInput,
  validateUpdateEventInput,
} from './event.validations';

@Injectable()
export class EventService {
  constructor(
    @InjectModel('Event') private _eventModel: Model<IEvent>,
    @InjectModel('Ticket') private _ticketModel: Model<ITicket>,
  ) {}

  /**
   *
   */
  async findAll(): Promise<IEventLean[]> {
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
      const events = await this._eventModel.find({}).lean();

      return events;
    } catch (error) {
      throw makeError(error);
    }
  }

  async findOne(id: string): Promise<IEventLean> {
    try {
      const event = await this._eventModel
        .findOne({
          _id: id,
        })
        .lean();

      if (!event) {
        throw new HttpException(EVENT_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

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
      validateCreateEventInput(input);

      const event = await new this._eventModel({
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
  ): Promise<IEventLean> {
    try {
      validateUpdateEventInput(updateInput);

      const existingEvent = await this._eventModel.findOne({ _id: id }).lean();

      if (!existingEvent) {
        throw new HttpException(EVENT_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const { location, ...updateWithoutLocation } = updateInput;

      const updateDocument: Partial<Mutable<IEventLean>> = {
        ...updateWithoutLocation,
      };

      if (location) {
        updateDocument.location = {
          type: 'Point',
          coordinates: [location.longitude, location.latitude],
        };
      }

      const updatedEvent = await this._eventModel
        .findOneAndUpdate(
          {
            _id: id,
          },
          {
            $set: { ...updateDocument, updatedOn: Date.now() },
          },
          {
            new: true,
          },
        )
        .lean();

      return updatedEvent!;
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
  async deleteEvent(id: string): Promise<IEventLean> {
    try {
      const existingEvent = await this._eventModel.findOne({ _id: id }).lean();

      if (!existingEvent) {
        throw new HttpException(EVENT_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const deletedEvent = await this._eventModel
        .findOneAndDelete({
          _id: id,
        })
        .lean();

      return deletedEvent!;
    } catch (error) {
      throw makeError(error);
    }
  }

  async createTicketForEvent(
    eventId: string,
    ticketInput: CreateTicketInput,
  ): Promise<ITicket> {
    try {
      const event = await this._eventModel.findOne({ _id: eventId });

      if (!event) {
        throw new HttpException(EVENT_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const ticket = new this._ticketModel({ ...ticketInput });

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
      const eventWithTicket = await this._eventModel
        .findOne({
          _id: eventId,
          'tickets._id': ticketId,
        })
        .lean();

      if (!eventWithTicket) {
        throw new HttpException(TICKET_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const ticketFound = eventWithTicket.tickets.find(
        ticket => `${ticket._id}` === ticketId,
      )!;

      if (ticketFound.type === 'free') {
        if (ticketInput.currency) {
          throw new HttpException(
            FIELD_NOT_ALLOWED('Currency'),
            HttpStatus.BAD_REQUEST,
          );
        }

        if (ticketInput.price) {
          throw new HttpException(
            FIELD_NOT_ALLOWED('Price'),
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      if (ticketInput.startsOn && !ticketInput.endsOn) {
        throw new HttpException(
          FIELD_REQUIRED('End Time'),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (ticketInput.endsOn && !ticketInput.startsOn) {
        throw new HttpException(
          FIELD_REQUIRED('Start Time'),
          HttpStatus.BAD_REQUEST,
        );
      }

      if (ticketInput.startsOn && ticketInput.endsOn) {
        if (ticketInput.endsOn < ticketInput.startsOn) {
          throw new HttpException(
            TICKET_ERRORS.ENDTIME_LESS_THAN_STARTTIME,
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      const subDocumentUpdate = prepareSubdocumentUpdate(
        { ...ticketInput },
        'tickets',
      );

      await this._eventModel.updateOne(
        {
          _id: eventId,
          'tickets._id': ticketId,
        },
        {
          $set: { ...subDocumentUpdate },
        },
      );

      return { ...ticketFound, ...ticketInput } as ITicketLean;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * increase or decrease value of sold and quantity respectively on being called
   * @param eventId
   * @param ticketId
   * @returns updatedTicket
   */

  async updateTicketSold(eventId: string, ticketId: string): Promise<ITicket> {
    try {
      const eventWithTicket = await this._eventModel.findOne({
        _id: eventId,
        'tickets._id': ticketId,
      });

      if (!eventWithTicket) {
        throw new HttpException(TICKET_ERRORS.NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const updatedTicket = await this._eventModel.updateOne(
        {
          _id: eventId,
          'tickets._id': ticketId,
        },
        {
          $inc: { 'tickets.$.sold': 1, 'tickets.$.quantity': -1 },
        },
      );

      return updatedTicket;
    } catch (error) {
      throw makeError(error);
    }
  }
}
