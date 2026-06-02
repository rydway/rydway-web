export interface MonthlyEarning {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
  bookings: number;
}

export interface CategoryRevenue {
  name: string;
  value: number;
  color: string;
  count: number;
}

export interface PaymentMethodBreakdown {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface PerformingVehicle {
  id: number;
  name: string;
  revenue: number;
  bookings: number;
  utilization: number;
  dailyRate: number;
}

export interface BusinessTransaction {
  id: string;
  date: string;
  vehicle: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  status: string;
  type: string;
}

export interface PayoutHistoryItem {
  id: string;
  date: string;
  amount: number;
  method: string;
  account: string;
  status: string;
  reference: string;
}
