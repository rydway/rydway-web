"use client";

import { BarChart3, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { VehicleDetails } from "./types";

export function BookingStats({ stats }: { stats?: VehicleDetails['bookingStats'] }) {
  if (!stats) return null;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-blue-600" />
          Booking Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Bookings</p>
              <p className="text-xl font-bold text-foreground">{stats.totalBookings}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">₦{stats.revenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Utilization Rate</p>
              <div className="flex items-center gap-2">
                <p className="text-xl font-bold text-amber-600">{stats.utilizationRate}%</p>
              </div>
              <Progress value={stats.utilizationRate} className="h-1.5 mt-2 bg-secondary" />
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Avg. Booking Length</p>
              <p className="text-xl font-bold text-purple-600">{stats.averageDaysPerBooking} days</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
            <div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mb-1">Repeat Customers</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.repeatCustomers}</p>
            </div>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
