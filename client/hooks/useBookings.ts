import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services/booking.service";
import { useCurrentUser } from "./useUser";

export function useRenterBookings(params?: Record<string, string>) {
  const { user } = useCurrentUser();
  const hasKyc = user?.kycStatus !== 'unsubmitted';

  const query = useQuery({
    queryKey: ["renter-bookings", params],
    queryFn: () => bookingService.getRenterBookings(params),
    enabled: hasKyc,
  });

  return {
    bookings: query.data || [],
    isLoading: query.isLoading && hasKyc,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useHostBookings(params?: Record<string, string>) {
  const { user } = useCurrentUser();
  const hasKyc = user?.kycStatus !== 'unsubmitted';

  const query = useQuery({
    queryKey: ["host-bookings", params],
    queryFn: () => bookingService.getHostBookings(params),
    enabled: hasKyc,
  });

  return {
    bookings: query.data || [],
    isLoading: query.isLoading && hasKyc,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

// Keeping the generic one for backward compatibility or refactor the consumer
export function useBookings(
  params?: Record<string, string> & { role?: "renter" | "host" },
) {
  const { user } = useCurrentUser();
  const hasKyc = user?.kycStatus !== 'unsubmitted';
  const isHost = params?.role === "host";
  const queryFn = isHost
    ? bookingService.getHostBookings
    : bookingService.getRenterBookings;

  const query = useQuery({
    queryKey: ["bookings", params],
    queryFn: () => queryFn(params),
    enabled: hasKyc,
  });

  return {
    bookings: query.data || [],
    isLoading: query.isLoading && hasKyc,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useBooking(id: string) {
  const query = useQuery({
    queryKey: ["booking", id],
    queryFn: () => bookingService.getBookingById(id),
    enabled: !!id,
  });

  return {
    booking: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useUpdateBookingStatus(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) =>
      bookingService.updateBookingStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["booking", id] });
      queryClient.invalidateQueries({ queryKey: ["host-bookings"] });
    },
  });
}
