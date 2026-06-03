import { api } from '@/lib/api/client';
import { Notification } from '@/types/models';

export const notificationService = {
  async getNotifications(): Promise<Notification[]> {
    return api.get<Notification[]>('/notifications');
  },

  async getUnreadCount(): Promise<{ count: number }> {
    return api.get<{ count: number }>('/notifications/unread-count');
  },

  async markAsRead(id: string): Promise<void> {
    return api.post<void>(`/notifications/${id}/read`, {});
  },

  async markAllAsRead(): Promise<void> {
    return api.post<void>('/notifications/read-all', {});
  },
};
