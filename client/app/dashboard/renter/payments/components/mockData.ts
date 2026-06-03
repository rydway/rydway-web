import { Payment, Invoice } from "./types";
import { PaymentMethod } from "@/components/base/cards/PaymentMethodCard";

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2028,
    cardholderName: "John Doe",
    isDefault: true,
    brand: "Visa"
  },
  {
    id: "pm-2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2027,
    cardholderName: "John Doe",
    isDefault: false,
    brand: "Mastercard"
  },
  {
    id: "pm-3",
    type: "verve",
    last4: "1234",
    expiryMonth: 5,
    expiryYear: 2026,
    cardholderName: "John Doe",
    isDefault: false,
    brand: "Verve"
  },
  {
    id: "pm-4",
    type: "bank",
    bankName: "Guaranty Trust Bank",
    accountNumber: "0123456789",
    accountName: "John Doe",
    isDefault: false
  }
];

export const mockPayments: Payment[] = [
  {
    id: "pay-1",
    transactionId: "RWD-CHG-2026-0315-001",
    amount: 75000,
    currency: "NGN",
    status: "completed",
    type: "booking",
    method: "card",
    description: "Toyota Camry 2023 - 3 days rental",
    date: new Date(2026, 2, 15, 10, 30),
    bookingId: "book-001",
    vehicleName: "Toyota Camry 2023",
    location: "Victoria Island, Lagos",
    paymentIntent: "pi_1234567890",
    receipt: "/receipts/001.pdf"
  },
  {
    id: "pay-2",
    transactionId: "RWD-CHG-2026-0312-002",
    amount: 225000,
    currency: "NGN",
    status: "completed",
    type: "booking",
    method: "bank_transfer",
    description: "Mercedes GLE - 3 days rental",
    date: new Date(2026, 2, 12, 14, 45),
    bookingId: "book-002",
    vehicleName: "Mercedes GLE",
    location: "Ikoyi, Lagos"
  },
  {
    id: "pay-3",
    transactionId: "RWD-CHG-2026-0308-003",
    amount: 50000,
    currency: "NGN",
    status: "completed",
    type: "extension",
    method: "card",
    description: "Toyota Camry - 2 days extension",
    date: new Date(2026, 2, 8, 9, 15),
    bookingId: "book-001",
    vehicleName: "Toyota Camry 2023",
    location: "Victoria Island, Lagos"
  },
  {
    id: "pay-4",
    transactionId: "RWD-CHG-2026-0305-004",
    amount: 380000,
    currency: "NGN",
    status: "completed",
    type: "booking",
    method: "card",
    description: "Range Rover Sport - 4 days rental",
    date: new Date(2026, 2, 5, 11, 20),
    bookingId: "book-003",
    vehicleName: "Range Rover Sport",
    location: "Ikoyi, Lagos"
  },
  {
    id: "pay-5",
    transactionId: "RWD-CHG-2026-0316-005",
    amount: 135000,
    currency: "NGN",
    status: "pending",
    type: "booking",
    method: "bank_transfer",
    description: "BMW 3 Series - 3 days rental",
    date: new Date(2026, 2, 16, 8, 0),
    bookingId: "book-004",
    vehicleName: "BMW 3 Series",
    location: "Lekki, Lagos"
  },
  {
    id: "pay-6",
    transactionId: "RWD-CHG-2026-0316-006",
    amount: 100000,
    currency: "NGN",
    status: "processing",
    type: "deposit",
    method: "card",
    description: "Security deposit - Ford Explorer",
    date: new Date(2026, 2, 16, 15, 30),
    bookingId: "book-005",
    vehicleName: "Ford Explorer",
    location: "Victoria Island, Lagos"
  },
  {
    id: "pay-7",
    transactionId: "RWD-CHG-2026-0314-007",
    amount: 165000,
    currency: "NGN",
    status: "failed",
    type: "booking",
    method: "card",
    description: "Toyota Hilux - 4 days rental",
    date: new Date(2026, 2, 14, 13, 45),
    bookingId: "book-006",
    vehicleName: "Toyota Hilux",
    location: "Lekki, Lagos"
  },
  {
    id: "pay-8",
    transactionId: "RWD-REF-2026-0310-008",
    amount: 110000,
    currency: "NGN",
    status: "refunded",
    type: "refund",
    method: "card",
    description: "Refund - Toyota RAV4 (cancelled)",
    date: new Date(2026, 2, 10, 16, 20),
    bookingId: "book-007",
    vehicleName: "Toyota RAV4",
    location: "Ikeja, Lagos"
  }
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026-0315-001",
    paymentId: "pay-1",
    date: new Date(2026, 2, 15, 10, 30),
    dueDate: new Date(2026, 2, 15, 10, 30),
    amount: 75000,
    status: "paid",
    pdfUrl: "/invoices/001.pdf"
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026-0312-002",
    paymentId: "pay-2",
    date: new Date(2026, 2, 12, 14, 45),
    dueDate: new Date(2026, 2, 12, 14, 45),
    amount: 225000,
    status: "paid"
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026-0316-003",
    paymentId: "pay-5",
    date: new Date(2026, 2, 16, 8, 0),
    dueDate: new Date(2026, 2, 18, 8, 0),
    amount: 135000,
    status: "pending"
  }
];
