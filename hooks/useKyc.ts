import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { kycService } from '@/services/kyc.service';

export function useKyc() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['my-kyc'],
    queryFn: () => kycService.getMyKycStatus(),
  });

  const submitMutation = useMutation({
    mutationFn: (data: any) => kycService.submitKyc(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-kyc'] });
    },
  });

  return {
    kyc: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    submitKyc: submitMutation.mutateAsync,
    isSubmitting: submitMutation.isPending,
  };
}
