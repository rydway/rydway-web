import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';
import { useCurrentUser } from './useUser';

export function useTransactions() {
  const { user } = useCurrentUser();
  const hasKyc = user?.kycStatus !== 'unsubmitted';

  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: () => paymentService.getTransactions(),
    enabled: hasKyc,
  });

  return {
    transactions: query.data || [],
    isLoading: query.isLoading && hasKyc,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
