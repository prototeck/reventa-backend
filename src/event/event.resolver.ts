import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';

import { EventDTO } from './dto/event.dto';
import { EventService } from './event.service';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';

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
}
