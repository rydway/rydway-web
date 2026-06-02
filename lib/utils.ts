import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return `₦${numPrice.toLocaleString('en-NG')}`;
}

export function formatDate(date: Date | string, formatString: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatString);
}

export function calculateDays(startDate: Date, endDate: Date): number {
  return differenceInDays(endDate, startDate) + 1;
}

export function calculateBookingTotal(
  dailyRate: number,
  days: number,
  extras?: { price: number; quantity: number }[]
): number {
  const rentTotal = dailyRate * days;
  const extrasTotal = extras?.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0) || 0;
  return rentTotal + extrasTotal;
}

export function getStatusColor(status: string): string {
  const statusColors: Record<string, string> = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'verified': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'failed': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'requested': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'accepted': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'pending_payment': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    'paid': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    'active': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    'returned': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    'completed': 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    'cancelled': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    'disputed': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
}

export function getStatusText(status: string): string {
  const statusText: Record<string, string> = {
    'pending': 'Pending',
    'verified': 'Verified',
    'failed': 'Failed',
    'requested': 'Requested',
    'accepted': 'Accepted',
    'rejected': 'Rejected',
    'pending_payment': 'Pending Payment',
    'paid': 'Paid',
    'active': 'Active',
    'returned': 'Returned',
    'completed': 'Completed',
    'cancelled': 'Cancelled',
    'disputed': 'Disputed',
  };
  return statusText[status] || status;
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function validateNIN(nin: string): boolean {
  // Basic NIN validation (11 digits)
  return /^\d{11}$/.test(nin);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Nigerian phone number validation
  const phoneRegex = /^(\+234|0)[789]\d{9}$/;
  return phoneRegex.test(phone);
}

export function generateBookingReference(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = 'RYD-';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const seconds = Math.floor((new Date().getTime() - dateObj.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' years ago';
  
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  
  return 'Just now';
}