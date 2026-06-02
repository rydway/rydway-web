"use client";

import { RenterBookingDetails } from "@/components/pages/booking/renter/RenterBookingDetails";
import { getBookingDetailsById } from "@/data/bookingData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RenterBookingPage() {
  const params = useParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const id = params.id as string;

  useEffect(() => {
    console.log("Booking ID:", id);
    
    if (id) {
      const data = getBookingDetailsById(id);
      console.log("Booking Data:", data);
      setBookingData(data);
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300 font-secondary">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!bookingData) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-primary">
          Booking Not Found
        </h1>
    
      </div>
    );
  }

  return (
    <RenterBookingDetails
      data={bookingData}
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