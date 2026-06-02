import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
import { SearchVehiclesDto } from './dto/search.dto';
export declare class SearchService {
    private prisma;
    private redisService;
    constructor(prisma: PrismaService, redisService: RedisService);
    private generateCacheKey;
    searchVehicles(dto: SearchVehiclesDto): Promise<any>;
    getFilters(): Promise<any>;
    searchHosts(query: string): Promise<({
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
    })[]>;
    autocomplete(query: string): Promise<{
        vehicles: string[];
        locations: string[];
    }>;
}
