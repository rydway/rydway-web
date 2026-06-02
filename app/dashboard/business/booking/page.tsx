"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Car, 
  Calendar, 
  AlertCircle, 
  CheckCircle,
  Clock,
  TrendingUp,
  Users
} from "lucide-react";
import Link from "next/link";
import { BookingCard } from "@/components/base/cards/BookingCard";
import { StatCard } from "@/components/base/cards/StatCard";
import { CustomPagination } from "@/components/base/Pagination";
import { CustomTabs } from "@/components/base/Tabs";
import { getActiveBookings, getRequestedBookings, getPastBookings, getBookingDetailsById, allBookings } from "@/data/bookingData";

interface BusinessBookingsPageProps {
  role?: "business";
}

export default function BusinessBookingsPage({ role = "business" }: BusinessBookingsPageProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("requests");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Get bookings for business view
  const activeBusinessBookings = getActiveBookings();
  const requestedBusinessBookings = getRequestedBookings();
  const pastBusinessBookings = getPastBookings();
  

  const activeBookingsWithRenter = activeBusinessBookings.map(booking => ({
    ...booking,
    renterName: getBookingDetailsById(booking.id)?.renterName || "Unknown Renter"
  }));

  const requestedBookingsWithRenter = requestedBusinessBookings.map(booking => ({
    ...booking,
    renterName: getBookingDetailsById(booking.id)?.renterName || "Unknown Renter"
  }));

  const pastBookingsWithRenter = pastBusinessBookings.map(booking => ({
    ...booking,
    renterName: getBookingDetailsById(booking.id)?.renterName || "Unknown Renter"
  }));

  // Business tabs
  const businessTabs = [
    { id: "requests", label: "Requests", count: requestedBookingsWithRenter.length },
    { id: "active", label: "Active", count: activeBookingsWithRenter.length },
    { id: "past", label: "Past", count: pastBookingsWithRenter.length },
  ];

  // Get current bookings based on active tab
  let currentBookings = [];
  switch (activeTab) {
    case "requests":
      currentBookings = requestedBookingsWithRenter;
      break;
    case "active":
      currentBookings = activeBookingsWithRenter;
      break;
    case "past":
      currentBookings = pastBookingsWithRenter;
      break;
    default:
      currentBookings = requestedBookingsWithRenter;
  }
  
  // Calculate pagination
  const totalItems = currentBookings.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentBookingsPage = currentBookings.slice(startIndex, startIndex + pageSize);

  const handleViewDetails = (id: string) => {
    router.push(`/dashboard/business/booking/${id}`);
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
    const booking = getBookingDetailsById(id);
    if (booking) {
      console.log("Contact renter:", booking.renterName);
    }
  };

  const handleTrack = (id: string) => {
    console.log("Track booking:", id);
  };

  const handleReceipt = (id: string) => {
    console.log("Download receipt for booking:", id);
  };

  // Calculate business metrics
  const totalRevenue = allBookings
    .filter(booking => booking.paymentStatus === "paid")
    .reduce((total, booking) => total + booking.totalAmount, 0);

  const pendingRequests = requestedBookingsWithRenter.filter(
    booking => booking.status === "requested"
  ).length;

  const completionRate = pastBusinessBookings.length > 0
    ? Math.round((pastBusinessBookings.length / allBookings.length) * 100)
    : 0;

  // Business stats
  const businessStats = [
    {
      title: "Pending Requests",
      value: pendingRequests.toString(),
      icon: AlertCircle,
      trend: "Need your response",
      trendUp: false,
      iconColor: "text-primary"
    },
    {
      title: "Active Bookings",
      value: activeBookingsWithRenter.length.toString(),
      icon: CheckCircle,
      trend: "All on track",
      trendUp: true,
      iconColor: "text-secondary"
    },
    {
      title: "Total Revenue",
      value: `₦${(totalRevenue / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      trend: "+25% this month",
      trendUp: true,
      iconColor: "text-primary"
    },
    {
      title: "Completion Rate",
      value: `${completionRate}%`,
      icon: TrendingUp,
      trend: "+3% this month",
      trendUp: true,
      iconColor: "text-secondary"
    }
  ];

  // Get tab label for empty state
  const getTabLabel = () => {
    switch (activeTab) {
      case "requests": return "Pending Requests";
      case "active": return "Active Bookings";
      case "past": return "Past Bookings";
      default: return "Bookings";
    }
  };

  // Get empty state message
  const getEmptyMessage = () => {
    switch (activeTab) {
      case "requests":
        return "No pending booking requests at the moment. Check back later for new requests.";
      case "active":
        return "No active bookings at the moment. Your fleet is available for new rentals.";
      case "past":
        return "No past bookings yet. Your booking history will appear here.";
      default:
        return "No bookings found.";
    }
  };

  // Get empty state action button
  const getEmptyAction = () => {
    if (activeTab === "requests") {
      return (
        <Button asChild className="bg-primary hover:bg-primary/90 mt-4 font-primary">
          <Link href="/dashboard/business/vehicles">Manage Fleet</Link>
        </Button>
      );
    } else if (activeTab === "active") {
      return (
        <Button asChild className="bg-primary hover:bg-primary/90 mt-4 font-primary">
          <Link href="/dashboard/business/vehicles">View Fleet Status</Link>
        </Button>
      );
    } else if (activeTab === "past") {
      return (
        <Button asChild className="bg-primary hover:bg-primary/90 mt-4 font-primary">
          <Link href="/dashboard/business/earnings">View Analytics</Link>
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Bookings Management
          </h1>
          <p className="text-sm text-slate-500 font-secondary">
            Manage booking requests, active rentals, and past bookings
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessStats.map((stat, index) => (
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
        tabs={businessTabs}
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
            <Calendar className="h-12 w-12 text-slate-400 mb-4" />
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 font-primary">
              {activeTab === "requests" 
                ? "No Pending Requests" 
                : activeTab === "active"
                ? "No Active Bookings"
                : "No Past Bookings"}
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-center mb-6 max-w-md font-secondary">
              {getEmptyMessage()}
            </p>
            {getEmptyAction()}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentBookingsPage.map((booking) => (
              <BookingCard
                key={booking.id}
                {...booking}
                onViewDetails={handleViewDetails}
                onApprove={handleApprove}
                onDecline={handleDecline}
                onCancel={handleCancel}
                onContact={handleContact}
                onTrack={handleTrack}
                onReceipt={handleReceipt}
                role="business"
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