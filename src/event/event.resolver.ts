import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators';

import { EventDTO } from './dto/event.dto';
import { TicketDTO } from './dto/ticket.dto';
import { EventService } from './event.service';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';
import { CreateTicketInput } from './inputs/create-ticket.input';
import { UpdateTicketInput } from './inputs/update-ticket.input';

@Resolver(() => EventDTO)
export class EventResolver {
  constructor(private readonly _eventService: EventService) {}

  @UseGuards(AuthGuard)
  @Query(() => [EventDTO])
  async events() {
    const events = await this._eventService.findAll();

    return events;
  }

  @UseGuards(AuthGuard)
  @Query(() => EventDTO)
  async getEventById(@Args('id') id: string) {
    const event = await this._eventService.findOne(id);

    return event;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EventDTO)
  async createEvent(
    @Args('input') input: CreateEventInput,
    @User() user: User,
  ) {
    const event = await this._eventService.createEvent(user._id, input);

    return event;
  }

  @Mutation(() => EventDTO)
  async updateEvent(
    @Args('id') id: string,
    @Args('input') input: UpdateEventInput,
  ) {
    const updatedEvent = await this._eventService.updateEvent(id, input);

    return updatedEvent;
  }

  @Mutation(() => EventDTO)
  async deleteEvent(@Args('id') id: string) {
    const deletedEvent = await this._eventService.deleteEvent(id);

    return deletedEvent;
  }

  @Mutation(() => TicketDTO)
  async createTicketForEvent(
    @Args('eventId') eventId: string,
    @Args('ticketInput') ticketInput: CreateTicketInput,
  ) {
    const eventTicket = await this._eventService.createTicketForEvent(
      eventId,
      ticketInput,
    );

    return eventTicket;
  }

  @Mutation(() => TicketDTO)
  async updateTicketForEvent(
    @Args('eventId') eventId: string,
    @Args('ticketId') ticketId: string,
    @Args('ticketInput') ticketInput: UpdateTicketInput,
  ) {
    const eventTicket = await this._eventService.updateTicketForEvent(
      eventId,
      ticketId,
      ticketInput,
    );

    return eventTicket;
  }
}
