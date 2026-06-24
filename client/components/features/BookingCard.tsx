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
        return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-primary">Active</Badge>;
      case "confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-primary">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-primary">Pending Payment</Badge>;
      default:
        return <Badge className="bg-muted/50 text-foreground border-border font-primary">{status}</Badge>;
    }
  };

  return (
    <Card className="p-4 border-border dark:border-border shadow-none hover:border-input transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-muted dark:bg-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
            <Car className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-foreground dark:text-white font-primary">{vehicleName}</h3>
              {getStatusBadge(status)}
            </div>
            <p className="text-xs text-muted-foreground font-secondary flex items-center gap-1">
              <User className="h-3 w-3 text-muted-foreground" /> {owner}
            </p>
          </div>
        </div>

        <div className="text-sm text-muted-foreground dark:text-slate-300 space-y-1 font-secondary sm:text-right">
          <div className="flex items-center sm:justify-end gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span>{startDate} - {endDate}</span>
          </div>
          <div className="flex items-center sm:justify-end gap-1">
            <MapPin className="h-3 w-3 text-muted-foreground" />
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
