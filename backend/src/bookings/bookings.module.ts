import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { RenterBookingsController } from './renter-bookings.controller';
import { HostBookingsController } from './host-bookings.controller';
import { BookingsController } from './bookings.controller';

@Module({
  providers: [BookingsService],
  controllers: [RenterBookingsController, HostBookingsController, BookingsController],
  exports: [BookingsService],
})
export class BookingsModule {}
