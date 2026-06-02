import { Module } from '@nestjs/common';
import { PayoutsService } from './payouts.service';
import { HostEarningsController } from './host-earnings.controller';
import { AdminPayoutsController } from './admin-payouts.controller';
import { PayoutsController } from './payouts.controller';

@Module({
  providers: [PayoutsService],
  controllers: [HostEarningsController, AdminPayoutsController, PayoutsController],
  exports: [PayoutsService],
})
export class PayoutsModule {}
