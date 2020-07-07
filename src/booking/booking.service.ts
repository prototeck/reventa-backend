import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError } from '../utils';
import { User } from '../user/interfaces/user.interface';
import { EventService } from '../event/event.service';
import { Mutable } from '../types';

import { BookingInput } from './inputs/booking.input';
import { Booking, IBooking } from './interfaces/booking.interface';
import { BOOKING_STATUSES } from './booking.schema';

const TICKET_ERRORS = {
  TICKETS_UNAVAILABLE: 'Tickets unavailable for this event',
  TICKET_NOT_FOUND: 'Ticket does not exists',
} as const;

const EVENT_ERRORS = {
  EVENT_NOT_FOUND: 'Event does not exists',
} as const;

const BOOKING_ERRORS = {
  BOOKING_NOT_FOUND: 'Booking does not exists',
} as const;

@Injectable()
export class BookingService {
  constructor(
    @InjectModel('Booking') private BookingModel: Model<Booking>,
    private readonly eventService: EventService,
  ) {}

  /**
   *create a booking in the database from the provided input
   * @param eventId
   * @param ticketId
   * @param user
   * @returns -booking created
   *
   * @public
   */
  async createBooking(
    eventId: string,
    ticketId: string,
    user: User,
  ): Promise<Booking> {
    try {
      const event = await this.eventService.findOne(eventId);

      if (!event) {
        throw new HttpException(
          EVENT_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      const ticketFound = event.tickets?.find(
        // eslint-disable-next-line no-underscore-dangle
        ticket => `${ticket._id}` === ticketId,
      );
      if (!ticketFound) {
        throw new HttpException(
          TICKET_ERRORS.TICKET_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      if (ticketFound.quantity === 0) {
        throw new HttpException(
          TICKET_ERRORS.TICKETS_UNAVAILABLE,
          HttpStatus.NOT_FOUND,
        );
      }

      const booking = await new this.BookingModel({
        eventId,
        ticketId,
        // eslint-disable-next-line no-underscore-dangle
        userId: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        eventTitle: event.title,
        location: event.location,
        address: event.address,
        ticketName: ticketFound.name,
        startsOn: ticketFound.startsOn,
        endsOn: ticketFound.endsOn,
        status: BOOKING_STATUSES.CONFIRMED,
      }).save();

      await this.eventService.updateTicket(booking.eventId, booking.ticketId);

      return booking;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * get all bookings from database
   * @returns - all bookings
   */
  async findBookingById(
    eventId: string,
    ticketId?: string,
  ): Promise<IBooking[]> {
    try {
      const event = await this.eventService.findOne(eventId);

      if (!event) {
        throw new HttpException(
          EVENT_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      const id: Partial<Mutable<IBooking>> = {
        eventId,
      };

      if (ticketId) {
        id.ticketId = ticketId;
      }
      const bookings = await this.BookingModel.find(id);

      return bookings;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * Cancel booking in the database by changing status
   * @param bookingId
   * @param cancellationReason
   * @returns cancelled booking with cancelled value for status
   */

  async cancelBookingById(
    bookingId: string,
    cancellationReason: string,
  ): Promise<IBooking> {
    try {
      const existingBooking = await this.BookingModel.findOne({
        _id: bookingId,
      }).lean();
      if (
        !existingBooking ||
        (existingBooking &&
          existingBooking.status === BOOKING_STATUSES.CANCELLED)
      ) {
        throw new HttpException(
          BOOKING_ERRORS.BOOKING_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }

      const bookingToBeCancelled = {
        ...existingBooking,
        status: BOOKING_STATUSES.CANCELLED,
        cancellationReason,
      };

      const cancelledBooking = await this.BookingModel.findOneAndUpdate(
        {
          _id: bookingId,
        },
        {
          $set: { ...bookingToBeCancelled },
        },
        {
          new: true,
        },
      );

      return cancelledBooking;
    } catch (error) {
      throw makeError(error);
    }
  }

  async cancelBookings(
    eventId: string,
    ticketId: string,
    input: BookingInput,
  ): Promise<[IBooking]> {
    try {
      const existingEvent = await this.eventService.findOne(eventId);
      if (!existingEvent) {
        throw new HttpException(
          EVENT_ERRORS.EVENT_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }

      const ticketFound = existingEvent.tickets?.find(
        // eslint-disable-next-line no-underscore-dangle
        ticket => `${ticket._id}` === ticketId,
      );

      if (!ticketFound) {
        throw new HttpException(
          TICKET_ERRORS.TICKET_NOT_FOUND,
          HttpStatus.BAD_REQUEST,
        );
      }

      const id: Partial<Mutable<IBooking>> = {
        eventId,
      };

      if (ticketId) {
        id.ticketId = ticketId;
      }
      const cancelBookings = await this.BookingModel.updateMany(id, {
        $set: {
          status: BOOKING_STATUSES.CANCELLED,
          cancellationReason: input.cancellationReason,
        },
      });

      const modifiedBookings = await this.BookingModel.find(id);

      return cancelBookings;
    } catch (error) {
      throw makeError(error);
    }
  }
}
