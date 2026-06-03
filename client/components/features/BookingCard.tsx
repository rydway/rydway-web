import Link from "next/link";
import { Car, Calendar, MapPin, User, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface BookingCardProps {
  id: string;
  vehicleName: string;
  image?: string;
  startDate: string;
  endDate: string;
  status: string;
  location: string;
  owner: string;
  amount: string;
  type: string;
  hrefPrefix?: string;
}

export function BookingCard({
  id,
  vehicleName,
  startDate,
  endDate,
  status,
  location,
  owner,
  hrefPrefix = "/dashboard/renter"
}: BookingCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-primary">Active</Badge>;
      case "confirmed":
        return <Badge className="bg-green-50 text-green-700 border-green-200 font-primary">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-primary">Pending Payment</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-primary">{status}</Badge>;
    }
  };

  return (
    <Card className="p-4 border-slate-200 dark:border-slate-800 shadow-none hover:border-slate-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            <Car className="h-6 w-6 text-slate-500" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-slate-800 dark:text-white font-primary">{vehicleName}</h3>
              {getStatusBadge(status)}
            </div>
            <p className="text-xs text-slate-500 font-secondary flex items-center gap-1">
              <User className="h-3 w-3 text-slate-400" /> {owner}
            </p>
          </div>
        </div>

        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1 font-secondary sm:text-right">
          <div className="flex items-center sm:justify-end gap-1">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span>{startDate} - {endDate}</span>
          </div>
          <div className="flex items-center sm:justify-end gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span>{location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:self-center">
          <Button size="sm" variant="outline" asChild className="text-xs font-primary">
            <Link href={`${hrefPrefix}/booking/${id}`}>
              Details
            </Link>
          </Button>
          <Button size="sm" className="bg-primary text-white text-xs font-primary" asChild>
            <Link href={`${hrefPrefix}/messages`}>
              <MessageSquare className="h-3 w-3 mr-1" /> Contact
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
