import { HealthCheckService, MemoryHealthIndicator } from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
export declare class HealthController {
    private health;
    private memory;
    private prisma;
    constructor(health: HealthCheckService, memory: MemoryHealthIndicator, prisma: PrismaService);
    check(): Promise<import("@nestjs/terminus").HealthCheckResult<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
            message?: undefined;
        };
    } | {
        database: {
            status: "down";
            message: any;
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap">, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
            message?: undefined;
        };
    } | {
        database: {
            status: "down";
            message: any;
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap">> | undefined, Partial<(import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
            message?: undefined;
        };
    } | {
        database: {
            status: "down";
            message: any;
        };
    })) & import("@nestjs/terminus").HealthIndicatorResult<"memory_heap">> | undefined>>;
    checkLiveness(): {
        status: string;
    };
    checkReadiness(): Promise<import("@nestjs/terminus").HealthCheckResult<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
            message?: undefined;
        };
    } | {
        database: {
            status: "down";
            message: any;
        };
    }), Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
            message?: undefined;
        };
    } | {
        database: {
            status: "down";
            message: any;
        };
    })> | undefined, Partial<import("@nestjs/terminus").HealthIndicatorResult<string, import("@nestjs/terminus").HealthIndicatorStatus, Record<string, any>> & ({
        database: {
            status: "up";
            message?: undefined;
        };
    } | {
        database: {
            status: "down";
            message: any;
        };
    })> | undefined>>;
}
