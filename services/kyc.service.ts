import { api } from '@/lib/api/client';
import { KycSubmission } from '@/types/models';

export const kycService = {
  async getMyKycStatus(): Promise<KycSubmission> {
    return api.get<KycSubmission>('/kyc/status');
  },

  async submitKyc(data: any): Promise<KycSubmission> {
    return api.post<KycSubmission>('/kyc/submit', data);
  },
};
