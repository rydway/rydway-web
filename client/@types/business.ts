// Business (Host) domain types for Rydway

// ─── Host Profile ───────────────────────────────────────────────────────────

export interface BusinessProfile {
  id: string;
  userId: string;
  businessName: string;
  cacNumber: string;
  taxId?: string;
  cacDocumentUrl?: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  avgRating?: number;
  totalReviews?: number;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    profileImageUrl?: string;
    kycStatus: 'pending' | 'verified' | 'rejected';
  };
}

// ─── Fleet / Vehicle ─────────────────────────────────────────────────────────

export type VehicleStatus = 'available' | 'maintenance' | 'archived';

export interface BusinessVehicle {
  id: string;
  slug: string;
  name: string;
  category: string;
  fuelType: string;
  transmission: string;
  seats: number;
  dailyRate: number;
  securityDeposit: number;
  location: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  requiresDriver: boolean;
  minimumRentalDays: number;
  status: VehicleStatus;
  isVerified: boolean;
  isFeatured: boolean;
  avgRating?: number;
  totalReviews?: number;
  images: VehicleImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  position?: number;
  isPrimary?: boolean;
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export type BusinessBookingStatus =
  | 'requested'
  | 'confirmed'
  | 'paid'
  | 'active'
  | 'completed'
  | 'cancelled';

export interface BusinessBooking {
  id: string;
  bookingNumber: string;
  vehicleId: string;
  renterId: string;
  hostId: string;
  status: BusinessBookingStatus;
  approvalStatus: 'pending' | 'approved' | 'declined' | 'declined_due_to_conflict';
  startDate: Date;
  endDate: Date;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  daysCount: number;
  baseAmount: number;
  platformFeeAmount: number;
  securityDepositAmount: number;
  totalAmount: number;
  confirmedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
  createdAt: Date;
  vehicle: Pick<BusinessVehicle, 'id' | 'name' | 'category' | 'images'>;
  renter: {
    firstName: string;
    lastName: string;
    email?: string;
  };
}

// ─── Earnings & Payouts ───────────────────────────────────────────────────────

export interface EarningsSummary {
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  availableBalance: number;
}

export type PayoutStatus = 'pending' | 'paid' | 'failed';

export interface Payout {
  id: string;
  hostId: string;
  amount: number;
  status: PayoutStatus;
  transactionRef?: string;
  destinationBankName: string;
  destinationAccountNumber: string;
  destinationAccountName?: string;
  createdAt: Date;
  booking?: {
    bookingNumber: string;
  };
}

// ─── KYC ─────────────────────────────────────────────────────────────────────

export type KycStatus = 'pending' | 'verified' | 'rejected';
export type KycType = 'renter' | 'host';

export interface KycSubmission {
  id: string;
  userId: string;
  type: KycType;
  status: KycStatus;
  submittedDataJson: Record<string, any>;
  reviewNotes?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface BusinessDashboardStats {
  totalVehicles: number;
  activeBookings: number;
  pendingRequests: number;
  availableBalance: number;
  totalEarned: number;
  avgRating?: number;
  totalReviews?: number;
}

// ─── Availability ─────────────────────────────────────────────────────────────

export interface AvailabilitySlot {
  date: string; // ISO date string
  isAvailable: boolean;
  bookingId?: string;
  bookingNumber?: string;
  status?: BusinessBookingStatus;
}

// ─── Reviews ─────────────────────────────────────────────────────────────────

export type ReviewType = 'vehicle' | 'host' | 'renter';

export interface BusinessReview {
  id: string;
  bookingId: string;
  vehicleId?: string;
  reviewerId: string;
  revieweeId: string;
  type: ReviewType;
  rating: number;
  body?: string;
  createdAt: Date;
  reviewer: {
    firstName: string;
    lastName: string;
  };
  vehicle?: {
    name: string;
  };
}

// ─── Notifications ────────────────────────────────────────────────────────────

export type BusinessNotificationType =
  | 'booking_request'
  | 'booking_approved'
  | 'booking_cancelled'
  | 'payment_received'
  | 'payout_completed'
  | 'review_received'
  | 'kyc_approved'
  | 'kyc_rejected'
  | 'vehicle_verified';

export interface BusinessNotification {
  id: string;
  type: BusinessNotificationType;
  title: string;
  message: string;
  isRead: boolean;
  actionUrl?: string;
  entityId?: string;
  entityType?: string;
  createdAt: Date;
}

// ─── Messages ─────────────────────────────────────────────────────────────────

export interface BusinessConversation {
  id: string;
  renterId: string;
  hostUserId: string;
  vehicleId: string;
  bookingId?: string;
  updatedAt: Date;
  vehicle: { id: string; name: string };
  renter: { firstName: string; lastName: string };
  host: { firstName: string; lastName: string };
  messages: BusinessMessage[];
}

export interface BusinessMessage {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
  };
}

// ─── API Response Wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
