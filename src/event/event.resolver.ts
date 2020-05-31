import { Resolver, Args, Mutation, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';

import { EventDTO } from './dto/event.dto';
import { EventService } from './event.service';
import { CreateEventInput } from './inputs/create-event.input';
import { UpdateEventInput } from './inputs/update-event.input';

@Resolver(() => EventDTO)
export class EventResolver {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(AuthGuard)
  @Query(() => [EventDTO])
  async events() {
    const events = await this.eventService.findAll();

    return events;
  }

  @UseGuards(AuthGuard)
  @Mutation(() => EventDTO)
  async createEvent(
    @Args('input') input: CreateEventInput,
    @User() user: User,
  ) {
    // eslint-disable-next-line no-underscore-dangle
    const event = await this.eventService.createEvent(user._id, input);

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
}
