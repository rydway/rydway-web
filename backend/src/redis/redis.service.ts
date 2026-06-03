import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RedisService.name);
  private isRedisAvailable = false;

  constructor(private configService: ConfigService) {
    const host = configService.get<string>('REDIS_HOST', 'localhost');
    const port = configService.get<number>('REDIS_PORT', 6379);
    const password = configService.get<string>('REDIS_PASSWORD');
    const db = configService.get<number>('REDIS_DB', 0);
    const retryAttempts = configService.get<number>('REDIS_RETRY_ATTEMPTS', 3);
    const retryDelay = configService.get<number>('REDIS_RETRY_DELAY', 1000);

    super({
      host,
      port,
      password: password || undefined,
      db,
      retryStrategy: (times: number) => {
        // ✅ Add type for 'times'
        if (times > retryAttempts) {
          this.logger.warn(
            `Redis connection failed after ${retryAttempts} attempts, continuing without Redis`,
          );
          return null; // Stop retrying
        }
        return Math.min(times * retryDelay, 3000);
      },
      maxRetriesPerRequest: retryAttempts,
      enableReadyCheck: true,
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    try {
      await this.connect(); // ✅ now available after ioredis installation

      this.on('connect', () => {
        this.isRedisAvailable = true;
        this.logger.log(
          `Redis connected successfully to ${this.options.host}:${this.options.port}`,
        );
      });

      this.on('error', (err: Error) => {
        // ✅ explicit type
        this.logger.error(`Redis connection error: ${err.message}`, err.stack);
        this.isRedisAvailable = false;
      });

      this.on('close', () => {
        this.logger.warn('Redis connection closed');
        this.isRedisAvailable = false;
      });

      this.on('reconnecting', () => {
        this.logger.log('Redis reconnecting...');
      });

      const isReady = await this.ping();
      if (isReady === 'PONG') {
        this.isRedisAvailable = true;
        this.logger.log('Redis is ready for use');
      }
    } catch (error: unknown) {
      this.logger.error(
        `Failed to initialize Redis: ${this.getErrorMessage(error)}`,
      );
      // App continues without Redis
    }
  }

  async onModuleDestroy() {
    try {
      if (this.isRedisAvailable) {
        await this.quit();
        this.logger.log('Redis connection closed gracefully');
      } else {
        this.disconnect();
      }
    } catch (error: unknown) {
      this.logger.error(
        `Error during Redis shutdown: ${this.getErrorMessage(error)}`,
      );
      this.disconnect();
    }
  }

  isAvailable(): boolean {
    return this.isRedisAvailable && this.status === 'ready';
  }

  // Safe wrappers (optional, but good practice)
  async safeGet(key: string): Promise<string | null> {
    if (!this.isAvailable()) return null;
    try {
      return await this.get(key);
    } catch (error) {
      this.logger.error(
        `Error getting key ${key}: ${this.getErrorMessage(error)}`,
      );
      return null;
    }
  }

  async safeSet(key: string, value: string, ttl?: number): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      if (ttl) await this.set(key, value, 'EX', ttl);
      else await this.set(key, value);
      return true;
    } catch (error) {
      this.logger.error(
        `Error setting key ${key}: ${this.getErrorMessage(error)}`,
      );
      return false;
    }
  }

  async safeDel(key: string): Promise<boolean> {
    if (!this.isAvailable()) return false;
    try {
      const result = await this.del(key);
      return result > 0;
    } catch (error) {
      this.logger.error(
        `Error deleting key ${key}: ${this.getErrorMessage(error)}`,
      );
      return false;
    }
  }

  async healthCheck(): Promise<{ available: boolean; latency?: number }> {
    if (!this.isAvailable()) return { available: false };
    const start = Date.now();
    try {
      await this.ping();
      return { available: true, latency: Date.now() - start };
    } catch {
      return { available: false };
    }
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error';
    }
  }
}
