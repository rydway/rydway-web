// components/CarCard.tsx
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import from next/navigation
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Heart, 
  Fuel, 
  Save,
  Settings, 
  Users, 
  Star, 
  Zap, 
  Battery, 
  Droplet
} from "lucide-react";
import { Vehicle } from "@/types/vehicle";

interface VehicleCardProps {
  vehicle: Vehicle;
  onFavoriteToggle?: (vehicleId: string) => void;
  onRentNow?: (vehicleId: string) => void;
  className?: string;
}

export default function VehicleCard({ 
  vehicle, 
  onFavoriteToggle, 
  onRentNow,
  className = "" 
}: VehicleCardProps) {
  const [isFavorite, setIsFavorite] = useState(vehicle.isFavorite);
  const router = useRouter(); // Initialize the router
  
  const handleFavoriteToggle = () => {
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);
    
    // Update the car object if needed
    vehicle.isFavorite = newFavoriteState;
    
    // Call parent callback if provided
    if (onFavoriteToggle) {
      onFavoriteToggle(vehicle.id);
    }
  };

  const handleRentNow = () => {

    if (onRentNow) {
      onRentNow(vehicle.id);
    } else {
   
      router.push(`/dashboard/renter/vehicles/${vehicle.id}`);
    }
  };
  
  // Format price display
  const formatPrice = (price: string) => {
    if (!price.startsWith('₦')) {
      return `₦${price}`;
    }
    return price;
  };
  
  // Get fuel type icon
  const getFuelIcon = (fuelType?: string) => {
    switch (fuelType?.toLowerCase()) {
      case 'electric':
        return <Zap className="h-3.5 w-3.5" />;
      case 'hybrid':
        return <Battery className="h-3.5 w-3.5" />;
      case 'diesel':
        return <Droplet className="h-3.5 w-3.5" />;
      default:
        return <Fuel className="h-3.5 w-3.5" />;
    }
  };

  // Get fuel type text
  const getFuelText = (fuelType?: string) => {
    switch (fuelType?.toLowerCase()) {
      case 'electric':
        return 'Electric';
      case 'hybrid':
        return 'Hybrid';
      case 'diesel':
        return 'Diesel';
      default:
        return 'Petrol';
    }
  };
  
  return (
    <Card className={`font-primary relative flex h-full flex-col overflow-hidden rounded-3xl border-slate-100 bg-white shadow-sm transition-all duration-300 hover:shadow-lg group dark:border-slate-700 dark:bg-slate-800 ${className}`}>
      {/* Image Section */}
      <div className="relative h-40 shrink-0 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="h-full w-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
        />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteToggle}
          className={`absolute right-4 top-1 h-8 w-8 rounded-full bg-white/90 backdrop-blur transition-all hover:scale-110 hover:bg-white dark:bg-slate-900/90 dark:hover:bg-slate-900 ${
            isFavorite ? 'shadow-md ' : ''
          }`}
          aria-label={isFavorite ? "Remove from bookmarks" : "Add to bookmarks"}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite 
                ? 'fill-red-500 text-red-500 dark:fill-red-400 dark:text-red-400' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          />
        </Button>
      </div>
      
      {/* Content Section - Takes remaining space */}
      <div className="flex flex-1 flex-col">
        <CardContent className="flex-1 p-4 font-secondary">
          {/* Header with name and price - Always side by side */}
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-slate-800 font-primary dark:text-white sm:text-base line-clamp-1 break-words">
                {vehicle.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm line-clamp-1">
                {vehicle.category} {vehicle.fleet ? `• ${vehicle.fleet}` : ''}
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <div className="flex items-baseline justify-end gap-1">
                <span className="text-base font-primary font-bold text-primary sm:text-lg whitespace-nowrap">
                  {formatPrice(vehicle.price)}
                </span>
                <span className="text-xs text-slate-400 sm:text-sm whitespace-nowrap">/day</span>
              </div>
              {vehicle.originalPrice && (
                <span className="text-xs text-slate-400 line-through whitespace-nowrap">
                  {formatPrice(vehicle.originalPrice)}
                </span>
              )}
            </div>
          </div>
          
          {/* Features */}
          <div className="mb-4 flex items-center justify-between border-t border-slate-100 pt-4 text-slate-500 dark:border-slate-700 dark:text-slate-400">
            <div className="flex flex-col items-center gap-1">
              {getFuelIcon(vehicle.fuelType)}
              <span className="text-xs font-medium whitespace-nowrap">{getFuelText(vehicle.fuelType)}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Settings className="h-3.5 w-3.5" />
              <span className="text-xs font-medium whitespace-nowrap">{vehicle.transmission}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              <span className="text-xs font-medium whitespace-nowrap">{vehicle.capacity}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Fuel className="h-3.5 w-3.5" />
              <span className="text-xs font-medium whitespace-nowrap">{vehicle.fuel}</span>
            </div>
          </div>
        </CardContent>
        
        {/* Action Buttons - Fixed at bottom of card */}
        <div className="border-t border-slate-100 p-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <Button 
              onClick={handleRentNow}
              className="flex-1 rounded-xl bg-primary font-secondary text-white shadow-md shadow-primary/20 hover:bg-blue-600"
            >
              Rent Now
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}