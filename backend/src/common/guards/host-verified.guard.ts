import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { KycStatus } from '@prisma/client';

/**
 * HostVerifiedGuard — ensures the host user has a verified KYC before performing fleet/booking actions.
 * Checks that the requesting user is a host AND has kycStatus === 'verified'.
 */
@Injectable()
export class HostVerifiedGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) throw new ForbiddenException('Authentication required');

    const dbUser = await this.prisma.user.findUnique({
      where: { id: user.id },
      select: { kycStatus: true, role: true },
    });

    if (dbUser?.role !== 'host') {
      throw new ForbiddenException({
        message: 'Only verified hosts can perform this action',
        error: { code: 'ROLE_NOT_ALLOWED' },
      });
    }

    if (dbUser?.kycStatus !== KycStatus.verified) {
      throw new ForbiddenException({
        message: 'Host KYC verification is required before managing your fleet',
        error: { code: 'KYC_REQUIRED', kycStatus: dbUser?.kycStatus },
      });
    }

    return true;
  }
}
