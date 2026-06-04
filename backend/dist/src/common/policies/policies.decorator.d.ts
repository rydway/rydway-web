import { SubscriptionTier } from '@prisma/client';
export declare const REQUIRE_ACTIVE_STATUS = "require_active_status";
export declare const RequireActiveStatus: () => import("@nestjs/common").CustomDecorator<string>;
export declare const REQUIRE_SUBSCRIPTION = "require_subscription";
export declare const RequireSubscription: (tiers: SubscriptionTier[]) => import("@nestjs/common").CustomDecorator<string>;
