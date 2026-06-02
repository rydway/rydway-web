"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingOwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
let BookingOwnershipGuard = class BookingOwnershipGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        const bookingId = request.params.id || request.params.bookingId;
        if (!user)
            throw new common_1.ForbiddenException('Authentication required');
        if (!bookingId)
            return true;
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { vehicle: { select: { hostId: true } } },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const isRenter = booking.renterId === user.id;
        let isHost = false;
        if (user.role === 'host') {
            const hostProfile = await this.prisma.hostProfile.findUnique({ where: { userId: user.id } });
            isHost = hostProfile?.id === booking.vehicle.hostId;
        }
        const isAdmin = user.role === 'admin';
        if (!isRenter && !isHost && !isAdmin) {
            throw new common_1.ForbiddenException({
                message: 'You do not have access to this booking',
                error: { code: 'FORBIDDEN' },
            });
        }
        request.booking = booking;
        return true;
    }
};
exports.BookingOwnershipGuard = BookingOwnershipGuard;
exports.BookingOwnershipGuard = BookingOwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingOwnershipGuard);
//# sourceMappingURL=booking-ownership.guard.js.map