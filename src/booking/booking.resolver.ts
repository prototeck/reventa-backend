import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards';
import { User } from '../decorators';

import { BookingService } from './booking.service';
import { BookingDto } from './dto/booking.dto';

@Resolver(() => BookingDto)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Query(() => [BookingDto])
  async bookings() {
    const bookings = await this.bookingService.findAll();

    return bookings;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => BookingDto)
  async createBooking(
    @Args('eventId') eventId: string,
    @Args('ticketId') ticketId: string,
    @User() user: User,
  ) {
    const booking = await this.bookingService.createBooking(
      eventId,
      ticketId,
      user,
    );

    return booking;
  }

}
