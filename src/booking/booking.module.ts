import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventModule } from '../event/event.module';
import { UserModule } from '../user/user.module';

import { BookingSchema } from './booking.schema';
import { BookingService } from './booking.service';
import { BookingResolver } from './booking.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Booking', schema: BookingSchema }]),
    EventModule,
    UserModule,
  ],
  providers: [BookingService, BookingResolver],
})
export class BookingModule {}
