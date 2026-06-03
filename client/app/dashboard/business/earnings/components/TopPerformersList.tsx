"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Award } from "lucide-react";
import { PerformingVehicle } from "./types";

interface TopPerformersListProps {
  vehicles: PerformingVehicle[];
  averageDailyRate: number;
  averageBookingValue: number;
  formatCurrency: (val: number) => string;
  formatCompactCurrency: (val: number) => string;
}

export function TopPerformersList({
  vehicles,
  averageDailyRate,
  averageBookingValue,
  formatCurrency,
  formatCompactCurrency
}: TopPerformersListProps) {
  return (
    <Card className="border-slate-200 shadow-sm font-secondary">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
            Top Performers
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Highest revenue generating vehicles
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {vehicles.map((vehicle, index) => (
            <div key={vehicle.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  index === 0 ? 'bg-amber-100 text-amber-700' :
                  index === 1 ? 'bg-slate-100 text-slate-700' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-50 text-blue-700'
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{vehicle.name}</p>
                  <p className="text-xs text-slate-500">{vehicle.bookings} bookings</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{formatCompactCurrency(vehicle.revenue)}</p>
                <p className="text-xs text-green-600">{vehicle.utilization}% utilized</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-600">Average Daily Rate</span>
            <span className="text-sm font-semibold text-slate-800">{formatCurrency(averageDailyRate)}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-slate-600">Avg. Booking Value</span>
            <span className="text-sm font-semibold text-slate-800">{formatCompactCurrency(averageBookingValue)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
