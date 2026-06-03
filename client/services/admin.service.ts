import { api } from '@/lib/api/client';
import { User, Vehicle, Booking, Payment, KycSubmission } from '@/types/models';

export const adminService = {
  async getDashboardSummary(): Promise<any> {
    return api.get<any>('/admin/dashboard/summary');
  },

  async getUsers(params?: Record<string, string>): Promise<User[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<User[]>(`/admin/users${query}`);
  },

  async getUser(id: string): Promise<User> {
    return api.get<User>(`/admin/users/${id}`);
  },

  async updateUserStatus(id: string, isActive: boolean): Promise<User> {
    return api.patch<User>(`/admin/users/${id}/status`, { isActive });
  },

  async getKycSubmissions(params?: Record<string, string>): Promise<KycSubmission[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<KycSubmission[]>(`/admin/kyc${query}`);
  },

  async getVehicles(params?: Record<string, string>): Promise<Vehicle[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<Vehicle[]>(`/admin/vehicles${query}`);
  },

  async getBookings(params?: Record<string, string>): Promise<Booking[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<Booking[]>(`/admin/bookings${query}`);
  },

  async getPayments(params?: Record<string, string>): Promise<Payment[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<Payment[]>(`/admin/payments${query}`);
  },

  async getPayouts(params?: Record<string, string>): Promise<any[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<any[]>(`/admin/payouts${query}`);
  },

  async getAuditLogs(params?: Record<string, string>): Promise<any[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<any[]>(`/admin/audit-logs${query}`);
  },
};
