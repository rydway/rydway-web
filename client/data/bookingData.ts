export interface BookingData {
  id: string;
  carImage: string;
  carName: string;
  carType: string;
  ownerName: string;
  renterName?: string; // For business view
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalDays: number;
  totalAmount: number;
  status: 'requested' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  category?: 'active' | 'requested' | 'past'; // For filtering
}

export interface BookingDetailsData extends BookingData {
  carId: string;
  renterId: string;
  renterAvatar?: string;
  renterPhone: string;
  ownerId: string;
  ownerPhone: string;
  pickupTime: string;
  dropoffTime: string;
  dailyRate: number;
  createdAt: string;
  extras: {
    insurance: boolean;
    gps: boolean;
    childSeat: boolean;
  };
  notes?: string;
  currentLocation?: string;
  fuelLevel?: number;
  mileage?: number;
  estimatedDistance?: number;
  estimatedTime?: string;
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    coverageAmount: number;
  };
  documents?: {
    rentalAgreement: string;
    paymentReceipt: string;
    insuranceCertificate: string;
    inspectionReport: string;
  };
  timeline?: Array<{
    event: string;
    date: string;
    time: string;
    description: string;
    icon: string;
  }>;
  rating?: {
    carCondition: number;
    cleanliness: number;
    ownerService: number;
    overall: number;
    comment?: string;
  };
}

// Consolidated bookings array with all bookings
export const allBookings: BookingData[] = [
  {
    id: "RB001",
    carImage: "/car/car1.png",
    carName: "Toyota Camry 2022",
    carType: "Sedan",
    ownerName: "Premium Fleet",
    startDate: "Mar 15",
    endDate: "Mar 18",
    pickupLocation: "Abuja Airport",
    dropoffLocation: "Wuse II",
    totalDays: 3,
    totalAmount: 105000,
    status: "active",
    paymentStatus: "paid",
    category: "active"
  },
  {
    id: "RB002",
    carImage: "/car/car2.png",
    carName: "Lexus RX350",
    carType: "SUV",
    ownerName: "Elite Cars",
    startDate: "Mar 20",
    endDate: "Mar 25",
    pickupLocation: "Maitama",
    dropoffLocation: "Gwarimpa",
    totalDays: 5,
    totalAmount: 225000,
    status: "confirmed",
    paymentStatus: "paid",
    category: "requested"
  },
  {
    id: "RB003",
    carImage: "/car/car3.png",
    carName: "Mercedes C300",
    carType: "Luxury",
    ownerName: "Luxury Rentals",
    startDate: "Mar 22",
    endDate: "Mar 24",
    pickupLocation: "Lagos Airport",
    dropoffLocation: "Victoria Island",
    totalDays: 2,
    totalAmount: 110000,
    status: "active",
    paymentStatus: "paid",
    category: "active"
  },
  {
    id: "RB004",
    carImage: "/car/car4.png",
    carName: "BMW X5",
    carType: "SUV",
    ownerName: "Premium Fleet",
    startDate: "Mar 28",
    endDate: "Mar 30",
    pickupLocation: "Port Harcourt",
    dropoffLocation: "City Center",
    totalDays: 2,
    totalAmount: 100000,
    status: "confirmed",
    paymentStatus: "paid",
    category: "requested"
  },
  {
    id: "RB005",
    carImage: "/car/car5.png",
    carName: "Audi Q7",
    carType: "SUV",
    ownerName: "Elite Cars",
    startDate: "Apr 1",
    endDate: "Apr 5",
    pickupLocation: "Abuja",
    dropoffLocation: "Kaduna",
    totalDays: 4,
    totalAmount: 280000,
    status: "confirmed",
    paymentStatus: "paid",
    category: "requested"
  },
  {
    id: "RB006",
    carImage: "/car/car6.png",
    carName: "Range Rover Sport",
    carType: "SUV",
    ownerName: "Luxury Rentals",
    startDate: "Apr 3",
    endDate: "Apr 7",
    pickupLocation: "Victoria Island",
    dropoffLocation: "Lekki",
    totalDays: 4,
    totalAmount: 350000,
    status: "active",
    paymentStatus: "paid",
    category: "active"
  },
  {
    id: "RB007",
    carImage: "/car/car7.png",
    carName: "Honda Accord 2023",
    carType: "Sedan",
    ownerName: "Premium Fleet",
    startDate: "Apr 5",
    endDate: "Apr 8",
    pickupLocation: "GRA",
    dropoffLocation: "City Center",
    totalDays: 3,
    totalAmount: 120000,
    status: "confirmed",
    paymentStatus: "pending",
    category: "requested"
  },
  {
    id: "RB008",
    carImage: "/car/car8.png",
    carName: "Tesla Model 3",
    carType: "Electric",
    ownerName: "Modern Fleet",
    startDate: "Apr 10",
    endDate: "Apr 11",
    pickupLocation: "Ikoyi",
    dropoffLocation: "Airport",
    totalDays: 1,
    totalAmount: 95000,
    status: "requested",
    paymentStatus: "pending",
    category: "requested"
  },
  {
    id: "RB009",
    carImage: "/car/car9.png",
    carName: "BMW X5",
    carType: "SUV",
    ownerName: "Premium Fleet",
    startDate: "Feb 10",
    endDate: "Feb 15",
    pickupLocation: "Port Harcourt",
    dropoffLocation: "City Center",
    totalDays: 5,
    totalAmount: 250000,
    status: "completed",
    paymentStatus: "paid",
    category: "past"
  },
  {
    id: "RB010",
    carImage: "/car/car10.png",
    carName: "Range Rover Sport",
    carType: "SUV",
    ownerName: "Luxury Rentals",
    startDate: "Jan 20",
    endDate: "Jan 25",
    pickupLocation: "Lagos",
    dropoffLocation: "Ibadan",
    totalDays: 5,
    totalAmount: 275000,
    status: "completed",
    paymentStatus: "paid",
    category: "past"
  }
];

