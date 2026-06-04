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
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const terminus_1 = require("@nestjs/terminus");
const prisma_service_1 = require("../prisma/prisma.service");
let HealthController = class HealthController {
    health;
    memory;
    prisma;
    constructor(health, memory, prisma) {
        this.health = health;
        this.memory = memory;
        this.prisma = prisma;
    }
    check() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
            async () => {
                try {
                    await this.prisma.$queryRaw `SELECT 1`;
                    return {
                        database: {
                            status: 'up',
                        },
                    };
                }
                catch (error) {
                    return {
                        database: {
                            status: 'down',
                            message: error.message,
                        },
                    };
                }
            },
        ]);
    }
    checkLiveness() {
        return { status: 'up' };
    }
    checkReadiness() {
        return this.health.check([
            async () => {
                try {
                    await this.prisma.$queryRaw `SELECT 1`;
                    return {
                        database: {
                            status: 'up',
                        },
                    };
                }
                catch (error) {
                    return {
                        database: {
                            status: 'down',
                            message: error.message,
                        },
                    };
                }
            },
        ]);
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, common_1.Get)(),
    (0, terminus_1.HealthCheck)(),
    (0, swagger_1.ApiOperation)({ summary: 'Overall health check' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "check", null);
__decorate([
    (0, common_1.Get)('live'),
    (0, swagger_1.ApiOperation)({ summary: 'Liveness probe' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkLiveness", null);
__decorate([
    (0, common_1.Get)('ready'),
    (0, swagger_1.ApiOperation)({ summary: 'Readiness probe' }),
    (0, terminus_1.HealthCheck)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "checkReadiness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)('Health'),
    (0, common_1.Controller)('health'),
    __metadata("design:paramtypes", [terminus_1.HealthCheckService,
        terminus_1.MemoryHealthIndicator,
        prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map