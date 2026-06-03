import { useQuery, useMutation } from '@tanstack/react-query';
import { paymentService } from '@/services/payment.service';

export function usePayments() {
  const transactionsQuery = useQuery({
    queryKey: ['payment-transactions'],
    queryFn: () => paymentService.getTransactions(),
  });

  const initializePaymentMutation = useMutation({
    mutationFn: (data: { bookingId: string; provider?: string }) => paymentService.initializePayment(data),
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: (reference: string) => paymentService.verifyPayment(reference),
  });

  return {
    transactions: transactionsQuery.data || [],
    isLoading: transactionsQuery.isLoading,
    error: transactionsQuery.error as Error | null,
    initializePayment: initializePaymentMutation.mutateAsync,
    isInitializing: initializePaymentMutation.isPending,
    verifyPayment: verifyPaymentMutation.mutateAsync,
    isVerifying: verifyPaymentMutation.isPending,
  };
}

export function useEarnings() {
  const summaryQuery = useQuery({
    queryKey: ['host-earnings-summary'],
    queryFn: () => paymentService.getHostEarningsSummary(),
  });

  const transactionsQuery = useQuery({
    queryKey: ['host-payout-transactions'],
    queryFn: () => paymentService.getPayoutTransactions(),
  });

  const withdrawMutation = useMutation({
    mutationFn: (data: { amount: number; bankAccountId: string }) => 
      paymentService.withdrawFunds(data.amount, data.bankAccountId),
  });

  return {
    summary: summaryQuery.data,
    transactions: transactionsQuery.data || [],
    isLoading: summaryQuery.isLoading || transactionsQuery.isLoading,
    error: (summaryQuery.error || transactionsQuery.error) as Error | null,
    withdraw: withdrawMutation.mutateAsync,
    isWithdrawing: withdrawMutation.isPending,
  };
}
