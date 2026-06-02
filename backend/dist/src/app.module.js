"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const redis_module_1 = require("./redis/redis.module");
const health_module_1 = require("./health/health.module");
const shared_module_1 = require("./shared/shared.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const audit_log_module_1 = require("./audit-log/audit-log.module");
const kyc_module_1 = require("./kyc/kyc.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const search_module_1 = require("./search/search.module");
const bookings_module_1 = require("./bookings/bookings.module");
const payments_module_1 = require("./payments/payments.module");
const payouts_module_1 = require("./payouts/payouts.module");
const messaging_module_1 = require("./messaging/messaging.module");
const reviews_module_1 = require("./reviews/reviews.module");
const notifications_module_1 = require("./notifications/notifications.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const admin_module_1 = require("./admin/admin.module");
const uploads_module_1 = require("./uploads/uploads.module");
const settings_module_1 = require("./settings/settings.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
            }),
            prisma_module_1.PrismaModule,
            redis_module_1.RedisModule,
            health_module_1.HealthModule,
            shared_module_1.SharedModule,
            audit_log_module_1.AuditLogModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            kyc_module_1.KycModule,
            vehicles_module_1.VehiclesModule,
            search_module_1.SearchModule,
            bookings_module_1.BookingsModule,
            payments_module_1.PaymentsModule,
            payouts_module_1.PayoutsModule,
            messaging_module_1.MessagingModule,
            reviews_module_1.ReviewsModule,
            notifications_module_1.NotificationsModule,
            dashboard_module_1.DashboardModule,
            admin_module_1.AdminModule,
            uploads_module_1.UploadsModule,
            settings_module_1.SettingsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map