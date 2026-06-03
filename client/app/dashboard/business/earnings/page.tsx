// app/dashboard/business/earnings/page.tsx
"use client";

import { useState, useMemo } from "react";
import {
  DollarSign,
  Car,
  Clock,
  TrendingUp,
  CreditCard,
  Calendar,
  Download,
  Filter,
  Wallet,
  Banknote,
  MoreHorizontal,
  Search
} from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { StatCard } from "@/components/base/cards/StatCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Decomposed components and data
import { 
  monthlyEarnings, 
  revenueByCategory, 
  paymentMethods, 
  topVehicles, 
  recentTransactions, 
  payoutHistory, 
  weeklyComparison 
} from "./components/mockData";
import { RevenueChart } from "./components/RevenueChart";
import { WeeklyPerformance } from "./components/WeeklyPerformance";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { PayoutHistoryTable } from "./components/PayoutHistoryTable";
import { TopPerformersList } from "./components/TopPerformersList";
import { useHostDashboard } from "@/hooks/useDashboard";

export default function EarningsPage() {
  const { summary, isLoading } = useHostDashboard();
  const [dateRange, setDateRange] = useState("this-month");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate summary metrics from API or fallback
  const metrics = useMemo(() => {
    const dataSource = summary?.monthlyEarnings || monthlyEarnings;
    const currentMonth = dataSource[dataSource.length - 1] || monthlyEarnings[5];
    const previousMonth = dataSource[dataSource.length - 2] || monthlyEarnings[4];
    
    const totalRevenue = summary?.totalEarnings || dataSource.reduce((sum, m) => sum + (m.revenue || 0), 0);
    const totalProfit = dataSource.reduce((sum, m) => sum + (m.profit || 0), 0);
    const totalExpenses = dataSource.reduce((sum, m) => sum + (m.expenses || 0), 0);
    const totalBookings = summary?.totalBookings || dataSource.reduce((sum, m) => sum + (m.bookings || 0), 0);
    
    const monthlyGrowth = previousMonth.revenue 
      ? ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100 
      : 0;
    const profitMargin = currentMonth.revenue ? (currentMonth.profit / currentMonth.revenue) * 100 : 0;
    
    return {
      totalRevenue,
      totalProfit,
      totalExpenses,
      totalBookings,
      monthlyRevenue: currentMonth.revenue || 0,
      monthlyProfit: currentMonth.profit || 0,
      monthlyGrowth,
      profitMargin,
      averageDailyRate: 48500, // Still mock until granular vehicle metrics
      averageBookingValue: currentMonth.bookings ? (currentMonth.revenue / currentMonth.bookings) : 0,
      dataSource,
    };
  }, [summary]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(t => 
      t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Format currency
  const formatCurrency = (value: number) => {
    return `₦${value.toLocaleString()}`;
  };

  // Format compact currency (M for millions, K for thousands)
  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(1)}K`;
    }
    return `₦${value}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="green" className="bg-green-50 text-green-700 border-green-200">Completed</Badge>;
      case 'pending':
        return <Badge variant="amber" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'refunded':
        return <Badge variant="red" className="bg-red-50 text-red-700 border-red-200">Refunded</Badge>;
      default:
        return <Badge variant="slate">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6 font-secondary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Earnings & Revenue
          </h1>
          <p className="text-sm text-slate-500">
            Track your financial performance, revenue streams, and payouts
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] h-9 text-sm">
              <Calendar className="h-4 w-4 mr-2 text-slate-400" />
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="this-quarter">This Quarter</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="sm" className="h-9">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue (YTD)" 
          value={formatCompactCurrency(metrics.totalRevenue)} 
          icon={DollarSign}
          trend="+24.8% vs last year"
          trendUp={true}
          iconClassName="text-blue-600"
          className="border-slate-200 shadow-sm"
        />
        <StatCard 
          title="Net Profit (YTD)" 
          value={formatCompactCurrency(metrics.totalProfit)} 
          icon={Wallet}
          trend={`${metrics.profitMargin.toFixed(1)}% margin`}
          trendUp={true}
          iconClassName="text-green-600"
          className="border-slate-200 shadow-sm"
        />
        <StatCard 
          title="Monthly Revenue" 
          value={formatCompactCurrency(metrics.monthlyRevenue)} 
          icon={TrendingUp}
          trend={`${metrics.monthlyGrowth > 0 ? '+' : ''}${metrics.monthlyGrowth.toFixed(1)}% vs last month`}
          trendUp={metrics.monthlyGrowth > 0}
          iconClassName="text-amber-600"
          className="border-slate-200 shadow-sm"
        />
        <StatCard 
          title="Total Bookings" 
          value={metrics.totalBookings.toString()} 
          icon={Car}
          trend={`${metrics.dataSource[metrics.dataSource.length - 1]?.bookings || 0} this month`}
          trendUp={true}
          iconClassName="text-purple-600"
          className="border-slate-200 shadow-sm"
        />
      </div>

      {/* Tabs Navigation */}
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-100 p-1 rounded-lg border border-slate-200 inline-flex">
          <TabsTrigger value="overview" className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Overview</TabsTrigger>
          <TabsTrigger value="revenue-breakdown" className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Revenue Breakdown</TabsTrigger>
          <TabsTrigger value="transactions" className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Transactions</TabsTrigger>
          <TabsTrigger value="payouts" className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm">Payouts</TabsTrigger>
        </TabsList>

        {/* ============ OVERVIEW TAB ============ */}
        <TabsContent value="overview" className="space-y-6">
          <RevenueChart data={metrics.dataSource} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeeklyPerformance data={weeklyComparison} />
            </div>
            <TopPerformersList
              vehicles={topVehicles}
              averageDailyRate={metrics.averageDailyRate}
              averageBookingValue={metrics.averageBookingValue}
              formatCurrency={formatCurrency}
              formatCompactCurrency={formatCompactCurrency}
            />
          </div>
        </TabsContent>

        {/* ============ REVENUE BREAKDOWN TAB ============ */}
        <TabsContent value="revenue-breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdown 
              categories={revenueByCategory}
              totalRevenue={metrics.totalRevenue}
              formatCompactCurrency={formatCompactCurrency}
            />

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-slate-800 font-primary">Payment Methods</h3>
                  {paymentMethods.map((method) => (
                    <div key={method.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-700">{method.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">{formatCompactCurrency(method.value)}</span>
                          <span className="text-xs text-slate-500">({method.percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full" 
                          style={{ width: `${method.percentage}%`, background: method.color }}
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 font-secondary">Card processing fees (2.5%)</span>
                      <span className="text-sm text-slate-800 font-semibold">₦206,000</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-slate-600 font-secondary">Bank transfer fees (₦50)</span>
                      <span className="text-sm text-slate-800 font-semibold">₦3,250</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ TRANSACTIONS TAB ============ */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <Search className="h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search transactions..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full md:w-[300px] text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px] h-9 text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select defaultValue="all">
                    <SelectTrigger className="w-[130px] h-9 text-sm">
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="bank">Bank Transfer</SelectItem>
                      <SelectItem value="wallet">Wallet</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm" className="h-9">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50">
                      <TableHead className="text-xs font-medium text-slate-500">Transaction ID</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">Date & Time</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">Vehicle</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">Customer</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500 text-right">Amount</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">Payment</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">Status</TableHead>
                      <TableHead className="text-xs font-medium text-slate-500"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-slate-50">
                        <TableCell className="text-xs font-mono text-slate-500">{tx.id}</TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="text-sm text-slate-800">{format(new Date(tx.date), "MMM d, yyyy")}</div>
                            <div className="text-xs text-slate-500">{format(new Date(tx.date), "h:mm a")}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-medium text-slate-800">{tx.vehicle}</TableCell>
                        <TableCell className="text-sm text-slate-700">{tx.customer}</TableCell>
                        <TableCell className="text-sm font-semibold text-slate-800 text-right">{formatCurrency(tx.amount)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            {tx.paymentMethod === 'Card' && <CreditCard className="h-3.5 w-3.5 text-slate-400" />}
                            {tx.paymentMethod === 'Bank Transfer' && <Banknote className="h-3.5 w-3.5 text-slate-400" />}
                            <span className="text-xs text-slate-600">{tx.paymentMethod}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-xs">View Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs">Download Receipt</DropdownMenuItem>
                              <DropdownMenuItem className="text-xs text-red-600">Refund</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex items-center justify-between p-4 border-t border-slate-200">
                <div className="text-xs text-slate-500">
                  Showing {filteredTransactions.length} of {recentTransactions.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ PAYOUTS TAB ============ */}
        <TabsContent value="payouts" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Available Balance</p>
                    <h3 className="text-2xl font-bold text-slate-800">₦1,245,000</h3>
                    <p className="text-xs text-green-600 mt-2">Next payout: Mar 22, 2026</p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-sm text-white">
                  Request Payout
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Pending Balance</p>
                    <h3 className="text-2xl font-bold text-slate-800">₦{(summary?.pendingBalance || 342000).toLocaleString()}</h3>
                    <p className="text-xs text-amber-600 mt-2">From {summary?.activeBookings || 8} bookings</p>
                  </div>
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">Total Payouts (YTD)</p>
                    <h3 className="text-2xl font-bold text-slate-800">₦3,801,000</h3>
                    <p className="text-xs text-green-600 mt-2">+24% vs last year</p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <PayoutHistoryTable payouts={payoutHistory} formatCurrency={formatCurrency} />
        </TabsContent>
      </Tabs>
    </div>
  );
}