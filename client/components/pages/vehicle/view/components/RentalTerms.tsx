"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VehicleDetails } from "./types";

export function RentalTerms({ vehicle }: { vehicle: VehicleDetails }) {
  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Rental Terms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <p className="text-xs text-muted-foreground mb-1">Daily Rate</p>
              <p className="text-2xl font-bold text-blue-600">₦{vehicle.dailyRate.toLocaleString()}</p>
            </div>
            
            {vehicle.weeklyRate && (
              <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                <p className="text-xs text-muted-foreground mb-1">Weekly Rate</p>
                <p className="text-2xl font-bold text-green-600">₦{vehicle.weeklyRate.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">Save 14%</p>
              </div>
            )}
            
            {vehicle.monthlyRate && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-muted-foreground mb-1">Monthly Rate</p>
                <p className="text-2xl font-bold text-purple-600">₦{vehicle.monthlyRate.toLocaleString()}</p>
                <p className="text-xs text-purple-700 mt-1">Save 27%</p>
              </div>
            )}
            
            <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-xs text-muted-foreground mb-1">Security Deposit</p>
              <p className="text-2xl font-bold text-amber-600">₦{vehicle.securityDeposit.toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Minimum Rental</p>
              <p className="font-medium text-foreground">
                {vehicle.minimumRentalDays} {vehicle.minimumRentalDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            {vehicle.mileageIncluded && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Mileage Included</p>
                <p className="font-medium text-foreground">{vehicle.mileageIncluded} km/day</p>
              </div>
            )}
            {vehicle.excessMileageCharge && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Excess Mileage</p>
                <p className="font-medium text-foreground">₦{vehicle.excessMileageCharge}/km</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
