// data/carData.ts

import { VehicleDetails } from "@/components/pages/vehicle/view/VehicleDetails";


// ============ POPULAR CARS ============

export const popularCars = [
  {
    id: "1",
    name: "Koenigsegg",
    category: "Sport",
    image: "/car/car1.png",
    fuel: "90L",
    transmission: "Manual",
    capacity: "2 People",
    price: "₦45,000",
    originalPrice: "₦45,000",
    rating: 4.8,
    isFavorite: true,
  },
  {
    id: "2",
    name: "Nissan GT-R",
    category: "Sport",
    image: "/car/car2.png",
    fuel: "80L",
    transmission: "Manual",
    capacity: "2 People",
    price: "₦36,000",
    originalPrice: "₦45,000",
    rating: 4.7,
    isFavorite: false,
  },
  {
    id: "3",
    name: "Rolls-Royce",
    category: "Luxury",
    image: "/car/car3.png",
    fuel: "70L",
    transmission: "Manual",
    capacity: "4 People",
    price: "₦43,200",
    originalPrice: "₦45,000",
    rating: 4.9,
    isFavorite: true,
  },
  {
    id: "4",
    name: "Nissan GT-R",
    category: "Sport",
    image: "/car/car4.png",
    fuel: "80L",
    transmission: "Manual",
    capacity: "2 People",
    price: "₦36,000",
    originalPrice: "₦45,000",
    rating: 4.6,
    isFavorite: false,
  },
];

export const recommendedCars = [
  {
    id: "5",
    name: "All New Rush",
    category: "SUV",
    image: "/car/car5.png",
    fuel: "70L",
    transmission: "Manual",
    capacity: "6 People",
    price: "₦32,400",
    originalPrice: "₦36,000",
    rating: 4.5,
    isFavorite: false,
  },
  {
    id: "6",
    name: "CR-V",
    category: "SUV",
    image: "/car/car6.png",
    fuel: "80L",
    transmission: "Manual",
    capacity: "6 People",
    price: "₦36,000",
    originalPrice: "₦40,000",
    rating: 4.7,
    isFavorite: true,
  },
  {
    id: "7",
    name: "All New Terios",
    category: "SUV",
    image: "/car/car7.png",
    fuel: "90L",
    transmission: "Manual",
    capacity: "6 People",
    price: "₦33,300",
    originalPrice: "₦35,000",
    rating: 4.4,
    isFavorite: false,
  },
  {
    id: "8",
    name: "CR-V",
    category: "SUV",
    image: "/car/car8.png",
    fuel: "80L",
    transmission: "Manual",
    capacity: "6 People",
    price: "₦36,000",
    originalPrice: "₦40,000",
    rating: 4.7,
    isFavorite: true,
  },
  {
    id: "9",
    name: "MG ZX Exclusive",
    category: "Hatchback",
    image: "/car/car9.png",
    fuel: "70L",
    transmission: "Manual",
    capacity: "4 People",
    price: "₦34,200",
    originalPrice: "₦36,000",
    rating: 4.3,
    isFavorite: true,
  },
  {
    id: "10",
    name: "New MG ZS",
    category: "SUV",
    image: "/car/car10.png",
    fuel: "80L",
    transmission: "Manual",
    capacity: "6 People",
    price: "₦36,000",
    originalPrice: "₦38,000",
    rating: 4.6,
    isFavorite: false,
  },
  {
    id: "11",
    name: "MG ZX Excite",
    category: "Hatchback",
    image: "/car/car11.png",
    fuel: "90L",
    transmission: "Manual",
    capacity: "4 People",
    price: "₦33,300",
    originalPrice: "₦35,000",
    rating: 4.4,
    isFavorite: true,
  },
  {
    id: "12",
    name: "New MG ZS",
    category: "SUV",
    image: "/car/car12.png",
    fuel: "80L",
    transmission: "Manual",
    capacity: "6 People",
    price: "₦36,000",
    originalPrice: "₦38,000",
    rating: 4.5,
    isFavorite: false,
  },
];

// ============ MOCK VEHICLE DETAILS DATA ============

// Helper function to parse price string to number
const parsePrice = (priceString: string): number => {
  return parseInt(priceString.replace(/[₦,]/g, ''), 10);
};

// Helper function to parse capacity to number
const parseCapacity = (capacityString: string): number => {
  return parseInt(capacityString.split(' ')[0], 10);
};

// Helper function to parse fuel to number (liters)
const parseFuel = (fuelString: string): number => {
  return parseInt(fuelString.replace('L', ''), 10);
};

