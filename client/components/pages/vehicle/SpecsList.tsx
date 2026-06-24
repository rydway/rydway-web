'use client';
import { Fuel, Settings, Users, Gauge, Calendar, Shield } from 'lucide-react';
import { Vehicle } from "@/types";

interface SpecsListProps {
  vehicle: Vehicle;
}

export default function SpecsList({ vehicle }: SpecsListProps) {
  const specs = [
    { icon: Fuel, label: 'Fuel Type', value: vehicle.fuelType },
    { icon: Settings, label: 'Transmission', value: vehicle.transmission },
    { icon: Users, label: 'Capacity', value: vehicle.capacity },
    { icon: Gauge, label: 'Fuel', value: vehicle.fuel },
    { icon: Calendar, label: 'Year', value: vehicle.year.toString() },
    { icon: Shield, label: 'Insurance', value: vehicle.insurance ? 'Included' : 'Not Included' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 font-secondary">
      {specs.map((spec, idx) => (
        <div key={idx} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50 dark:bg-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-foreground">
            <spec.icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{spec.label}</p>
            <p className="text-sm font-semibold text-foreground dark:text-white">{spec.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}