import { api } from "@/lib/api/client";
import { Booking } from "@/types/models";

export const bookingService = {
  // Common
  async getBookingById(id: string): Promise<Booking> {
    return api.get<Booking>(`/bookings/${id}`);
  },

  // Renter
  async getRenterBookings(params?: Record<string, string>): Promise<Booking[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return api.get<Booking[]>(`/renter/bookings${query}`);
  },
  async createBooking(data: Partial<Booking>): Promise<Booking> {
    return api.post<Booking>("/renter/bookings", data);
  },

  // Host
  async getHostBookings(params?: Record<string, string>): Promise<Booking[]> {
    const query = params ? `?${new URLSearchParams(params).toString()}` : "";
    return api.get<Booking[]>(`/host/bookings${query}`);
  },
  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    return api.patch<Booking>(`/host/bookings/${id}/status`, { status });
  },
};
