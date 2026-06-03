"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function SpendingChart() {
  const monthlySpend = [
    { month: 'Jan', amount: 85000 },
    { month: 'Feb', amount: 120000 },
    { month: 'Mar', amount: 225000 },
    { month: 'Apr', amount: 180000 },
    { month: 'May', amount: 275000 },
    { month: 'Jun', amount: 215000 },
  ];

  const maxAmount = Math.max(...monthlySpend.map(m => m.amount));

  return (
    <div className="space-y-4 font-secondary">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-slate-800">Monthly Spending</h4>
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
        {monthlySpend.map((month) => (
          <div key={month.month} className="flex-1 flex flex-col items-center gap-2">
            <div 
              className="w-full bg-blue-100 rounded-t-lg relative group hover:bg-blue-200 transition-colors"
              style={{ 
                height: `${(month.amount / maxAmount) * 100}px`,
                minHeight: '20px'
              }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                ₦{month.amount.toLocaleString()}
              </div>
            </div>
            <span className="text-xs text-slate-600 font-medium">{month.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
