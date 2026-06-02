import { api } from '@/lib/api/client';

export interface Dispute {
  id: string;
  bookingId: string;
  raisedBy: string;
  reason: string;
  status: 'OPEN' | 'RESOLVED' | 'REJECTED';
  resolution?: string;
  resolvedAt?: string;
  createdAt: string;
  booking?: {
    bookingNumber?: string;
    status: string;
    vehicle?: { name: string };
  };
}

export const disputeService = {
  async raise(data: { bookingId: string; reason: string }): Promise<Dispute> {
    const res = await api.post<{ data: Dispute }>('/disputes', data);
    return res.data;
  },

  async getMyDisputes(): Promise<Dispute[]> {
    const res = await api.get<{ data: Dispute[] }>('/disputes/me');
    return res.data;
  },

  // Admin
  async getAll(status?: string): Promise<Dispute[]> {
    const query = status ? `?status=${status}` : '';
    const res = await api.get<{ data: Dispute[] }>(`/disputes${query}`);
    return res.data;
  },

  async getById(id: string): Promise<Dispute> {
    const res = await api.get<{ data: Dispute }>(`/disputes/${id}`);
    return res.data;
  },

  async resolve(id: string, data: { resolution: string; outcome: 'RESOLVED' | 'REJECTED' }): Promise<Dispute> {
    const res = await api.patch<{ data: Dispute }>(`/disputes/${id}/resolve`, data);
    return res.data;
  },
};
