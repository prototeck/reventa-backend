import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { makeError } from '../utils';
import { User } from '../user/interfaces/user.interface';
import { EventService } from '../event/event.service';

import { Booking, IBooking } from './interfaces/booking.interface';

const ERRORS = {
  EVENT_NOT_FOUND: 'Event does not exists',
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
      const event = await this.eventService.findOne(eventId, ticketId);

      if (!event) {
        throw new HttpException(ERRORS.EVENT_NOT_FOUND, HttpStatus.NOT_FOUND);
      }

      const ticketFound = event.tickets.find(
        // eslint-disable-next-line no-underscore-dangle
        ticket => `${ticket._id}` === ticketId,
      );
      const booking = await new this.BookingModel({
        eventId,
        ticketId,
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
      }).save();

      return booking;
    } catch (error) {
      throw makeError(error);
    }
  }

  /**
   * get all bookings from database
   * @returns - all bookings
   */
  async findAll(): Promise<IBooking[]> {
    try {
      const bookings = await this.BookingModel.find({}).lean();

      return bookings;
    } catch (error) {
      throw makeError(error);
    }
  }

  

  
}
