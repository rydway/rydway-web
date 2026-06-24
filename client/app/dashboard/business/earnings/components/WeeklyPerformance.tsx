"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, ArrowUpRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface WeeklyPerformanceProps {
  data: Array<{ day: string; thisWeek: number; lastWeek: number }>;
}

export function WeeklyPerformance({ data }: WeeklyPerformanceProps) {
  return (
    <Card className="border-border shadow-sm font-secondary">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-lg font-semibold text-foreground font-primary">
              Weekly Performance
            </CardTitle>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-600"></div>
              <span className="text-xs text-muted-foreground">This Week</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-slate-300"></div>
              <span className="text-xs text-muted-foreground">Last Week</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 10, left: 10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis dataKey="day" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis 
                stroke="#64748b" 
                tickFormatter={(value) => `₦${value / 1000}K`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`₦${Number(value).toLocaleString()}`, ""]}
                contentStyle={{ fontSize: '12px', borderRadius: '8px' }}
              />
              <Bar dataKey="lastWeek" name="Last Week" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={20} />
              <Bar dataKey="thisWeek" name="This Week" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-foreground">Week-over-week growth</span>
          </div>
          <div className="flex items-center gap-1">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-600">+15.3%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
