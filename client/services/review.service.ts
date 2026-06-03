import { api } from '@/lib/api/client';
import { Review } from '@/types/models';

export const reviewService = {
  async getMyReviews(): Promise<Review[]> {
    return api.get<Review[]>('/reviews/me');
  },

  async getVehicleReviews(vehicleId: string): Promise<Review[]> {
    return api.get<Review[]>(`/reviews/vehicles/${vehicleId}`);
  },

  async getHostReviews(hostId: string): Promise<Review[]> {
    return api.get<Review[]>(`/reviews/hosts/${hostId}`);
  },

  async submitVehicleReview(data: Partial<Review>): Promise<Review> {
    return api.post<Review>('/reviews/vehicle', data);
  },

  async submitHostReview(data: Partial<Review>): Promise<Review> {
    return api.post<Review>('/reviews/host', data);
  },

  async submitRenterReview(data: Partial<Review>): Promise<Review> {
    return api.post<Review>('/reviews/renter', data);
  },
};
