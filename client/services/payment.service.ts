import { api } from '@/lib/api/client';
import { Payment } from '@/types/models';

export interface PaymentInitResponse {
  payment: { id: string; transactionRef: string; amount: number; status: string };
  checkoutUrl: string;
  accessCode: string;
}

export const paymentService = {
  /**
   * Initialize a Paystack payment session for a confirmed booking.
   * Returns a `checkoutUrl` to redirect the user to Paystack's hosted checkout.
   */
  async initializePayment(data: {
    bookingId: string;
    provider?: string;
    method?: string;
  }): Promise<PaymentInitResponse> {
    return api.post<PaymentInitResponse>('/payments/initialize', {
      bookingId: data.bookingId,
      provider: data.provider || 'paystack',
      method: data.method || 'card',
    });
  },

  /**
   * Manually verify a payment by its transaction reference.
   * Call this on the Paystack callback page after redirect.
   */
  async verifyPayment(transactionRef: string): Promise<Payment> {
    return api.post<Payment>('/payments/verify', { transactionRef });
  },

  /**
   * Fetch the authenticated user's full payment transaction history.
   */
  async getTransactions(): Promise<Payment[]> {
    return api.get<Payment[]>('/payments/transactions');
  },

  /**
   * Open the Paystack checkout URL in the same tab, so the callback_url
   * set in the backend brings the user back to our app.
   */
  openCheckout(checkoutUrl: string) {
    window.location.href = checkoutUrl;
  },

  // ── Host Earnings / Payouts ──────────────────────────────────────────────
  async getHostEarningsSummary(): Promise<{ totalEarned: number; pendingBalance: number }> {
    return api.get<{ totalEarned: number; pendingBalance: number }>('/host-earnings/summary');
  },

  async getPayoutTransactions(): Promise<any[]> {
    return api.get<any[]>('/host-earnings/transactions');
  },

  async withdrawFunds(amount: number, bankAccountId: string): Promise<any> {
    return api.post<any>('/host-earnings/withdraw', { amount, bankAccountId });
  },
};
