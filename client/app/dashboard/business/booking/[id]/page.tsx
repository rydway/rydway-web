"use client";

import { BusinessBookingDetails } from "@/components/pages/booking/business/BusinessBookingDetails";
import { useBooking, useUpdateBookingStatus } from "@/hooks/useBookings";
import { useParams, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { BookingDetailsData } from "@/components/pages/booking/BookingDetails";

export default function BusinessBookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const id = params.id as string;
  const action = searchParams.get('action');

  const { booking, isLoading } = useBooking(id);
  const updateStatus = useUpdateBookingStatus(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="animate-spin h-12 w-12 text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground dark:text-slate-300 font-secondary">Loading booking details...</p>
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
        <p className="text-muted-foreground mt-2 font-secondary">The booking you're looking for doesn't exist.</p>
      </div>
    );
  }

  const mappedBooking: BookingDetailsData = {
    id: booking.id,
    carId: booking.vehicleId,
    carName: (booking as any).vehicle?.name || `${(booking as any).vehicle?.make || ''} ${(booking as any).vehicle?.model || ''}`.trim() || "Vehicle",
    carImage: (booking as any).vehicle?.photos?.[0] || "",
    carType: (booking as any).vehicle?.category || "",
    renterId: (booking as any).userId,
    renterName: (booking as any).user?.name || "Renter",
    renterPhone: (booking as any).user?.phone || "",
    ownerId: (booking as any).businessId,
    ownerName: (booking as any).business?.name || "Business",
    ownerPhone: (booking as any).business?.phone || "",
    startDate: new Date((booking as any).startDate).toLocaleDateString(),
    endDate: new Date((booking as any).endDate).toLocaleDateString(),
    pickupTime: new Date((booking as any).startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    dropoffTime: new Date((booking as any).endDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    pickupLocation: (booking as any).pickupLocation,
    dropoffLocation: (booking as any).dropoffLocation,
    totalDays: (booking as any).daysCount,
    dailyRate: (booking as any).vehicle?.rateDaily || 0,
    totalAmount: (booking as any).totalAmount,
    status: (booking as any).status as any,
    paymentStatus: (booking as any).payment?.status || 'pending',
    createdAt: new Date((booking as any).createdAt).toLocaleDateString(),
    extras: {
      insurance: false,
      gps: false,
      childSeat: false
    }
  };

  return (
    <BusinessBookingDetails
      data={mappedBooking}
      showApproveDecline={action === 'approve'}
      onApproveBooking={() => updateStatus.mutate('accepted')}
      onDeclineBooking={() => updateStatus.mutate('rejected')}
      onContactRenter={() => console.log("Contact renter")}
      onTrackVehicle={() => console.log("Track vehicle")}
      onDownloadDocuments={() => console.log("Download documents")}
      onViewAnalytics={() => console.log("View analytics")}
      onUpdateStatus={() => console.log("Update status")}
      onReportIssue={() => console.log("Report issue")}
    />
  );
}