"use client";

import { CreditCard, Landmark, Wallet, Star, XCircle, MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'verve' | 'bank' | 'wallet';
  last4?: string;
  expiryMonth?: number;
  expiryYear?: number;
  cardholderName?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  isDefault: boolean;
  brand?: string;
}

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export function PaymentMethodCard({ 
  method, 
  onSetDefault, 
  onRemove 
}: PaymentMethodCardProps) {
  const getCardIcon = () => {
    switch (method.type) {
      case 'visa':
        return <CreditCard className="h-5 w-5 text-blue-600" />;
      case 'mastercard':
        return <CreditCard className="h-5 w-5 text-orange-600" />;
      case 'verve':
        return <CreditCard className="h-5 w-5 text-green-600" />;
      case 'bank':
        return <Landmark className="h-5 w-5 text-slate-600" />;
      case 'wallet':
        return <Wallet className="h-5 w-5 text-purple-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-slate-400" />;
    }
  };

  const getCardBrandColor = () => {
    switch (method.type) {
      case 'visa': return 'bg-blue-50/50 border-blue-200';
      case 'mastercard': return 'bg-orange-50/50 border-orange-200';
      case 'verve': return 'bg-green-50/50 border-green-200';
      case 'bank': return 'bg-slate-50 border-slate-200';
      case 'wallet': return 'bg-purple-50/50 border-purple-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getCardBrandColor()} ${
      method.isDefault ? 'ring-2 ring-blue-500 ring-offset-2' : ''
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg border border-slate-200">
            {getCardIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {method.type === 'bank' ? (
                <>
                  <span className="text-sm font-medium text-slate-800">
                    {method.bankName}
                  </span>
                  <span className="text-xs text-slate-500">
                    •••• {method.accountNumber?.slice(-4)}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-slate-800">
                    {method.brand || method.type.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-500">
                    •••• {method.last4}
                  </span>
                </>
              )}
              {method.isDefault && (
                <Badge variant="blue" className="text-[10px] px-1.5 py-0 h-4 bg-blue-100 text-blue-700 border-blue-200">
                  Default
                </Badge>
              )}
            </div>
            {method.type !== 'bank' && method.expiryMonth && method.expiryYear && (
              <p className="text-xs text-slate-500 mt-1">
                Expires {method.expiryMonth}/{method.expiryYear}
              </p>
            )}
            {method.type === 'bank' && method.accountName && (
              <p className="text-xs text-slate-500 mt-1">
                {method.accountName}
              </p>
            )}
          </div>
        </div>
        
        {(onSetDefault || onRemove) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              {!method.isDefault && method.type !== 'bank' && onSetDefault && (
                <DropdownMenuItem onClick={() => onSetDefault(method.id)}>
                  <Star className="h-4 w-4 mr-2" />
                  Set as Default
                </DropdownMenuItem>
              )}
              {onRemove && (
                <DropdownMenuItem className="text-red-600" onClick={() => onRemove(method.id)}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Remove
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
