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
exports.PolicyGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../prisma/prisma.service");
const policies_decorator_1 = require("../policies/policies.decorator");
const client_1 = require("@prisma/client");
let PolicyGuard = class PolicyGuard {
    reflector;
    prisma;
    constructor(reflector, prisma) {
        this.reflector = reflector;
        this.prisma = prisma;
    }
    async canActivate(context) {
        const requireActiveStatus = this.reflector.get(policies_decorator_1.REQUIRE_ACTIVE_STATUS, context.getHandler());
        const requiredSubscriptions = this.reflector.get(policies_decorator_1.REQUIRE_SUBSCRIPTION, context.getHandler());
        if (!requireActiveStatus && !requiredSubscriptions) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            return false;
        }
        if (requireActiveStatus) {
            const dbUser = await this.prisma.user.findUnique({
                where: { id: user.id },
                select: { isActive: true, isSuspended: true, suspensionReason: true }
            });
            if (!dbUser?.isActive) {
                throw new common_1.ForbiddenException('Your account is currently inactive.');
            }
            if (dbUser.isSuspended) {
                throw new common_1.ForbiddenException(`Account suspended: ${dbUser.suspensionReason || 'Contact support'}`);
            }
        }
        if (requiredSubscriptions && requiredSubscriptions.length > 0) {
            if (user.role !== 'host') {
                throw new common_1.ForbiddenException('Only hosts have subscription tiers.');
            }
            const hostProfile = await this.prisma.hostProfile.findUnique({
                where: { userId: user.id },
                select: { subscriptionTier: true, subscriptionExpiresAt: true }
            });
            if (!hostProfile) {
                throw new common_1.ForbiddenException('Host profile not found.');
            }
            if (!requiredSubscriptions.includes(hostProfile.subscriptionTier)) {
                throw new common_1.ForbiddenException(`This feature requires one of the following subscriptions: ${requiredSubscriptions.join(', ')}`);
            }
            if (hostProfile.subscriptionTier !== client_1.SubscriptionTier.free &&
                hostProfile.subscriptionExpiresAt &&
                new Date() > hostProfile.subscriptionExpiresAt) {
                throw new common_1.ForbiddenException('Your subscription has expired. Please renew to access this feature.');
            }
        }
        return true;
    }
};
exports.PolicyGuard = PolicyGuard;
exports.PolicyGuard = PolicyGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService])
], PolicyGuard);
//# sourceMappingURL=policy.guard.js.map