"use client";

import { useState } from "react";
import { CreditCard, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddPaymentMethodDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: any) => void;
}

export function AddPaymentMethodDialog({ 
  open, 
  onOpenChange,
  onSubmit
}: AddPaymentMethodDialogProps) {
  const [methodType, setMethodType] = useState<'card' | 'bank'>('card');
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  const [bankData, setBankData] = useState({
    bankName: "",
    accountNumber: "",
    accountName: ""
  });

  const handleSubmit = () => {
    if (onSubmit) {
      if (methodType === 'card') {
        onSubmit({ type: 'card', ...cardData });
      } else {
        onSubmit({ type: 'bank', ...bankData });
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-primary text-lg">Add Payment Method</DialogTitle>
          <DialogDescription className="font-secondary text-sm">
            Add a new card or bank account for payments
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex gap-2 mb-6">
            <Button
              variant={methodType === 'card' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMethodType('card')}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Card
            </Button>
            <Button
              variant={methodType === 'bank' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setMethodType('bank')}
              className="flex-1"
            >
              <Landmark className="h-4 w-4 mr-2" />
              Bank Account
            </Button>
          </div>

          {methodType === 'card' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="card-number" className="text-xs">Card Number</Label>
                <div className="relative">
                  <Input 
                    id="card-number" 
                    placeholder="1234 5678 9012 3456" 
                    className="h-10 text-sm pl-10"
                    value={cardData.number}
                    onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry" className="text-xs">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    placeholder="MM/YY" 
                    className="h-10 text-sm" 
                    value={cardData.expiry}
                    onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-xs">CVV</Label>
                  <Input 
                    id="cvv" 
                    placeholder="123" 
                    className="h-10 text-sm" 
                    value={cardData.cvv}
                    onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cardholder" className="text-xs">Cardholder Name</Label>
                <Input 
                  id="cardholder" 
                  placeholder="John Doe" 
                  className="h-10 text-sm" 
                  value={cardData.name}
                  onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name" className="text-xs">Bank Name</Label>
                <Select 
                  value={bankData.bankName} 
                  onValueChange={(val) => setBankData({ ...bankData, bankName: val })}
                >
                  <SelectTrigger className="h-10 text-sm">
                    <SelectValue placeholder="Select bank" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gtb">Guaranty Trust Bank</SelectItem>
                    <SelectItem value="first">First Bank</SelectItem>
                    <SelectItem value="access">Access Bank</SelectItem>
                    <SelectItem value="zenith">Zenith Bank</SelectItem>
                    <SelectItem value="uba">UBA</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-number" className="text-xs">Account Number</Label>
                <Input 
                  id="account-number" 
                  placeholder="0123456789" 
                  className="h-10 text-sm"
                  value={bankData.accountNumber}
                  onChange={(e) => setBankData({ ...bankData, accountNumber: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="account-name" className="text-xs">Account Name</Label>
                <Input 
                  id="account-name" 
                  placeholder="John Doe" 
                  className="h-10 text-sm"
                  value={bankData.accountName}
                  onChange={(e) => setBankData({ ...bankData, accountName: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={
              methodType === 'card' 
                ? !cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name
                : !bankData.bankName || !bankData.accountNumber || !bankData.accountName
            }
          >
            Add Payment Method
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
