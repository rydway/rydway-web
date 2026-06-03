import { api } from '@/lib/api/client';
import { User } from '@/types/models';

export const userService = {
  async getMe(): Promise<User> {
    return api.get<User>('/users/me');
  },

  async updateMe(data: Partial<User>): Promise<User> {
    return api.patch<User>('/users/me', data);
  },

  async updatePassword(data: any): Promise<void> {
    return api.patch<void>('/users/me/password', data);
  },

  async deleteMe(): Promise<void> {
    return api.delete<void>('/users/me');
  },

  async getUser(id: string): Promise<User> {
    return api.get<User>(`/users/${id}`);
  },
};
