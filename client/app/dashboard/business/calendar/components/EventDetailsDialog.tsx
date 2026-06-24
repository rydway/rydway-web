"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Car, Users, MapPin, Clock, XCircle, Edit, Save } from "lucide-react";
import { CalendarEvent } from "./types";

interface EventDetailsDialogProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (id: string) => void;
  onUpdate: (event: CalendarEvent) => void;
}

export function EventDetailsDialog({
  event,
  open,
  onOpenChange,
  onDelete,
  onUpdate
}: EventDetailsDialogProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (event) {
      setNotes(event.notes || "");
    }
    setIsEditing(false);
  }, [event, open]);

  if (!event) return null;

  const handleSave = () => {
    onUpdate({
      ...event,
      notes
    });
    setIsEditing(false);
  };

  const getStatusBadge = (status: CalendarEvent['status'], type: CalendarEvent['type']) => {
    switch (status) {
      case 'pending':
        return <Badge variant="blue" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="blue" className="bg-blue-100 text-blue-600 dark:text-blue-400 border-blue-300">Confirmed</Badge>;
      case 'overdue':
        return <Badge variant="red" className="bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20">Overdue</Badge>;
      case 'returned':
        return <Badge variant="blue" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Returned</Badge>;
      case 'scheduled':
        return <Badge variant="amber" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Scheduled</Badge>;
      case 'in-progress':
        return <Badge variant="amber" className="bg-amber-100 text-amber-600 dark:text-amber-400 border-amber-300">In Progress</Badge>;
      case 'completed':
        return <Badge variant="green" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="slate" className="bg-muted/50 text-foreground border-border">Cancelled</Badge>;
    }
    return null;
  };

  const getTypeBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'booking':
        return <Badge variant="blue" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Booking</Badge>;
      case 'maintenance':
        return <Badge variant="amber" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Maintenance</Badge>;
      case 'service':
        return <Badge variant="amber" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Service</Badge>;
      case 'inspection':
        return <Badge variant="amber" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Inspection</Badge>;
      case 'unavailable':
        return <Badge variant="slate" className="bg-muted/50 text-foreground border-border">Unavailable</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl font-secondary">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-primary text-lg">
              {event.title}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {getTypeBadge(event.type)}
              {getStatusBadge(event.status, event.type)}
            </div>
          </div>
          <DialogDescription className="font-secondary text-sm">
            Event details and management
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5">
          {/* Event Time */}
          <div className="p-3 bg-muted/50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-medium">Start Date</p>
              <p className="text-sm font-semibold text-foreground">
                {format(new Date(event.start), "EEE, MMM d, yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.start), "h:mm a")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground font-medium">End Date</p>
              <p className="text-sm font-semibold text-foreground">
                {format(new Date(event.end), "EEE, MMM d, yyyy")}
              </p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(event.end), "h:mm a")}
              </p>
            </div>
          </div>
          
          {/* Event Details Grid */}
          <div className="grid grid-cols-2 gap-4 py-2">
            {event.vehicleName && (
              <div className="flex items-start gap-2">
                <Car className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Vehicle</p>
                  <p className="text-sm font-medium text-foreground">{event.vehicleName}</p>
                </div>
              </div>
            )}
            
            {event.renterName && (
              <div className="flex items-start gap-2">
                <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Renter</p>
                  <p className="text-sm font-medium text-foreground">{event.renterName}</p>
                </div>
              </div>
            )}
            
            {event.location && (
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Location</p>
                  <p className="text-sm font-medium text-foreground">{event.location}</p>
                </div>
              </div>
            )}
            
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Duration</p>
                <p className="text-sm font-medium text-foreground">
                  {Math.max(1, Math.ceil((new Date(event.end).getTime() - new Date(event.start).getTime()) / (1000 * 3600 * 24)))} days
                </p>
              </div>
            </div>
          </div>
          
          {/* Notes Section */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Notes</Label>
            {isEditing ? (
              <Textarea 
                value={notes} 
                onChange={(e) => setNotes(e.target.value)} 
                className="text-sm"
                placeholder="Add notes..."
              />
            ) : (
              <div className="bg-muted/50 p-3 rounded-md border border-border">
                <p className="text-sm text-foreground whitespace-pre-wrap">{notes || "No notes available."}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(event.id)}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Delete
            </Button>
            {isEditing ? (
              <Button
                size="sm"
                onClick={handleSave}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={() => setIsEditing(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Notes
              </Button>
            )}
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
