"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = __importDefault(require("ioredis"));
let RedisService = RedisService_1 = class RedisService extends ioredis_1.default {
    configService;
    logger = new common_1.Logger(RedisService_1.name);
    isRedisAvailable = false;
    constructor(configService) {
        const host = configService.get('REDIS_HOST', 'localhost');
        const port = configService.get('REDIS_PORT', 6379);
        const password = configService.get('REDIS_PASSWORD');
        const db = configService.get('REDIS_DB', 0);
        const retryAttempts = configService.get('REDIS_RETRY_ATTEMPTS', 3);
        const retryDelay = configService.get('REDIS_RETRY_DELAY', 1000);
        super({
            host,
            port,
            password: password || undefined,
            db,
            retryStrategy: (times) => {
                if (times > retryAttempts) {
                    this.logger.warn(`Redis connection failed after ${retryAttempts} attempts, continuing without Redis`);
                    return null;
                }
                return Math.min(times * retryDelay, 3000);
            },
            maxRetriesPerRequest: retryAttempts,
            enableReadyCheck: true,
            lazyConnect: true,
        });
        this.configService = configService;
    }
    async onModuleInit() {
        try {
            await this.connect();
            this.on('connect', () => {
                this.isRedisAvailable = true;
                this.logger.log(`Redis connected successfully to ${this.options.host}:${this.options.port}`);
            });
            this.on('error', (err) => {
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
        }
        catch (error) {
            this.logger.error(`Failed to initialize Redis: ${this.getErrorMessage(error)}`);
        }
    }
    async onModuleDestroy() {
        try {
            if (this.isRedisAvailable) {
                await this.quit();
                this.logger.log('Redis connection closed gracefully');
            }
            else {
                this.disconnect();
            }
        }
        catch (error) {
            this.logger.error(`Error during Redis shutdown: ${this.getErrorMessage(error)}`);
            this.disconnect();
        }
    }
    isAvailable() {
        return this.isRedisAvailable && this.status === 'ready';
    }
    async safeGet(key) {
        if (!this.isAvailable())
            return null;
        try {
            return await this.get(key);
        }
        catch (error) {
            this.logger.error(`Error getting key ${key}: ${this.getErrorMessage(error)}`);
            return null;
        }
    }
    async safeSet(key, value, ttl) {
        if (!this.isAvailable())
            return false;
        try {
            if (ttl)
                await this.set(key, value, 'EX', ttl);
            else
                await this.set(key, value);
            return true;
        }
        catch (error) {
            this.logger.error(`Error setting key ${key}: ${this.getErrorMessage(error)}`);
            return false;
        }
    }
    async safeDel(key) {
        if (!this.isAvailable())
            return false;
        try {
            const result = await this.del(key);
            return result > 0;
        }
        catch (error) {
            this.logger.error(`Error deleting key ${key}: ${this.getErrorMessage(error)}`);
            return false;
        }
    }
    async healthCheck() {
        if (!this.isAvailable())
            return { available: false };
        const start = Date.now();
        try {
            await this.ping();
            return { available: true, latency: Date.now() - start };
        }
        catch {
            return { available: false };
        }
    }
    getErrorMessage(error) {
        if (error instanceof Error)
            return error.message;
        if (typeof error === 'string')
            return error;
        try {
            return JSON.stringify(error);
        }
        catch {
            return 'Unknown error';
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RedisService);
//# sourceMappingURL=redis.service.js.map