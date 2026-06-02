import { PrismaService } from '../prisma/prisma.service';
export declare class AuditLogService {
    private prisma;
    constructor(prisma: PrismaService);
    logAction(params: {
        actorId?: string;
        action: string;
        entityType: string;
        entityId: string;
        beforeJson?: any;
        afterJson?: any;
        ipAddress?: string;
        userAgent?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        entityId: string;
        entityType: string;
        action: string;
        beforeJson: import("@prisma/client/runtime/client").JsonValue | null;
        afterJson: import("@prisma/client/runtime/client").JsonValue | null;
        ipAddress: string | null;
        userAgent: string | null;
        actorId: string | null;
    }>;
}
