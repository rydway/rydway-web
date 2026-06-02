"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryRevenue } from "./types";

interface CategoryBreakdownProps {
  categories: CategoryRevenue[];
  totalRevenue: number;
  formatCompactCurrency: (val: number) => string;
}

export function CategoryBreakdown({ categories, totalRevenue, formatCompactCurrency }: CategoryBreakdownProps) {
  return (
    <Card className="border-slate-200 shadow-sm font-secondary">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Car className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
            Revenue by Vehicle Category
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categories}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {categories.map((entry, i) => (
                    <Cell key={`cell-${i}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Revenue"]}
                  contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="w-full md:w-1/2 space-y-3">
            {categories.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ background: cat.color }} />
                  <span className="text-sm text-slate-700">{cat.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-800">{formatCompactCurrency(cat.value)}</span>
                  <span className="text-xs text-slate-500 ml-2">({cat.count} cars)</span>
                </div>
              </div>
            ))}
            
            <div className="pt-3 mt-2 border-t border-slate-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-800">Total</span>
                <span className="text-sm font-bold text-blue-600">{formatCompactCurrency(totalRevenue)}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
