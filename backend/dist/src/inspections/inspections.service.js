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
exports.InspectionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let InspectionsService = class InspectionsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createInspection(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: {
                renter: { select: { id: true } },
                hostProfile: { select: { userId: true } },
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const isRenter = booking.renterId === userId;
        const isHost = booking.hostProfile?.userId === userId;
        if (!isRenter && !isHost) {
            throw new common_1.ForbiddenException('You are not a participant in this booking');
        }
        if (dto.type === client_1.InspectionType.PRE && booking.status !== 'confirmed' && booking.status !== 'paid') {
            throw new common_1.BadRequestException(`PRE inspection can only be submitted for confirmed or paid bookings (current: ${booking.status})`);
        }
        if (dto.type === client_1.InspectionType.POST && booking.status !== 'active') {
            throw new common_1.BadRequestException(`POST inspection can only be submitted for active bookings (current: ${booking.status})`);
        }
        if (dto.photoUrls.length < 4) {
            throw new common_1.BadRequestException('At least 4 inspection photos are required');
        }
        const existing = await this.prisma.tripInspection.findUnique({
            where: { bookingId_type: { bookingId: dto.bookingId, type: dto.type } },
        });
        if (existing) {
            throw new common_1.BadRequestException(`A ${dto.type} inspection has already been submitted for this booking`);
        }
        const inspection = await this.prisma.tripInspection.create({
            data: {
                bookingId: dto.bookingId,
                type: dto.type,
                photoUrls: dto.photoUrls,
            },
        });
        return inspection;
    }
    async getInspectionsForBooking(userId, bookingId) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: bookingId },
            include: { hostProfile: { select: { userId: true } } },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const isRenter = booking.renterId === userId;
        const isHost = booking.hostProfile?.userId === userId;
        if (!isRenter && !isHost) {
            throw new common_1.ForbiddenException('You are not a participant in this booking');
        }
        return this.prisma.tripInspection.findMany({
            where: { bookingId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async getAllInspections(bookingId) {
        return this.prisma.tripInspection.findMany({
            where: bookingId ? { bookingId } : undefined,
            include: {
                booking: { select: { bookingNumber: true, status: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.InspectionsService = InspectionsService;
exports.InspectionsService = InspectionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InspectionsService);
//# sourceMappingURL=inspections.service.js.map