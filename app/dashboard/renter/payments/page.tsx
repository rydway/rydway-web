// app/dashboard/renter/payments/page.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Printer, 
  FileText, 
  DollarSign, 
  Clock, 
  CheckCircle
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { StatCard } from "@/components/base/cards/StatCard";
import { format } from "date-fns";

// Remove AddPaymentMethodDialog imports as we're switching to Paystack checkout flow

// Local sub-components
import { mockPayments, mockInvoices } from "./components/mockData";
import { TransactionRow } from "./components/TransactionRow";
import { SpendingChart } from "./components/SpendingChart";
import { PaymentDetailsDialog } from "./components/PaymentDetailsDialog";
import { Payment, Invoice } from "./components/types";
import { paymentService } from "@/services/payment.service";
import { useRenterBookings } from "@/hooks/useBookings";
import { Loader2 } from "lucide-react";

export default function RenterPaymentsPage() {
  const [activeTab, setActiveTab] = useState("transactions");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [showRemoveDialog, setShowRemoveDialog] = useState<string | null>(null);
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showPaymentDetails, setShowPaymentDetails] = useState(false);

  // Fetch live transactions from the API, fallback to mock while loading
  const [apiPayments, setApiPayments] = useState<Payment[]>([]);
  const [invoices] = useState<Invoice[]>(mockInvoices);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);

  // Active bookings — needed to pick a bookingId for Paystack init
  const { bookings } = useRenterBookings();
  const confirmedBooking = bookings.find(
    (b) => b.status === 'confirmed' && b.paymentStatus !== 'success'
  );

  useEffect(() => {
    paymentService
      .getTransactions()
      .then((data) => setApiPayments(data as unknown as Payment[]))
      .catch(() => {/* silently fallback to mock */})
      .finally(() => setIsLoadingTransactions(false));
  }, []);

  // Use live data if available, else fall back to mock
  const payments = apiPayments.length > 0 ? apiPayments : mockPayments;

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalSpent = payments
      .filter(p => p.status === 'completed' && p.type !== 'refund')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const pendingPayments = payments
      .filter(p => p.status === 'pending' || p.status === 'processing')
      .reduce((sum, p) => sum + p.amount, 0);
    
    const upcomingPayments = payments
      .filter(p => p.status === 'pending')
      .length;
    
    const completedTransactions = payments
      .filter(p => p.status === 'completed')
      .length;

    return {
      totalSpent,
      pendingPayments,
      upcomingPayments,
      completedTransactions
    };
  }, [payments]);

  // Filter payments
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.vehicleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [payments, searchQuery, statusFilter]);

  // Removed manual payment method management in favor of Paystack checkout

  // Handle view payment details
  const handleViewPaymentDetails = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowPaymentDetails(true);
  };

  // Handle Paystack checkout
  const handleInitiatePayment = async () => {
    if (!confirmedBooking) {
      alert('No confirmed booking awaiting payment found.');
      return;
    }
    setIsInitiatingPayment(true);
    try {
      const result = await paymentService.initializePayment({
        bookingId: confirmedBooking.id,
        method: 'card',
      });
      paymentService.openCheckout(result.checkoutUrl);
    } catch (err: any) {
      alert(`Could not start payment: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsInitiatingPayment(false);
    }
  };

  return (
    <div className="space-y-6 font-secondary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Payments & Transactions
          </h1>
          <p className="text-sm text-slate-500 font-secondary">
            Manage your payment methods and view transaction history
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-9"
            onClick={() => console.log('Export')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button 
            size="sm" 
            className="bg-blue-600 hover:bg-blue-700 h-9 min-w-[160px]"
            onClick={handleInitiatePayment}
            disabled={isInitiatingPayment || !confirmedBooking}
          >
            {isInitiatingPayment ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Processing...</>
            ) : (
              <><Plus className="h-4 w-4 mr-2" />Make a Payment</>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Spent" 
          value={`₦${metrics.totalSpent.toLocaleString()}`} 
          icon={DollarSign}
          trend="+12.5% vs last month"
          trendUp={true}
          iconClassName="text-blue-600"
          className="border-slate-200 shadow-sm"
        />
        <StatCard 
          title="Pending Payments" 
          value={`₦${metrics.pendingPayments.toLocaleString()}`} 
          icon={Clock}
          trend={`${metrics.upcomingPayments} payments pending`}
          trendUp={false}
          iconClassName="text-amber-600"
          className="border-slate-200 shadow-sm"
        />
        <StatCard 
          title="Completed" 
          value={metrics.completedTransactions.toString()} 
          icon={CheckCircle}
          trend="Transactions"
          trendUp={true}
          iconClassName="text-green-600"
          className="border-slate-200 shadow-sm"
        />
        {/* Removed Payment Methods stat card */}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="transactions" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="">
          <TabsTrigger value="transactions" className="text-sm">Transactions</TabsTrigger>
          <TabsTrigger value="invoices" className="text-sm">Invoices</TabsTrigger>
          <TabsTrigger value="analytics" className="text-sm">Spending Analytics</TabsTrigger>
        </TabsList>

        {/* ============ TRANSACTIONS TAB ============ */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by vehicle, transaction ID, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-10 text-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] h-10 text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[140px] h-10 text-sm">
                      <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">Last 3 Months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead className="text-xs font-medium text-slate-500">Transaction</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500">Date</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500">Method</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500">Amount</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500">Status</TableHead>
                    <TableHead className="text-xs font-medium text-slate-500 text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPayments.length > 0 ? (
                    filteredPayments.map((payment) => (
                      <TransactionRow 
                        key={payment.id} 
                        payment={payment} 
                        onViewDetails={handleViewPaymentDetails}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="h-8 w-8 text-slate-300 mb-2" />
                          <p className="text-sm text-slate-600 mb-1">No transactions found</p>
                          <p className="text-xs text-slate-500">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="flex items-center justify-between p-4 border-t border-slate-200">
                <div className="text-xs text-slate-500 font-secondary">
                  Showing {filteredPayments.length} of {payments.length} transactions
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" disabled className="h-8 text-xs">
                    Previous
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs bg-blue-50 text-blue-700 border-blue-200">
                    1
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    2
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    3
                  </Button>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ PAYMENT METHODS TAB (REMOVED) ============ */}

        {/* ============ INVOICES TAB ============ */}
        <TabsContent value="invoices" className="space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
                    Invoices & Receipts
                  </CardTitle>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs">
                  <Download className="h-3.5 w-3.5 mr-1" />
                  Download All
                </Button>
              </div>
              <CardDescription className="text-sm text-slate-500 font-secondary">
                View and download your invoices and receipts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {invoices.map((invoice) => (
                  <div 
                    key={invoice.id} 
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors font-secondary"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg border border-slate-200">
                        <FileText className="h-5 w-5 text-slate-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium text-slate-800">
                            {invoice.invoiceNumber}
                          </span>
                          <Badge 
                            variant={
                              invoice.status === 'paid' ? 'green' : 
                              invoice.status === 'pending' ? 'amber' : 
                              'red'
                            }
                            className="text-[10px] px-1.5 py-0 h-4"
                          >
                            {invoice.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="text-xs text-slate-500">
                            {format(new Date(invoice.date), 'MMM d, yyyy')}
                          </span>
                          <span className="text-xs text-slate-300">•</span>
                          <span className="text-xs font-medium text-slate-800">
                            ₦{invoice.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ ANALYTICS TAB ============ */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Spending Chart */}
            <Card className="lg:col-span-2 border-slate-200 shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
                    Spending Overview
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <SpendingChart />
              </CardContent>
            </Card>

            {/* Spending Summary */}
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
                  Spending Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 font-secondary">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Total spent</span>
                    <span className="text-sm font-semibold text-slate-800">
                      ₦{metrics.totalSpent.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Average per booking</span>
                    <span className="text-sm font-semibold text-slate-800">
                      ₦{metrics.completedTransactions > 0 ? (metrics.totalSpent / metrics.completedTransactions).toLocaleString() : 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Most spent on</span>
                    <span className="text-sm font-semibold text-slate-800">
                      Luxury SUV
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Peak spending month</span>
                    <span className="text-sm font-semibold text-slate-800">
                      May 2026
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Spending by Category
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span className="text-xs text-slate-600">Sedan</span>
                      </div>
                      <span className="text-xs font-medium text-slate-800">35%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span className="text-xs text-slate-600">SUV</span>
                      </div>
                      <span className="text-xs font-medium text-slate-800">42%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="text-xs text-slate-600">Luxury</span>
                      </div>
                      <span className="text-xs font-medium text-slate-800">18%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                        <span className="text-xs text-slate-600">Other</span>
                      </div>
                      <span className="text-xs font-medium text-slate-800">5%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Payment Method Dialog (REMOVED) */}

      {/* Payment Details Dialog */}
      <PaymentDetailsDialog
        payment={selectedPayment}
        open={showPaymentDetails}
        onOpenChange={setShowPaymentDetails}
      />

    </div>
  );
}