// Filter helper functions
export const getActiveBookings = () => allBookings.filter(b => b.category === 'active');
export const getRequestedBookings = () => allBookings.filter(b => b.category === 'requested');
export const getPastBookings = () => allBookings.filter(b => b.category === 'past');
export const getBookingById = (id: string) => allBookings.find(b => b.id === id);

// Detailed booking data for each booking
export const bookingDetails: Record<string, BookingDetailsData> = {
  RB001: {
    id: "RB001",
    carId: "C001",
    carImage: "/car/car1.png",
    carName: "Toyota Camry 2022",
    carType: "Sedan",
    ownerName: "Premium Fleet",
    ownerId: "O001",
    ownerPhone: "+234 812 987 6543",
    renterName: "Musa Ibrahim",
    renterId: "U001",
    renterAvatar: "/avatars/user1.jpg",
    renterPhone: "+234 812 345 6789",
    startDate: "Mar 15",
    endDate: "Mar 18",
    pickupTime: "10:00 AM",
    dropoffTime: "4:00 PM",
    pickupLocation: "Abuja Airport, Terminal 2",
    dropoffLocation: "Wuse II, Parkview Hotel",
    totalDays: 3,
    dailyRate: 35000,
    totalAmount: 105000,
    status: "active",
    paymentStatus: "paid",
    createdAt: "2024-03-10",
    currentLocation: "Abuja Central Business District",
    fuelLevel: 65,
    mileage: 245,
    estimatedDistance: 120,
    estimatedTime: "2 hours 15 mins",
    extras: {
      insurance: true,
      gps: false,
      childSeat: true
    },
    notes: "Please ensure the car is cleaned and has at least half tank of fuel.",
    insuranceDetails: {
      provider: "Leadway Assurance",
      policyNumber: "POL-2024-00123",
      coverageAmount: 5000000
    },
    documents: {
      rentalAgreement: "/documents/RB001-agreement.pdf",
      paymentReceipt: "/documents/RB001-receipt.pdf",
      insuranceCertificate: "/documents/RB001-insurance.pdf",
      inspectionReport: "/documents/RB001-inspection.pdf"
    },
    timeline: [
      {
        event: "Booking Requested",
        date: "Mar 10, 2024",
        time: "10:30 AM",
        description: "Booking request submitted by Musa Ibrahim",
        icon: "request"
      },
      {
        event: "Payment Confirmed",
        date: "Mar 10, 2024",
        time: "11:15 AM",
        description: "Payment of ₦105,000 processed successfully",
        icon: "payment"
      },
      {
        event: "Booking Confirmed",
        date: "Mar 10, 2024",
        time: "2:45 PM",
        description: "Booking approved by Premium Fleet",
        icon: "confirm"
      },
      {
        event: "Vehicle Picked Up",
        date: "Mar 15, 2024",
        time: "10:00 AM",
        description: "Vehicle picked up from Abuja Airport",
        icon: "pickup"
      },
      {
        event: "Currently Active",
        date: "Mar 15, 2024",
        time: "10:00 AM",
        description: "Trip in progress",
        icon: "active"
      }
    ],
    rating: undefined
  },
  RB002: {
    id: "RB002",
    carId: "C002",
    carImage: "/car/car2.png",
    carName: "Lexus RX350",
    carType: "SUV",
    ownerName: "Elite Cars",
    ownerId: "O002",
    ownerPhone: "+234 812 876 5432",
    renterName: "Chidi Okafor",
    renterId: "U002",
    renterAvatar: "/avatars/user2.jpg",
    renterPhone: "+234 812 234 5678",
    startDate: "Mar 20",
    endDate: "Mar 25",
    pickupTime: "9:00 AM",
    dropoffTime: "6:00 PM",
    pickupLocation: "Maitama, Silverbird Galleria",
    dropoffLocation: "Gwarimpa, 1st Avenue",
    totalDays: 5,
    dailyRate: 45000,
    totalAmount: 225000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-03-12",
    extras: {
      insurance: true,
      gps: true,
      childSeat: false
    },
    notes: "Customer requested full tank and car wash before pickup.",
    insuranceDetails: {
      provider: "AIICO Insurance",
      policyNumber: "POL-2024-00124",
      coverageAmount: 8000000
    },
    documents: {
      rentalAgreement: "/documents/RB002-agreement.pdf",
      paymentReceipt: "/documents/RB002-receipt.pdf",
      insuranceCertificate: "/documents/RB002-insurance.pdf",
      inspectionReport: "/documents/RB002-inspection.pdf"
    }
  },
  RB003: {
    id: "RB003",
    carId: "C003",
    carImage: "/car/car3.png",
    carName: "Mercedes C300",
    carType: "Luxury",
    ownerName: "Luxury Rentals",
    ownerId: "O003",
    ownerPhone: "+234 812 765 4321",
    renterName: "Fatima Ahmed",
    renterId: "U003",
    renterAvatar: "/avatars/user3.jpg",
    renterPhone: "+234 812 123 4567",
    startDate: "Mar 22",
    endDate: "Mar 24",
    pickupTime: "11:00 AM",
    dropoffTime: "5:00 PM",
    pickupLocation: "Lagos Airport, MM2 Terminal",
    dropoffLocation: "Victoria Island, Eko Hotel",
    totalDays: 2,
    dailyRate: 55000,
    totalAmount: 110000,
    status: "active",
    paymentStatus: "paid",
    createdAt: "2024-03-15",
    currentLocation: "Lagos Island",
    fuelLevel: 45,
    mileage: 180,
    estimatedDistance: 85,
    estimatedTime: "1 hour 45 mins",
    extras: {
      insurance: true,
      gps: true,
      childSeat: false
    },
    notes: "VIP client - ensure premium service",
    insuranceDetails: {
      provider: "AXA Mansard",
      policyNumber: "POL-2024-00125",
      coverageAmount: 10000000
    },
    documents: {
      rentalAgreement: "/documents/RB003-agreement.pdf",
      paymentReceipt: "/documents/RB003-receipt.pdf",
      insuranceCertificate: "/documents/RB003-insurance.pdf",
      inspectionReport: "/documents/RB003-inspection.pdf"
    }
  },
  RB004: {
    id: "RB004",
    carId: "C004",
    carImage: "/car/car4.png",
    carName: "BMW X5",
    carType: "SUV",
    ownerName: "Premium Fleet",
    ownerId: "O001",
    ownerPhone: "+234 812 987 6543",
    renterName: "Samuel Johnson",
    renterId: "U004",
    renterAvatar: "/avatars/user4.jpg",
    renterPhone: "+234 812 345 6780",
    startDate: "Mar 28",
    endDate: "Mar 30",
    pickupTime: "2:00 PM",
    dropoffTime: "12:00 PM",
    pickupLocation: "Port Harcourt International Airport",
    dropoffLocation: "Port Harcourt City Center, Hotel Presidential",
    totalDays: 2,
    dailyRate: 50000,
    totalAmount: 100000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-03-18",
    extras: {
      insurance: true,
      gps: false,
      childSeat: true
    }
  },
  RB005: {
    id: "RB005",
    carId: "C005",
    carImage: "/car/car5.png",
    carName: "Audi Q7",
    carType: "SUV",
    ownerName: "Elite Cars",
    ownerId: "O002",
    ownerPhone: "+234 812 876 5432",
    renterName: "Michael Chen",
    renterId: "U005",
    renterAvatar: "/avatars/user5.jpg",
    renterPhone: "+234 812 234 5670",
    startDate: "Apr 1",
    endDate: "Apr 5",
    pickupTime: "8:00 AM",
    dropoffTime: "4:00 PM",
    pickupLocation: "Abuja, Transcorp Hilton",
    dropoffLocation: "Kaduna, NDA Road",
    totalDays: 4,
    dailyRate: 70000,
    totalAmount: 280000,
    status: "confirmed",
    paymentStatus: "paid",
    createdAt: "2024-03-20",
    extras: {
      insurance: true,
      gps: true,
      childSeat: false
    }
  },
  RB006: {
    id: "RB006",
    carId: "C006",
    carImage: "/car/car6.png",
    carName: "Range Rover Sport",
    carType: "SUV",
    ownerName: "Luxury Rentals",
    ownerId: "O003",
    ownerPhone: "+234 812 765 4321",
    renterName: "Chinwe Okafor",
    renterId: "U006",
    renterAvatar: "/avatars/user6.jpg",
    renterPhone: "+234 812 123 4560",
    startDate: "Apr 3",
    endDate: "Apr 7",
    pickupTime: "10:00 AM",
    dropoffTime: "6:00 PM",
    pickupLocation: "Victoria Island, Landmark Center",
    dropoffLocation: "Lekki Phase 1",
    totalDays: 4,
    dailyRate: 87500,
    totalAmount: 350000,
    status: "active",
    paymentStatus: "paid",
    createdAt: "2024-03-25",
    currentLocation: "Lekki-Epe Expressway",
    fuelLevel: 70,
    mileage: 320,
    estimatedDistance: 150,
    estimatedTime: "3 hours",
    extras: {
      insurance: true,
      gps: true,
      childSeat: true
    },
    notes: "Client is a returning customer - provide premium package",
    insuranceDetails: {
      provider: "Cornerstone Insurance",
      policyNumber: "POL-2024-00126",
      coverageAmount: 15000000
    }
  },
  RB007: {
    id: "RB007",
    carId: "C007",
    carImage: "/car/car7.png",
    carName: "Honda Accord 2023",
    carType: "Sedan",
    ownerName: "Premium Fleet",
    ownerId: "O001",
    ownerPhone: "+234 812 987 6543",
    renterName: "Aisha Bello",
    renterId: "U007",
    renterAvatar: "/avatars/user7.jpg",
    renterPhone: "+234 812 345 6781",
    startDate: "Apr 5",
    endDate: "Apr 8",
    pickupTime: "9:30 AM",
    dropoffTime: "3:30 PM",
    pickupLocation: "GRA, Port Harcourt",
    dropoffLocation: "City Center, Mile 1 Market",
    totalDays: 3,
    dailyRate: 40000,
    totalAmount: 120000,
    status: "confirmed",
    paymentStatus: "pending",
    createdAt: "2024-03-28",
    extras: {
      insurance: false,
      gps: false,
      childSeat: false
    }
  },
  RB008: {
    id: "RB008",
    carId: "C008",
    carImage: "/car/car8.png",
    carName: "Tesla Model 3",
    carType: "Electric",
    ownerName: "Modern Fleet",
    ownerId: "O004",
    ownerPhone: "+234 812 654 3210",
    renterName: "David Smith",
    renterId: "U008",
    renterAvatar: "/avatars/user8.jpg",
    renterPhone: "+234 812 234 5671",
    startDate: "Apr 10",
    endDate: "Apr 11",
    pickupTime: "8:00 AM",
    dropoffTime: "8:00 PM",
    pickupLocation: "Ikoyi, Banana Island",
    dropoffLocation: "Lagos Airport, International Terminal",
    totalDays: 1,
    dailyRate: 95000,
    totalAmount: 95000,
    status: "requested",
    paymentStatus: "pending",
    createdAt: "2024-03-30",
    extras: {
      insurance: true,
      gps: true,
      childSeat: false
    }
  },
  RB009: {
    id: "RB009",
    carId: "C009",
    carImage: "/car/car9.png",
    carName: "BMW X5",
    carType: "SUV",
    ownerName: "Premium Fleet",
    ownerId: "O001",
    ownerPhone: "+234 812 987 6543",
    renterName: "Emeka Okoro",
    renterId: "U009",
    renterAvatar: "/avatars/user9.jpg",
    renterPhone: "+234 812 345 6782",
    startDate: "Feb 10",
    endDate: "Feb 15",
    pickupTime: "11:00 AM",
    dropoffTime: "11:00 AM",
    pickupLocation: "Port Harcourt, Airport Road",
    dropoffLocation: "City Center, Hotel Presidential",
    totalDays: 5,
    dailyRate: 50000,
    totalAmount: 250000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2024-02-05",
    extras: {
      insurance: true,
      gps: false,
      childSeat: true
    },
    rating: {
      carCondition: 4,
      cleanliness: 5,
      ownerService: 4,
      overall: 4.3,
      comment: "Great car, very clean and well maintained. Owner was responsive and helpful."
    }
  },
  RB010: {
    id: "RB010",
    carId: "C010",
    carImage: "/car/car10.png",
    carName: "Range Rover Sport",
    carType: "SUV",
    ownerName: "Luxury Rentals",
    ownerId: "O003",
    ownerPhone: "+234 812 765 4321",
    renterName: "Ruth Williams",
    renterId: "U010",
    renterAvatar: "/avatars/user10.jpg",
    renterPhone: "+234 812 123 4561",
    startDate: "Jan 20",
    endDate: "Jan 25",
    pickupTime: "9:00 AM",
    dropoffTime: "9:00 AM",
    pickupLocation: "Lagos, VI",
    dropoffLocation: "Ibadan, University of Ibadan",
    totalDays: 5,
    dailyRate: 55000,
    totalAmount: 275000,
    status: "completed",
    paymentStatus: "paid",
    createdAt: "2024-01-15",
    extras: {
      insurance: true,
      gps: true,
      childSeat: false
    },
    rating: {
      carCondition: 5,
      cleanliness: 4,
      ownerService: 5,
      overall: 4.7,
      comment: "Excellent service! The car was in perfect condition and the trip was smooth."
    }
  }
};

