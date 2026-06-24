"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatPrice } from "@/lib/utils";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { Vehicle } from "@/types";

interface FleetListProps {
  vehicles: Vehicle[];
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleAvailability?: (id: string) => void;
}

export default function FleetList({ vehicles, onEdit, onDelete, onToggleAvailability }: FleetListProps) {
  return (
    <div className="space-y-4">
      {vehicles.map((vehicle) => (
        <Card key={vehicle.id} className="glassmorphism-card p-6">
          <div className="flex gap-4">
            <img
              src={vehicle.photos[0]}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-32 h-24 object-cover rounded-xl"
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-lg font-bold font-primary">
                    {vehicle.make} {vehicle.model}
                  </h3>
                  <p className="text-sm text-muted-foreground font-secondary">
                    {vehicle.year} • {vehicle.plate}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary font-primary">
                    {formatPrice(vehicle.rateDaily)}
                  </p>
                  <p className="text-xs text-muted-foreground font-secondary">/day</p>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-600 dark:text-blue-400 font-secondary">
                  {vehicle.category}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-foreground font-secondary">
                  {vehicle.transmission}
                </span>
                <span className="px-2 py-1 text-xs rounded-full bg-muted text-foreground font-secondary">
                  {vehicle.capacity}
                </span>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => onEdit?.(vehicle.id)}
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => onToggleAvailability?.(vehicle.id)}
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                >
                  {vehicle.availabilityBlocks?.length > 0 ? (
                    <><EyeOff className="h-4 w-4 mr-1" /> Disable</>
                  ) : (
                    <><Eye className="h-4 w-4 mr-1" /> Enable</>
                  )}
                </Button>
                <Button
                  onClick={() => onDelete?.(vehicle.id)}
                  size="sm"
                  variant="outline"
                  className="rounded-xl border-red-500 text-red-600 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}