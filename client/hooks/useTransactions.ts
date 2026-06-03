import { useQuery } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';

export function useTransactions() {
  const query = useQuery({
    queryKey: ['transactions'],
    queryFn: () => paymentService.getTransactions(),
  });

  return {
    transactions: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}
