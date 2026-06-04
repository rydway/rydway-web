"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  DollarSign,
  Car,
  Clock,
  CheckCircle,
  TrendingUp,
  PieChart as PieChartIcon,
  Car as CarIcon,
  MapPin,
  Calendar,
  User,
  CreditCard,
  Users,
  AlertCircle,
  Navigation,
  CheckCircle2,
  XCircle,
  Loader2
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
import { useHostDashboard } from "@/hooks/useDashboard";
import { useHostBookings } from "@/hooks/useBookings";
import { useMemo } from "react";

export default function DashboardPage() {
  const { summary, isLoading: isSummaryLoading } = useHostDashboard();
  const { bookings } = useHostBookings();

  const displayEarnings = summary?.monthlyEarnings || [];
  const displayFleet = summary?.fleetStatus || [];

  const requestedCars = useMemo(() =>
    bookings.filter((b: any) => b.status === 'requested').slice(0, 5),
  [bookings]);

  const dispatchedBookings = useMemo(() =>
    bookings.filter((b: any) => ['confirmed', 'active'].includes(b.status)).slice(0, 5),
  [bookings]);
  const stats = [
    {
      title: "Total Earnings",
      value: summary ? `₦${summary.totalEarnings.toLocaleString()}` : "₦2,450,000",
      icon: DollarSign,
      trend: "+15.2% this month",
      trendUp: true,
      iconColor: "text-primary"
    },
    {
      title: "Active Bookings",
      value: "8 Active",
      icon: Calendar,
      trend: "3 pending confirmation",
      trendUp: true,
      iconColor: "text-secondary"
    },
    {
      title: "Fleet Utilization",
      value: "75%",
      icon: TrendingUp,
      trend: "+5.4% vs last week",
      trendUp: true,
      iconColor: "text-primary"
    },
    {
      title: "Pending Balance",
      value: summary ? `₦${summary.pendingBalance.toLocaleString()}` : "₦180,000",
      icon: Clock,
      trend: "Available for withdrawal",
      trendUp: true,
      iconColor: "text-secondary"
    }
  ];

  if (isSummaryLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 font-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Host Dashboard
          </h1>
          <p className="text-sm text-slate-500 font-secondary">
            Overview of your fleet performance, earnings, and booking requests
          </p>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AREA CHART */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Monthly Earnings
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart 
                  data={displayEarnings}
                  margin={{ top: 10, right: 20, left: 20, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0074D1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#0074D1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748b"
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    padding={{ left: 0, right: 10 }}
                    fontFamily="var(--font-primary)"
                  />
                  <YAxis 
                    stroke="#64748b"
                    axisLine={{ stroke: '#e2e8f0' }}
                    tickLine={{ stroke: '#e2e8f0' }}
                    tickFormatter={(value) => `₦${value / 1000000}M`}
                    padding={{ top: 10, bottom: 10 }}
                    fontFamily="var(--font-primary)"
                  />
                  <Tooltip 
                    formatter={(value) => [`₦${Number(value).toLocaleString()}`, "Earnings"]}
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-primary)',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                    }}
                    labelStyle={{ color: '#0074D1', fontWeight: '600' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0074D1"
                    strokeWidth={2}
                    fill="url(#colorEarnings)"
                    fillOpacity={1}
                    activeDot={{ 
                      r: 6,
                      fill: "#7AC1FF",
                      strokeWidth: 0
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* PIE CHART */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PieChartIcon className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Fleet Status
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayFleet}
                    cx="50%"
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={2}
                  >
                    {displayFleet.map((entry: any, i: number) => (
                      <Cell 
                        key={`cell-${i}`} 
                        fill={entry.color} 

                        strokeWidth={0}
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-primary)',
                      boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value, name) => [`${value} cars`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-2">
              {displayFleet.map((s: any) => (
                <div key={s.name} className="flex justify-between items-center p-2 rounded">
                  <span className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 font-secondary">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: s.color }}
                    />
                    {s.name}
                  </span>
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400 font-primary">
                    {s.value}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* REQUESTS + DISPATCHED */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* REQUESTED CARS */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Car Requests
              </CardTitle>
              <Badge variant="outline" className="font-normal bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800 font-primary">
                <AlertCircle className="h-3 w-3 mr-1" />
                {requestedCars.length} Pending
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {requestedCars.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <AlertCircle className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 font-secondary text-sm">No pending booking requests</p>
                </div>
              ) : (
                requestedCars.map((r: any) => (
                  <Card key={r.id} className="p-4 border-slate-200 dark:border-slate-800 hover:border-primary/20 dark:hover:border-primary/30 transition-colors shadow-none">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded bg-primary/10 dark:bg-primary/20">
                            <CarIcon className="h-3.5 w-3.5 text-primary dark:text-primary/90" />
                          </div>
                          <p className="font-semibold text-slate-800 dark:text-white font-primary">{r.vehicle?.name || r.vehicleId || 'Unknown Vehicle'}</p>
                        </div>
                        <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1 font-secondary">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {r.renter?.fullName || r.renterId || 'Unknown Renter'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3" />
                            <span className="text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-primary">
                              {r.startDate ? new Date(r.startDate).toLocaleDateString() : '–'}
                            </span>
                            <Badge 
                              variant="outline" 
                              className="text-xs font-medium bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90 dark:border-primary/30 font-primary"
                            >
                              {r.endDate && r.startDate
                                ? `${Math.ceil((new Date(r.endDate).getTime() - new Date(r.startDate).getTime()) / 86400000)} days`
                                : '–'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-sm border-red-500 bg-white text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20 font-primary"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Decline
                          </Button>
                          <Button 
                            size="sm"
                            className="text-sm bg-primary hover:bg-primary/90 text-white font-primary"
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* DISPATCHED TABLE */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-slate-800 dark:text-white font-primary">
                Dispatched Bookings
              </CardTitle>
              <Badge 
                variant="outline" 
                className="font-normal bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90 dark:border-primary/30 font-primary"
              >
                {dispatchedBookings.length} Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-[400px] overflow-y-auto">
              {dispatchedBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <Navigation className="h-10 w-10 text-slate-300 mb-3" />
                  <p className="text-slate-500 font-secondary text-sm">No active dispatched bookings</p>
                </div>
              ) : (
                <Table>
                  <TableHeader className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                    <TableRow>
                      <TableHead className="text-slate-600 dark:text-slate-300 font-secondary">Client</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-300 font-secondary">Car</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-300 font-secondary">Duration</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-300 font-secondary">Amount</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-300 font-secondary">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dispatchedBookings.map((b: any) => (
                      <TableRow 
                        key={b.id} 
                        className="border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                      >
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800 dark:text-white font-primary">
                              {b.renter?.fullName || b.renterId || 'Unknown'}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 font-secondary">
                              {b.startDate ? new Date(b.startDate).toLocaleDateString() : '–'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="font-medium text-slate-800 dark:text-white font-primary">
                              {b.vehicle?.name || b.vehicleId || '–'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300 font-secondary">
                            <Calendar className="h-3 w-3" />
                            {b.startDate && b.endDate
                              ? `${Math.ceil((new Date(b.endDate).getTime() - new Date(b.startDate).getTime()) / 86400000)} days`
                              : '–'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-semibold text-primary dark:text-primary/90 font-primary">
                            {b.totalAmount ? `₦${b.totalAmount.toLocaleString()}` : '–'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            className={`font-normal font-primary ${
                              b.status === 'active' 
                                ? 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90 dark:border-primary/30'
                                : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                            }`}
                          >
                            {b.status === 'active' ? 'Active' : 'Confirmed'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}