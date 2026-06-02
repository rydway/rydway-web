import { PrismaService } from '../prisma/prisma.service';
import { RedisService } from '../redis/redis.service';
export declare class DashboardService {
    private prisma;
    private redisService;
    constructor(prisma: PrismaService, redisService: RedisService);
    getRenterSummary(renterId: string): Promise<any>;
    getHostSummary(userId: string): Promise<any>;
}
