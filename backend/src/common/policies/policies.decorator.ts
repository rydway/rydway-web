import { SetMetadata } from '@nestjs/common';
import { SubscriptionTier } from '@prisma/client';

export const REQUIRE_ACTIVE_STATUS = 'require_active_status';
export const RequireActiveStatus = () => SetMetadata(REQUIRE_ACTIVE_STATUS, true);

export const REQUIRE_SUBSCRIPTION = 'require_subscription';
export const RequireSubscription = (tiers: SubscriptionTier[]) => SetMetadata(REQUIRE_SUBSCRIPTION, tiers);
