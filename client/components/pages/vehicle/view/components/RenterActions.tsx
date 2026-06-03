"use client";

import { Calendar, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VehicleDetails } from "./types";

interface RenterActionsProps {
  vehicle: VehicleDetails;
  onBook?: () => void;
  onContact?: (type: 'call' | 'message') => void;
}

export function RenterActions({ 
  vehicle, 
  onBook, 
  onContact 
}: RenterActionsProps) {
  return (
    <div className="space-y-3">
      {onBook && (
        <Button 
          className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
          onClick={onBook}
          disabled={vehicle.status !== 'available'}
        >
          <Calendar className="h-5 w-5 mr-2" />
          {vehicle.status === 'available' ? 'Book Now' : 'Currently Unavailable'}
        </Button>
      )}
      
      {onContact && (
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onContact('call')}
          >
            <Phone className="h-4 w-4 mr-2" />
            Call
          </Button>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => onContact('message')}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Message
          </Button>
        </div>
      )}
    </div>
  );
}
