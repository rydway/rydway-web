import { 
  MonthlyEarning, 
  CategoryRevenue, 
  PaymentMethodBreakdown, 
  PerformingVehicle, 
  BusinessTransaction, 
  PayoutHistoryItem 
} from "./types";

export const monthlyEarnings: MonthlyEarning[] = [
  { month: "Jan", revenue: 1850000, expenses: 420000, profit: 1430000, bookings: 42 },
  { month: "Feb", revenue: 2100000, expenses: 480000, profit: 1620000, bookings: 48 },
  { month: "Mar", revenue: 2450000, expenses: 510000, profit: 1940000, bookings: 55 },
  { month: "Apr", revenue: 2800000, expenses: 560000, profit: 2240000, bookings: 62 },
  { month: "May", revenue: 3150000, expenses: 590000, profit: 2560000, bookings: 68 },
  { month: "Jun", revenue: 3420000, expenses: 620000, profit: 2800000, bookings: 75 },
  { month: "Jul", revenue: 3680000, expenses: 650000, profit: 3030000, bookings: 81 },
  { month: "Aug", revenue: 3950000, expenses: 680000, profit: 3270000, bookings: 87 },
  { month: "Sep", revenue: 4230000, expenses: 710000, profit: 3520000, bookings: 94 },
  { month: "Oct", revenue: 4580000, expenses: 750000, profit: 3830000, bookings: 102 },
  { month: "Nov", revenue: 4920000, expenses: 780000, profit: 4140000, bookings: 110 },
  { month: "Dec", revenue: 5350000, expenses: 820000, profit: 4530000, bookings: 118 },
];

export const revenueByCategory: CategoryRevenue[] = [
  { name: "Sedan", value: 3850000, color: "#2563EB", count: 124 },
  { name: "SUV", value: 5240000, color: "#3B82F6", count: 156 },
  { name: "Luxury", value: 4120000, color: "#60A5FA", count: 89 },
  { name: "Bus/Van", value: 1890000, color: "#93C5FD", count: 42 },
  { name: "Truck", value: 950000, color: "#BFDBFE", count: 18 },
];

export const paymentMethods: PaymentMethodBreakdown[] = [
  { name: "Card", value: 8240000, percentage: 52, color: "#2563EB" },
  { name: "Bank Transfer", value: 4850000, percentage: 31, color: "#3B82F6" },
  { name: "Cash", value: 1960000, percentage: 12, color: "#60A5FA" },
  { name: "Wallet", value: 780000, percentage: 5, color: "#93C5FD" },
];

export const topVehicles: PerformingVehicle[] = [
  { id: 1, name: "Mercedes GLE", revenue: 1240000, bookings: 31, utilization: 85, dailyRate: 75000 },
  { id: 2, name: "Range Rover Sport", revenue: 1120000, bookings: 22, utilization: 75, dailyRate: 95000 },
  { id: 3, name: "Toyota Camry", revenue: 980000, bookings: 42, utilization: 78, dailyRate: 25000 },
  { id: 4, name: "BMW 3 Series", revenue: 875000, bookings: 35, utilization: 82, dailyRate: 45000 },
  { id: 5, name: "Toyota Hilux", revenue: 720000, bookings: 41, utilization: 88, dailyRate: 35000 },
];

export const recentTransactions: BusinessTransaction[] = [
  {
    id: "TRX-001",
    date: "2026-03-15T10:30:00",
    vehicle: "Toyota Camry",
    customer: "John Doe",
    amount: 75000,
    paymentMethod: "Card",
    status: "completed",
    type: "booking"
  },
  {
    id: "TRX-002",
    date: "2026-03-15T09:15:00",
    vehicle: "Mercedes GLE",
    customer: "Sarah Smith",
    amount: 225000,
    paymentMethod: "Bank Transfer",
    status: "completed",
    type: "booking"
  },
  {
    id: "TRX-003",
    date: "2026-03-14T16:45:00",
    vehicle: "Range Rover Sport",
    customer: "James Bond",
    amount: 380000,
    paymentMethod: "Card",
    status: "completed",
    type: "booking"
  },
  {
    id: "TRX-004",
    date: "2026-03-14T14:20:00",
    vehicle: "Ford Explorer",
    customer: "Emma Thompson",
    amount: 110000,
    paymentMethod: "Wallet",
    status: "pending",
    type: "booking"
  },
  {
    id: "TRX-005",
    date: "2026-03-14T11:00:00",
    vehicle: "BMW 3 Series",
    customer: "Mike Johnson",
    amount: 135000,
    paymentMethod: "Card",
    status: "completed",
    type: "booking"
  },
  {
    id: "TRX-006",
    date: "2026-03-13T09:30:00",
    vehicle: "Toyota Hilux",
    customer: "David Williams",
    amount: 105000,
    paymentMethod: "Bank Transfer",
    status: "completed",
    type: "booking"
  },
  {
    id: "TRX-007",
    date: "2026-03-13T08:15:00",
    vehicle: "Mercedes Sprinter",
    customer: "Tech Corp Ltd",
    amount: 425000,
    paymentMethod: "Bank Transfer",
    status: "completed",
    type: "booking"
  },
  {
    id: "TRX-008",
    date: "2026-03-12T15:45:00",
    vehicle: "Toyota Camry",
    customer: "Alice Johnson",
    amount: 100000,
    paymentMethod: "Card",
    status: "refunded",
    type: "refund"
  },
];

export const payoutHistory: PayoutHistoryItem[] = [
  {
    id: "PAY-001",
    date: "2026-03-15",
    amount: 845000,
    method: "Bank Transfer",
    account: "GTBank •••• 3456",
    status: "completed",
    reference: "REF-2026-0315-001"
  },
  {
    id: "PAY-002",
    date: "2026-03-08",
    amount: 792000,
    method: "Bank Transfer",
    account: "GTBank •••• 3456",
    status: "completed",
    reference: "REF-2026-0308-002"
  },
  {
    id: "PAY-003",
    date: "2026-03-01",
    amount: 768000,
    method: "Bank Transfer",
    account: "GTBank •••• 3456",
    status: "completed",
    reference: "REF-2026-0301-003"
  },
  {
    id: "PAY-004",
    date: "2026-02-22",
    amount: 712000,
    method: "Bank Transfer",
    account: "GTBank •••• 3456",
    status: "completed",
    reference: "REF-2026-0222-004"
  },
  {
    id: "PAY-005",
    date: "2026-02-15",
    amount: 684000,
    method: "Bank Transfer",
    account: "GTBank •••• 3456",
    status: "completed",
    reference: "REF-2026-0215-005"
  },
];

export const weeklyComparison = [
  { day: "Mon", thisWeek: 245000, lastWeek: 212000 },
  { day: "Tue", thisWeek: 268000, lastWeek: 235000 },
  { day: "Wed", thisWeek: 292000, lastWeek: 248000 },
  { day: "Thu", thisWeek: 315000, lastWeek: 276000 },
  { day: "Fri", thisWeek: 342000, lastWeek: 298000 },
  { day: "Sat", thisWeek: 384000, lastWeek: 325000 },
  { day: "Sun", thisWeek: 356000, lastWeek: 308000 },
];
