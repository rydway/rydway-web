export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'renter' | 'business';
  verified?: boolean;
  kycStatus?: 'verified' | 'pending' | 'unverified';
  licenseStatus?: 'verified' | 'pending' | 'unverified';
  businessVerification?: 'verified' | 'pending' | 'unverified';
  documentExpiry?: Date;
}

export interface PayoutDetails {
  bankName: string;
  accountNumber: string;
  accountName: string;
  bankCode?: string;
}

export interface NotificationPreferences {
  bookingUpdates: boolean;
  promotions: boolean;
  newBookings: boolean;
  cancellations: boolean;
  securityAlerts: boolean; // Always on
}
