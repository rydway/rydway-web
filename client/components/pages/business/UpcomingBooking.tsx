"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatPrice, formatDate, calculateDays } from "@/lib/utils";
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react";
import { Booking } from "@/types";

interface UpcomingBookingCardProps {
  booking: Booking;
  onViewDetails?: () => void;
}

export default function UpcomingBookingCard({ booking, onViewDetails }: UpcomingBookingCardProps) {
  const daysUntil = calculateDays(new Date(), booking.startDate);

  return (
    <Card className="glassmorphism-card p-6 border-l-4 border-primary">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary font-secondary">
              {daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `In ${daysUntil} days`}
            </span>
          </div>
          <h3 className="text-lg font-bold font-primary">Your Next Trip</h3>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-primary font-primary">
            {formatPrice(booking.totalAmount)}
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm font-secondary">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>{formatDate(booking.startDate)} - {formatDate(booking.endDate)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-secondary">
          <MapPin className="h-4 w-4 text-slate-400" />
          <span>{booking.pickupLocation}</span>
        </div>
      </div>

      <Button 
        onClick={onViewDetails}
        className="w-full rounded-xl bg-primary hover:bg-blue-600 text-white"
      >
        View Details
        <ArrowRight className="h-4 w-4 ml-2" />
      </Button>
    </Card>
  );
}