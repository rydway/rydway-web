// app/dashboard/business/earnings/page.tsx (updated with fixes)
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
  Search,
  X,
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

// Decomposed components
import { RevenueChart } from "./components/RevenueChart";
import { WeeklyPerformance } from "./components/WeeklyPerformance";
import { CategoryBreakdown } from "./components/CategoryBreakdown";
import { PayoutHistoryTable } from "./components/PayoutHistoryTable";
import { TopPerformersList } from "./components/TopPerformersList";

// Import the actual hook
import { useEarnings } from "@/hooks/usePayments";
import { BaseLoader } from "@/components/ui/BaseLoader";

// Mock data only as fallback
import {
  monthlyEarnings as mockMonthlyEarnings,
  revenueByCategory as mockRevenueByCategory,
  paymentMethods as mockPaymentMethods,
  topVehicles as mockTopVehicles,
  recentTransactions as mockRecentTransactions,
  payoutHistory as mockPayoutHistory,
  weeklyComparison as mockWeeklyComparison,
} from "./components/mockData";

// Define proper types
interface Transaction {
  id: string;
  date: string;
  vehicle: string;
  customer: string;
  amount: number;
  paymentMethod: string;
  status: string;
  type: string;
}

export default function EarningsPage() {
  const {
    summary,
    transactions: payoutTransactions,
    isLoading,
    error,
    withdraw,
    isWithdrawing,
  } = useEarnings();

  const [dateRange, setDateRange] = useState("this-month");
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  // Transform API summary data
  const transformedSummary = useMemo(() => {
    if (!summary) return null;

    // Use real data from API
    const totalEarned = summary.totalEarned || 0;
    const totalWithdrawn = summary.totalWithdrawn || 0;
    const pendingWithdrawal = summary.pendingWithdrawal || 0;
    const availableBalance = summary.availableBalance || 0;

    // Calculate derived metrics
    const totalProfit = totalEarned * 0.7;
    const totalExpenses = totalEarned * 0.3;
    const profitMargin =
      totalEarned > 0 ? (totalProfit / totalEarned) * 100 : 0;

    // Generate monthly earnings from transactions if available
    const monthlyEarningsData =
      payoutTransactions?.length > 0
        ? aggregateMonthlyEarnings(payoutTransactions)
        : mockMonthlyEarnings;

    const currentMonth = monthlyEarningsData[monthlyEarningsData.length - 1];
    const previousMonth = monthlyEarningsData[monthlyEarningsData.length - 2];

    const monthlyGrowth = previousMonth?.revenue
      ? ((currentMonth.revenue - previousMonth.revenue) /
          previousMonth.revenue) *
        100
      : 0;

    return {
      totalEarned,
      totalWithdrawn,
      pendingWithdrawal,
      availableBalance,
      totalRevenue: totalEarned,
      totalProfit,
      totalExpenses,
      profitMargin,
      monthlyRevenue: currentMonth?.revenue || 0,
      monthlyProfit: currentMonth?.profit || 0,
      monthlyGrowth,
      totalBookings: currentMonth?.bookings || 0,
      averageDailyRate: 48500,
      averageBookingValue: currentMonth?.bookings
        ? currentMonth.revenue / currentMonth.bookings
        : 0,
      monthlyEarnings: monthlyEarningsData,
    };
  }, [summary, payoutTransactions]);

  // Aggregate transactions into monthly earnings
  const aggregateMonthlyEarnings = (transactions: any[]) => {
    const monthlyMap = new Map();

    transactions.forEach((tx) => {
      const date = new Date(tx.createdAt);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = format(date, "MMM yyyy");

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, {
          month: monthName,
          revenue: 0,
          profit: 0,
          expenses: 0,
          bookings: 0,
        });
      }

      const monthData = monthlyMap.get(monthKey);
      monthData.revenue += tx.amount;
      monthData.profit += tx.amount * 0.7;
      monthData.expenses += tx.amount * 0.3;
      monthData.bookings += 1;
    });

    return Array.from(monthlyMap.values()).slice(-6);
  };

  // Transform payout transactions to match transaction table format
  const recentTransactions: Transaction[] = useMemo(() => {
    if (payoutTransactions && payoutTransactions.length > 0) {
      return payoutTransactions.slice(0, 10).map((tx) => ({
        id: tx.transactionRef || tx.id,
        date: tx.createdAt,
        vehicle: tx.booking?.bookingNumber || `Payout #${tx.id.slice(-6)}`,
        customer: tx.destinationAccountName || "System Payout",
        amount: tx.amount,
        paymentMethod: "Bank Transfer",
        status: tx.status,
        type: "payout",
      }));
    }
    return mockRecentTransactions;
  }, [payoutTransactions]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(
      (t) =>
        t.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, recentTransactions]);

  // Handle withdrawal request
  const handleWithdraw = async () => {
    if (withdrawAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (withdrawAmount > (transformedSummary?.availableBalance || 0)) {
      alert("Insufficient balance");
      return;
    }

    try {
      await withdraw({
        amount: withdrawAmount,
        bankAccountId: "default", // You should implement bank account selection
      });
      setShowWithdrawModal(false);
      setWithdrawAmount(0);
      alert("Withdrawal request submitted successfully!");
    } catch (err: any) {
      alert(`Withdrawal failed: ${err.message}`);
    }
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return `₦${value?.toLocaleString() || 0}`;
  };

  // Format compact currency
  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) {
      return `₦${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `₦${(value / 1000).toFixed(1)}K`;
    }
    return `₦${value || 0}`;
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
      case "paid":
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200">
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge className="bg-red-50 text-red-700 border-red-200">
            Failed
          </Badge>
        );
      default:
        return <Badge variant="outline">{status || "Unknown"}</Badge>;
    }
  };

  // Loading state
  if (isLoading) {
    return <BaseLoader message="Loading earnings data..." />;
  }

  // Error state
  if (error) {
    const isProfileError = error.message?.toLowerCase().includes("host profile");
    
    return (
      <div className="flex items-center justify-center min-h-[400px] max-w-md mx-auto">
        <div className="text-center space-y-4">
          <div className="p-4 bg-slate-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2">
            <Wallet className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 font-primary">
            {isProfileError ? "Complete Your Profile" : "Unable to Load Earnings"}
          </h3>
          <p className="text-slate-500 font-secondary text-sm">
            {isProfileError 
              ? "You need an active host profile and verified KYC to view your earnings and request payouts. Please complete your business verification."
              : `We couldn't load your earnings data: ${error.message}`}
          </p>
          <div className="pt-2">
            {isProfileError ? (
              <Button asChild className="bg-primary hover:bg-primary/90 text-white font-primary w-full">
                <a href="/kyc/business">Complete KYC</a>
              </Button>
            ) : (
              <Button onClick={() => window.location.reload()} variant="outline" className="font-primary w-full">
                Retry
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Transform payouts for the table component
  const payoutsForTable = useMemo(() => {
    if (payoutTransactions && payoutTransactions.length > 0) {
      return payoutTransactions.map((tx) => ({
        id: tx.id,
        date: tx.createdAt,
        amount: tx.amount,
        status: tx.status,
        reference: tx.transactionRef,
        method: "Bank Transfer",
        account:
          `${tx.destinationBankName || ""} ${tx.destinationAccountNumber || ""}`.trim() ||
          "N/A",
      }));
    }
    return mockPayoutHistory;
  }, [payoutTransactions]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Earnings & Revenue
          </h1>
          <p className="text-sm text-slate-500">
            Track your financial performance, revenue streams, and payouts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40 h-9 text-sm">
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

      {/* Key Metrics - Using Real Data */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Balance"
          value={formatCompactCurrency(
            transformedSummary?.availableBalance || 0,
          )}
          icon={Wallet}
          trend="Ready for withdrawal"
          trendUp={true}
          className="border-slate-200 shadow-sm"
        />
        <StatCard
          title="Total Earned"
          value={formatCompactCurrency(transformedSummary?.totalEarned || 0)}
          icon={DollarSign}
          trend="From completed bookings"
          trendUp={true}
          className="border-slate-200 shadow-sm"
        />
        <StatCard
          title="Total Withdrawn"
          value={formatCompactCurrency(transformedSummary?.totalWithdrawn || 0)}
          icon={Banknote}
          trend="Lifetime payouts"
          trendUp={false}
          className="border-slate-200 shadow-sm"
        />
        <StatCard
          title="Pending Balance"
          value={formatCompactCurrency(
            transformedSummary?.pendingWithdrawal || 0,
          )}
          icon={Clock}
          trend="Awaiting processing"
          trendUp={false}
          className="border-slate-200 shadow-sm"
        />
      </div>

      {/* Tabs Navigation */}
      <Tabs
        defaultValue="overview"
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="bg-slate-100 p-1 rounded-lg border border-slate-200 inline-flex">
          <TabsTrigger
            value="overview"
            className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="revenue-breakdown"
            className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Revenue Breakdown
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger
            value="payouts"
            className="text-sm rounded-md px-3 py-1.5 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            Payout History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <RevenueChart
            data={transformedSummary?.monthlyEarnings || mockMonthlyEarnings}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WeeklyPerformance data={mockWeeklyComparison} />
            </div>
            <TopPerformersList
              vehicles={mockTopVehicles}
              averageDailyRate={transformedSummary?.averageDailyRate || 48500}
              averageBookingValue={transformedSummary?.averageBookingValue || 0}
              formatCurrency={formatCurrency}
              formatCompactCurrency={formatCompactCurrency}
            />
          </div>
        </TabsContent>

        {/* Revenue Breakdown Tab */}
        <TabsContent value="revenue-breakdown" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CategoryBreakdown
              categories={mockRevenueByCategory}
              totalRevenue={transformedSummary?.totalRevenue || 0}
              formatCompactCurrency={formatCompactCurrency}
            />

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="space-y-5">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Payment Methods
                  </h3>
                  {mockPaymentMethods.map((method) => (
                    <div key={method.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-700">
                            {method.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-800">
                            {formatCompactCurrency(method.value)}
                          </span>
                          <span className="text-xs text-slate-500">
                            ({method.percentage}%)
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${method.percentage}%`,
                            background: method.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
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
                    className="h-9 w-full md:w-96 text-sm"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-32 h-9 text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
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
                      <TableHead className="text-xs font-medium text-slate-500">
                        Reference
                      </TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">
                        Date & Time
                      </TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">
                        Description
                      </TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">
                        Destination
                      </TableHead>
                      <TableHead className="text-xs font-medium text-slate-500 text-right">
                        Amount
                      </TableHead>
                      <TableHead className="text-xs font-medium text-slate-500">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-medium text-slate-500"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx) => (
                      <TableRow key={tx.id} className="hover:bg-slate-50">
                        <TableCell className="text-xs font-mono text-slate-500">
                          {tx.id.slice(-12)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <div className="text-sm text-slate-800">
                              {format(new Date(tx.date), "MMM d, yyyy")}
                            </div>
                            <div className="text-xs text-slate-500">
                              {format(new Date(tx.date), "h:mm a")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-slate-700">
                          {tx.vehicle}
                        </TableCell>
                        <TableCell className="text-sm text-slate-700">
                          {tx.customer}
                        </TableCell>
                        <TableCell className="text-sm font-semibold text-slate-800 text-right">
                          {formatCurrency(tx.amount)}
                        </TableCell>
                        <TableCell>{getStatusBadge(tx.status)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="text-xs">
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-xs">
                                Download Receipt
                              </DropdownMenuItem>
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
                  Showing {filteredTransactions.length} transactions
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">
                      Available Balance
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {formatCurrency(
                        transformedSummary?.availableBalance || 0,
                      )}
                    </h3>
                    <p className="text-xs text-green-600 mt-2">
                      Ready for withdrawal
                    </p>
                  </div>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Wallet className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <Button
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-sm text-white"
                  onClick={() => setShowWithdrawModal(true)}
                  disabled={
                    isWithdrawing ||
                    (transformedSummary?.availableBalance || 0) <= 0
                  }
                >
                  {isWithdrawing ? "Processing..." : "Request Payout"}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-600 mb-1">
                      Pending Balance
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {formatCurrency(
                        transformedSummary?.pendingWithdrawal || 0,
                      )}
                    </h3>
                    <p className="text-xs text-amber-600 mt-2">
                      Awaiting processing
                    </p>
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
                    <p className="text-sm text-slate-600 mb-1">
                      Total Payouts (All Time)
                    </p>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {formatCurrency(transformedSummary?.totalWithdrawn || 0)}
                    </h3>
                    <p className="text-xs text-green-600 mt-2">
                      Lifetime earnings withdrawn
                    </p>
                  </div>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <PayoutHistoryTable
            payouts={payoutsForTable}
            formatCurrency={formatCurrency}
          />
        </TabsContent>
      </Tabs>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Request Withdrawal</h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-600 block mb-2">
                  Amount (₦)
                </label>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                  placeholder="Enter amount"
                  className="w-full"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Available:{" "}
                  {formatCurrency(transformedSummary?.availableBalance || 0)}
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isWithdrawing ? "Processing..." : "Confirm Withdrawal"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
