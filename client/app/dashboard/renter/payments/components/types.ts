export interface Payment {
  id: string;
  transactionId: string;
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded' | 'processing';
  type: 'booking' | 'extension' | 'deposit' | 'refund' | 'fee';
  method: 'card' | 'bank_transfer' | 'wallet' | 'cash';
  description: string;
  date: Date;
  bookingId?: string;
  vehicleName?: string;
  vehicleImage?: string;
  location?: string;
  paymentIntent?: string;
  receipt?: string;
  metadata?: Record<string, any>;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  paymentId: string;
  date: Date;
  dueDate?: Date;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  pdfUrl?: string;
}