// Helper function to get booking details by ID
export const getBookingDetailsById = (id: string): BookingDetailsData | undefined => {
  return bookingDetails[id];
};

// Get all booking details
export const getAllBookingDetails = (): BookingDetailsData[] => {
  return Object.values(bookingDetails);
};

// Filter booking details by status
export const getBookingDetailsByStatus = (status: BookingDetailsData['status']) => {
  return Object.values(bookingDetails).filter(booking => booking.status === status);
};

// Filter booking details by category
export const getBookingDetailsByCategory = (category: 'active' | 'requested' | 'past') => {
  return Object.values(bookingDetails).filter(booking => {
    const bookingData = allBookings.find(b => b.id === booking.id);
    return bookingData?.category === category;
  });
};

// For business view, add renter names to all bookings
export const getBusinessBookings = () => {
  return allBookings.map(booking => ({
    ...booking,
    renterName: bookingDetails[booking.id]?.renterName || "Unknown Renter"
  }));
};

// Get business booking details
export const getBusinessBookingDetails = () => {
  return Object.values(bookingDetails).map(details => ({
    ...details,
    renterName: details.renterName
  }));
};

// Mock data for business dashboard (car requests)
export const requestedCars = [
  {
    id: "BR001",
    carImage: "/car/car1.png",
    carName: "Toyota Camry 2022",
    carType: "Sedan",
    renterName: "Musa Ibrahim",
    startDate: "Mar 20",
    endDate: "Mar 23",
    pickupLocation: "Abuja Airport",
    dropoffLocation: "Wuse II",
    totalDays: 3,
    totalAmount: 105000,
    status: "requested" as const,
    paymentStatus: "pending" as const
  },
  {
    id: "BR002",
    carImage: "/car/car2.png",
    carName: "Lexus RX350",
    carType: "SUV",
    renterName: "Chidi Okafor",
    startDate: "Mar 25",
    endDate: "Mar 30",
    pickupLocation: "Maitama",
    dropoffLocation: "Gwarimpa",
    totalDays: 5,
    totalAmount: 225000,
    status: "requested" as const,
    paymentStatus: "pending" as const
  }
];

export default {
  allBookings,
  bookingDetails,
  getActiveBookings,
  getRequestedBookings,
  getPastBookings,
  getBookingById,
  getBookingDetailsById,
  getAllBookingDetails,
  getBookingDetailsByStatus,
  getBookingDetailsByCategory,
  getBusinessBookings,
  getBusinessBookingDetails,
  requestedCars
};