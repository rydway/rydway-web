"use client";

import { Briefcase, Shield, Star, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VehicleDetails } from "./types";

export function BusinessInfo({ vehicle }: { vehicle: VehicleDetails }) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden relative z-0">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-blue-600" />
          Host Information
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 relative z-0">
            <Avatar className="h-16 w-16 border-2 border-slate-200 shadow-sm">
              <AvatarImage src={vehicle.businessLogo} />
              <AvatarFallback className="bg-blue-100 text-blue-700 text-lg font-primary">
                {vehicle.businessName ? vehicle.businessName.split(' ').map(n => n[0]).join('') : 'H'}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h3 className="text-base font-semibold text-slate-800 truncate">{vehicle.businessName}</h3>
              {vehicle.businessVerified && (
                <Shield className="h-4 w-4 text-blue-500 fill-blue-500 flex-shrink-0" />
              )}
            </div>
            
            <div className="flex items-center gap-1 mb-2">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-slate-800">{vehicle.businessRating}</span>
              <span className="text-xs text-slate-500">({vehicle.businessTotalReviews} reviews)</span>
            </div>
            
            {vehicle.businessMemberSince && (
              <p className="text-xs text-slate-500 mb-3">
                Member since {new Date(vehicle.businessMemberSince).toLocaleDateString('default', { month: 'long', year: 'numeric' })}
              </p>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600 truncate">{vehicle.businessPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span className="text-slate-600 truncate">{vehicle.businessEmail}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
