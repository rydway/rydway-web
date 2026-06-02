// types/car.ts
export interface Vehicle {
  id: string;
  name: string;
  category: string;
  image: string;
  fuel: string;
  transmission: string;
  capacity: string;
  price: string;
  rating?: number;
  originalPrice?: string; 
  isFavorite: boolean;

  premium?: boolean; 
  fleet?: string; 
  seats?: number; 
  fuelType?: string; 
}

// types/vehicle.ts
export interface VehicleFormData {
  dailyRate: number;
  weeklyRate: number | undefined;
  monthlyRate: number | undefined;
  features: never[];
  minimumRentalDays: number;
  isFeatured: boolean;
  // Step 1: Basic Information
  title: string;
  make: string;
  model: string;
  year: string;
  vehicleType: string;
  transmission: string;
  fuelType: string;
  plateNumber: string;
  color: string;
  
  // Step 2: Capacity & Comfort
  seats: string;
  airConditioning: boolean;
  luggageCapacity: string;
  
  // Step 3: Rental Configuration
  rentalMode: string;
  minimumDuration: string;
  durationUnit: string;
  basePrice: string;
  pricingUnit: string;
  securityDeposit: boolean;
  depositAmount: string;
  location: string;
  
  // Step 4: Documentation
  registrationDoc: File | null;
  insuranceDoc: File | null;
  insuranceExpiry: string;
  roadWorthinessDoc: File | null;
  
  // Step 5: Images
  images: File[];
  
  // Step 6: Status
  status: string;
  availableFrom: string;
}

export interface VehicleFieldConfig {
  id: keyof VehicleFormData;
  label: string;
  type: 'text' | 'number' | 'select' | 'checkbox' | 'date' | 'file';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ label: string; value: string; icon?: string }>;
  min?: number;
  max?: number;
  icon?: string;
  tooltip?: string;
  hint?: string | ((data: Record<string, any>) => string);
  condition?: (data: Record<string, any>) => boolean;
  dependsOn?: string;
  grid?: 'full' | 'half' | 'third';
  customRender?: boolean;
  accept?: string;
  multiple?: boolean;
}

export interface VehicleStepConfig {
  id: string;
  title: string;
  description: string;
  fields: VehicleFieldConfig[];
}