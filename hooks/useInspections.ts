import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inspectionService, Inspection } from '@/services/inspection.service';

export function useBookingInspections(bookingId: string) {
  const query = useQuery({
    queryKey: ['inspections', bookingId],
    queryFn: () => inspectionService.getForBooking(bookingId),
    enabled: !!bookingId,
  });

  return {
    inspections: query.data ?? [],
    preInspection: query.data?.find((i) => i.type === 'PRE') ?? null,
    postInspection: query.data?.find((i) => i.type === 'POST') ?? null,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useSubmitInspection() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { bookingId: string; type: 'PRE' | 'POST'; photoUrls: string[] }) =>
      inspectionService.submit(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['inspections', variables.bookingId] });
      queryClient.invalidateQueries({ queryKey: ['renter-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['host-bookings'] });
    },
  });

  return {
    submitInspection: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

// Admin hook
export function useAllInspections(bookingId?: string) {
  const query = useQuery({
    queryKey: ['admin-inspections', bookingId],
    queryFn: () => inspectionService.getAll(bookingId),
  });

  return {
    inspections: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}
