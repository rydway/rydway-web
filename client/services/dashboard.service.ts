import { api } from '@/lib/api/client';

export interface RenterSummary {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  pendingPayments: number;
  totalSpend: number;
  recentBookings: any[];
}

export interface HostSummary {
  monthlyEarnings: Array<{ 
    month: string; 
    value: number; // For compatibility
    revenue: number;
    profit: number;
    expenses: number;
    bookings: number;
  }>;
  fleetStatus: Array<{ name: string; value: number; color: string }>;
  totalEarnings: number;
  pendingBalance: number;
  totalBookings: number;
  activeBookings: number;
}

export const dashboardService = {
  async getRenterSummary(): Promise<RenterSummary> {
    return api.get<RenterSummary>('/dashboard/renter/summary');
  },

  async getHostSummary(): Promise<HostSummary> {
    return api.get<HostSummary>('/dashboard/host/summary');
  },
};
