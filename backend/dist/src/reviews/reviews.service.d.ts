import { PrismaService } from '../prisma/prisma.service';
import { AuditLogService } from '../audit-log/audit-log.service';
import { CreateVehicleReviewDto, CreateHostReviewDto, CreateRenterReviewDto } from './dto/reviews.dto';
export declare class ReviewsService {
    private prisma;
    private auditLogService;
    constructor(prisma: PrismaService, auditLogService: AuditLogService);
    private getCompletedBookingForRenter;
    createVehicleReview(renterId: string, dto: CreateVehicleReviewDto): Promise<{
        id: string;
        createdAt: Date;
        vehicleId: string | null;
        type: string;
        rating: number;
        body: string | null;
        bookingId: string;
        reviewerId: string;
        revieweeId: string;
    }>;
    createHostReview(renterId: string, dto: CreateHostReviewDto): Promise<{
        id: string;
        createdAt: Date;
        vehicleId: string | null;
        type: string;
        rating: number;
        body: string | null;
        bookingId: string;
        reviewerId: string;
        revieweeId: string;
    }>;
    createRenterReview(hostUserId: string, dto: CreateRenterReviewDto): Promise<{
        id: string;
        createdAt: Date;
        vehicleId: string | null;
        type: string;
        rating: number;
        body: string | null;
        bookingId: string;
        reviewerId: string;
        revieweeId: string;
    }>;
    getVehicleReviews(vehicleId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            reviewer: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            vehicleId: string | null;
            type: string;
            rating: number;
            body: string | null;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getHostReviews(hostUserId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            reviewer: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            vehicleId: string | null;
            type: string;
            rating: number;
            body: string | null;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMyReceivedReviews(userId: string, page?: number, limit?: number): Promise<{
        reviews: ({
            vehicle: {
                name: string;
            } | null;
            reviewer: {
                firstName: string;
                lastName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            vehicleId: string | null;
            type: string;
            rating: number;
            body: string | null;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
}
