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
        return <Badge variant="green" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="amber" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="blue" className="bg-blue-50 text-blue-700 border-blue-200">Processing</Badge>;
      case 'failed':
        return <Badge variant="red" className="bg-red-50 text-red-700 border-red-200">Failed</Badge>;
      case 'refunded':
        return <Badge variant="slate" className="bg-slate-50 text-slate-700 border-slate-200">Refunded</Badge>;
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
          <DialogDescription className="font-secondary text-sm text-slate-500 font-mono">
            Transaction ID: {payment.transactionId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Amount */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <span className="text-sm text-slate-600">Total Amount</span>
            <span className="text-2xl font-bold text-slate-800">
              ₦{payment.amount.toLocaleString()}
            </span>
          </div>

          {/* Payment Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Date</p>
              <p className="text-sm font-medium text-slate-800">
                {format(new Date(payment.date), 'MMMM d, yyyy')}
              </p>
              <p className="text-xs text-slate-500">
                {format(new Date(payment.date), 'h:mm a')}
              </p>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Payment Method</p>
              <div className="flex items-center gap-2">
                {payment.method === 'card' && <CreditCard className="h-4 w-4 text-slate-400" />}
                {payment.method === 'bank_transfer' && <Landmark className="h-4 w-4 text-slate-400" />}
                {payment.method === 'wallet' && <Wallet className="h-4 w-4 text-slate-400" />}
                <p className="text-sm font-medium text-slate-800 capitalize">
                  {payment.method.replace('_', ' ')}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Payment Type</p>
              <div className="flex items-center gap-2">
                {getTypeIcon(payment.type)}
                <p className="text-sm font-medium text-slate-800 capitalize">
                  {payment.type}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-slate-500">Booking ID</p>
              <p className="text-sm font-medium text-slate-800 font-mono">
                {payment.bookingId || 'N/A'}
              </p>
            </div>
          </div>

          <Separator />

          {/* Vehicle Information */}
          {payment.vehicleName && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-slate-800">Vehicle</h4>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="h-6 w-6 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">{payment.vehicleName}</p>
                  {payment.location && (
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
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
            <h4 className="text-sm font-semibold text-slate-800">Description</h4>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">
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
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Retry Payment
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
