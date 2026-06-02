import { api } from '@/lib/api/client';
import { Vehicle } from '@/types/models';

export const vehicleService = {
  // Public / Search
  async getVehicles(params?: Record<string, string>): Promise<Vehicle[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<Vehicle[]>(`/vehicles${query}`);
  },
  async getVehicleById(id: string): Promise<Vehicle> {
    return api.get<Vehicle>(`/vehicles/${id}`);
  },
  async getCalendar(id: string): Promise<any[]> {
    return api.get<any[]>(`/vehicles/${id}/calendar`);
  },
  async addCalendarBlock(id: string, startDate: string, endDate: string, reason?: string): Promise<any> {
    return api.post<any>(`/vehicles/${id}/calendar/blocks`, { startDate, endDate, reason });
  },
  async removeCalendarBlock(id: string, blockId: string): Promise<void> {
    return api.delete<void>(`/vehicles/${id}/calendar/blocks/${blockId}`);
  },

  // Host
  async getHostVehicles(): Promise<Vehicle[]> {
    return api.get<Vehicle[]>('/host-vehicles');
  },
  async createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
    return api.post<Vehicle>('/host-vehicles', data);
  },
  async updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle> {
    return api.patch<Vehicle>(`/host-vehicles/${id}`, data);
  },
  async deleteVehicle(id: string): Promise<void> {
    return api.delete<void>(`/host-vehicles/${id}`);
  },

  // Admin
  async verifyVehicle(id: string): Promise<Vehicle> {
    return api.patch<Vehicle>(`/admin-vehicles/${id}/verify`);
  },
  async rejectVehicle(id: string): Promise<Vehicle> {
    return api.patch<Vehicle>(`/admin-vehicles/${id}/reject`);
  },
};
