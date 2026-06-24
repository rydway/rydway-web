"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { 
  Car, 
  Clock, 
  DollarSign, 
  RefreshCw, 
  Receipt, 
  CreditCard, 
  Landmark, 
  Wallet, 
  MapPin, 
  FileText, 
  Download 
} from "lucide-react";
import { Payment } from "./types";

interface PaymentDetailsDialogProps {
  payment: Payment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PaymentDetailsDialog({ 
  payment, 
  open, 
  onOpenChange 
}: PaymentDetailsDialogProps) {
  if (!payment) return null;

  const getStatusBadge = (status: Payment['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="green" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Completed</Badge>;
      case 'pending':
        return <Badge variant="amber" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Pending</Badge>;
      case 'processing':
        return <Badge variant="blue" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Processing</Badge>;
      case 'failed':
        return <Badge variant="red" className="bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20">Failed</Badge>;
      case 'refunded':
        return <Badge variant="slate" className="bg-muted/50 text-foreground border-border">Refunded</Badge>;
    }
  };

  const getTypeIcon = (type: Payment['type']) => {
    switch (type) {
      case 'booking': return <Car className="h-4 w-4" />;
      case 'extension': return <Clock className="h-4 w-4" />;
      case 'deposit': return <DollarSign className="h-4 w-4" />;
      case 'refund': return <RefreshCw className="h-4 w-4" />;
      case 'fee': return <Receipt className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl font-secondary">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-primary text-lg">Payment Details</DialogTitle>
            {getStatusBadge(payment.status)}
          </div>
          <DialogDescription className="font-secondary text-sm text-muted-foreground font-mono">
            Transaction ID: {payment.transactionId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <span className="text-sm text-muted-foreground">Total Amount</span>
            <span className="text-2xl font-bold text-foreground">
              ₦{payment.amount.toLocaleString()}
            </span>
          </div>

          {/* Payment Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Date</p>
              <p className="text-sm font-medium text-foreground">
                {format(new Date(payment.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(payment.date), 'h:mm a')}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Payment Method</p>
              <div className="flex items-center gap-2">
                {payment.method === 'card' && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                {payment.method === 'bank_transfer' && <Landmark className="h-4 w-4 text-muted-foreground" />}
                {payment.method === 'wallet' && <Wallet className="h-4 w-4 text-muted-foreground" />}
                <p className="text-sm font-medium text-foreground capitalize">
                  {payment.method.replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Payment Type</p>
              <div className="flex items-center gap-2">
                {getTypeIcon(payment.type)}
                <p className="text-sm font-medium text-foreground capitalize">
                  {payment.type}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Booking ID</p>
              <p className="text-sm font-medium text-foreground font-mono">
                {payment.bookingId || 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          {payment.vehicleName && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Vehicle</h4>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{payment.vehicleName}</p>
                  {payment.location && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {payment.location}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground">Description</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              {payment.description}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-4">
            {payment.receipt && (
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                View Receipt
              </Button>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            {payment.status === 'failed' && (
              <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Retry Payment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
