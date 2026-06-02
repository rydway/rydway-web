// types/vehicle.ts
export interface VehicleFormData {
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

export const vehicleFormSteps: VehicleStepConfig[] = [
  {
    id: "basic-info",
    title: "Basic Vehicle Information",
    description: "This is the identity of the car.",
    fields: [
      {
        id: "title",
        label: "Vehicle Name / Title",
        type: "text",
        placeholder: "Toyota Camry 2018",
        required: true,
        grid: "full",
        hint: "Give your vehicle a descriptive name that renters will see"
      },
      {
        id: "make",
        label: "Make",
        type: "select",
        options: [
          { label: "Toyota", value: "toyota" },
          { label: "Honda", value: "honda" },
          { label: "Mercedes", value: "mercedes" },
          { label: "BMW", value: "bmw" },
          { label: "Ford", value: "ford" },
          { label: "Nissan", value: "nissan" },
          { label: "Hyundai", value: "hyundai" },
          { label: "Kia", value: "kia" },
          { label: "Lexus", value: "lexus" },
          { label: "Audi", value: "audi" },
          { label: "Volkswagen", value: "volkswagen" }
        ],
        required: true,
        grid: "half"
      },
      {
        id: "model",
        label: "Model",
        type: "text",
        placeholder: "Camry",
        required: true,
        grid: "half"
      },
      {
        id: "year",
        label: "Year of Manufacture",
        type: "number",
        min: 1990,
        max: new Date().getFullYear(),
        required: true,
        grid: "third"
      },
      {
        id: "vehicleType",
        label: "Vehicle Type",
        type: "select",
        options: [
          { label: "Sedan", value: "sedan" },
          { label: "SUV", value: "suv" },
          { label: "Bus/Van", value: "bus-van" },
          { label: "Truck", value: "truck" }
        ],
        required: true,
        grid: "third"
      },
      {
        id: "transmission",
        label: "Transmission",
        type: "select",
        options: [
          { label: "Automatic", value: "automatic" },
          { label: "Manual", value: "manual" }
        ],
        required: true,
        grid: "third"
      },
      {
        id: "fuelType",
        label: "Fuel Type",
        type: "select",
        options: [
          { label: "Petrol", value: "petrol" },
          { label: "Diesel", value: "diesel" },
          { label: "Hybrid", value: "hybrid" },
          { label: "Electric", value: "electric" }
        ],
        required: true,
        grid: "third"
      },
      {
        id: "plateNumber",
        label: "Plate Number",
        type: "text",
        placeholder: "ABC 123 XY",
        required: true,
        grid: "third"
      },
      {
        id: "color",
        label: "Color",
        type: "text",
        placeholder: "White",
        required: true,
        grid: "third"
      }
    ]
  },
  {
    id: "capacity-comfort",
    title: "Capacity & Comfort",
    description: "This affects matching and pricing logic later.",
    fields: [
      {
        id: "seats",
        label: "Number of Seats",
        type: "number",
        min: 1,
        max: 50,
        required: true,
        grid: "half",
        hint: "How many passengers can this vehicle comfortably carry?"
      },
      {
        id: "airConditioning",
        label: "Air Conditioning",
        type: "checkbox",
        required: true,
        grid: "half",
        hint: "Does this vehicle have working air conditioning?"
      },
      {
        id: "luggageCapacity",
        label: "Luggage Capacity",
        type: "select",
        options: [
          { label: "Small", value: "small" },
          { label: "Medium", value: "medium" },
          { label: "Large", value: "large" }
        ],
        required: false,
        grid: "half",
        hint: "How much luggage can this vehicle hold?"
      }
    ]
  },
  {
    id: "rental-config",
    title: "Rental Configuration",
    description: "This is where money and restrictions live.",
    fields: [
      {
        id: "rentalMode",
        label: "Available Rental Mode",
        type: "select",
        options: [
          { label: "Self-drive only", value: "self-drive" },
          { label: "With driver only", value: "with-driver" },
          { label: "Both", value: "both" }
        ],
        required: true,
        grid: "full",
        hint: "How can this vehicle be rented?"
      },
      {
        id: "minimumDuration",
        label: "Minimum Rental Duration",
        type: "number",
        min: 1,
        required: true,
        grid: "half",
        hint: "Minimum number of rental units"
      },
      {
        id: "durationUnit",
        label: "Duration Unit",
        type: "select",
        options: [
          { label: "Days", value: "days" },
          { label: "Hours", value: "hours" },
          { label: "Weeks", value: "weeks" },
          { label: "Months", value: "months" }
        ],
        required: true,
        grid: "half",
        hint: "Unit for minimum duration"
      },
      {
        id: "basePrice",
        label: "Base Price",
        type: "number",
        min: 0,
        required: true,
        grid: "half",
        hint: "Price per rental unit"
      },
      {
        id: "pricingUnit",
        label: "Pricing Unit",
        type: "select",
        options: [
          { label: "Per day", value: "day" },
          { label: "Per hour", value: "hour" },
          { label: "Per week", value: "week" },
          { label: "Per month", value: "month" }
        ],
        required: true,
        grid: "half",
        hint: "What period does the base price cover?"
      },
      {
        id: "securityDeposit",
        label: "Security Deposit Required",
        type: "checkbox",
        required: true,
        grid: "half",
        hint: "Do you require a security deposit for this vehicle?"
      },
      {
        id: "depositAmount",
        label: "Security Deposit Amount",
        type: "number",
        min: 0,
        required: false,
        grid: "half",
        condition: (data) => data.securityDeposit === true,
        hint: "Amount to be held as security deposit"
      },
      {
        id: "location",
        label: "Pickup Location (City)",
        type: "text",
        placeholder: "Lagos",
        required: true,
        grid: "full",
        hint: "Where will renters pick up this vehicle?"
      }
    ]
  },
  {
    id: "documentation",
    title: "Documentation",
    description: "This protects you when things go sideways.",
    fields: [
      {
        id: "registrationDoc",
        label: "Vehicle Registration Document",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        required: true,
        grid: "full",
        hint: "Upload a clear photo or scan of the vehicle registration"
      },
      {
        id: "insuranceDoc",
        label: "Insurance Document",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        required: true,
        grid: "full",
        hint: "Upload a clear photo or scan of the insurance certificate"
      },
      {
        id: "insuranceExpiry",
        label: "Insurance Expiry Date",
        type: "date",
        required: true,
        grid: "half",
        hint: "When does the insurance expire?"
      },
      {
        id: "roadWorthinessDoc",
        label: "Road Worthiness Document (Optional)",
        type: "file",
        accept: ".pdf,.jpg,.jpeg,.png",
        required: false,
        grid: "full",
        hint: "If available, upload the road worthiness certificate"
      }
    ]
  },
  {
    id: "images",
    title: "Vehicle Images",
    description: "No images = no bookings. Minimum 3 photos required.",
    fields: [
      {
        id: "images",
        label: "Vehicle Photos",
        type: "file",
        accept: "image/*",
        required: true,
        multiple: true,
        grid: "full",
        hint: "Upload clear photos of the vehicle from different angles (front, side, interior, rear). Minimum 3 photos required."
      }
    ]
  },
  {
    id: "status-availability",
    title: "Status & Availability",
    description: "Internal control. Not user-facing.",
    fields: [
      {
        id: "status",
        label: "Vehicle Status",
        type: "select",
        options: [
          { label: "Available", value: "available" },
          { label: "Under Maintenance", value: "maintenance" }
        ],
        required: true,
        grid: "half",
        hint: "Is this vehicle ready for bookings?"
      },
      {
        id: "availableFrom",
        label: "Available From Date (Optional)",
        type: "date",
        required: false,
        grid: "half",
        hint: "If not currently available, when will it be ready?"
      }
    ]
  }
];

// Helper function to get field by ID
export const getFieldById = (fieldId: string, steps: VehicleStepConfig[]): VehicleFieldConfig | undefined => {
  for (const step of steps) {
    const field = step.fields.find(f => f.id === fieldId);
    if (field) return field;
  }
  return undefined;
};

// Helper function to validate a step
export const validateStep = (step: VehicleStepConfig, formData: Record<string, any>): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  step.fields.forEach(field => {
    const value = formData[field.id];
    
    // Check required fields
    if (field.required && (value === undefined || value === null || value === "" || (Array.isArray(value) && value.length === 0))) {
      errors[field.id] = `${field.label} is required`;
    }
    
    // Check conditional required fields
    if (field.condition && field.condition(formData) && !value) {
      errors[field.id] = `${field.label} is required`;
    }
    
    // Validate file types if applicable
    if (field.type === "file" && value && !Array.isArray(value)) {
      if (field.accept && value instanceof File) {
        const acceptedTypes = field.accept.split(',').map(type => type.trim());
        const fileExtension = value.name.split('.').pop()?.toLowerCase();
        const mimeType = value.type;
        
        const isValid = acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return `.${fileExtension}` === type;
          } else if (type.includes('/')) {
            return mimeType.startsWith(type.replace('*', ''));
          }
          return false;
        });
        
        if (!isValid) {
          errors[field.id] = `File type must be: ${field.accept}`;
        }
      }
    }
  });
  
  return errors;
};

// Helper function to get initial form data
export const getInitialFormData = (): Record<string, any> => {
  const initialData: Record<string, any> = {};
  
  vehicleFormSteps.forEach(step => {
    step.fields.forEach(field => {
      if (field.type === "checkbox") {
        initialData[field.id] = false;
      } else if (field.type === "file") {
        initialData[field.id] = field.multiple ? [] : null;
      } else {
        initialData[field.id] = "";
      }
    });
  });
  
  return initialData;
};