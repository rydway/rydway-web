import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
export declare class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
    private configService;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    onModuleDestroy(): void;
}
