"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequireSubscription = exports.REQUIRE_SUBSCRIPTION = exports.RequireActiveStatus = exports.REQUIRE_ACTIVE_STATUS = void 0;
const common_1 = require("@nestjs/common");
exports.REQUIRE_ACTIVE_STATUS = 'require_active_status';
const RequireActiveStatus = () => (0, common_1.SetMetadata)(exports.REQUIRE_ACTIVE_STATUS, true);
exports.RequireActiveStatus = RequireActiveStatus;
exports.REQUIRE_SUBSCRIPTION = 'require_subscription';
const RequireSubscription = (tiers) => (0, common_1.SetMetadata)(exports.REQUIRE_SUBSCRIPTION, tiers);
exports.RequireSubscription = RequireSubscription;
//# sourceMappingURL=policies.decorator.js.map