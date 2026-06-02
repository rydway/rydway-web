import { SearchService } from './search.service';
import { SearchVehiclesDto } from './dto/search.dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchVehicles(query: SearchVehiclesDto): Promise<{
        success: boolean;
        message: string;
        data: any;
    }>;
    getFilters(): Promise<{
        message: string;
        data: any;
    }>;
    searchHosts(query?: string): Promise<{
        message: string;
        data: ({
            user: {
                firstName: string;
                lastName: string;
                profileImageUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            businessName: string | null;
            cacNumber: string | null;
            taxId: string | null;
            cacDocumentUrl: string | null;
            bankName: string | null;
            accountName: string | null;
            accountNumber: string | null;
            avgRating: number;
            totalReviews: number;
            subscriptionTier: import("@prisma/client").$Enums.SubscriptionTier;
            subscriptionExpiresAt: Date | null;
            userId: string;
        })[];
    }>;
    autocomplete(query?: string): Promise<{
        message: string;
        data: {
            vehicles: string[];
            locations: string[];
        };
    }>;
}
