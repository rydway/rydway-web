import { InspectionType } from '@prisma/client';
export declare class CreateInspectionDto {
    bookingId: string;
    type: InspectionType;
    photoUrls: string[];
}
