'use client';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice, calculateDays } from '@/lib/utils';
import { PLATFORM_FEE_PERCENT } from '@/shared/constants';

interface PriceBreakdownProps {
  dailyRate: number;
  startDate: Date;
  endDate: Date;
  deposit: number;
  extras?: { name: string; price: number; quantity: number }[];
}

export default function PriceBreakdown({ dailyRate, startDate, endDate, deposit, extras = [] }: PriceBreakdownProps) {
  const days = calculateDays(startDate, endDate);
  const rentTotal = dailyRate * days;
  const extrasTotal = extras.reduce((sum, extra) => sum + (extra.price * extra.quantity), 0);
  const subtotal = rentTotal + extrasTotal;
  const serviceFee = subtotal * PLATFORM_FEE_PERCENT;
  const total = subtotal + serviceFee;

  return (
    <Card className="glassmorphism-card p-6 font-secondary">
      <h3 className="text-lg font-bold font-primary mb-4">Price Breakdown</h3>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>{formatPrice(dailyRate)} × {days} days</span>
          <span className="font-semibold">{formatPrice(rentTotal)}</span>
        </div>
        
        {extras.map((extra, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span>{extra.name} × {extra.quantity}</span>
            <span className="font-semibold">{formatPrice(extra.price * extra.quantity)}</span>
          </div>
        ))}
        
        <div className="flex justify-between text-sm">
          <span>Service Fee ({PLATFORM_FEE_PERCENT * 100}%)</span>
          <span className="font-semibold">{formatPrice(serviceFee)}</span>
        </div>
        
        <Separator />
        
        <div className="flex justify-between text-base font-bold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
        
        <div className="flex justify-between text-sm text-slate-600">
          <span>Security Deposit (refundable)</span>
          <span className="font-semibold">{formatPrice(deposit)}</span>
        </div>
      </div>
    </Card>
  );
}