"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Car, 
  Calendar, 
  TrendingUp
} from "lucide-react";
import Link from "next/link";
import { StatCard } from "@/components/base/cards/StatCard";
import { CustomPagination } from "@/components/base/Pagination";
import { CustomTabs } from "@/components/base/Tabs";
import { BookingCard } from "@/components/base/cards/BookingCard";
import { useRenterBookings } from "@/hooks/useBookings";
import { format } from "date-fns";
import { Booking } from "@/types/models";


interface BookingsPageProps {
  role?: "renter";
}

export default function BookingsPage({ role = "renter" }: BookingsPageProps) {
  const router = useRouter();
  const { bookings: apiBookings, isLoading } = useRenterBookings();
  const [activeTab, setActiveTab] = useState("active");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter bookings locally by status
  const activeBookings = apiBookings.filter(b => b.status === 'active');
  const requestedBookings = apiBookings.filter(b => b.status === 'requested' || b.status === 'confirmed');
  const pastBookings = apiBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  // Renter tabs
  const renterTabs = [
    { id: "active", label: "Active Trips", count: activeBookings.length },
    { id: "requested", label: "Upcoming", count: requestedBookings.length },
    { id: "past", label: "Past Trips", count: pastBookings.length },
  ];

  // Get current bookings based on active tab
  let currentBookings: Booking[] = [];
  switch (activeTab) {
    case "active":
      currentBookings = activeBookings;
      break;
    case "requested":
      currentBookings = requestedBookings;
      break;
    case "past":
      currentBookings = pastBookings;
      break;
    default:
      currentBookings = activeBookings;
  }
  
  // Calculate pagination
  const totalItems = currentBookings.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBookingsPage = currentBookings.slice(startIndex, startIndex + pageSize);

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/renter/booking/${id}`);
  };

  const handleApprove = (id: string) => {
    console.log("Approve booking:", id);
  };

  const handleDecline = (id: string) => {
    console.log("Decline booking:", id);
  };

  const handleCancel = (id: string) => {
    console.log("Cancel booking:", id);
  };

  const handleContact = (id: string) => {
    console.log("Contact owner logic for booking:", id);
  };

  const handleExtend = (id: string) => {
    console.log("Extend booking:", id);
  };

  const handleTrack = (id: string) => {
    console.log("Track vehicle for booking:", id);
  };

  const handleReview = (id: string) => {
    console.log("Leave review for booking:", id);
  };

  const handleReceipt = (id: string) => {
    console.log("Download receipt for booking:", id);
  };

  // Calculate total spent from past bookings
  const totalSpent = pastBookings.reduce((total, booking) => total + booking.totalAmount, 0);
  
  // Find next upcoming trip
  const nextTrip = requestedBookings.length > 0 ? requestedBookings[0] : null;
  const nextTripDays = nextTrip ? 
    `Next trip: ${format(new Date(nextTrip.startDate), 'MMM dd, yyyy')}` : 
    "No upcoming trips";

  // Calculate average rating from completed trips with ratings
  // For now, hardcode to 4.8 as backend schema doesn't embed specific booking rating easily yet.
  const averageRating = "N/A";

  // Renter stats
  const renterStats = [
    {
      title: "Active Trips",
      value: activeBookings.length.toString(),
      icon: Car,
      trend: activeBookings.length > 0 ? "Currently on trip" : "No active trips",
      trendUp: activeBookings.length > 0,
      iconColor: "text-primary"
    },
    {
      title: "Total Spent",
      value: `₦${(totalSpent / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      trend: "Based on past trips",
      trendUp: true,
      iconColor: "text-secondary"
    },
    {
      title: "Upcoming Trips",
      value: requestedBookings.length.toString(),
      icon: Calendar,
      trend: nextTripDays,
      trendUp: requestedBookings.length > 0,
      iconColor: "text-primary"
    },
    {
      title: "Average Rating",
      value: averageRating,
      icon: TrendingUp,
      trend: "Based on reviews",
      trendUp: true,
      iconColor: "text-secondary"
    }
  ];

  // Get tab label for empty state
  const getTabLabel = () => {
    switch (activeTab) {
      case "active": return "Active Trips";
      case "requested": return "Upcoming Trips";
      case "past": return "Past Trips";
      default: return "Bookings";
    }
  };

  // Get empty state message
  const getEmptyMessage = () => {
    switch (activeTab) {
      case "active": return "You don't have any active trips at the moment.";
      case "requested": return "You don't have any upcoming trips.";
      case "past": return "You don't have any past trips yet.";
      default: return "No bookings found.";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-primary">
            My Bookings
          </h1>
          <p className="text-sm text-muted-foreground font-secondary">
            Manage your current and past vehicle rentals
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {renterStats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
            iconClassName={stat.iconColor}
          />
        ))}
      </div>

      {/* Tabs */}
      <CustomTabs 
        tabs={renterTabs}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setCurrentPage(1);
        }}
        className="mt-6"
      />

      {/* Bookings Grid */}
      {currentBookingsPage.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground dark:text-white mb-2 font-primary">
              No {getTabLabel()}
            </h3>
            <p className="text-muted-foreground dark:text-slate-300 text-center mb-6 font-secondary">
              {getEmptyMessage()}
            </p>
            {activeTab === "active" && (
              <Button asChild className="bg-primary hover:bg-primary/90 font-primary text-primary-foreground">
                <Link href="/discover">Rent a Car</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentBookingsPage.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                carImage={booking.vehicle?.images?.[0]?.url || "/car/car1.png"}
                carName={booking.vehicle?.name || "Unknown Vehicle"}
                carType={booking.vehicle?.category || "Unknown"}
                ownerName="Host" // Requires host eager load from backend
                startDate={format(new Date(booking.startDate), 'MMM dd, yyyy')}
                endDate={format(new Date(booking.endDate), 'MMM dd, yyyy')}
                pickupLocation={booking.pickupLocation}
                dropoffLocation={booking.dropoffLocation}
                pickupTime={booking.pickupTime}
                dropoffTime={booking.dropoffTime}
                totalDays={booking.daysCount}
                totalAmount={booking.totalAmount}
                status={booking.status as any}
                paymentStatus={booking.paymentStatus as any}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onDecline={handleDecline}
                onCancel={handleCancel}
                onContact={handleContact}
                onExtend={handleExtend}
                onTrack={handleTrack}
                onReview={handleReview}
                onReceipt={handleReceipt}
                role="renter"
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              pageSize={pageSize}
              totalItems={totalItems}
              onPageChange={setCurrentPage}
              className="mt-6"
            />
          )}
        </>
      )}
    </div>
  );
}