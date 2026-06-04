import { Controller, Get, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TicketCategory } from '@prisma/client';

@Controller('tickets')
@UseGuards(JwtAuthGuard)
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Req() req: any, @Body() data: { subject: string; category: TicketCategory; message: string }) {
    return this.ticketsService.createTicket(req.user.id, data);
  }

  @Get()
  findAll(@Req() req: any) {
    return this.ticketsService.getTickets(req.user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.getTicket(id);
  }

  @Post(':id/messages')
  reply(@Req() req: any, @Param('id') id: string, @Body() data: { body: string }) {
    return this.ticketsService.reply(id, req.user.id, data.body);
  }
}
