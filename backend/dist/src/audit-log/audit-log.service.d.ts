import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogService {
    private prisma;
    constructor(prisma: PrismaService);
    private readonly logger;
    logAction(params: {
        actorId?: string;
        action: string;
        entityType: string;
        entityId: string;
        beforeJson?: any;
        afterJson?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<void>;
}
