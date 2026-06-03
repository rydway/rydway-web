import { Car, Calendar, CreditCard, HelpCircle } from "lucide-react";

export const mockRenterStats = [
  {
    title: "Total Trips",
    value: "12 Trips",
    icon: Car,
    trend: "8 completed, 2 active",
    trendUp: true,
    iconColor: "text-primary"
  },
  {
    title: "Upcoming Pickups",
    value: "1 Pickup",
    icon: Calendar,
    trend: "Nov 22, 2026",
    trendUp: true,
    iconColor: "text-secondary"
  },
  {
    title: "Total Spent",
    value: "₦580,000",
    icon: CreditCard,
    trend: "₦110,000 this month",
    trendUp: true,
    iconColor: "text-primary"
  },
  {
    title: "Active Support",
    value: "0 Tickets",
    icon: HelpCircle,
    trend: "All resolved",
    trendUp: false,
    iconColor: "text-secondary"
  }
];

export const currentTrips = [
  {
    id: "BK-2026-001",
    vehicleName: "Toyota Camry 2023",
    image: "/car/car2.png",
    startDate: "Nov 22, 2026",
    endDate: "Nov 25, 2026",
    status: "confirmed",
    location: "Maitama, Abuja",
    owner: "Premium Car Rentals",
    amount: "₦75,000",
    type: "Self-Drive"
  }
];

export const recentTransactions = [
  {
    id: "TRX-1092",
    date: "Nov 15, 2026",
    vehicle: "Honda Accord 2022",
    amount: "₦60,000",
    status: "completed",
    type: "Card (Visa)"
  },
  {
    id: "TRX-1089",
    date: "Nov 02, 2026",
    vehicle: "Toyota Camry 2023",
    amount: "₦75,000",
    status: "completed",
    type: "Card (Visa)"
  },
  {
    id: "TRX-1077",
    date: "Oct 24, 2026",
    vehicle: "BMW 3 Series",
    amount: "₦180,000",
    status: "completed",
    type: "Bank Transfer"
  }
];

export const recommendedCars = [
  {
    id: "vehicle-2",
    name: "Mercedes-Benz GLE",
    type: "SUV",
    dailyRate: "₦75,000",
    rating: 4.8,
    image: "/car/car3.png"
  },
  {
    id: "vehicle-5",
    name: "BMW 3 Series 2023",
    type: "Sedan",
    dailyRate: "₦45,000",
    rating: 4.9,
    image: "/car/car5.png"
  }
];

export const monthlyEarnings = [
  { month: "Jan", value: 1200000 },
  { month: "Feb", value: 1450000 },
  { month: "Mar", value: 1600000 },
  { month: "Apr", value: 1850000 },
  { month: "May", value: 2100000 },
  { month: "Jun", value: 2450000 }
];

export const fleetStatus = [
  { name: "Dispatched", value: 18, color: "#0074D1" },
  { name: "Requested", value: 6, color: "#7AC1FF" },
  { name: "Available", value: 9, color: "#0056A3" },
  { name: "Service", value: 3, color: "#003366" }
];

export const requestedCars = [
  {
    id: 1,
    car: "Toyota Camry 2022",
    requester: "Musa Ibrahim",
    duration: "3 days",
    location: "Abuja",
    priority: "high",
    date: "Nov 15, 2023"
  },
  {
    id: 2,
    car: "Lexus RX350",
    requester: "Chidi Okafor",
    duration: "5 days",
    location: "Gwarimpa",
    priority: "medium",
    date: "Nov 14, 2023"
  },
  {
    id: 3,
    car: "Mercedes Benz C300",
    requester: "Fatima Ahmed",
    duration: "2 days",
    location: "Lagos",
    priority: "high",
    date: "Nov 16, 2023"
  },
  {
    id: 4,
    car: "BMW X5 2021",
    requester: "Emeka Okoro",
    duration: "7 days",
    location: "Port Harcourt",
    priority: "low",
    date: "Nov 13, 2023"
  }
];

export const dispatchedBookings = [
  {
    id: 1,
    client: "Aisha Bello",
    car: "Toyota Corolla",
    duration: "4 days",
    amount: "₦140,000",
    pickup: "Wuse II",
    destination: "Airport",
    status: "active",
    date: "Today, 10:30 AM"
  },
  {
    id: 2,
    client: "John Ade",
    car: "Highlander 2021",
    duration: "2 days",
    amount: "₦180,000",
    pickup: "Maitama",
    destination: "Asokoro",
    status: "completed",
    date: "Yesterday, 3:45 PM"
  },
  {
    id: 3,
    client: "Chinwe Okafor",
    car: "Range Rover Sport",
    duration: "5 days",
    amount: "₦350,000",
    pickup: "Victoria Island",
    destination: "Lekki",
    status: "active",
    date: "Today, 9:15 AM"
  },
  {
    id: 4,
    client: "Samuel Johnson",
    car: "Honda Accord 2023",
    duration: "3 days",
    amount: "₦120,000",
    pickup: "GRA",
    destination: "City Center",
    status: "active",
    date: "Today, 11:45 AM"
  },
  {
    id: 5,
    client: "Ruth Williams",
    car: "Tesla Model 3",
    duration: "1 day",
    amount: "₦95,000",
    pickup: "Ikoyi",
    destination: "Airport",
    status: "completed",
    date: "Nov 13, 2023"
  },
  {
    id: 6,
    client: "Michael Chen",
    car: "Audi Q7",
    duration: "6 days",
    amount: "₦280,000",
    pickup: "Abuja",
    destination: "Kaduna",
    status: "active",
    date: "Today, 8:00 AM"
  },
  {
    id: 7,
    client: "Amina Yusuf",
    car: "Toyota RAV4",
    duration: "2 days",
    amount: "₦110,000",
    pickup: "Kano",
    destination: "Airport",
    status: "completed",
    date: "Nov 14, 2023"
  },
  {
    id: 8,
    client: "David Smith",
    car: "Ford Explorer",
    duration: "4 days",
    amount: "₦165,000",
    pickup: "Ikeja",
    destination: "Epe",
    status: "active",
    date: "Today, 2:30 PM"
  }
];
