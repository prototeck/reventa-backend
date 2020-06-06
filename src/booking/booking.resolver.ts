import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards';
import { User } from '../decorators';

import { BookingInput } from './inputs/booking.input';
import { BookingService } from './booking.service';
import { BookingDto } from './dto/booking.dto';

@Resolver(() => BookingDto)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(AuthGuard)
  @Query(() => [BookingDto])
  async getBookingByEvent(
    @Args('eventId') eventId: string,
    @Args('ticketId', { nullable: true }) ticketId?: string,
  ) {
    const bookings = await this.bookingService.findBookingById(
      eventId,
      ticketId,
    );

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

  @UseGuards(AuthGuard)
  @Mutation(() => BookingDto)
  async cancelBookingById(
    @Args('bookingId') bookingId: string,
    @Args('cancellationReason') cancellationReason: string,
  ) {
    const cancelledBooking = await this.bookingService.cancelBookingById(
      bookingId,
      cancellationReason,
    );

    return cancelledBooking;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Int)
  async cancelBookings(
    @Args('eventId') eventId: string,
    @Args('input') input: BookingInput,
    @Args('ticketId', { nullable: true }) ticketId?: string,
  ) {
    const cancelledBookings = await this.bookingService.cancelBookings(
      eventId,
      ticketId,
      input,
    );
console.log("cancelledBookings",cancelledBookings)
    return cancelledBookings;
  }

  // @UseGuards(AuthGuard)
  // @Mutation(() => [BookingDto])
  // async cancelBooking(
  //   @Args('eventId') eventId: string,
  //   @Args('ticketId', { nullable: true }) ticketId?: string,
  // ) {
  //   const booking = await this.bookingService.cancelBooking(eventId, ticketId);

  //   return booking;
  // }
}
