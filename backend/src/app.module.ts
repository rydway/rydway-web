import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { HealthModule } from './health/health.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { KycModule } from './kyc/kyc.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { SearchModule } from './search/search.module';
import { BookingsModule } from './bookings/bookings.module';
import { PaymentsModule } from './payments/payments.module';
import { PayoutsModule } from './payouts/payouts.module';
import { MessagingModule } from './messaging/messaging.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AdminModule } from './admin/admin.module';
import { UploadsModule } from './uploads/uploads.module';
import { SettingsModule } from './settings/settings.module';
import { InspectionsModule } from './inspections/inspections.module';
import { DisputesModule } from './disputes/disputes.module';

import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    PrismaModule,
    RedisModule,
    HealthModule,
    SharedModule,
    AuditLogModule,
    UsersModule,
    AuthModule,
    KycModule,
    VehiclesModule,
    SearchModule,
    BookingsModule,
    PaymentsModule,
    PayoutsModule,
    MessagingModule,
    ReviewsModule,
    NotificationsModule,
    DashboardModule,
    AdminModule,
    UploadsModule,
    SettingsModule,
    InspectionsModule,
    DisputesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
