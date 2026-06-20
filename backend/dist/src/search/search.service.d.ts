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
        legalBusinessName: string | null;
        tradingName: string | null;
        businessType: string | null;
        rcNumber: string | null;
        dateOfIncorporation: Date | null;
        businessState: string | null;
        businessCity: string | null;
        businessAddress: string | null;
        businessPhone: string | null;
        businessEmail: string | null;
        tin: string | null;
        vatStatus: string | null;
        frscFleetStatus: string | null;
        stateTransportPermit: string | null;
        ownerName: string | null;
        ownerPhone: string | null;
        ownerNIN: string | null;
        ownerDOB: Date | null;
        ownerEmail: string | null;
        ownershipPercentage: number | null;
        cacCertificateUrl: string | null;
        cacStatusReportUrl: string | null;
        utilityBillUrl: string | null;
        taxClearanceCertificateUrl: string | null;
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
