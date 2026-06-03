"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, CreditCard, Search, TrendingUp } from "lucide-react";

interface Payment {
  id: string;
  reference: string;
  amount: number;
  status: string;
  channel?: string;
  provider: string;
  createdAt: string;
  booking: {
    bookingNumber: string;
  };
}

const PAYMENT_STATUS_BADGE: Record<string, string> = {
  success: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  refunded: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
};

async function fetchAdminPayments() {
  return api.get<{ data: { items: Payment[]; meta: any } }>(
    "/admin/payments?limit=50"
  );
}

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-payments"],
    queryFn: fetchAdminPayments,
  });

  const items: Payment[] = (data as any)?.data?.items ?? [];

  const filtered = items.filter((p) => {
    const q = search.toLowerCase();
    return (
      !q ||
      p.reference?.toLowerCase().includes(q) ||
      p.booking?.bookingNumber?.toLowerCase().includes(q)
    );
  });

  const totalSuccess = items
    .filter((p) => p.status === "success")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Payments
        </h1>
        <p className="text-slate-500 font-secondary mt-1">
          All payment transactions processed through the platform.
        </p>
      </div>

      {/* Summary card */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Collected</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                ₦{totalSuccess.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Transactions</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {items.length}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-10 w-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pending</p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {items.filter((p) => p.status === "pending").length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          id="payments-search"
          placeholder="Search by reference or booking…"
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-slate-400">
            <CreditCard className="h-10 w-10 mb-3" />
            <p className="font-medium">No payments found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Reference</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Booking</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Provider</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  id={`payment-row-${p.id}`}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-700 dark:text-slate-300 break-all">
                      {p.reference}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="font-mono text-xs text-slate-500">
                      {p.booking?.bookingNumber ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-slate-600 dark:text-slate-400 capitalize">
                    {p.provider}
                    {p.channel && (
                      <span className="ml-1 text-xs text-slate-400">
                        ({p.channel})
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800 dark:text-slate-200">
                    ₦{Number(p.amount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        PAYMENT_STATUS_BADGE[p.status] ??
                        "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">
                    {new Date(p.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
