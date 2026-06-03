import { api } from '@/lib/api/client';
import { KycSubmission } from '@/types/models';

export const kycService = {
  async getMyKycSubmissions(): Promise<KycSubmission[]> {
    const res = await api.get<{ data: KycSubmission[] }>('/kyc/me');
    return (res as any).data ?? res;
  },

  async submitRenterKyc(data: any): Promise<KycSubmission> {
    const res = await api.post<{ data: KycSubmission }>('/kyc/renter', data);
    return (res as any).data ?? res;
  },

  async submitHostKyc(data: any): Promise<KycSubmission> {
    const res = await api.post<{ data: KycSubmission }>('/kyc/host', data);
    return (res as any).data ?? res;
  },
};
