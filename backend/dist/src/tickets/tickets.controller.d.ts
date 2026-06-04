import { TicketsService } from './tickets.service';
import { TicketCategory } from '@prisma/client';
export declare class TicketsController {
    private readonly ticketsService;
    constructor(ticketsService: TicketsService);
    create(req: any, data: {
        subject: string;
        category: TicketCategory;
        message: string;
    }): Promise<{
        messages: {
            id: string;
            createdAt: Date;
            body: string;
            attachmentUrl: string | null;
            senderId: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.TicketCategory;
        status: import("@prisma/client").$Enums.TicketStatus;
        subject: string;
    }>;
    findAll(req: any): Promise<({
        messages: {
            id: string;
            createdAt: Date;
            body: string;
            attachmentUrl: string | null;
            senderId: string;
            ticketId: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.TicketCategory;
        status: import("@prisma/client").$Enums.TicketStatus;
        subject: string;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            email: string;
            phone: string | null;
            passwordHash: string;
            firstName: string;
            lastName: string;
            role: import("@prisma/client").$Enums.Role;
            profileImageUrl: string | null;
            isActive: boolean;
            isSuspended: boolean;
            suspensionReason: string | null;
            kycStatus: import("@prisma/client").$Enums.KycStatus;
            emailVerifiedAt: Date | null;
            phoneVerifiedAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
        messages: ({
            sender: {
                id: string;
                email: string;
                phone: string | null;
                passwordHash: string;
                firstName: string;
                lastName: string;
                role: import("@prisma/client").$Enums.Role;
                profileImageUrl: string | null;
                isActive: boolean;
                isSuspended: boolean;
                suspensionReason: string | null;
                kycStatus: import("@prisma/client").$Enums.KycStatus;
                emailVerifiedAt: Date | null;
                phoneVerifiedAt: Date | null;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
            };
        } & {
            id: string;
            createdAt: Date;
            body: string;
            attachmentUrl: string | null;
            senderId: string;
            ticketId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        category: import("@prisma/client").$Enums.TicketCategory;
        status: import("@prisma/client").$Enums.TicketStatus;
        subject: string;
    }>;
    reply(req: any, id: string, data: {
        body: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        body: string;
        attachmentUrl: string | null;
        senderId: string;
        ticketId: string;
    }>;
}
