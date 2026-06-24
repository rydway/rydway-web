"use client";

import { RenterBookingDetails } from "@/components/pages/booking/renter/RenterBookingDetails";
import { useBooking } from "@/hooks/useBookings";
import { useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RenterBookingPage() {
  const params = useParams();
  const id = params.id as string;

  const { booking, isLoading } = useBooking(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground dark:text-slate-300 font-secondary">
            Loading booking details...
          </p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold text-foreground dark:text-white font-primary">
          Booking Not Found
        </h1>
        <p className="text-muted-foreground mt-2 font-secondary">
          The booking you're looking for doesn't exist or you don't have access
          to it.
        </p>
      </div>
    );
  }

  return (
    <RenterBookingDetails
      data={booking as any}
      onContactOwner={() => console.log("Contact owner")}
      onTrackVehicle={() => console.log("Track vehicle")}
      onExtendBooking={() => console.log("Extend booking")}
      onCancelBooking={() => console.log("Cancel booking")}
      onDownloadReceipt={() => console.log("Download receipt")}
      onLeaveReview={() => console.log("Leave review")}
      onReportIssue={() => console.log("Report issue")}
    />
  );
}
