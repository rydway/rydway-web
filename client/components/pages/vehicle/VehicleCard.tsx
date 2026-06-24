"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Fuel, Settings, Users, Star } from "lucide-react";
import { Vehicle } from "@/types";
import { formatPrice } from "@/lib/utils";

interface VehicleCardProps {
  vehicle: Vehicle;
  onFavoriteToggle?: (id: string) => void;
  onRentNow?: (id: string) => void;
}

export function VehicleCard({ vehicle, onFavoriteToggle, onRentNow }: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    onFavoriteToggle?.(vehicle.id);
  };

  return (
    <Card className="font-primary relative flex h-full flex-col overflow-hidden rounded-3xl border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg group">
      <div className="relative h-40 shrink-0 overflow-hidden">
        <img
          src={vehicle.photos[0]}
          alt={`${vehicle.make} ${vehicle.model}`}
          className="h-full w-full object-cover p-4 transition-transform duration-500 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className={`absolute right-4 top-4 h-8 w-8 rounded-full bg-white/90 backdrop-blur ${
            isFavorite ? 'shadow-md' : ''
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </Button>
      </div>
      
      <div className="flex flex-1 flex-col">
        <CardContent className="flex-1 p-4 font-secondary">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-foreground font-primary sm:text-base line-clamp-1">
                {vehicle.make} {vehicle.model}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm line-clamp-1">
                {vehicle.category} • {vehicle.businessName}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-base font-primary font-bold text-primary sm:text-lg">
                  {formatPrice(vehicle.rateDaily)}
                </span>
                <span className="text-xs text-muted-foreground sm:text-sm">/day</span>
              </div>
            </div>
          </div>
          
          <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4 text-muted-foreground">
            <div className="flex flex-col items-center gap-1">
              <Fuel className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{vehicle.fuelType}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Settings className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{vehicle.transmission}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">{vehicle.capacity}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-medium">{vehicle.rating || '5.0'}</span>
            </div>
          </div>
        </CardContent>
        
        <div className="border-t border-slate-100 p-4">
          <Button 
            onClick={() => onRentNow?.(vehicle.id)}
            className="w-full rounded-xl bg-primary font-secondary text-white shadow-md shadow-primary/20 hover:bg-blue-600"
          >
            Rent Now
          </Button>
        </div>
      </div>
    </Card>
  );
}