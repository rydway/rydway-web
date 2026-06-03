"use client";

import { CreditCard, Landmark, ArrowUpRight, Clock, ArrowDownLeft, RefreshCw, TrendingDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { format } from "date-fns";
import { Payment } from "./types";

interface TransactionRowProps {
  payment: Payment;
  onViewDetails: (payment: Payment) => void;
}

export function TransactionRow({ 
  payment, 
  onViewDetails 
}: TransactionRowProps) {
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
      case 'booking': return <ArrowUpRight className="h-4 w-4 text-blue-600" />;
      case 'extension': return <Clock className="h-4 w-4 text-amber-600" />;
      case 'deposit': return <ArrowDownLeft className="h-4 w-4 text-purple-600" />;
      case 'refund': return <RefreshCw className="h-4 w-4 text-green-600" />;
      case 'fee': return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
  };

  return (
    <TableRow className="hover:bg-slate-50 cursor-pointer font-secondary" onClick={() => onViewDetails(payment)}>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200 flex-shrink-0">
            {getTypeIcon(payment.type)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-slate-800">
                {payment.vehicleName || payment.description}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-mono">
              {payment.transactionId}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <p className="text-sm text-slate-800">
            {format(new Date(payment.date), 'MMM d, yyyy')}
          </p>
          <p className="text-xs text-slate-500">
            {format(new Date(payment.date), 'h:mm a')}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {payment.method === 'card' && <CreditCard className="h-3.5 w-3.5 text-slate-400" />}
          {payment.method === 'bank_transfer' && <Landmark className="h-3.5 w-3.5 text-slate-400" />}
          <span className="text-sm text-slate-600 capitalize">
            {payment.method.replace('_', ' ')}
          </span>
        </div>
      </TableCell>
      <TableCell>
        <span className="text-sm font-semibold text-slate-800">
          ₦{payment.amount.toLocaleString()}
        </span>
      </TableCell>
      <TableCell>
        {getStatusBadge(payment.status)}
      </TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
