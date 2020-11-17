import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '@/user/user.module';

import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EVENT_SCHEMA, TICKET_SCHEMA } from './event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EVENT_SCHEMA }]),
    MongooseModule.forFeature([{ name: 'Ticket', schema: TICKET_SCHEMA }]),
    UserModule,
  ],
  providers: [EventService, EventResolver],
  exports: [EventService],
})
export class EventModule {}
