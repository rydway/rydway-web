import { api } from '@/lib/api/client';

export const settingsService = {
  async getProfileSettings(): Promise<any> {
    return api.get<any>('/settings/profile');
  },

  async updateProfileSettings(data: any): Promise<any> {
    return api.patch<any>('/settings/profile', data);
  },

  async getNotificationSettings(): Promise<any> {
    return api.get<any>('/settings/notifications');
  },

  async updateNotificationSettings(data: any): Promise<any> {
    return api.patch<any>('/settings/notifications', data);
  },

  async updateSecuritySettings(data: any): Promise<any> {
    return api.patch<any>('/settings/security', data);
  },
};
