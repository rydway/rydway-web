import { InspectionsService } from './inspections.service';
import { CreateInspectionDto } from './dto/inspections.dto';
export declare class InspectionsController {
    private readonly inspectionsService;
    constructor(inspectionsService: InspectionsService);
    createInspection(user: any, dto: CreateInspectionDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.InspectionType;
            bookingId: string;
            photoUrls: string[];
        };
    }>;
    getInspectionsForBooking(user: any, bookingId: string): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            type: import("@prisma/client").$Enums.InspectionType;
            bookingId: string;
            photoUrls: string[];
        }[];
    }>;
    getAllInspections(bookingId?: string): Promise<{
        message: string;
        data: ({
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
        })[];
    }>;
}
