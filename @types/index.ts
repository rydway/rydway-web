// Core type definitions for Rydway

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  profileImage?: string;
  kycStatus: 'pending' | 'verified' | 'failed';
  kycDocs?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Business {
  id: string;
  name: string;
  cacNumber: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  verified: boolean;
  payoutAccount?: string;
  documents?: string[];
  rating?: number;
  totalBookings?: number;
  createdAt: Date;
}

export interface Vehicle {
  id: string;
  businessId: string;
  businessName: string;
  make: string;
  model: string;
  year: number;
  vin: string;
  plate: string;
  category: 'luxury' | 'casual' | 'family' | 'suv' | 'electric';
  transmission: 'Automatic' | 'Manual';
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  capacity: string;
  fuel: string;
  rateDaily: number;
  rateWeekly?: number;
  rateMonthly?: number;
  depositAmount: number;
  photos: string[];
  features: string[];
  availabilityBlocks: AvailabilityBlock[];
  insurance?: string[];
  rating?: number;
  totalBookings?: number;
  location: string;
  createdAt: Date;
}

export interface AvailabilityBlock {
  start: Date;
  end: Date;
  type: 'booked' | 'blocked';
  bookingId?: string;
}

export interface Booking {
  id: string;
  vehicleId: string;
  userId: string;
  businessId: string;
  status: BookingStatus;
  startDate: Date;
  endDate: Date;
  pickupLocation: string;
  dropoffLocation: string;
  totalAmount: number;
  depositAmount: number;
  daysCount: number;
  extras?: BookingExtra[];
  pickupEvidence?: Evidence;
  returnEvidence?: Evidence;
  paymentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'requested' 
  | 'accepted' 
  | 'rejected' 
  | 'pending_payment' 
  | 'paid' 
  | 'active' 
  | 'returned' 
  | 'completed' 
  | 'cancelled'
  | 'disputed';

export interface BookingExtra {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Evidence {
  id: string;
  bookingId: string;
  uploaderId: string;
  uploaderType: 'user' | 'business';
  type: 'pickup' | 'return';
  photos: string[];
  odometer?: number;
  fuelLevel?: string;
  damageNotes?: string;
  damagePhotos?: string[];
  location?: {
    lat: number;
    lng: number;
  };
  timestamp: Date;
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  gatewayRef: string;
  gateway: 'paystack' | 'moniepoint';
  status: 'pending' | 'successful' | 'failed' | 'refunded';
  splitDetails?: {
    platformFee: number;
    businessAmount: number;
  };
  escrowReleaseDate?: Date;
  createdAt: Date;
}

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerType: 'user' | 'business';
  rating: number;
  text: string;
  photos?: string[];
  createdAt: Date;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  senderName: string;
  senderType: 'user' | 'business';
  body: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

export interface SearchFilters {
  query: string;
  location?: string;
  startDate?: Date;
  endDate?: Date;
  category?: string[];
  transmission?: string[];
  fuelType?: string[];
  priceMin?: number;
  priceMax?: number;
  capacity?: string[];
  rating?: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'payment' | 'message' | 'review' | 'kyc';
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  createdAt: Date;
}