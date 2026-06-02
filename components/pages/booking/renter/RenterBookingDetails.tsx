"use client";

import { useState } from "react";
import { BookingDetailsBase, BookingDetailsData } from "../BookingDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Navigation, 
  Clock, 
  FileText,
  Star,
  XCircle,
  ShieldCheck,
  AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";

interface RenterBookingDetailsProps {
  data: BookingDetailsData;
  onBack?: () => void;
  onContactOwner?: () => void;
  onTrackVehicle?: () => void;
  onExtendBooking?: () => void;
  onDownloadReceipt?: () => void;
  onLeaveReview?: () => void;
  onCancelBooking?: () => void;
  onReportIssue?: () => void;
}

export function RenterBookingDetails({
  data,
  onBack,
  onContactOwner,
  onTrackVehicle,
  onExtendBooking,
  onDownloadReceipt,
  onLeaveReview,
  onCancelBooking,
  onReportIssue
}: RenterBookingDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");

const router = useRouter();

      const handleBack = () => {
    router.push("/dashboard/renter/booking");
  };

  const getRenterActions = () => {
    const actions = [];
    
    // Always available
    actions.push(
      <Button 
        key="contact" 
        className="w-full font-primary"
        onClick={onContactOwner}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Contact Owner
      </Button>
    );

    // Status-specific actions
    switch (data.status) {
      case 'requested':
      case 'confirmed':
        actions.push(
          <Button 
            key="cancel" 
            variant="destructive" 
            className="w-full font-primary"
            onClick={onCancelBooking}
          >
            <XCircle className="h-4 w-4 mr-2" />
            Cancel Booking
          </Button>
        );
        break;
      
      case 'active':
        actions.push(
          <Button 
            key="track" 
            variant="outline" 
            className="w-full font-primary"
            onClick={onTrackVehicle}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Track Vehicle
          </Button>
        );
        actions.push(
          <Button 
            key="extend" 
            variant="outline" 
            className="w-full font-primary"
            onClick={onExtendBooking}
          >
            <Clock className="h-4 w-4 mr-2" />
            Extend Booking
          </Button>
        );
        actions.push(
          <Button 
            key="report" 
            variant="outline" 
            className="w-full font-primary border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-900/20"
            onClick={onReportIssue}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Report Issue
          </Button>
        );
        break;
      
      case 'completed':
        actions.push(
          <Button 
            key="receipt" 
            variant="outline" 
            className="w-full font-primary"
            onClick={onDownloadReceipt}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
        );
        actions.push(
          <Button 
            key="review" 
            variant="outline" 
            className="w-full font-primary"
            onClick={onLeaveReview}
          >
            <Star className="h-4 w-4 mr-2" />
            Leave Review
          </Button>
        );
        break;
    }

    // Additional protection for active trips
    if (data.status === 'active') {
      actions.push(
        <div key="protection" className="pt-4 border-t border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="font-medium">24/7 Roadside Assistance Active</span>
          </div>
        </div>
      );
    }

    return actions;
  };

  return (
    <BookingDetailsBase
      data={data}
      role="renter"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={handleBack}
      rightColumn={
        <>
          {/* Price Summary is included in base */}
          
          {/* Renter Actions */}
          <Card className="border-slate-200 dark:border-slate-800">
            <CardContent className="p-6">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-4 font-primary">Actions</h3>
              <div className="space-y-3">
                {getRenterActions()}
              </div>
            </CardContent>
          </Card>
        </>
      }
    />
  );
}