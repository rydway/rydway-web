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
exports.DisputesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const audit_log_service_1 = require("../audit-log/audit-log.service");
let DisputesService = class DisputesService {
    prisma;
    auditLogService;
    constructor(prisma, auditLogService) {
        this.prisma = prisma;
        this.auditLogService = auditLogService;
    }
    async raiseDispute(userId, dto) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: dto.bookingId },
            include: {
                hostProfile: { select: { userId: true } },
                dispute: true,
                inspections: true,
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Booking not found');
        const isRenter = booking.renterId === userId;
        const isHost = booking.hostProfile?.userId === userId;
        if (!isRenter && !isHost) {
            throw new common_1.ForbiddenException('You are not a participant in this booking');
        }
        if (booking.dispute) {
            throw new common_1.BadRequestException('A dispute has already been raised for this booking');
        }
        if (!['active', 'completed', 'paid'].includes(booking.status)) {
            throw new common_1.BadRequestException(`Disputes can only be raised on active or completed bookings (current: ${booking.status})`);
        }
        const dispute = await this.prisma.dispute.create({
            data: {
                bookingId: dto.bookingId,
                raisedBy: userId,
                reason: dto.reason,
                status: 'OPEN',
            },
        });
        await this.auditLogService.logAction({
            actorId: userId,
            action: 'DISPUTE_RAISED',
            entityType: 'Dispute',
            entityId: dispute.id,
        });
        return dispute;
    }
    async resolveDispute(adminId, disputeId, dto) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id: disputeId },
        });
        if (!dispute)
            throw new common_1.NotFoundException('Dispute not found');
        if (dispute.status !== 'OPEN') {
            throw new common_1.BadRequestException(`Dispute is already ${dispute.status}`);
        }
        const updated = await this.prisma.dispute.update({
            where: { id: disputeId },
            data: {
                status: dto.outcome,
                resolution: dto.resolution,
                resolvedAt: new Date(),
            },
        });
        await this.auditLogService.logAction({
            actorId: adminId,
            action: `DISPUTE_${dto.outcome}`,
            entityType: 'Dispute',
            entityId: disputeId,
        });
        return updated;
    }
    async getAllDisputes(status) {
        return this.prisma.dispute.findMany({
            where: status ? { status } : undefined,
            include: {
                booking: {
                    include: {
                        renter: { select: { firstName: true, lastName: true, email: true } },
                        hostProfile: {
                            include: {
                                user: { select: { firstName: true, lastName: true, email: true } },
                            },
                        },
                        inspections: true,
                        vehicle: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getMyDisputes(userId) {
        return this.prisma.dispute.findMany({
            where: { raisedBy: userId },
            include: {
                booking: {
                    select: {
                        bookingNumber: true,
                        status: true,
                        vehicle: { select: { name: true } },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getDisputeById(id) {
        const dispute = await this.prisma.dispute.findUnique({
            where: { id },
            include: {
                booking: {
                    include: {
                        renter: { select: { firstName: true, lastName: true, email: true } },
                        hostProfile: {
                            include: {
                                user: { select: { firstName: true, lastName: true } },
                            },
                        },
                        inspections: true,
                        vehicle: { select: { name: true, images: { take: 1 } } },
                    },
                },
            },
        });
        if (!dispute)
            throw new common_1.NotFoundException('Dispute not found');
        return dispute;
    }
};
exports.DisputesService = DisputesService;
exports.DisputesService = DisputesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_log_service_1.AuditLogService])
], DisputesService);
//# sourceMappingURL=disputes.service.js.map