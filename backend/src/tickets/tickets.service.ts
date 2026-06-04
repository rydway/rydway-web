import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TicketCategory, TicketStatus } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async createTicket(userId: string, data: { subject: string; category: TicketCategory; message: string }) {
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

  async getTickets(userId: string) {
    return this.prisma.supportTicket.findMany({
      where: { userId },
      include: {
        messages: true
      },
      orderBy: { updatedAt: 'desc' }
    });
  }

  async getTicket(id: string) {
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
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async reply(ticketId: string, senderId: string, body: string) {
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
}
