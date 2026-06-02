export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: Date;
  renterResponse?: string;
}

export interface MaintenanceRecord {
  id: string;
  date: Date;
  type: 'service' | 'repair' | 'inspection';
  description: string;
  cost: number;
  completedBy: string;
  nextDue?: Date;
}

export interface AvailabilitySlot {
  date: Date;
  status: 'available' | 'booked' | 'blocked';
  bookingId?: string;
}

export interface VehicleDetails {
  id: string;
  image: string;
  name: string;
  make: string;
  model: string;
  year: number;
  vehicleType: string;
  fuelType: string;
  transmission: string;
  seats: number;
  doors?: number;
  color: string;
  plateNumber: string;
  dailyRate: number;
  weeklyRate?: number;
  monthlyRate?: number;
  hourlyRate?: number;
  securityDeposit: number;
  minimumRentalDays: number;
  mileageIncluded?: number;
  excessMileageCharge?: number;
  location: string;
  city: string;
  state: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  status: 'available' | 'booked' | 'maintenance' | 'unavailable';
  isVerified: boolean;
  isFeatured: boolean;
  nextAvailable?: string;
  features: string[];
  gallery: string[];
  description: string;
  engine?: string;
  horsepower?: number;
  torque?: number;
  drivetrain?: string;
  fuelCapacity?: number;
  mileage?: number;
  insuranceExpiry?: Date;
  roadWorthinessExpiry?: Date;
  registrationExpiry?: Date;
  businessId: string;
  businessName: string;
  businessLogo?: string;
  businessPhone: string;
  businessEmail: string;
  businessRating: number;
  businessTotalReviews: number;
  businessVerified: boolean;
  businessMemberSince: Date;
  driverDailyRate?: number;
  businessSettings?: {
    driverOption: "chauffeur-only" | "both";
    minimumDuration: number;
    workingHours?: {
      start: string;
      end: string;
    };
    overtimeRate?: number;
    deliveryFee?: number;
    insuranceRequired: boolean;
    insuranceRate?: number;
    serviceFee: number;
    taxRate: number;
  };
  rating: number;
  totalReviews: number;
  reviews?: Review[];
  bookingStats?: {
    totalBookings: number;
    revenue: number;
    utilizationRate: number;
    averageDaysPerBooking: number;
    repeatCustomers: number;
  };
  maintenanceHistory?: MaintenanceRecord[];
  availability?: AvailabilitySlot[];
}

export interface VehicleDetailsProps {
  vehicle: VehicleDetails;
  role: 'renter' | 'business';
  onBack?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleStatus?: () => void;
  onBook?: (bookingData?: any) => void;
  onContact?: (type: 'call' | 'message') => void;
  onShare?: () => void;
  onFavorite?: () => void;
  onCopyId?: () => void;
  onDownloadSpecs?: () => void;
  onPrint?: () => void;
  onArchive?: () => void;
  isFavorite?: boolean;
  showBackButton?: boolean;
  className?: string;
  userProfile?: {
    driverPreference?: "chauffeur_only" | "self_drive";
    hasDriverLicense?: boolean;
    driverLicense?: {
      number: string;
      fullName: string;
      phone: string;
    };
  };
}
