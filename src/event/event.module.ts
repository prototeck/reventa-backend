import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';

import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EventSchema, TicketSchema } from './event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    MongooseModule.forFeature([{ name: 'Ticket', schema: TicketSchema }]),
    UserModule,
  ],
  providers: [EventService, EventResolver],
  exports: [EventService],
})
export class EventModule {}
