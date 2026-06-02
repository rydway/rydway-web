import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis implements OnModuleInit, OnModuleDestroy {
  constructor(private configService: ConfigService) {
    super({
      host: configService.get<string>('REDIS_HOST', 'localhost'),
      port: configService.get<number>('REDIS_PORT', 6379),
    });
  }

  onModuleInit() {
    this.on('connect', () => console.log('Redis connected successfully'));
    this.on('error', (err) => console.error('Redis connection error', err));
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
