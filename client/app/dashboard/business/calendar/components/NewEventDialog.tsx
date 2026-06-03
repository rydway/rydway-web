"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { CalendarEvent, Vehicle } from "./types";

interface NewEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicles: Vehicle[];
  newEvent: Partial<CalendarEvent>;
  setNewEvent: (event: Partial<CalendarEvent>) => void;
  onCreate: () => void;
}

export function NewEventDialog({
  open,
  onOpenChange,
  vehicles,
  newEvent,
  setNewEvent,
  onCreate
}: NewEventDialogProps) {
  // Synchronize dynamic updates to start/end times when open changes
  const [formData, setFormData] = useState({
    title: "",
    type: "booking" as CalendarEvent["type"],
    vehicleId: "",
    start: "",
    end: "",
    status: "pending" as CalendarEvent["status"],
    notes: "",
    renterName: "",
    location: ""
  });

  useEffect(() => {
    if (open) {
      setFormData({
        title: newEvent.title || "",
        type: newEvent.type || "booking",
        vehicleId: newEvent.vehicleId || "",
        start: newEvent.start ? format(new Date(newEvent.start), "yyyy-MM-dd'T'HH:mm") : "",
        end: newEvent.end ? format(new Date(newEvent.end), "yyyy-MM-dd'T'HH:mm") : "",
        status: newEvent.status || "pending",
        notes: newEvent.notes || "",
        renterName: newEvent.renterName || "",
        location: newEvent.location || ""
      });
    }
  }, [open, newEvent]);

  const handleSubmit = () => {
    setNewEvent({
      ...newEvent,
      title: formData.title,
      type: formData.type,
      vehicleId: formData.vehicleId,
      start: formData.start ? new Date(formData.start).toISOString() : new Date().toISOString(),
      end: formData.end ? new Date(formData.end).toISOString() : new Date(Date.now() + 3600000).toISOString(),
      status: formData.status,
      notes: formData.notes,
      renterName: formData.renterName,
      location: formData.location
    });
    onCreate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl font-secondary">
        <DialogHeader>
          <DialogTitle className="font-primary text-lg">
            Create Event
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm">
            Add a new booking, maintenance, or unavailable period
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-2">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-xs">Event Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Vehicle Service"
                  className="h-8 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="type" className="text-xs">Event Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(val) => setFormData({ ...formData, type: val as CalendarEvent['type'] })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="service">Service</SelectItem>
                    <SelectItem value="inspection">Inspection</SelectItem>
                    <SelectItem value="unavailable">Unavailable</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="vehicle" className="text-xs">Vehicle</Label>
                <Select 
                  value={formData.vehicleId} 
                  onValueChange={(val) => setFormData({ ...formData, vehicleId: val })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map(vehicle => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.type === "booking" && (
                <>
                  <div>
                    <Label htmlFor="renterName" className="text-xs">Renter Name</Label>
                    <Input
                      id="renterName"
                      value={formData.renterName}
                      onChange={(e) => setFormData({ ...formData, renterName: e.target.value })}
                      placeholder="e.g., Jane Doe"
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-xs">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="e.g., Victoria Island, Lagos"
                      className="h-8 text-sm"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="start" className="text-xs">Start Date & Time</Label>
                <Input
                  id="start"
                  type="datetime-local"
                  value={formData.start}
                  onChange={(e) => setFormData({ ...formData, start: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="end" className="text-xs">End Date & Time</Label>
                <Input
                  id="end"
                  type="datetime-local"
                  value={formData.end}
                  onChange={(e) => setFormData({ ...formData, end: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              
              <div>
                <Label htmlFor="status" className="text-xs">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(val) => setFormData({ ...formData, status: val as CalendarEvent['status'] })}
                >
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-xs">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional details..."
              rows={2}
              className="text-sm"
            />
          </div>
          
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!formData.title || !formData.vehicleId}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
