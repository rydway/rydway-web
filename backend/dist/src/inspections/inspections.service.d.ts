import { PrismaService } from '../prisma/prisma.service';
import { CreateInspectionDto } from './dto/inspections.dto';
export declare class InspectionsService {
    private prisma;
    constructor(prisma: PrismaService);
    createInspection(userId: string, dto: CreateInspectionDto): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.InspectionType;
        bookingId: string;
        photoUrls: string[];
    }>;
    getInspectionsForBooking(userId: string, bookingId: string): Promise<{
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.InspectionType;
        bookingId: string;
        photoUrls: string[];
    }[]>;
    getAllInspections(bookingId?: string): Promise<({
        booking: {
            status: import("@prisma/client").$Enums.BookingStatus;
            bookingNumber: string;
        };
    } & {
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.InspectionType;
        bookingId: string;
        photoUrls: string[];
    })[]>;
}
