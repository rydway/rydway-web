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
    <Card className="border-border shadow-sm font-secondary">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-lg font-semibold text-foreground font-primary">
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
                  index === 0 ? 'bg-amber-100 text-amber-600 dark:text-amber-400' :
                  index === 1 ? 'bg-muted text-foreground' :
                  index === 2 ? 'bg-orange-100 text-orange-700' :
                  'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                }`}>
                  #{index + 1}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{vehicle.name}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.bookings} bookings</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{formatCompactCurrency(vehicle.revenue)}</p>
                <p className="text-xs text-green-600">{vehicle.utilization}% utilized</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Average Daily Rate</span>
            <span className="text-sm font-semibold text-foreground">{formatCurrency(averageDailyRate)}</span>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-sm text-muted-foreground">Avg. Booking Value</span>
            <span className="text-sm font-semibold text-foreground">{formatCompactCurrency(averageBookingValue)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
