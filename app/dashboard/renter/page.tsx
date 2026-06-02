"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Car, 
  Calendar, 
  CreditCard, 
  TrendingUp, 
  MapPin, 
  User, 
  Search, 
  ArrowRight, 
  Clock, 
  CheckCircle,
  HelpCircle,
  MessageSquare
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatCard } from "@/components/base/cards/StatCard";
import { BookingCard } from "@/components/features/BookingCard";
import { VehicleCard } from "@/components/features/VehicleCard";
import {
  mockRenterStats,
  currentTrips,
  recentTransactions,
  recommendedCars
} from "@/data/mock/dashboards";

import { useRenterDashboard } from "@/hooks/useDashboard";
import { useBookings } from "@/hooks/useBookings";
import { useVehicles } from "@/hooks/useVehicles";
import { Loader2 } from "lucide-react";

export default function RenterDashboardPage() {
  const { summary, isLoading: isSummaryLoading } = useRenterDashboard();
  const { bookings: apiBookings, isLoading: isBookingsLoading } = useBookings({ role: 'renter' });
  const { vehicles: apiVehicles, isLoading: isVehiclesLoading } = useVehicles({ recommended: 'true' });

  // Use real data if available, fallback to mock data for UI completeness
  const stats = summary ? [
    {
      title: "Total Trips",
      value: `${summary.totalTrips} Trips`,
      icon: Car,
      trend: `${summary.completedTrips} completed, ${summary.activeTrips} active`,
      trendUp: true,
      iconColor: "text-primary"
    },
    {
      title: "Upcoming Pickups",
      value: `${summary.upcomingPickups} Pickup${summary.upcomingPickups !== 1 ? 's' : ''}`,
      icon: Calendar,
      trend: summary.nextPickupDate ? new Date(summary.nextPickupDate).toLocaleDateString() : "None",
      trendUp: summary.upcomingPickups > 0,
      iconColor: "text-secondary"
    },
    {
      title: "Total Spent",
      value: `₦${summary.totalSpent.toLocaleString()}`,
      icon: CreditCard,
      trend: `₦${summary.spentThisMonth.toLocaleString()} this month`,
      trendUp: true,
      iconColor: "text-primary"
    },
    {
      title: "Active Support",
      value: `${summary.activeTickets} Tickets`,
      icon: HelpCircle,
      trend: summary.activeTickets === 0 ? "All resolved" : "Action needed",
      trendUp: summary.activeTickets === 0,
      iconColor: "text-secondary"
    }
  ] : mockRenterStats;

  const displayTrips = apiBookings.length > 0 ? apiBookings.map(b => ({
    id: b.id,
    vehicleName: b.vehicle?.name || "Unknown Vehicle",
    startDate: new Date(b.startDate).toLocaleDateString(),
    endDate: new Date(b.endDate).toLocaleDateString(),
    status: b.status,
    location: b.pickupLocation,
    owner: b.vehicle?.hostId || "Unknown Host",
    amount: `₦${b.totalAmount.toLocaleString()}`,
    type: "Rental"
  })) : currentTrips;

  const displayCars = apiVehicles.length > 0 ? apiVehicles.map(v => ({
    id: v.id,
    name: v.name,
    type: v.category,
    dailyRate: `₦${v.dailyRate.toLocaleString()}`,
    rating: v.avgRating || 4.5
  })) : recommendedCars;

  const [trips, setTrips] = useState(displayTrips);

  useEffect(() => {
    setTrips(displayTrips);
  }, [apiBookings, isBookingsLoading]);

  const isLoading = isBookingsLoading || isVehiclesLoading;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200 font-primary">Active</Badge>;
      case "confirmed":
        return <Badge className="bg-green-50 text-green-700 border-green-200 font-primary">Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200 font-primary">Pending Payment</Badge>;
      default:
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200 font-primary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Renter Dashboard
          </h1>
          <p className="text-sm text-slate-500 font-secondary">
            Welcome back! Manage your trips, browse vehicles, and track your rental logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild className="bg-primary hover:bg-primary/90 text-white font-primary">
            <Link href="/dashboard/renter/booking">
              <Search className="h-4 w-4 mr-2" />
              Find a Car
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, i) => (
          <StatCard 
            key={i}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
            iconClassName={stat.iconColor}
          />
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Trips and Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active/Upcoming Trips */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                  Upcoming & Active Trips
                </CardTitle>
                <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/95 text-xs font-primary">
                  <Link href="/dashboard/renter/booking">
                    View All Trips <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {trips.length === 0 ? (
                <div className="text-center py-8">
                  <Car className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-secondary mb-4">No active or upcoming trips booked.</p>
                  <Button asChild size="sm" className="bg-primary text-white font-primary">
                    <Link href="/dashboard/renter/booking">Find a Rental</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {trips.map((trip) => (
                    <BookingCard
                      key={trip.id}
                      id={trip.id}
                      vehicleName={trip.vehicleName}
                      startDate={trip.startDate}
                      endDate={trip.endDate}
                      status={trip.status}
                      location={trip.location}
                      owner={trip.owner}
                      amount={trip.amount}
                      type={trip.type}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recommended Cars */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Explore Premium Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {displayCars.map((car) => (
                  <VehicleCard
                    key={car.id}
                    id={car.id}
                    name={car.name}
                    type={car.type}
                    dailyRate={car.dailyRate}
                    rating={car.rating}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Side - Quick Links & Recent Actions */}
        <div className="space-y-6">
          
          {/* Quick Actions */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Quick Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start text-sm font-primary" asChild>
                <Link href="/dashboard/renter/payments">
                  <CreditCard className="h-4 w-4 mr-2 text-slate-500" />
                  Payment Methods & logs
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm font-primary" asChild>
                <Link href="/dashboard/renter/settings">
                  <User className="h-4 w-4 mr-2 text-slate-500" />
                  Account Settings
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start text-sm font-primary" asChild>
                <Link href="/dashboard/renter/help">
                  <HelpCircle className="h-4 w-4 mr-2 text-slate-500" />
                  Help Center & FAQs
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Payments Table */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50 hover:bg-slate-50/80">
                    <TableHead className="text-xs font-semibold font-secondary py-2 pl-4">Vehicle</TableHead>
                    <TableHead className="text-xs font-semibold font-secondary py-2">Amount</TableHead>
                    <TableHead className="text-xs font-semibold font-secondary py-2 pr-4 text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((tx) => (
                    <TableRow key={tx.id} className="hover:bg-slate-50/50">
                      <TableCell className="py-3 pl-4">
                        <div className="font-medium text-xs text-slate-800 dark:text-white font-primary">{tx.vehicle}</div>
                        <div className="text-[10px] text-slate-400 font-secondary">{tx.date}</div>
                      </TableCell>
                      <TableCell className="py-3 font-semibold text-xs font-primary">{tx.amount}</TableCell>
                      <TableCell className="py-3 pr-4 text-right">
                        <Badge className="bg-green-50 text-green-700 border-green-100 text-[10px] font-normal font-primary">
                          Success
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

        </div>

      </div>
    </div>
  );
}