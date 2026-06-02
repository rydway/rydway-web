"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { VehicleDetails } from "./types";

export function RentalTerms({ vehicle }: { vehicle: VehicleDetails }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-blue-600" />
          Rental Terms
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-slate-500 mb-1">Daily Rate</p>
              <p className="text-2xl font-bold text-blue-600">₦{vehicle.dailyRate.toLocaleString()}</p>
            </div>
            
            {vehicle.weeklyRate && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-xs text-slate-500 mb-1">Weekly Rate</p>
                <p className="text-2xl font-bold text-green-600">₦{vehicle.weeklyRate.toLocaleString()}</p>
                <p className="text-xs text-green-700 mt-1">Save 14%</p>
              </div>
            )}
            
            {vehicle.monthlyRate && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-xs text-slate-500 mb-1">Monthly Rate</p>
                <p className="text-2xl font-bold text-purple-600">₦{vehicle.monthlyRate.toLocaleString()}</p>
                <p className="text-xs text-purple-700 mt-1">Save 27%</p>
              </div>
            )}
            
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-xs text-slate-500 mb-1">Security Deposit</p>
              <p className="text-2xl font-bold text-amber-600">₦{vehicle.securityDeposit.toLocaleString()}</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-slate-500 mb-1">Minimum Rental</p>
              <p className="font-medium text-slate-800">
                {vehicle.minimumRentalDays} {vehicle.minimumRentalDays === 1 ? 'day' : 'days'}
              </p>
            </div>
            {vehicle.mileageIncluded && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Mileage Included</p>
                <p className="font-medium text-slate-800">{vehicle.mileageIncluded} km/day</p>
              </div>
            )}
            {vehicle.excessMileageCharge && (
              <div>
                <p className="text-xs text-slate-500 mb-1">Excess Mileage</p>
                <p className="font-medium text-slate-800">₦{vehicle.excessMileageCharge}/km</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
