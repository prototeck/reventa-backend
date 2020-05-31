import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { EventDTO } from './dto/event.dto';
import { TicketDTO } from './dto/ticket.dto';
import { EventService } from './event.service';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';
import { CreateTicketInput } from './inputs/create-ticket.input';

@Resolver(() => EventDTO)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @Query(() => [EventDTO])
  async events() {
    const events = await this.eventService.findAll();

    return events;
  }

  @Mutation(() => EventDTO)
  async createEvent(@Args('input') input: CreateEventInput) {
    const event = await this.eventService.createEvent(input);

    return event;
  }

  @Mutation(() => EventDTO)
  async updateEvent(
    @Args('id') id: string,
    @Args('input') input: UpdateEventInput,
  ) {
    const updatedEvent = await this.eventService.updateEvent(id, input);

    return updatedEvent;
  }

  @Mutation(() => EventDTO)
  async deleteEvent(@Args('id') id: string) {
    const deletedEvent = await this.eventService.deleteEvent(id);

    return deletedEvent;
  }

  @Mutation(() => TicketDTO)
  async createTicketForEvent(
    @Args('eventId') eventId: string,
    @Args('ticketInput') ticketInput: CreateTicketInput,
  ) {
    const eventTicket = await this.eventService.createTicketForEvent(
      eventId,
      ticketInput,
    );

    return eventTicket;
  }
}
