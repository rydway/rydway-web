import { useQuery } from '@tanstack/react-query';
import { bookingService } from '@/services/booking.service';

export function useRenterBookings(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['renter-bookings', params],
    queryFn: () => bookingService.getRenterBookings(params),
  });

  return {
    bookings: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useHostBookings(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['host-bookings', params],
    queryFn: () => bookingService.getHostBookings(params),
  });

  return {
    bookings: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

// Keeping the generic one for backward compatibility or refactor the consumer
export function useBookings(params?: Record<string, string> & { role?: 'renter' | 'host' }) {
  const isHost = params?.role === 'host';
  const queryFn = isHost ? bookingService.getHostBookings : bookingService.getRenterBookings;
  
  const query = useQuery({
    queryKey: ['bookings', params],
    queryFn: () => queryFn(params),
  });

  return {
    bookings: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
