import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KycStatus } from '@prisma/client';

/**
 * KycVerifiedGuard — blocks access if the authenticated user's kycStatus !== 'verified'.
 * Apply to any protected marketplace action (e.g. create booking, create vehicle).
 */
@Injectable()
export class KycVerifiedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Authentication required');

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { kycStatus: true },
    });

    if (dbUser?.kycStatus !== KycStatus.verified) {
      throw new ForbiddenException({
        message: 'KYC verification is required before performing this action',
        error: { code: 'KYC_REQUIRED', kycStatus: dbUser?.kycStatus },
      });
    }

    return true;
  }
}
