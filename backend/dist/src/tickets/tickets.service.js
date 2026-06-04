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
exports.TicketsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TicketsService = class TicketsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createTicket(userId, data) {
        return this.prisma.supportTicket.create({
            data: {
                userId,
                subject: data.subject,
                category: data.category,
                messages: {
                    create: {
                        senderId: userId,
                        body: data.message,
                    }
                }
            },
            include: {
                messages: true
            }
        });
    }
    async getTickets(userId) {
        return this.prisma.supportTicket.findMany({
            where: { userId },
            include: {
                messages: true
            },
            orderBy: { updatedAt: 'desc' }
        });
    }
    async getTicket(id) {
        const ticket = await this.prisma.supportTicket.findUnique({
            where: { id },
            include: {
                messages: {
                    include: { sender: true },
                    orderBy: { createdAt: 'asc' }
                },
                user: true
            }
        });
        if (!ticket)
            throw new common_1.NotFoundException('Ticket not found');
        return ticket;
    }
    async reply(ticketId, senderId, body) {
        await this.prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status: 'in_progress' }
        });
        return this.prisma.supportMessage.create({
            data: {
                ticketId,
                senderId,
                body
            }
        });
    }
};
exports.TicketsService = TicketsService;
exports.TicketsService = TicketsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TicketsService);
//# sourceMappingURL=tickets.service.js.map