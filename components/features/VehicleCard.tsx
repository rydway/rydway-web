import Link from "next/link";
import { Car } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VehicleCardProps {
  id: string;
  name: string;
  type: string;
  dailyRate: string | number;
  rating: number;
  image?: string;
  hrefPrefix?: string;
}

export function VehicleCard({
  id,
  name,
  type,
  dailyRate,
  rating,
  hrefPrefix = "/dashboard/renter"
}: VehicleCardProps) {
  return (
    <Card className="overflow-hidden border-slate-200 hover:border-primary/20 transition-all shadow-none">
      <div className="h-40 bg-slate-100 flex items-center justify-center relative">
        <Car className="h-12 w-12 text-slate-300" />
        <span className="absolute top-2 left-2 text-xs bg-white text-slate-700 px-2 py-0.5 rounded font-medium shadow-sm">
          ★ {rating}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <span className="text-xs text-slate-400 uppercase font-semibold tracking-wider font-primary">{type}</span>
          <h4 className="font-semibold text-slate-800 dark:text-white font-primary">{name}</h4>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold font-primary">{dailyRate}<span className="text-xs text-slate-400 font-normal"> / day</span></span>
          <Button size="sm" variant="outline" className="text-xs font-primary" asChild>
            <Link href={`${hrefPrefix}/booking/${id}`}>
              Book Now
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
