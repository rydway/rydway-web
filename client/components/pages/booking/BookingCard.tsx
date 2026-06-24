"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatPrice, formatDate } from "@/lib/utils";
import { Calendar, MapPin, Car, ArrowRight } from "lucide-react";
import { Booking } from "@/types";
import StatusBadge from "@/components/base/StatusBadge";

interface BookingCardProps {
  booking: Booking;
  onViewDetails?: () => void;
  showActions?: boolean;
}

export default function BookingCard({ booking, onViewDetails, showActions = true }: BookingCardProps) {
  return (
    <Card className="glassmorphism-card hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-xs text-muted-foreground font-secondary mb-1">Booking ID: {booking.id}</p>
            <h3 className="text-lg font-bold font-primary">Vehicle Rental</h3>
          </div>
          <StatusBadge status={booking.status} />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-2 text-sm font-secondary">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
            <span className="text-muted-foreground">({booking.daysCount} days)</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-secondary">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{booking.pickupLocation}</span>
          </div>
          <div className="flex items-center gap-2 text-sm font-secondary">
            <Car className="h-4 w-4 text-muted-foreground" />
            <span>Vehicle ID: {booking.vehicleId}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <p className="text-xs text-muted-foreground font-secondary">Total Amount</p>
            <p className="text-xl font-bold text-primary font-primary">{formatPrice(booking.totalAmount)}</p>
          </div>
          {showActions && onViewDetails && (
            <Button 
              onClick={onViewDetails}
              variant="outline"
              className="rounded-xl"
            >
              View Details
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
