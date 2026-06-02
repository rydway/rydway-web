import { PrismaService } from '../prisma/prisma.service';
import { SubmitRenterKycDto, SubmitHostKycDto, ReviewKycDto } from './dto/kyc.dto';
import { Prisma } from '@prisma/client';
import { AuditLogService } from '../audit-log/audit-log.service';
export declare class KycService {
    private prisma;
    private auditLogService;
    constructor(prisma: PrismaService, auditLogService: AuditLogService);
    submitRenterKyc(userId: string, dto: SubmitRenterKycDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        type: import("@prisma/client").$Enums.KycType;
        submittedDataJson: Prisma.JsonValue | null;
        reviewedBy: string | null;
        reviewNotes: string | null;
        reviewedAt: Date | null;
    }>;
    submitHostKyc(userId: string, dto: SubmitHostKycDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        type: import("@prisma/client").$Enums.KycType;
        submittedDataJson: Prisma.JsonValue | null;
        reviewedBy: string | null;
        reviewNotes: string | null;
        reviewedAt: Date | null;
    }>;
    getMyKyc(userId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        type: import("@prisma/client").$Enums.KycType;
        submittedDataJson: Prisma.JsonValue | null;
        reviewedBy: string | null;
        reviewNotes: string | null;
        reviewedAt: Date | null;
    }[]>;
    getKycById(id: string): Promise<{
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        type: import("@prisma/client").$Enums.KycType;
        submittedDataJson: Prisma.JsonValue | null;
        reviewedBy: string | null;
        reviewNotes: string | null;
        reviewedAt: Date | null;
    }>;
    approveKyc(id: string, adminId: string, dto: ReviewKycDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        type: import("@prisma/client").$Enums.KycType;
        submittedDataJson: Prisma.JsonValue | null;
        reviewedBy: string | null;
        reviewNotes: string | null;
        reviewedAt: Date | null;
    }>;
    rejectKyc(id: string, adminId: string, dto: ReviewKycDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        status: import("@prisma/client").$Enums.KycStatus;
        type: import("@prisma/client").$Enums.KycType;
        submittedDataJson: Prisma.JsonValue | null;
        reviewedBy: string | null;
        reviewNotes: string | null;
        reviewedAt: Date | null;
    }>;
}