// Generate mock vehicle details for each car
export const mockVehicleDetails: Record<string, VehicleDetails> = {
  // Popular Cars
  "1": {
    id: "1",
    image: "/car/car1.png",
    name: "Koenigsegg",
    make: "Koenigsegg",
    model: "Agera RS",
    year: 2023,
    vehicleType: "sport",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 2,
    doors: 2,
    color: "Midnight Blue",
    plateNumber: "KNG-001-LAG",
    
    // Rental Rates
    dailyRate: parsePrice("₦45,000"),
    weeklyRate: parsePrice("₦270,000"),
    monthlyRate: parsePrice("₦990,000"),
    securityDeposit: parsePrice("₦150,000"),
    minimumRentalDays: 1,
    mileageIncluded: 200,
    excessMileageCharge: 300,
    
    // Location
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "123 Marina Road, Victoria Island",
    
    // Status & Verification
    status: "available",
    isVerified: true,
    isFeatured: true,
    nextAvailable: "Today",
    
    // Features
    features: [
      "Air Conditioning",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Carbon Fiber Body",
      "Ceramic Brakes",
      "Sport Exhaust",
      "Heated Seats",
      "Launch Control"
    ],
    
    // Media
    gallery: [
      "/car/car1.png",
      "/car/car1-side.png",
      "/car/car1-interior.png",
      "/car/car1-back.png"
    ],
    
    // Description
    description: `Experience the pinnacle of automotive engineering with this 2023 Koenigsegg Agera RS. 
    A masterpiece of Swedish craftsmanship, this hypercar delivers unparalleled performance and luxury. 
    With its lightweight carbon fiber construction and powerful V8 engine, it offers an extraordinary 
    driving experience that few cars can match. Perfect for special occasions, photoshoots, or experiencing 
    the ultimate in automotive excellence.`,
    
    // Specifications
    engine: "5.0L Twin-Turbo V8",
    horsepower: 1360,
    torque: 1011,
    drivetrain: "RWD",
    fuelCapacity: 90,
    mileage: 1200,
    
    // Insurance & Documents
    insuranceExpiry: new Date(2026, 11, 31),
    roadWorthinessExpiry: new Date(2026, 5, 15),
    registrationExpiry: new Date(2026, 8, 20),
    
    // Owner/Business Info
    businessId: "business-1",
    businessName: "Premium Car Rentals",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 801 234 5678",
    businessEmail: "info@premiumrentals.com",
    businessRating: 4.9,
    businessTotalReviews: 342,
    businessVerified: true,
    businessMemberSince: new Date(2020, 0, 15),
    
    // Reviews & Ratings
    rating: 4.8,
    totalReviews: 124,
    reviews: [
      {
        id: "rev-1",
        userId: "user-1",
        userName: "John Doe",
        userAvatar: "/api/placeholder/32/32",
        rating: 5,
        comment: "Absolutely incredible experience! The car was immaculate and performed flawlessly. Worth every naira!",
        date: new Date(2026, 2, 15),
        renterResponse: "Thank you John! We're glad you enjoyed the Koenigsegg experience."
      },
      {
        id: "rev-2",
        userId: "user-2",
        userName: "Sarah Smith",
        userAvatar: "/api/placeholder/32/32",
        rating: 5,
        comment: "Dream car rental made possible. The attention to detail and service was exceptional.",
        date: new Date(2026, 2, 10)
      }
    ],
    
    // Booking Stats
    bookingStats: {
      totalBookings: 42,
      revenue: parsePrice("₦45,000") * 42,
      utilizationRate: 78,
      averageDaysPerBooking: 1.5,
      repeatCustomers: 8
    },
    
    // Maintenance History
    maintenanceHistory: [
      {
        id: "maint-1",
        date: new Date(2026, 1, 15),
        type: "service",
        description: "Regular service and performance check",
        cost: 350000,
        completedBy: "Koenigsegg Certified",
        nextDue: new Date(2026, 4, 15)
      }
    ]
  },
  
  "2": {
    id: "2",
    image: "/car/car2.png",
    name: "Nissan GT-R",
    make: "Nissan",
    model: "GT-R",
    year: 2023,
    vehicleType: "sport",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 2,
    doors: 2,
    color: "Gun Metallic",
    plateNumber: "GTR-002-LAG",
    
    dailyRate: parsePrice("₦36,000"),
    weeklyRate: parsePrice("₦216,000"),
    monthlyRate: parsePrice("₦792,000"),
    securityDeposit: parsePrice("₦120,000"),
    minimumRentalDays: 1,
    mileageIncluded: 200,
    excessMileageCharge: 250,
    
    location: "Ikoyi, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "45 Bourdillon Road, Ikoyi",
    
    status: "available",
    isVerified: true,
    isFeatured: true,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Brembo Brakes",
      "Launch Control",
      "BOSE Sound System",
      "Heated Seats",
      "Carbon Fiber Spoiler"
    ],
    
    gallery: [
      "/car/car2.png",
      "/car/car2-side.png",
      "/car/car2-interior.png",
      "/car/car2-back.png"
    ],
    
    description: `Unleash the legendary performance of the Nissan GT-R. Known as "Godzilla," this 2023 model 
    continues the legacy with exceptional handling and breathtaking acceleration. The iconic supercar 
    killer features advanced all-wheel drive and a twin-turbo V6 that delivers thrilling performance 
    while maintaining daily usability. Perfect for enthusiasts who want to experience Japanese 
    engineering excellence.`,
    
    engine: "3.8L Twin-Turbo V6",
    horsepower: 565,
    torque: 467,
    drivetrain: "AWD",
    fuelCapacity: 80,
    mileage: 8500,
    
    insuranceExpiry: new Date(2026, 10, 30),
    roadWorthinessExpiry: new Date(2026, 4, 20),
    registrationExpiry: new Date(2026, 7, 15),
    
    businessId: "business-1",
    businessName: "Premium Car Rentals",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 801 234 5678",
    businessEmail: "info@premiumrentals.com",
    businessRating: 4.9,
    businessTotalReviews: 342,
    businessVerified: true,
    businessMemberSince: new Date(2020, 0, 15),
    
    rating: 4.7,
    totalReviews: 89,
    reviews: [
      {
        id: "rev-3",
        userId: "user-3",
        userName: "Mike Johnson",
        rating: 5,
        comment: "The GT-R is a beast! Handles like it's on rails. Amazing experience.",
        date: new Date(2026, 2, 5)
      }
    ],
    
    bookingStats: {
      totalBookings: 31,
      revenue: parsePrice("₦36,000") * 31,
      utilizationRate: 72,
      averageDaysPerBooking: 2.1,
      repeatCustomers: 7
    },
    
    maintenanceHistory: [
      {
        id: "maint-2",
        date: new Date(2026, 0, 20),
        type: "service",
        description: "Oil change and performance check",
        cost: 85000,
        completedBy: "Nissan Performance Center",
        nextDue: new Date(2026, 3, 20)
      }
    ]
  },
  
  "3": {
    id: "3",
    image: "/car/car3.png",
    name: "Rolls-Royce",
    make: "Rolls-Royce",
    model: "Ghost",
    year: 2023,
    vehicleType: "luxury",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 4,
    doors: 4,
    color: "Arctic White",
    plateNumber: "RR-003-LAG",
    
    dailyRate: parsePrice("₦43,200"),
    weeklyRate: parsePrice("₦259,200"),
    monthlyRate: parsePrice("₦950,400"),
    securityDeposit: parsePrice("₦200,000"),
    minimumRentalDays: 2,
    mileageIncluded: 150,
    excessMileageCharge: 400,
    
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "88 Ahmadu Bello Way, Victoria Island",
    
    status: "booked",
    isVerified: true,
    isFeatured: true,
    nextAvailable: "in 3 days",
    
    features: [
      "Air Conditioning",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Massage Seats",
      "Starlight Headliner",
      "Rear Entertainment",
      "Champagne Cooler",
      "Umbrella Set"
    ],
    
    gallery: [
      "/car/car3.png",
      "/car/car3-side.png",
      "/car/car3-interior.png",
      "/car/car3-back.png"
    ],
    
    description: `Experience the pinnacle of luxury with this Rolls-Royce Ghost. Every detail is crafted 
    to perfection, from the hand-stitched leather to the iconic Spirit of Ecstasy. The legendary 
    silent ride and effortless power make every journey extraordinary. Whether for a wedding, 
    corporate event, or special occasion, arrive in unparalleled style and sophistication.`,
    
    engine: "6.75L Twin-Turbo V12",
    horsepower: 563,
    torque: 627,
    drivetrain: "AWD",
    fuelCapacity: 70,
    mileage: 3200,
    
    insuranceExpiry: new Date(2026, 9, 30),
    roadWorthinessExpiry: new Date(2026, 3, 15),
    registrationExpiry: new Date(2026, 6, 10),
    
    businessId: "business-1",
    businessName: "Premium Car Rentals",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 801 234 5678",
    businessEmail: "info@premiumrentals.com",
    businessRating: 4.9,
    businessTotalReviews: 342,
    businessVerified: true,
    businessMemberSince: new Date(2020, 0, 15),
    
    rating: 4.9,
    totalReviews: 56,
    reviews: [
      {
        id: "rev-4",
        userId: "user-4",
        userName: "Emily Brown",
        rating: 5,
        comment: "Pure luxury! Made my wedding day absolutely perfect. The service was impeccable.",
        date: new Date(2026, 1, 28)
      }
    ],
    
    bookingStats: {
      totalBookings: 24,
      revenue: parsePrice("₦43,200") * 24,
      utilizationRate: 85,
      averageDaysPerBooking: 2.8,
      repeatCustomers: 5
    },
    
    maintenanceHistory: [
      {
        id: "maint-3",
        date: new Date(2026, 1, 10),
        type: "service",
        description: "Comprehensive detail and maintenance",
        cost: 120000,
        completedBy: "Rolls-Royce Bespoke Service",
        nextDue: new Date(2026, 4, 10)
      }
    ]
  },
  
  "4": {
    id: "4",
    image: "/car/car4.png",
    name: "Nissan GT-R",
    make: "Nissan",
    model: "GT-R Nismo",
    year: 2023,
    vehicleType: "sport",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 2,
    doors: 2,
    color: "Pearl White",
    plateNumber: "GTR-004-LAG",
    
    dailyRate: parsePrice("₦36,000"),
    weeklyRate: parsePrice("₦216,000"),
    monthlyRate: parsePrice("₦792,000"),
    securityDeposit: parsePrice("₦120,000"),
    minimumRentalDays: 1,
    mileageIncluded: 200,
    excessMileageCharge: 250,
    
    location: "Lekki, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "12 Admiralty Way, Lekki Phase 1",
    
    status: "available",
    isVerified: true,
    isFeatured: false,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Nismo Tuning",
      "Racing Seats",
      "Carbon Fiber Body",
      "Track Mode",
      "Data Logger"
    ],
    
    gallery: [
      "/car/car4.png",
      "/car/car4-side.png",
      "/car/car4-interior.png",
      "/car/car4-back.png"
    ],
    
    description: `The Nissan GT-R Nismo represents the pinnacle of GT-R performance. With extensive 
    track-focused enhancements, carbon fiber aero components, and specially tuned suspension, 
    this is the ultimate driving machine. Perfect for track days or experiencing the full 
    potential of Japanese engineering.`,
    
    engine: "3.8L Twin-Turbo V6",
    horsepower: 600,
    torque: 481,
    drivetrain: "AWD",
    fuelCapacity: 80,
    mileage: 5200,
    
    insuranceExpiry: new Date(2026, 8, 25),
    roadWorthinessExpiry: new Date(2026, 2, 18),
    registrationExpiry: new Date(2026, 5, 22),
    
    businessId: "business-1",
    businessName: "Premium Car Rentals",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 801 234 5678",
    businessEmail: "info@premiumrentals.com",
    businessRating: 4.9,
    businessTotalReviews: 342,
    businessVerified: true,
    businessMemberSince: new Date(2020, 0, 15),
    
    rating: 4.6,
    totalReviews: 45,
    reviews: [
      {
        id: "rev-5",
        userId: "user-5",
        userName: "David Wilson",
        rating: 4.5,
        comment: "Amazing performance! The Nismo package makes a huge difference on track.",
        date: new Date(2026, 1, 18)
      }
    ],
    
    bookingStats: {
      totalBookings: 19,
      revenue: parsePrice("₦36,000") * 19,
      utilizationRate: 65,
      averageDaysPerBooking: 1.8,
      repeatCustomers: 4
    },
    
    maintenanceHistory: [
      {
        id: "maint-4",
        date: new Date(2026, 0, 5),
        type: "service",
        description: "Nismo performance check",
        cost: 95000,
        completedBy: "Nismo Certified",
        nextDue: new Date(2026, 3, 5)
      }
    ]
  },
  
  // Recommended Cars
  "5": {
    id: "5",
    image: "/car/car5.png",
    name: "All New Rush",
    make: "Toyota",
    model: "Rush",
    year: 2023,
    vehicleType: "suv",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 6,
    doors: 4,
    color: "Black",
    plateNumber: "RUSH-005-LAG",
    
    dailyRate: parsePrice("₦32,400"),
    weeklyRate: parsePrice("₦194,400"),
    monthlyRate: parsePrice("₦712,800"),
    securityDeposit: parsePrice("₦80,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "78 Allen Avenue, Ikeja",
    
    status: "available",
    isVerified: true,
    isFeatured: false,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Third Row Seating",
      "Roof Rails",
      "USB Charging",
      "Hill Start Assist"
    ],
    
    gallery: [
      "/car/car5.png",
      "/car/car5-side.png",
      "/car/car5-interior.png",
      "/car/car5-back.png"
    ],
    
    description: `The All New Toyota Rush combines SUV capability with family-friendly practicality. 
    With seven-seat capacity, efficient engine, and modern features, it's the perfect companion 
    for family outings, group travel, or weekend adventures. Spacious, reliable, and economical.`,
    
    engine: "1.5L 4-Cylinder",
    horsepower: 104,
    torque: 102,
    drivetrain: "RWD",
    fuelCapacity: 70,
    mileage: 12500,
    
    insuranceExpiry: new Date(2026, 7, 15),
    roadWorthinessExpiry: new Date(2026, 1, 28),
    registrationExpiry: new Date(2026, 4, 30),
    
    businessId: "business-2",
    businessName: "Family Rentals NG",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 802 345 6789",
    businessEmail: "bookings@familyrentals.ng",
    businessRating: 4.7,
    businessTotalReviews: 215,
    businessVerified: true,
    businessMemberSince: new Date(2021, 3, 10),
    
    rating: 4.5,
    totalReviews: 67,
    reviews: [
      {
        id: "rev-6",
        userId: "user-6",
        userName: "Chioma Okafor",
        rating: 4.5,
        comment: "Great family car, spacious and comfortable for long trips.",
        date: new Date(2026, 2, 12)
      }
    ],
    
    bookingStats: {
      totalBookings: 38,
      revenue: parsePrice("₦32,400") * 38,
      utilizationRate: 82,
      averageDaysPerBooking: 3.5,
      repeatCustomers: 15
    },
    
    maintenanceHistory: [
      {
        id: "maint-5",
        date: new Date(2026, 1, 20),
        type: "service",
        description: "Routine maintenance",
        cost: 45000,
        completedBy: "Toyota Service Center",
        nextDue: new Date(2026, 4, 20)
      }
    ]
  },
  
  "6": {
    id: "6",
    image: "/car/car6.png",
    name: "CR-V",
    make: "Honda",
    model: "CR-V",
    year: 2023,
    vehicleType: "suv",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 6,
    doors: 4,
    color: "Silver",
    plateNumber: "CRV-006-LAG",
    
    dailyRate: parsePrice("₦36,000"),
    weeklyRate: parsePrice("₦216,000"),
    monthlyRate: parsePrice("₦792,000"),
    securityDeposit: parsePrice("₦90,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Surulere, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "23 Bode Thomas Street, Surulere",
    
    status: "available",
    isVerified: true,
    isFeatured: true,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Apple CarPlay",
      "Android Auto",
      "Panoramic Roof",
      "Heated Seats",
      "Honda Sensing"
    ],
    
    gallery: [
      "/car/car6.png",
      "/car/car6-side.png",
      "/car/car6-interior.png",
      "/car/car6-back.png"
    ],
    
    description: `The Honda CR-V sets the standard for compact SUVs with its perfect balance of style, 
    versatility, and efficiency. Featuring Honda Sensing safety suite and innovative storage solutions, 
    it's ideal for families and professionals alike. Comfortable, reliable, and packed with technology.`,
    
    engine: "1.5L Turbo 4-Cylinder",
    horsepower: 190,
    torque: 179,
    drivetrain: "AWD",
    fuelCapacity: 80,
    mileage: 9800,
    
    insuranceExpiry: new Date(2026, 6, 20),
    roadWorthinessExpiry: new Date(2026, 0, 15),
    registrationExpiry: new Date(2026, 3, 25),
    
    businessId: "business-2",
    businessName: "Family Rentals NG",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 802 345 6789",
    businessEmail: "bookings@familyrentals.ng",
    businessRating: 4.7,
    businessTotalReviews: 215,
    businessVerified: true,
    businessMemberSince: new Date(2021, 3, 10),
    
    rating: 4.7,
    totalReviews: 82,
    reviews: [
      {
        id: "rev-7",
        userId: "user-7",
        userName: "Adebayo Adeyemi",
        rating: 5,
        comment: "Excellent SUV, very smooth ride and great fuel economy.",
        date: new Date(2026, 2, 8)
      }
    ],
    
    bookingStats: {
      totalBookings: 45,
      revenue: parsePrice("₦36,000") * 45,
      utilizationRate: 79,
      averageDaysPerBooking: 3.2,
      repeatCustomers: 18
    },
    
    maintenanceHistory: [
      {
        id: "maint-6",
        date: new Date(2026, 0, 25),
        type: "service",
        description: "Oil change and inspection",
        cost: 55000,
        completedBy: "Honda Service Center",
        nextDue: new Date(2026, 3, 25)
      }
    ]
  },
  
  "7": {
    id: "7",
    image: "/car/car7.png",
    name: "All New Terios",
    make: "Daihatsu",
    model: "Terios",
    year: 2023,
    vehicleType: "suv",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 6,
    doors: 4,
    color: "Red",
    plateNumber: "TER-007-LAG",
    
    dailyRate: parsePrice("₦33,300"),
    weeklyRate: parsePrice("₦199,800"),
    monthlyRate: parsePrice("₦732,600"),
    securityDeposit: parsePrice("₦85,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Ajah, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "56 Freedom Way, Ajah",
    
    status: "available",
    isVerified: true,
    isFeatured: false,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Third Row Seating",
      "Roof Rails",
      "USB Charging",
      "Hill Start Assist"
    ],
    
    gallery: [
      "/car/car7.png",
      "/car/car7-side.png",
      "/car/car7-interior.png",
      "/car/car7-back.png"
    ],
    
    description: `The All New Terios offers exceptional value in the compact SUV segment. With its 
    commanding driving position, flexible seating arrangements, and efficient engine, it's perfect 
    for urban driving and weekend getaways. Practical, affordable, and surprisingly spacious.`,
    
    engine: "1.5L 4-Cylinder",
    horsepower: 102,
    torque: 100,
    drivetrain: "RWD",
    fuelCapacity: 90,
    mileage: 11200,
    
    insuranceExpiry: new Date(2026, 5, 10),
    roadWorthinessExpiry: new Date(2026, 2, 5),
    registrationExpiry: new Date(2026, 6, 15),
    
    businessId: "business-2",
    businessName: "Family Rentals NG",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 802 345 6789",
    businessEmail: "bookings@familyrentals.ng",
    businessRating: 4.7,
    businessTotalReviews: 215,
    businessVerified: true,
    businessMemberSince: new Date(2021, 3, 10),
    
    rating: 4.4,
    totalReviews: 38,
    reviews: [
      {
        id: "rev-8",
        userId: "user-8",
        userName: "Nkechi Eze",
        rating: 4,
        comment: "Good value for money, comfortable for a family of 5.",
        date: new Date(2026, 1, 22)
      }
    ],
    
    bookingStats: {
      totalBookings: 28,
      revenue: parsePrice("₦33,300") * 28,
      utilizationRate: 71,
      averageDaysPerBooking: 2.9,
      repeatCustomers: 9
    },
    
    maintenanceHistory: [
      {
        id: "maint-7",
        date: new Date(2025, 11, 15),
        type: "service",
        description: "Regular maintenance",
        cost: 40000,
        completedBy: "Daihatsu Service",
        nextDue: new Date(2026, 2, 15)
      }
    ]
  },
  
  "8": {
    id: "8",
    image: "/car/car8.png",
    name: "CR-V",
    make: "Honda",
    model: "CR-V",
    year: 2023,
    vehicleType: "suv",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 6,
    doors: 4,
    color: "White",
    plateNumber: "CRV-008-LAG",
    
    dailyRate: parsePrice("₦36,000"),
    weeklyRate: parsePrice("₦216,000"),
    monthlyRate: parsePrice("₦792,000"),
    securityDeposit: parsePrice("₦90,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "150 Ahmadu Bello Way, Victoria Island",
    
    status: "booked",
    isVerified: true,
    isFeatured: true,
    nextAvailable: "in 2 days",
    
    features: [
      "Air Conditioning",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Apple CarPlay",
      "Android Auto",
      "Panoramic Roof",
      "Heated Seats",
      "Honda Sensing"
    ],
    
    gallery: [
      "/car/car8.png",
      "/car/car8-side.png",
      "/car/car8-interior.png",
      "/car/car8-back.png"
    ],
    
    description: `Another pristine Honda CR-V ready for your adventures. This popular SUV continues 
    to impress with its refined driving dynamics, upscale interior, and class-leading resale value. 
    Whether for business or pleasure, the CR-V delivers a premium experience at a reasonable price.`,
    
    engine: "1.5L Turbo 4-Cylinder",
    horsepower: 190,
    torque: 179,
    drivetrain: "AWD",
    fuelCapacity: 80,
    mileage: 8900,
    
    insuranceExpiry: new Date(2026, 4, 18),
    roadWorthinessExpiry: new Date(2026, 1, 10),
    registrationExpiry: new Date(2026, 5, 12),
    
    businessId: "business-2",
    businessName: "Family Rentals NG",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 802 345 6789",
    businessEmail: "bookings@familyrentals.ng",
    businessRating: 4.7,
    businessTotalReviews: 215,
    businessVerified: true,
    businessMemberSince: new Date(2021, 3, 10),
    
    rating: 4.7,
    totalReviews: 53,
    reviews: [
      {
        id: "rev-9",
        userId: "user-9",
        userName: "Funmi Adebayo",
        rating: 5,
        comment: "Excellent condition, very clean and well-maintained.",
        date: new Date(2026, 2, 1)
      }
    ],
    
    bookingStats: {
      totalBookings: 32,
      revenue: parsePrice("₦36,000") * 32,
      utilizationRate: 84,
      averageDaysPerBooking: 3.4,
      repeatCustomers: 14
    },
    
    maintenanceHistory: [
      {
        id: "maint-8",
        date: new Date(2026, 0, 8),
        type: "service",
        description: "Oil change and tire rotation",
        cost: 55000,
        completedBy: "Honda Service Center",
        nextDue: new Date(2026, 3, 8)
      }
    ]
  },
  
  "9": {
    id: "9",
    image: "/car/car9.png",
    name: "MG ZX Exclusive",
    make: "MG",
    model: "ZX Exclusive",
    year: 2023,
    vehicleType: "hatchback",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 4,
    doors: 4,
    color: "Blue",
    plateNumber: "MG-009-LAG",
    
    dailyRate: parsePrice("₦34,200"),
    weeklyRate: parsePrice("₦205,200"),
    monthlyRate: parsePrice("₦752,400"),
    securityDeposit: parsePrice("₦75,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Ikeja, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "34 Obafemi Awolowo Way, Ikeja",
    
    status: "available",
    isVerified: true,
    isFeatured: true,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Navigation System",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Apple CarPlay",
      "Android Auto",
      "Sunroof",
      "Leather Seats",
      "Premium Sound"
    ],
    
    gallery: [
      "/car/car9.png",
      "/car/car9-side.png",
      "/car/car9-interior.png",
      "/car/car9-back.png"
    ],
    
    description: `The MG ZX Exclusive represents the best of British automotive design with modern 
    technology and style. This stylish hatchback offers a premium interior, impressive features list, 
    and engaging driving dynamics. Perfect for professionals who appreciate style and substance.`,
    
    engine: "1.5L 4-Cylinder",
    horsepower: 114,
    torque: 110,
    drivetrain: "FWD",
    fuelCapacity: 70,
    mileage: 6800,
    
    insuranceExpiry: new Date(2026, 3, 25),
    roadWorthinessExpiry: new Date(2026, 0, 20),
    registrationExpiry: new Date(2026, 4, 18),
    
    businessId: "business-3",
    businessName: "AutoRent Nigeria",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 803 456 7890",
    businessEmail: "rentals@autorent.ng",
    businessRating: 4.6,
    businessTotalReviews: 178,
    businessVerified: true,
    businessMemberSince: new Date(2021, 6, 22),
    
    rating: 4.3,
    totalReviews: 41,
    reviews: [
      {
        id: "rev-10",
        userId: "user-10",
        userName: "Tunde Bakare",
        rating: 4,
        comment: "Nice car, very modern features and comfortable ride.",
        date: new Date(2026, 2, 14)
      }
    ],
    
    bookingStats: {
      totalBookings: 27,
      revenue: parsePrice("₦34,200") * 27,
      utilizationRate: 73,
      averageDaysPerBooking: 2.5,
      repeatCustomers: 8
    },
    
    maintenanceHistory: [
      {
        id: "maint-9",
        date: new Date(2026, 1, 5),
        type: "service",
        description: "Regular maintenance",
        cost: 48000,
        completedBy: "MG Service Center",
        nextDue: new Date(2026, 4, 5)
      }
    ]
  },
  
  "10": {
    id: "10",
    image: "/car/car10.png",
    name: "New MG ZS",
    make: "MG",
    model: "ZS",
    year: 2023,
    vehicleType: "suv",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 6,
    doors: 4,
    color: "Red",
    plateNumber: "MGZS-010-LAG",
    
    dailyRate: parsePrice("₦36,000"),
    weeklyRate: parsePrice("₦216,000"),
    monthlyRate: parsePrice("₦792,000"),
    securityDeposit: parsePrice("₦85,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Lekki, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "92 Chevron Drive, Lekki",
    
    status: "available",
    isVerified: true,
    isFeatured: false,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Apple CarPlay",
      "Android Auto",
      "Roof Rails",
      "USB Charging"
    ],
    
    gallery: [
      "/car/car10.png",
      "/car/car10-side.png",
      "/car/car10-interior.png",
      "/car/car10-back.png"
    ],
    
    description: `The New MG ZS combines SUV practicality with contemporary style. With its bold grille, 
    sleek lines, and spacious interior, it's designed to stand out. The ZS offers excellent value with 
    a comprehensive feature set and distinctive British design language.`,
    
    engine: "1.5L 4-Cylinder",
    horsepower: 114,
    torque: 110,
    drivetrain: "FWD",
    fuelCapacity: 80,
    mileage: 7500,
    
    insuranceExpiry: new Date(2026, 2, 28),
    roadWorthinessExpiry: new Date(2025, 11, 15),
    registrationExpiry: new Date(2026, 2, 10),
    
    businessId: "business-3",
    businessName: "AutoRent Nigeria",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 803 456 7890",
    businessEmail: "rentals@autorent.ng",
    businessRating: 4.6,
    businessTotalReviews: 178,
    businessVerified: true,
    businessMemberSince: new Date(2021, 6, 22),
    
    rating: 4.6,
    totalReviews: 35,
    reviews: [
      {
        id: "rev-11",
        userId: "user-11",
        userName: "Kayode Martins",
        rating: 4.5,
        comment: "Good SUV, very responsive and fuel efficient.",
        date: new Date(2026, 2, 5)
      }
    ],
    
    bookingStats: {
      totalBookings: 23,
      revenue: parsePrice("₦36,000") * 23,
      utilizationRate: 68,
      averageDaysPerBooking: 2.7,
      repeatCustomers: 6
    },
    
    maintenanceHistory: [
      {
        id: "maint-10",
        date: new Date(2026, 0, 12),
        type: "service",
        description: "Oil change and checkup",
        cost: 45000,
        completedBy: "MG Service Center",
        nextDue: new Date(2026, 3, 12)
      }
    ]
  },
  
  "11": {
    id: "11",
    image: "/car/car11.png",
    name: "MG ZX Excite",
    make: "MG",
    model: "ZX Excite",
    year: 2023,
    vehicleType: "hatchback",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 4,
    doors: 4,
    color: "White",
    plateNumber: "MGZX-011-LAG",
    
    dailyRate: parsePrice("₦33,300"),
    weeklyRate: parsePrice("₦199,800"),
    monthlyRate: parsePrice("₦732,600"),
    securityDeposit: parsePrice("₦75,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Surulere, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "45 Adelabu Street, Surulere",
    
    status: "available",
    isVerified: true,
    isFeatured: true,
    nextAvailable: "Today",
    
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Apple CarPlay",
      "Android Auto",
      "Sunroof",
      "Leather Seats"
    ],
    
    gallery: [
      "/car/car11.png",
      "/car/car11-side.png",
      "/car/car11-interior.png",
      "/car/car11-back.png"
    ],
    
    description: `The MG ZX Excite offers a compelling package of style, technology, and value. 
    This well-equipped hatchback features MG's latest infotainment system, comfortable seating, 
    and a peppy engine that makes city driving a pleasure. Ideal for young professionals and small families.`,
    
    engine: "1.5L 4-Cylinder",
    horsepower: 114,
    torque: 110,
    drivetrain: "FWD",
    fuelCapacity: 90,
    mileage: 8200,
    
    insuranceExpiry: new Date(2026, 1, 14),
    roadWorthinessExpiry: new Date(2025, 10, 22),
    registrationExpiry: new Date(2026, 1, 28),
    
    businessId: "business-3",
    businessName: "AutoRent Nigeria",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 803 456 7890",
    businessEmail: "rentals@autorent.ng",
    businessRating: 4.6,
    businessTotalReviews: 178,
    businessVerified: true,
    businessMemberSince: new Date(2021, 6, 22),
    
    rating: 4.4,
    totalReviews: 29,
    reviews: [
      {
        id: "rev-12",
        userId: "user-12",
        userName: "Blessing Okonkwo",
        rating: 4.5,
        comment: "Very stylish car, got many compliments. Great value!",
        date: new Date(2026, 1, 28)
      }
    ],
    
    bookingStats: {
      totalBookings: 21,
      revenue: parsePrice("₦33,300") * 21,
      utilizationRate: 64,
      averageDaysPerBooking: 2.3,
      repeatCustomers: 5
    },
    
    maintenanceHistory: [
      {
        id: "maint-11",
        date: new Date(2025, 11, 18),
        type: "service",
        description: "Regular maintenance",
        cost: 42000,
        completedBy: "MG Service Center",
        nextDue: new Date(2026, 2, 18)
      }
    ]
  },
  
  "12": {
    id: "12",
    image: "/car/car12.png",
    name: "New MG ZS",
    make: "MG",
    model: "ZS",
    year: 2023,
    vehicleType: "suv",
    fuelType: "Petrol",
    transmission: "Manual",
    seats: 6,
    doors: 4,
    color: "Black",
    plateNumber: "MGZS-012-LAG",
    
    dailyRate: parsePrice("₦36,000"),
    weeklyRate: parsePrice("₦216,000"),
    monthlyRate: parsePrice("₦792,000"),
    securityDeposit: parsePrice("₦85,000"),
    minimumRentalDays: 1,
    mileageIncluded: 250,
    excessMileageCharge: 150,
    
    location: "Victoria Island, Lagos",
    city: "Lagos",
    state: "Lagos",
    address: "200A Sanusi Fafunwa Street, VI",
    
    status: "booked",
    isVerified: true,
    isFeatured: false,
    nextAvailable: "in 4 days",
    
    features: [
      "Air Conditioning",
      "Bluetooth",
      "Backup Camera",
      "Keyless Entry",
      "Apple CarPlay",
      "Android Auto",
      "Roof Rails",
      "USB Charging"
    ],
    
    gallery: [
      "/car/car12.png",
      "/car/car12-side.png",
      "/car/car12-interior.png",
      "/car/car12-back.png"
    ],
    
    description: `Another example of the popular MG ZS, this black edition adds a touch of sophistication 
    to the already impressive SUV package. With its commanding presence and practical features, it's 
    ready for any adventure. Experience modern British design with African spirit.`,
    
    engine: "1.5L 4-Cylinder",
    horsepower: 114,
    torque: 110,
    drivetrain: "FWD",
    fuelCapacity: 80,
    mileage: 7100,
    
    insuranceExpiry: new Date(2026, 2, 5),
    roadWorthinessExpiry: new Date(2025, 12, 10),
    registrationExpiry: new Date(2026, 2, 15),
    
    businessId: "business-3",
    businessName: "AutoRent Nigeria",
    businessLogo: "/api/placeholder/64/64",
    businessPhone: "+234 803 456 7890",
    businessEmail: "rentals@autorent.ng",
    businessRating: 4.6,
    businessTotalReviews: 178,
    businessVerified: true,
    businessMemberSince: new Date(2021, 6, 22),
    
    rating: 4.5,
    totalReviews: 31,
    reviews: [
      {
        id: "rev-13",
        userId: "user-13",
        userName: "Segun Oluwole",
        rating: 4.5,
        comment: "Smooth ride and good fuel economy. Perfect for family trips.",
        date: new Date(2026, 2, 3)
      }
    ],
    
    bookingStats: {
      totalBookings: 22,
      revenue: parsePrice("₦36,000") * 22,
      utilizationRate: 77,
      averageDaysPerBooking: 2.9,
      repeatCustomers: 7
    },
    
    maintenanceHistory: [
      {
        id: "maint-12",
        date: new Date(2026, 0, 30),
        type: "service",
        description: "Oil change and inspection",
        cost: 45000,
        completedBy: "MG Service Center",
        nextDue: new Date(2026, 3, 30)
      }
    ]
  }
};

// Helper function to get vehicle by ID
export const getVehicleById = (id: string): VehicleDetails | undefined => {
  return mockVehicleDetails[id];
};

// Helper function to get all vehicles
export const getAllVehicles = (): VehicleDetails[] => {
  return Object.values(mockVehicleDetails);
};

// Helper function to get vehicles by business ID
export const getVehiclesByBusinessId = (businessId: string): VehicleDetails[] => {
  return Object.values(mockVehicleDetails).filter(
    vehicle => vehicle.businessId === businessId
  );
};

// Helper function to get vehicles by status
export const getVehiclesByStatus = (status: VehicleDetails['status']): VehicleDetails[] => {
  return Object.values(mockVehicleDetails).filter(
    vehicle => vehicle.status === status
  );
};

// Helper function to get vehicles by type
export const getVehiclesByType = (type: string): VehicleDetails[] => {
  return Object.values(mockVehicleDetails).filter(
    vehicle => vehicle.vehicleType === type
  );
};

// Helper function to get available vehicles
export const getAvailableVehicles = (): VehicleDetails[] => {
  return Object.values(mockVehicleDetails).filter(
    vehicle => vehicle.status === 'available'
  );
};

// Export all cars combined
export const allCars = [...popularCars, ...recommendedCars];