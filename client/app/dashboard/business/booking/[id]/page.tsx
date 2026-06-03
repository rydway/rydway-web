"use client";

import { BusinessBookingDetails } from "@/components/pages/booking/business/BusinessBookingDetails";
import { getBookingDetailsById } from "@/data/bookingData";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function BusinessBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [bookingData, setBookingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const id = params.id as string;
  const action = searchParams.get('action');

  useEffect(() => {
    console.log("Action param:", id, action);
    
    if (id) {
      const data = getBookingDetailsById(id);
      console.log("Booking Data:", data);
      setBookingData(data);
      setLoading(false);
    }
  }, [id, action]);

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
    <BusinessBookingDetails
      data={bookingData}
      showApproveDecline={action === 'approve'}
      onApproveBooking={() => console.log("Approve booking")}
      onDeclineBooking={() => console.log("Decline booking")}
      onContactRenter={() => console.log("Contact renter")}
      onTrackVehicle={() => console.log("Track vehicle")}
      onDownloadDocuments={() => console.log("Download documents")}
      onViewAnalytics={() => console.log("View analytics")}
      onUpdateStatus={() => console.log("Update status")}
      onReportIssue={() => console.log("Report issue")}
    />
  );
}