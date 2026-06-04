import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
    private configService;
    private readonly logger;
    private isRedisAvailable;
    constructor(configService: ConfigService);
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    isAvailable(): boolean;
    safeGet(key: string): Promise<string | null>;
    safeSet(key: string, value: string, ttl?: number): Promise<boolean>;
    safeDel(key: string): Promise<boolean>;
    healthCheck(): Promise<{
        available: boolean;
        latency?: number;
    }>;
    private getErrorMessage;
}
