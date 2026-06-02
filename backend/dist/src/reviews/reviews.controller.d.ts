import { ReviewsService } from './reviews.service';
import { CreateVehicleReviewDto, CreateHostReviewDto, CreateRenterReviewDto } from './dto/reviews.dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    reviewVehicle(user: any, dto: CreateVehicleReviewDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            vehicleId: string | null;
            type: string;
            rating: number;
            body: string | null;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
        };
    }>;
    reviewHost(user: any, dto: CreateHostReviewDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            vehicleId: string | null;
            type: string;
            rating: number;
            body: string | null;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
        };
    }>;
    reviewRenter(user: any, dto: CreateRenterReviewDto): Promise<{
        message: string;
        data: {
            id: string;
            createdAt: Date;
            vehicleId: string | null;
            type: string;
            rating: number;
            body: string | null;
            bookingId: string;
            reviewerId: string;
            revieweeId: string;
        };
    }>;
    getMyReviews(user: any, page?: string, limit?: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getVehicleReviews(vehicleId: string, page?: string, limit?: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
    getHostReviews(hostUserId: string, page?: string, limit?: string): Promise<{
        message: string;
        data: {
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
        };
    }>;
}
