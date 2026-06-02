export type Role = 'renter' | 'host' | 'admin';
export type KycStatus = 'unsubmitted' | 'pending' | 'verified' | 'rejected';
export type BookingStatus = 'requested' | 'confirmed' | 'paid' | 'active' | 'completed' | 'cancelled' | 'disputed';
export type PaymentStatus = 'pending' | 'success' | 'failed' | 'refunded' | 'partially_refunded';
export type VehicleStatus = 'available' | 'booked' | 'maintenance' | 'archived';
export type KycType = 'renter' | 'host';

export interface User {
  id: string;
  email: string;
  phone?: string;
  firstName: string;
  lastName: string;
  role: Role;
  profileImageUrl?: string;
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  kycStatus: KycStatus;
  emailVerifiedAt?: string | Date;
  phoneVerifiedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface RenterProfile {
  id: string;
  userId: string;
  licenseNumber?: string;
  licenseExpiry?: string | Date;
  licenseDocumentUrl?: string;
  selfieUrl?: string;
  avgRating: number;
  totalReviews: number;
}

export type SubscriptionTier = 'free' | 'premium' | 'enterprise';

export interface HostProfile {
  id: string;
  userId: string;
  businessName?: string;
  cacNumber?: string;
  taxId?: string;
  cacDocumentUrl?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  avgRating: number;
  totalReviews: number;
  subscriptionTier: SubscriptionTier;
  subscriptionExpiresAt?: string | Date;
}

export interface Vehicle {
  id: string;
  hostId: string;
  name: string;
  slug: string;
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
  status: VehicleStatus;
  isFeatured: boolean;
  isVerified: boolean;
  requiresDriver: boolean;
  minimumRentalDays: number;
  avgRating: number;
  totalReviews: number;
  images?: VehicleImage[];
}

export interface VehicleImage {
  id: string;
  vehicleId: string;
  url: string;
  position: number;
  isPrimary: boolean;
}

export interface Booking {
  id: string;
  bookingNumber: string;
  renterId: string;
  hostId: string;
  vehicleId: string;
  startDate: string | Date;
  endDate: string | Date;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  daysCount: number;
  baseAmount: number;
  platformFeeAmount: number;
  securityDepositAmount: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  approvalStatus: string;
  vehicle?: Vehicle;
  renter?: User;
}

export interface Payment {
  id: string;
  bookingId: string;
  transactionRef: string;
  provider: string;
  method: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paidAt?: string | Date;
}

export interface Conversation {
  id: string;
  renterId: string;
  hostUserId: string;
  vehicleId: string;
  bookingId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  renter?: User;
  host?: User;
  vehicle?: Vehicle;
  messages?: Message[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  attachmentUrl?: string;
  isRead: boolean;
  readAt?: string | Date;
  createdAt: string | Date;
  sender?: User;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  readAt?: string | Date;
  actionUrl?: string;
  entityId?: string;
  entityType?: string;
  createdAt: string | Date;
}

export interface Review {
  id: string;
  bookingId: string;
  vehicleId?: string;
  reviewerId: string;
  revieweeId: string;
  type: "vehicle" | "host" | "renter";
  rating: number;
  body?: string;
  createdAt: string | Date;
  reviewer?: User;
  reviewee?: User;
}

export interface KycSubmission {
  id: string;
  userId: string;
  type: KycType;
  status: KycStatus;
  submittedDataJson?: any;
  reviewNotes?: string;
  reviewedAt?: string | Date;
  createdAt: string | Date;
  updatedAt: string | Date;
}
