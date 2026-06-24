"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, FileText, Search } from "lucide-react";

interface Booking {
  id: string;
  bookingNumber: string;
  status: string;
  totalAmount: number;
  startDate: string;
  endDate: string;
  createdAt: string;
  vehicle: { name: string };
  renter: { firstName: string; lastName: string; email: string };
}

const BOOKING_STATUSES = [
  "",
  "pending",
  "confirmed",
  "active",
  "completed",
  "cancelled",
  "disputed",
];

const STATUS_BADGE: Record<string, string> = {
  pending: "bg-amber-100 text-amber-600 dark:text-amber-400 dark:bg-amber-900/30 dark:text-amber-400",
  confirmed: "bg-blue-100 text-blue-600 dark:text-blue-400 dark:bg-blue-900/30 dark:text-blue-400",
  active: "bg-green-100 text-emerald-600 dark:text-emerald-400 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-muted text-foreground dark:bg-slate-800 dark:text-slate-300",
  cancelled: "bg-red-100 text-destructive dark:text-red-400 dark:bg-red-900/30 dark:text-red-400",
  disputed: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
};

async function fetchAdminBookings(status?: string) {
  const params = new URLSearchParams({ limit: "50" });
  if (status) params.set("status", status);
  return api.get<{ data: { items: Booking[]; meta: any } }>(
    `/admin/bookings?${params}`
  );
}

export default function AdminBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bookings", statusFilter],
    queryFn: () => fetchAdminBookings(statusFilter || undefined),
  });

  const items: Booking[] = (data as any)?.data?.items ?? [];
  const filtered = items.filter((b) => {
    const q = search.toLowerCase();
    return (
      !q ||
      b.bookingNumber?.toLowerCase().includes(q) ||
      b.vehicle?.name?.toLowerCase().includes(q) ||
      `${b.renter?.firstName} ${b.renter?.lastName}`.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">
          All Bookings
        </h1>
        <p className="text-muted-foreground font-secondary mt-1">
          Monitor trip activity across the entire platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="bookings-search"
            placeholder="Search by ref, vehicle, or renter…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {BOOKING_STATUSES.map((s) => (
            <button
              key={s || "all"}
              id={`bookings-filter-${s || "all"}`}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors capitalize ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-slate-400 dark:border-slate-700 dark:text-muted-foreground"
              }`}
            >
              {s || "All"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <FileText className="h-10 w-10 mb-3" />
            <p className="font-medium">No bookings found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-border dark:border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 dark:bg-background text-xs text-muted-foreground uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Ref</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Renter</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Vehicle</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Dates</th>
                <th className="px-4 py-3 text-right hidden sm:table-cell">Amount</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((b) => (
                <tr
                  key={b.id}
                  id={`booking-row-${b.id}`}
                  className="hover:bg-muted/50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-foreground dark:text-slate-300">
                      {b.bookingNumber}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.createdAt).toLocaleDateString("en-NG", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="font-medium text-foreground dark:text-slate-300">
                      {b.renter?.firstName} {b.renter?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{b.renter?.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-muted-foreground dark:text-muted-foreground">
                    {b.vehicle?.name}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-muted-foreground">
                    {new Date(b.startDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}{" "}
                    →{" "}
                    {new Date(b.endDate).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right hidden sm:table-cell font-semibold text-foreground dark:text-slate-200">
                    ₦{Number(b.totalAmount).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        STATUS_BADGE[b.status] ??
                        "bg-muted text-muted-foreground"
                      }`}
                    >
                      {b.status}
                    </span>
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
