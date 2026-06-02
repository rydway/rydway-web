import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import pino from 'pino';

@Injectable()
export class AuditLogService {
  constructor(private prisma: PrismaService) {}

  private readonly logger = pino({
    name: 'AuditLog',
    level: process.env.LOG_LEVEL || 'info',
  });

  async logAction(params: {
    actorId?: string;
    action: string;
    entityType: string;
    entityId: string;
    beforeJson?: any;
    afterJson?: any;
    ipAddress?: string;
    userAgent?: string;
  }) {
    // Log asynchronously to stdout instead of blocking DB insert
    this.logger.info(params, `Audit: ${params.action} on ${params.entityType}:${params.entityId}`);
  }
}
