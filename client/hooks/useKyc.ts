import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kycService } from '@/services/kyc.service';

export function useKyc() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-kyc'],
    queryFn: () => kycService.getMyKycSubmissions(),
  });

  const submitRenterKycMutation = useMutation({
    mutationFn: (data: any) => kycService.submitRenterKyc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-kyc'] });
    },
  });

  const submitHostKycMutation = useMutation({
    mutationFn: (data: any) => kycService.submitHostKyc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-kyc'] });
    },
  });

  return {
    submissions: query.data ?? [],
    latestSubmission: query.data?.[0] ?? null,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    submitRenterKyc: submitRenterKycMutation.mutateAsync,
    submitHostKyc: submitHostKycMutation.mutateAsync,
    isSubmittingRenter: submitRenterKycMutation.isPending,
    isSubmittingHost: submitHostKycMutation.isPending,
  };
}
