"use client";

import { useState } from "react";
import { Upload, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface CreateTicketDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

export function CreateTicketDialog({ 
  open, 
  onOpenChange,
  onSubmit 
}: CreateTicketDialogProps) {
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    orderNumber: '',
    vehicle: '',
    message: ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
    onOpenChange(false);
    setFormData({
      subject: '',
      category: '',
      priority: 'medium',
      orderNumber: '',
      vehicle: '',
      message: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl font-secondary">
        <DialogHeader>
          <DialogTitle className="font-primary text-lg">Create Support Ticket</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 font-secondary">
            Fill out the form below and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs">Subject *</Label>
              <Input
                id="subject"
                placeholder="Brief summary of your issue"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                className="h-10 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="text-xs">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                <SelectTrigger className="h-10 text-sm">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="booking">Booking Issue</SelectItem>
                  <SelectItem value="payment">Payment Problem</SelectItem>
                  <SelectItem value="vehicle">Vehicle Issue</SelectItem>
                  <SelectItem value="account">Account Problem</SelectItem>
                  <SelectItem value="refund">Refund Request</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="order" className="text-xs">Booking/Order Number</Label>
              <Input
                id="order"
                placeholder="e.g. RWD-2026-0315-001"
                value={formData.orderNumber}
                onChange={(e) => setFormData({...formData, orderNumber: e.target.value})}
                className="h-10 text-sm"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle" className="text-xs">Vehicle (if applicable)</Label>
              <Input
                id="vehicle"
                placeholder="e.g. Toyota Camry"
                value={formData.vehicle}
                onChange={(e) => setFormData({...formData, vehicle: e.target.value})}
                className="h-10 text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-xs">Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => setFormData({...formData, priority: value})}>
              <SelectTrigger className="h-10 text-sm">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low - General inquiry</SelectItem>
                <SelectItem value="medium">Medium - Needs attention</SelectItem>
                <SelectItem value="high">High - Urgent issue</SelectItem>
                <SelectItem value="urgent">Urgent - Emergency</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-xs">Message *</Label>
            <Textarea
              id="message"
              placeholder="Please describe your issue in detail..."
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="min-h-[150px] text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Attachments</Label>
            <div className="border border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer bg-slate-50">
              <Upload className="h-6 w-6 text-slate-400 mx-auto mb-2" />
              <p className="text-sm text-slate-600 mb-1 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-500">Max file size: 10MB (PDF, JPG, PNG)</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={!formData.subject || !formData.category || !formData.message}
          >
            <Send className="h-4 w-4 mr-2" />
            Submit Ticket
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
