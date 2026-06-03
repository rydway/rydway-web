"use client";

import { cn, getStatusColor, getStatusText } from "@/lib/utils";
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  DollarSign,
  Car,
  RotateCcw,
  Ban,
  AlertTriangle
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export default function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true,
  className 
}: StatusBadgeProps) {
  const getIcon = () => {
    switch (status.toLowerCase()) {
      case 'pending':
      case 'requested':
      case 'pending_payment':
        return <Clock className="h-3.5 w-3.5" />;
      case 'verified':
      case 'accepted':
      case 'paid':
      case 'completed':
        return <CheckCircle2 className="h-3.5 w-3.5" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="h-3.5 w-3.5" />;
      case 'active':
        return <Car className="h-3.5 w-3.5" />;
      case 'returned':
        return <RotateCcw className="h-3.5 w-3.5" />;
      case 'cancelled':
        return <Ban className="h-3.5 w-3.5" />;
      case 'disputed':
        return <AlertTriangle className="h-3.5 w-3.5" />;
      default:
        return <AlertCircle className="h-3.5 w-3.5" />;
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium font-secondary whitespace-nowrap",
        getStatusColor(status),
        sizeClasses[size],
        className
      )}
    >
      {showIcon && getIcon()}
      <span>{getStatusText(status)}</span>
    </div>
  );
}