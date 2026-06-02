import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';
import { REQUIRE_ACTIVE_STATUS, REQUIRE_SUBSCRIPTION } from '../policies/policies.decorator';
import { SubscriptionTier } from '@prisma/client';

@Injectable()
export class PolicyGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requireActiveStatus = this.reflector.get<boolean>(REQUIRE_ACTIVE_STATUS, context.getHandler());
    const requiredSubscriptions = this.reflector.get<SubscriptionTier[]>(REQUIRE_SUBSCRIPTION, context.getHandler());

    if (!requireActiveStatus && !requiredSubscriptions) {
      return true; // No policy rules attached to this route
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user; // Set by JwtAuthGuard

    if (!user) {
      return false; // Cannot evaluate policy without an authenticated user
    }

    // Evaluate Active Status Policy
    if (requireActiveStatus) {
      const dbUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: { isActive: true, isSuspended: true, suspensionReason: true }
      });

      if (!dbUser?.isActive) {
        throw new ForbiddenException('Your account is currently inactive.');
      }

      if (dbUser.isSuspended) {
        throw new ForbiddenException(`Account suspended: ${dbUser.suspensionReason || 'Contact support'}`);
      }
    }

    // Evaluate Subscription Policy
    if (requiredSubscriptions && requiredSubscriptions.length > 0) {
      if (user.role !== 'host') {
        throw new ForbiddenException('Only hosts have subscription tiers.');
      }

      const hostProfile = await this.prisma.hostProfile.findUnique({
        where: { userId: user.id },
        select: { subscriptionTier: true, subscriptionExpiresAt: true }
      });

      if (!hostProfile) {
        throw new ForbiddenException('Host profile not found.');
      }

      if (!requiredSubscriptions.includes(hostProfile.subscriptionTier)) {
        throw new ForbiddenException(`This feature requires one of the following subscriptions: ${requiredSubscriptions.join(', ')}`);
      }

      if (
        hostProfile.subscriptionTier !== SubscriptionTier.free && 
        hostProfile.subscriptionExpiresAt && 
        new Date() > hostProfile.subscriptionExpiresAt
      ) {
        throw new ForbiddenException('Your subscription has expired. Please renew to access this feature.');
      }
    }

    return true;
  }
}
