import { api } from "@/lib/api/client";
import { Payment } from "@/types/models";

export interface PaymentInitResponse {
  payment: {
    id: string;
    transactionRef: string;
    amount: number;
    status: string;
  };
  checkoutUrl: string;
  accessCode: string;
}

// Define proper types for earnings
export interface EarningsSummary {
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  availableBalance: number;
}

export interface PayoutTransaction {
  id: string;
  amount: number;
  status: string;
  transactionRef: string;
  createdAt: string;
  destinationBankName: string;
  destinationAccountNumber: string;
  destinationAccountName: string;
  booking?: {
    bookingNumber: string;
  };
}

export interface WithdrawResponse {
  id: string;
  amount: number;
  status: string;
  transactionRef: string;
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
    return api.post<PaymentInitResponse>("/payments/initialize", {
      bookingId: data.bookingId,
      provider: data.provider || "paystack",
      method: data.method || "card",
    });
  },

  /**
   * Manually verify a payment by its transaction reference.
   * Call this on the Paystack callback page after redirect.
   */
  async verifyPayment(transactionRef: string): Promise<Payment> {
    return api.post<Payment>("/payments/verify", { transactionRef });
  },

  /**
   * Fetch the authenticated user's full payment transaction history.
   */
  async getTransactions(): Promise<Payment[]> {
    return api.get<Payment[]>("/payments/transactions");
  },

  /**
   * Open the Paystack checkout URL in the same tab, so the callback_url
   * set in the backend brings the user back to our app.
   */
  openCheckout(checkoutUrl: string) {
    window.location.href = checkoutUrl;
  },

  // ── Host Earnings / Payouts ──────────────────────────────────────────────
  /**
   * Get host earnings summary including available balance, total earned, withdrawn, and pending amounts.
   * Uses the correct endpoint matching the backend controller: @Controller('host/earnings')
   */
  async getHostEarningsSummary(): Promise<EarningsSummary> {
    const response = await api.get<{ message: string; data: EarningsSummary }>(
      "/host/earnings/summary",
    );
    return response.data;
  },

  /**
   * Get all payout transactions for the authenticated host.
   * Uses the correct endpoint matching the backend controller: @Controller('host/earnings')
   */
  async getPayoutTransactions(): Promise<PayoutTransaction[]> {
    const response = await api.get<{
      message: string;
      data: PayoutTransaction[];
    }>("/host/earnings/transactions");
    return response.data;
  },

  /**
   * Request a withdrawal of earnings.
   * Uses the correct endpoint matching the backend controller: @Controller('host/earnings')
   * @param amount - The amount to withdraw
   * @param bankAccountId - The bank account ID to withdraw to (optional, uses default if not provided)
   */
  async withdrawFunds(
    amount: number,
    bankAccountId?: string,
  ): Promise<WithdrawResponse> {
    const response = await api.post<{
      message: string;
      data: WithdrawResponse;
    }>("/host/earnings/withdraw", {
      amount: amount.toString(), // Convert to string as expected by the DTO
      bankAccountId,
    });
    return response.data;
  },
};
