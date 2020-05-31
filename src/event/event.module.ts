import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UserModule } from '../user/user.module';

import { EventService } from './event.service';
import { EventResolver } from './event.resolver';
import { EventSchema } from './event.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Event', schema: EventSchema }]),
    UserModule,
  ],
  providers: [EventService, EventResolver],
})
export class EventModule {}
