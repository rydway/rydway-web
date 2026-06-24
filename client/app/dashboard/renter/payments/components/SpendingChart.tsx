"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SpendingChart({ data }: { data?: { month: string; amount: number }[] }) {
  const defaultData = [
    { month: 'Jan', amount: 0 },
    { month: 'Feb', amount: 0 },
    { month: 'Mar', amount: 0 },
    { month: 'Apr', amount: 0 },
    { month: 'May', amount: 0 },
    { month: 'Jun', amount: 0 },
  ];

  const chartData = data && data.length > 0 ? data : defaultData;

  const maxAmount = Math.max(...chartData.map(m => m.amount));

  return (
    <div className="space-y-4 font-secondary">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground">Monthly Spending</h4>
        <Select defaultValue="6months">
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="3months">Last 3 months</SelectItem>
            <SelectItem value="6months">Last 6 months</SelectItem>
            <SelectItem value="12months">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-40 flex items-end gap-3 pt-6">
        {chartData.map((month) => (
          <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-primary/20 rounded-t-lg relative group hover:bg-primary/40 transition-colors text-primary-foreground"
              style={{ 
                height: `${maxAmount > 0 ? (month.amount / maxAmount) * 100 : 0}px`,
                minHeight: '20px'
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                ₦{month.amount.toLocaleString()}
              </div>
            </div>
            <span className="text-xs text-muted-foreground font-medium">{month.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
