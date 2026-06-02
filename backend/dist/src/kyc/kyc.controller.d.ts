import { KycService } from './kyc.service';
import { SubmitRenterKycDto, SubmitHostKycDto, ReviewKycDto } from './dto/kyc.dto';
export declare class KycController {
    private readonly kycService;
    constructor(kycService: KycService);
    submitRenterKyc(user: any, dto: SubmitRenterKycDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.KycStatus;
            type: import("@prisma/client").$Enums.KycType;
            submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
            reviewedBy: string | null;
            reviewNotes: string | null;
            reviewedAt: Date | null;
        };
    }>;
    submitHostKyc(user: any, dto: SubmitHostKycDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.KycStatus;
            type: import("@prisma/client").$Enums.KycType;
            submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
            reviewedBy: string | null;
            reviewNotes: string | null;
            reviewedAt: Date | null;
        };
    }>;
    getMyKyc(user: any): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.KycStatus;
            type: import("@prisma/client").$Enums.KycType;
            submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
            reviewedBy: string | null;
            reviewNotes: string | null;
            reviewedAt: Date | null;
        }[];
    }>;
    getKycById(id: string): Promise<{
        message: string;
        data: {
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
            submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
            reviewedBy: string | null;
            reviewNotes: string | null;
            reviewedAt: Date | null;
        };
    }>;
    approveKyc(id: string, admin: any, dto: ReviewKycDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.KycStatus;
            type: import("@prisma/client").$Enums.KycType;
            submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
            reviewedBy: string | null;
            reviewNotes: string | null;
            reviewedAt: Date | null;
        };
    }>;
    rejectKyc(id: string, admin: any, dto: ReviewKycDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            status: import("@prisma/client").$Enums.KycStatus;
            type: import("@prisma/client").$Enums.KycType;
            submittedDataJson: import("@prisma/client/runtime/client").JsonValue | null;
            reviewedBy: string | null;
            reviewNotes: string | null;
            reviewedAt: Date | null;
        };
    }>;
}
