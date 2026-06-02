"use client";

import { 
  Settings as SettingsIcon, 
  Car, 
  Calendar, 
  Fuel, 
  Gauge, 
  Users, 
  Key, 
  Briefcase, 
  MapPin, 
  Wrench 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VehicleDetails } from "./types";

export function VehicleSpecs({ vehicle }: { vehicle: VehicleDetails }) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-slate-800 flex items-center gap-2">
          <SettingsIcon className="h-5 w-5 text-blue-600" />
          Specifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Car className="h-4 w-4" />
              <span className="text-xs">Make & Model</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {vehicle.make} {vehicle.model}
            </p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Calendar className="h-4 w-4" />
              <span className="text-xs">Year</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{vehicle.year}</p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Fuel className="h-4 w-4" />
              <span className="text-xs">Fuel Type</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{vehicle.fuelType}</p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Gauge className="h-4 w-4" />
              <span className="text-xs">Transmission</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{vehicle.transmission}</p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Users className="h-4 w-4" />
              <span className="text-xs">Seats</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{vehicle.seats} seats</p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Key className="h-4 w-4" />
              <span className="text-xs">Doors</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{vehicle.doors || 4} doors</p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <Briefcase className="h-4 w-4" />
              <span className="text-xs">Color</span>
            </div>
            <p className="text-sm font-semibold text-slate-800">{vehicle.color}</p>
          </div>
          
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-2 text-slate-600 mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-xs">Plate Number</span>
            </div>
            <p className="text-sm font-mono font-semibold text-slate-800">{vehicle.plateNumber}</p>
          </div>
          
          {vehicle.engine && (
            <div className="p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-2 text-slate-600 mb-1">
                <Wrench className="h-4 w-4" />
                <span className="text-xs">Engine</span>
              </div>
              <p className="text-sm font-semibold text-slate-800">{vehicle.engine}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
