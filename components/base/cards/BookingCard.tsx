import Image from "next/image";
import { Calendar, MapPin, User, MoreVertical, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface BookingCardProps {
  id: string;
  carImage: string;
  carName: string;
  carType: string;
  renterName?: string;
  ownerName?: string;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  pickupTime?: string; // Added for pickup time
  dropoffTime?: string; // Added for dropoff time
  totalDays: number;
  totalAmount: number;
  status: 'requested' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  role?: 'renter' | 'business'; // Changed from userType to role for consistency
  onViewDetails?: (id: string) => void;
  onApprove?: (id: string) => void;
  onDecline?: (id: string) => void;
  onCancel?: (id: string) => void;
  onContact?: (id: string) => void;
  onExtend?: (id: string) => void;
  onReview?: (id: string) => void;
  onReceipt?: (id: string) => void;
  onTrack?: (id: string) => void;
  className?: string;
}

export function BookingCard({
  id,
  carImage,
  carName,
  carType,
  renterName,
  ownerName,
  startDate,
  endDate,
  pickupLocation,
  dropoffLocation,
  pickupTime,
  dropoffTime,
  totalDays,
  totalAmount,
  status,
  paymentStatus,
  role = 'renter',
  onViewDetails,
  onApprove,
  onDecline,
  onCancel,
  onContact,
  onExtend,
  onReview,
  onReceipt,
  onTrack,
  className
}: BookingCardProps) {
  const getStatusBadge = () => {
    switch (status) {
      case 'requested':
        return (
          <Badge variant="amber" className="font-primary">
            Requested
          </Badge>
        );
      case 'confirmed':
        return (
          <Badge variant="purple" className="font-primary">
            {role === 'business' ? 'Confirmed' : 'Upcoming'}
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="blue" className="font-primary">
            Active
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="green" className="font-primary">
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="red" className="font-primary">
            Cancelled
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = () => {
    switch (paymentStatus) {
      case 'paid':
        return (
          <Badge variant="green" className="text-xs font-primary">
            Paid
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="amber" className="text-xs font-primary">
            Pending
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="slate" className="text-xs font-primary">
            Refunded
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRenterActions = () => {
    const actions = [];
    
    // View Details (always available)
    actions.push(
      <DropdownMenuItem key="view-details" onClick={() => onViewDetails?.(id)} className="font-primary">
        View Details
      </DropdownMenuItem>
    );

    // Contact Owner
    actions.push(
      <DropdownMenuItem key="contact" onClick={() => onContact?.(id)} className="font-primary">
        Contact Owner
      </DropdownMenuItem>
    );

    // Status-specific actions for renter
    // Renter can cancel both requested and confirmed bookings
    if (status === 'requested' || status === 'confirmed') {
      actions.push(
        <DropdownMenuItem key="cancel" onClick={() => onCancel?.(id)} className="font-primary text-red-600">
          Cancel Booking
        </DropdownMenuItem>
      );
    }

    if (status === 'active') {
      actions.push(
        <DropdownMenuItem key="extend" onClick={() => onExtend?.(id)} className="font-primary">
          Extend Booking
        </DropdownMenuItem>
      );
      actions.push(
        <DropdownMenuItem key="track" onClick={() => onTrack?.(id)} className="font-primary">
          Track Vehicle
        </DropdownMenuItem>
      );
    }

    if (status === 'completed') {
      actions.push(
        <DropdownMenuItem key="review" onClick={() => onReview?.(id)} className="font-primary">
          Leave Review
        </DropdownMenuItem>
      );
      actions.push(
        <DropdownMenuItem key="receipt" onClick={() => onReceipt?.(id)} className="font-primary">
          Download Receipt
        </DropdownMenuItem>
      );
    }

    return actions;
  };

  const getBusinessActions = () => {
    const actions = [];
    
    // View Details (always available)
    actions.push(
      <DropdownMenuItem key="view-details" onClick={() => onViewDetails?.(id)} className="font-primary">
        View Details
      </DropdownMenuItem>
    );

    // Contact Renter
    actions.push(
      <DropdownMenuItem key="contact" onClick={() => onContact?.(id)} className="font-primary">
        Contact Renter
      </DropdownMenuItem>
    );

    // Status-specific actions for business
    if (status === 'confirmed') {
      actions.push(
        <DropdownMenuItem key="cancel" onClick={() => onCancel?.(id)} className="font-primary text-red-600">
          Cancel Booking
        </DropdownMenuItem>
      );
    }

    if (status === 'active') {
      actions.push(
        <DropdownMenuItem key="track" onClick={() => onTrack?.(id)} className="font-primary">
          Track Vehicle
        </DropdownMenuItem>
      );
    }

    if (status === 'completed') {
      actions.push(
        <DropdownMenuItem key="receipt" onClick={() => onReceipt?.(id)} className="font-primary">
          Download Receipt
        </DropdownMenuItem>
      );
    }

    return actions;
  };

  return (
    <Card className={cn(
      "overflow-hidden hover:border-primary/20 dark:hover:border-primary/30 transition-colors font-primary",
      className
    )}>
      {/* Car Image - Directly at top with no negative space */}
      <div className="relative h-48 w-full">
        <Image
          src={carImage}
          alt={carName}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
        <div className="absolute top-3 right-3">
          {getStatusBadge()}
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-lg font-primary">
              {carName}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 font-secondary">
              {carType} {ownerName && `• ${ownerName}`} {renterName && `• ${renterName}`}
            </p>
          </div>
          
          {/* Action button positioned opposite the name */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-transparent"
              >
                <MoreVertical className="h-4 w-4 text-slate-500 hover:text-slate-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="font-primary w-48">
              {role === 'renter' ? getRenterActions() : getBusinessActions()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Renter/Owner Info */}
        {renterName && role === 'business' && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-secondary">
            <User className="h-3 w-3" />
            <span>Renter: {renterName}</span>
          </div>
        )}
        {ownerName && role === 'renter' && (
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-secondary">
            <User className="h-3 w-3" />
            <span>Owner: {ownerName}</span>
          </div>
        )}

        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 mb-2 font-secondary">
          <Calendar className="h-3 w-3" />
          <span>{startDate} - {endDate}</span>
          <Badge 
            variant="outline" 
            className="ml-auto text-xs bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-foreground dark:border-primary/30 font-primary"
          >
            {totalDays} {totalDays === 1 ? 'day' : 'days'}
          </Badge>
        </div>

        {/* Pickup/Dropoff Times for Confirmed/Active bookings */}
        {(status === 'confirmed' || status === 'active') && (
          <div className="space-y-1">
            {pickupTime && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-secondary">
                <Clock className="h-3 w-3" />
                <span>Pickup: {pickupTime}</span>
              </div>
            )}
            {dropoffTime && (
              <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-secondary ml-5">
                <span>Dropoff: {dropoffTime}</span>
              </div>
            )}
          </div>
        )}

        {/* Location */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-secondary">
            <MapPin className="h-3 w-3" />
            <span className="truncate">Pickup: {pickupLocation}</span>
          </div>
          {dropoffLocation && (
            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-secondary ml-5">
              <span className="truncate">Dropoff: {dropoffLocation}</span>
            </div>
          )}
        </div>

        {/* Business Actions for Requested Status */}
        {role === 'business' && status === 'requested' && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              onClick={() => onApprove?.(id)}
              className="flex-1 bg-primary hover:bg-green-700 text-white font-primary"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDecline?.(id)}
              className="flex-1 text-red-600 border-red-500 bg-transparent hover:bg-red-50 hover:text-red-700 font-primary"
            >
              Decline
            </Button>
          </div>
        )}

        {/* Price */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-secondary">Total Amount</p>
              <p className="text-lg font-bold text-primary dark:text-primary-foreground font-primary">
                ₦{totalAmount.toLocaleString()}
              </p>
            </div>
            {/* Show payment status badge for all statuses except requested */}
            {status !== 'requested' && paymentStatus && getPaymentStatusBadge()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}