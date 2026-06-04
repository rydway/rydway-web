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
exports.HostVerifiedGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const client_1 = require("@prisma/client");
let HostVerifiedGuard = class HostVerifiedGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user)
            throw new common_1.ForbiddenException('Authentication required');
        const dbUser = await this.prisma.user.findUnique({
            where: { id: user.id },
            select: { kycStatus: true, role: true },
        });
        if (dbUser?.role !== 'host') {
            throw new common_1.ForbiddenException({
                message: 'Only verified hosts can perform this action',
                error: { code: 'ROLE_NOT_ALLOWED' },
            });
        }
        if (dbUser?.kycStatus !== client_1.KycStatus.verified) {
            throw new common_1.ForbiddenException({
                message: 'Host KYC verification is required before managing your fleet',
                error: { code: 'KYC_REQUIRED', kycStatus: dbUser?.kycStatus },
            });
        }
        return true;
    }
};
exports.HostVerifiedGuard = HostVerifiedGuard;
exports.HostVerifiedGuard = HostVerifiedGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HostVerifiedGuard);
//# sourceMappingURL=host-verified.guard.js.map