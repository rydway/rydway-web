"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Car, Search, CheckCircle, XCircle } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number;
  plateNumber: string;
  pricePerDay: number;
  isVerified: boolean;
  status: string;
  createdAt: string;
  images: { url: string }[];
  host: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

async function fetchAdminVehicles(verified?: string) {
  const params = new URLSearchParams({ limit: "50" });
  if (verified) params.set("verified", verified);
  return api.get<{ data: { items: Vehicle[]; meta: any } }>(
    `/admin/vehicles?${params}`
  );
}

export default function AdminVehiclesPage() {
  const queryClient = useQueryClient();
  const [verifiedFilter, setVerifiedFilter] = useState<string>("");
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-vehicles", verifiedFilter],
    queryFn: () => fetchAdminVehicles(verifiedFilter || undefined),
  });

  const verifyMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/vehicles/${id}/verify`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/admin/vehicles/${id}/reject`, {}),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-vehicles"] }),
  });

  const items: Vehicle[] = (data as any)?.data?.items ?? [];
  const filtered = items.filter((v) => {
    const q = search.toLowerCase();
    return (
      !q ||
      v.name?.toLowerCase().includes(q) ||
      v.plateNumber?.toLowerCase().includes(q) ||
      `${v.host?.user?.firstName} ${v.host?.user?.lastName}`
        .toLowerCase()
        .includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Vehicle Registry
        </h1>
        <p className="text-slate-500 font-secondary mt-1">
          All vehicles listed on the platform.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            id="vehicles-search"
            placeholder="Search by vehicle or host…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[
            { label: "All", value: "" },
            { label: "Verified", value: "true" },
            { label: "Unverified", value: "false" },
          ].map((f) => (
            <button
              key={f.value || "all"}
              id={`vehicles-filter-${f.label.toLowerCase()}`}
              onClick={() => setVerifiedFilter(f.value)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                verifiedFilter === f.value
                  ? "bg-primary text-white border-primary"
                  : "border-slate-200 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400"
              }`}
            >
              {f.label}
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
          <CardContent className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Car className="h-10 w-10 mb-3" />
            <p className="font-medium">No vehicles found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">Vehicle</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Host</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Plate</th>
                <th className="px-4 py-3 text-right hidden lg:table-cell">Price/Day</th>
                <th className="px-4 py-3 text-center">Verified</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Listed</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((v) => (
                <tr
                  key={v.id}
                  id={`vehicle-row-${v.id}`}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {v.images?.[0]?.url ? (
                        <img
                          src={v.images[0].url}
                          alt={v.name}
                          className="h-10 w-14 object-cover rounded-md bg-slate-100"
                        />
                      ) : (
                        <div className="h-10 w-14 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                          <Car className="h-4 w-4 text-slate-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">
                          {v.name ?? `${v.make} ${v.model}`}
                        </p>
                        <p className="text-xs text-slate-400">{v.year}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {v.host?.user?.firstName} {v.host?.user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400">{v.host?.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-mono text-slate-600 dark:text-slate-400 text-xs">
                    {v.plateNumber}
                  </td>
                  <td className="px-4 py-3 text-right hidden lg:table-cell font-semibold text-slate-800 dark:text-slate-200">
                    ₦{Number(v.pricePerDay).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {v.isVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                    ) : (
                      <XCircle className="h-5 w-5 text-slate-300 dark:text-slate-600 mx-auto" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 hidden sm:table-cell">
                    {new Date(v.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {!v.isVerified ? (
                      <div className="flex justify-center gap-1.5">
                        <Button
                          id={`vehicle-verify-${v.id}`}
                          size="sm"
                          className="h-7 px-2.5 text-xs bg-green-600 hover:bg-green-700 text-white"
                          disabled={verifyMutation.isPending}
                          onClick={() => verifyMutation.mutate(v.id)}
                        >
                          {verifyMutation.isPending ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            "Verify"
                          )}
                        </Button>
                        <Button
                          id={`vehicle-reject-${v.id}`}
                          size="sm"
                          variant="destructive"
                          className="h-7 px-2.5 text-xs"
                          disabled={rejectMutation.isPending}
                          onClick={() => rejectMutation.mutate(v.id)}
                        >
                          Reject
                        </Button>
                      </div>
                    ) : (
                      <span className="text-xs text-green-600 font-medium">Approved</span>
                    )}
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
