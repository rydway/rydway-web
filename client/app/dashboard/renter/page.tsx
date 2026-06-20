"use client";

import Link from "next/link";
import {
  Car,
  Calendar,
  CreditCard,
  User,
  Search,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/base/cards/StatCard";
import { BookingCard } from "@/components/features/BookingCard";
import { VehicleCard } from "@/components/features/VehicleCard";
import { Skeleton } from "@/components/ui/skeleton";

import { useRenterDashboard } from "@/hooks/useDashboard";
import { useRenterBookings } from "@/hooks/useBookings";
import { useVehicles } from "@/hooks/useVehicles";
import { useTransactions } from "@/hooks/useTransactions";
import { useTickets } from "@/hooks/useTickets";
import { BaseLoader } from "@/components/ui/BaseLoader";

export default function RenterDashboardPage() {
  const { summary, isLoading: isSummaryLoading } = useRenterDashboard();
  const { bookings: apiBookings, isLoading: isBookingsLoading } = useRenterBookings();
  const { vehicles: apiVehicles, isLoading: isVehiclesLoading } = useVehicles({ recommended: "true" });
  const { transactions: apiTransactions, isLoading: isTransactionsLoading } = useTransactions();
  const { tickets } = useTickets();
  const openTickets = tickets?.filter((t: any) => t.status !== 'closed' && t.status !== 'resolved').length ?? 0;

  const stats = [
    {
      title: "Total Trips",
      value: isSummaryLoading ? "..." : `${summary?.totalBookings ?? 0} Trips`,
      icon: Car,
      trend: isSummaryLoading
        ? "Loading..."
        : `${(summary?.trends?.bookings ?? 0) >= 0 ? '+' : ''}${summary?.trends?.bookings ?? 0}% this month`,
      trendUp: (summary?.trends?.bookings ?? 0) >= 0,
      iconColor: "text-primary",
    },
    {
      title: "Pending Payments",
      value: isSummaryLoading ? "..." : `${summary?.pendingPayments ?? 0} Booking${(summary?.pendingPayments ?? 0) !== 1 ? "s" : ""}`,
      icon: Calendar,
      trend: isSummaryLoading ? "Loading..." : (summary?.pendingPayments ?? 0) > 0 ? "Action needed" : "All clear",
      trendUp: (summary?.pendingPayments ?? 0) === 0,
      iconColor: "text-secondary",
    },
    {
      title: "Total Spent",
      value: isSummaryLoading ? "..." : `₦${(summary?.totalSpend ?? 0).toLocaleString()}`,
      icon: CreditCard,
      trend: isSummaryLoading
        ? "Loading..."
        : `${(summary?.trends?.spend ?? 0) >= 0 ? '+' : ''}${summary?.trends?.spend ?? 0}% this month`,
      trendUp: (summary?.trends?.spend ?? 0) >= 0,
      iconColor: "text-primary",
    },
    {
      title: "Active Support",
      value: `${openTickets} Ticket${openTickets !== 1 ? "s" : ""}`,
      icon: HelpCircle,
      trend: openTickets > 0 ? "Open tickets require attention" : "All tickets resolved",
      trendUp: openTickets === 0,
      iconColor: "text-secondary",
    },
  ];

  const displayTrips = apiBookings.map((b) => ({
    id: b.id,
    vehicleName: b.vehicle?.name || "Unknown Vehicle",
    startDate: new Date(b.startDate).toLocaleDateString(),
    endDate: new Date(b.endDate).toLocaleDateString(),
    status: b.status,
    location: b.pickupLocation,
    owner: b.vehicle?.hostId || "Unknown Host",
    amount: `₦${(b.totalAmount || 0).toLocaleString()}`,
    type: "Rental",
  }));

  const displayCars = apiVehicles.map((v) => ({
    id: v.id,
    name: v.name,
    type: v.category,
    dailyRate: `₦${(v.dailyRate || 0).toLocaleString()}`,
    rating: v.avgRating || 4.5,
  }));

  const recentTransactions = apiTransactions.slice(0, 5).map((tx: any) => ({
    id: tx.id,
    vehicle: tx.booking?.vehicle?.name || tx.description || "Payment",
    date: new Date(tx.createdAt || tx.paidAt || Date.now()).toLocaleDateString(),
    amount: `₦${(tx.amount || 0).toLocaleString()}`,
    status: tx.status,
  }));

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
            <Link href="/dashboard/renter/discover">
              <Search className="h-4 w-4 mr-2" />
              Find a Car
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        {/* Left - Trips & Recommendations */}
        <div className="lg:col-span-2 space-y-6">

          {/* Active/Upcoming Trips */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                  Upcoming &amp; Active Trips
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="text-primary hover:text-primary/95 text-xs font-primary"
                >
                  <Link href="/dashboard/renter/booking">
                    View All Trips <ArrowRight className="h-3 w-3 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isBookingsLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((n) => (
                    <Skeleton key={n} className="h-24 w-full rounded-lg" />
                  ))}
                </div>
              ) : displayTrips.length === 0 ? (
                <div className="text-center py-10">
                  <Car className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-secondary mb-4">
                    No active or upcoming trips yet.
                  </p>
                  <Button asChild size="sm" className="bg-primary text-white font-primary">
                    <Link href="/dashboard/renter/discover">Find a Rental</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayTrips.map((trip) => (
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
              {isVehiclesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2].map((n) => (
                    <Skeleton key={n} className="h-48 w-full rounded-lg" />
                  ))}
                </div>
              ) : displayCars.length === 0 ? (
                <div className="text-center py-10">
                  <Car className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-secondary">
                    No premium recommendations at the moment.
                  </p>
                  <Button asChild size="sm" className="mt-4 bg-primary text-white font-primary">
                    <Link href="/dashboard/renter/discover">Browse All Vehicles</Link>
                  </Button>
                </div>
              ) : (
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
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side */}
        <div className="space-y-6">

          {/* Quick Shortcuts */}
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Quick Shortcuts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-primary"
                asChild
              >
                <Link href="/dashboard/renter/discover">
                  <Search className="h-4 w-4 mr-2 text-slate-500" />
                  Discover Vehicles
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-primary"
                asChild
              >
                <Link href="/dashboard/renter/booking">
                  <Calendar className="h-4 w-4 mr-2 text-slate-500" />
                  My Bookings
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-primary"
                asChild
              >
                <Link href="/dashboard/renter/payments">
                  <CreditCard className="h-4 w-4 mr-2 text-slate-500" />
                  Payment Methods &amp; Logs
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-primary"
                asChild
              >
                <Link href="/dashboard/renter/messages">
                  <HelpCircle className="h-4 w-4 mr-2 text-slate-500" />
                  Messages
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-primary"
                asChild
              >
                <Link href="/dashboard/renter/settings">
                  <User className="h-4 w-4 mr-2 text-slate-500" />
                  Account Settings
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-sm font-primary"
                asChild
              >
                <Link href="/dashboard/renter/help">
                  <HelpCircle className="h-4 w-4 mr-2 text-slate-500" />
                  Help Center &amp; FAQs
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
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
                    <TableHead className="text-xs font-semibold font-secondary py-2 pl-4">
                      Vehicle
                    </TableHead>
                    <TableHead className="text-xs font-semibold font-secondary py-2">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs font-semibold font-secondary py-2 pr-4 text-right">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isTransactionsLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="py-6">
                        <div className="flex justify-center">
                          <BaseLoader />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : recentTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center py-6 text-sm text-slate-500 font-secondary"
                      >
                        No recent transactions.
                      </TableCell>
                    </TableRow>
                  ) : (
                    recentTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-slate-50/50">
                        <TableCell className="py-3 pl-4">
                          <div className="font-medium text-xs text-slate-800 dark:text-white font-primary">
                            {tx.vehicle}
                          </div>
                          <div className="text-[10px] text-slate-400 font-secondary">
                            {tx.date}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 font-semibold text-xs font-primary">
                          {tx.amount}
                        </TableCell>
                        <TableCell className="py-3 pr-4 text-right">
                          <Badge className="text-[10px] font-normal font-primary capitalize bg-slate-50 text-slate-700 border-slate-200">
                            {tx.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}