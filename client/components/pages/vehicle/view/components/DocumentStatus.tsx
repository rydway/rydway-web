"use client";

import { FileText, Shield, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { VehicleDetails } from "./types";

export function DocumentStatus({ vehicle }: { vehicle: VehicleDetails }) {
  const getExpiryStatus = (date?: Date) => {
    if (!date) return null;
    const now = new Date();
    const expiryDate = new Date(date);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) return { status: 'expired', color: 'red', text: 'Expired' };
    if (daysUntilExpiry < 30) return { status: 'warning', color: 'amber', text: `${daysUntilExpiry} days left` };
    return { status: 'valid', color: 'green', text: `${daysUntilExpiry} days left` };
  };

  const renderBadge = (date?: Date) => {
    const status = getExpiryStatus(date);
    if (!status) return null;

    let badgeClass = "";
    if (status.color === 'red') {
      badgeClass = "bg-red-50 text-red-700 border-red-200";
    } else if (status.color === 'amber') {
      badgeClass = "bg-amber-50 text-amber-700 border-amber-200";
    } else {
      badgeClass = "bg-green-50 text-green-700 border-green-200";
    }

    return (
      <Badge 
        variant={status.color as any}
        className={`text-[10px] px-1.5 py-0 h-4 border ${badgeClass}`}
      >
        {status.text}
      </Badge>
    );
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          Documents & Insurance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {vehicle.insuranceExpiry && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700">Insurance</span>
              </div>
              {renderBadge(vehicle.insuranceExpiry)}
            </div>
          )}
          
          {vehicle.roadWorthinessExpiry && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700">Road Worthiness</span>
              </div>
              {renderBadge(vehicle.roadWorthinessExpiry)}
            </div>
          )}
          
          {vehicle.registrationExpiry && (
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-700">Registration</span>
              </div>
              {renderBadge(vehicle.registrationExpiry)}
            </div>
          )}

          {!vehicle.insuranceExpiry && !vehicle.roadWorthinessExpiry && !vehicle.registrationExpiry && (
            <p className="text-xs text-slate-500 text-center py-2">No documents logged.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
