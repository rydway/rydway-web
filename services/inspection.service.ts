import { api } from '@/lib/api/client';

export interface Inspection {
  id: string;
  bookingId: string;
  type: 'PRE' | 'POST';
  photoUrls: string[];
  createdAt: string;
}

export const inspectionService = {
  async submit(data: { bookingId: string; type: 'PRE' | 'POST'; photoUrls: string[] }): Promise<Inspection> {
    const res = await api.post<{ data: Inspection }>('/inspections', data);
    return res.data;
  },

  async getForBooking(bookingId: string): Promise<Inspection[]> {
    const res = await api.get<{ data: Inspection[] }>(`/inspections/booking/${bookingId}`);
    return res.data;
  },

  // Admin
  async getAll(bookingId?: string): Promise<Inspection[]> {
    const query = bookingId ? `?bookingId=${bookingId}` : '';
    const res = await api.get<{ data: Inspection[] }>(`/inspections${query}`);
    return res.data;
  },
};
