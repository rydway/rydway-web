import { api } from '@/lib/api/client';
import { Vehicle, User } from '@/types/models';

export const searchService = {
  async searchVehicles(params?: Record<string, string>): Promise<Vehicle[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<Vehicle[]>(`/search/vehicles${query}`);
  },

  async getFilters(): Promise<any> {
    return api.get<any>('/search/filters');
  },

  async searchHosts(params?: Record<string, string>): Promise<User[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : '';
    return api.get<User[]>(`/search/hosts${query}`);
  },

  async getAutocomplete(query: string): Promise<any[]> {
    return api.get<any[]>(`/search/autocomplete?q=${encodeURIComponent(query)}`);
  },
};
