import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { disputeService, Dispute } from '@/services/dispute.service';

export function useMyDisputes() {
  const query = useQuery({
    queryKey: ['my-disputes'],
    queryFn: () => disputeService.getMyDisputes(),
  });

  return {
    disputes: query.data ?? [],
    openDisputes: query.data?.filter((d) => d.status === 'OPEN') ?? [],
    resolvedDisputes: query.data?.filter((d) => d.status !== 'OPEN') ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useRaiseDispute() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: { bookingId: string; reason: string }) =>
      disputeService.raise(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-disputes'] });
      queryClient.invalidateQueries({ queryKey: ['renter-bookings'] });
    },
  });

  return {
    raiseDispute: mutation.mutateAsync,
    isRaising: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}

// Admin hooks
export function useAllDisputes(status?: string) {
  const query = useQuery({
    queryKey: ['admin-disputes', status],
    queryFn: () => disputeService.getAll(status),
  });

  return {
    disputes: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useDisputeById(id: string) {
  const query = useQuery({
    queryKey: ['dispute', id],
    queryFn: () => disputeService.getById(id),
    enabled: !!id,
  });

  return {
    dispute: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useResolveDispute() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, ...data }: { id: string; resolution: string; outcome: 'RESOLVED' | 'REJECTED' }) =>
      disputeService.resolve(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
      queryClient.invalidateQueries({ queryKey: ['dispute', variables.id] });
    },
  });

  return {
    resolveDispute: mutation.mutateAsync,
    isResolving: mutation.isPending,
    error: mutation.error as Error | null,
    isSuccess: mutation.isSuccess,
  };
}
