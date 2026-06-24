"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { api } from "@/lib/api/client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  ShieldCheck,
  ShieldX,
  Search,
  ExternalLink,
  User,
} from "lucide-react";

type KycStatus = "pending" | "approved" | "rejected";

interface KycSubmission {
  id: string;
  status: KycStatus;
  type: string;
  documentUrl?: string;
  selfieUrl?: string;
  notes?: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

const STATUS_STYLES: Record<KycStatus, string> = {
  pending: "bg-amber-100 text-amber-600 dark:text-amber-400 dark:bg-amber-900/30 dark:text-amber-400",
  approved: "bg-green-100 text-emerald-600 dark:text-emerald-400 dark:bg-green-900/30 dark:text-green-400",
  rejected: "bg-red-100 text-destructive dark:text-red-400 dark:bg-red-900/30 dark:text-red-400",
};

async function fetchAdminKyc(status?: string) {
  return api.get<{ data: { items: KycSubmission[]; meta: any } }>(
    `/admin/kyc${status ? `?status=${status}` : ""}`
  );
}

async function reviewKyc(id: string, action: "approve" | "reject", notes: string) {
  return api.patch(`/kyc/${id}/${action}`, { notes });
}

export default function AdminKycPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery({
    queryKey: ["admin-kyc", statusFilter],
    queryFn: () => fetchAdminKyc(statusFilter || undefined),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      reviewKyc(id, "approve", reviewNotes[id] ?? ""),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-kyc"] }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      reviewKyc(id, "reject", reviewNotes[id] ?? ""),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-kyc"] }),
  });

  const items: KycSubmission[] = (data as any)?.data?.items ?? [];
  const filtered = items.filter((k) => {
    const q = search.toLowerCase();
    return (
      !q ||
      k.user.email.toLowerCase().includes(q) ||
      `${k.user.firstName} ${k.user.lastName}`.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground dark:text-white">
          KYC &amp; Verification
        </h1>
        <p className="text-muted-foreground font-secondary mt-1">
          Review and approve identity verification submissions.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            id="kyc-search"
            placeholder="Search by name or email…"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s || "all"}
              id={`kyc-filter-${s || "all"}`}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold border transition-colors ${
                statusFilter === s
                  ? "bg-primary text-white border-primary"
                  : "border-border text-muted-foreground hover:border-slate-400 dark:border-slate-700 dark:text-muted-foreground"
              }`}
            >
              {s ? s.charAt(0).toUpperCase() + s.slice(1) : "All"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <ShieldCheck className="h-10 w-10 mb-3" />
            <p className="font-medium">No KYC submissions found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((kyc) => (
            <Card key={kyc.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* User Info */}
                  <div className="flex items-start gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-muted dark:bg-slate-800 flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground dark:text-white">
                        {kyc.user.firstName} {kyc.user.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{kyc.user.email}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs bg-muted dark:bg-slate-800 text-muted-foreground dark:text-muted-foreground px-2 py-0.5 rounded-full capitalize">
                          {kyc.user.role}
                        </span>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                            STATUS_STYLES[kyc.status]
                          }`}
                        >
                          {kyc.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="flex flex-wrap gap-2">
                    {kyc.documentUrl && (
                      <a
                        href={kyc.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`kyc-doc-${kyc.id}`}
                        className="flex items-center gap-1.5 text-xs bg-blue-500/10 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 dark:text-blue-400 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        ID Document
                      </a>
                    )}
                    {kyc.selfieUrl && (
                      <a
                        href={kyc.selfieUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        id={`kyc-selfie-${kyc.id}`}
                        className="flex items-center gap-1.5 text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 px-3 py-1.5 rounded-md hover:bg-purple-100 transition-colors"
                      >
                        <ExternalLink className="h-3 w-3" />
                        Selfie
                      </a>
                    )}
                  </div>

                  {/* Submitted */}
                  <p className="text-xs text-muted-foreground flex-shrink-0">
                    {new Date(kyc.createdAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>

                {/* Review Actions — only show for pending */}
                {kyc.status === "pending" && (
                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-border flex flex-col sm:flex-row gap-3">
                    <Input
                      id={`kyc-notes-${kyc.id}`}
                      placeholder="Optional review notes…"
                      className="flex-1 text-sm"
                      value={reviewNotes[kyc.id] ?? ""}
                      onChange={(e) =>
                        setReviewNotes((prev) => ({
                          ...prev,
                          [kyc.id]: e.target.value,
                        }))
                      }
                    />
                    <div className="flex gap-2">
                      <Button
                        id={`kyc-approve-${kyc.id}`}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white gap-1.5"
                        disabled={approveMutation.isPending}
                        onClick={() => approveMutation.mutate({ id: kyc.id })}
                      >
                        {approveMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ShieldCheck className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </Button>
                      <Button
                        id={`kyc-reject-${kyc.id}`}
                        size="sm"
                        variant="destructive"
                        className="gap-1.5"
                        disabled={rejectMutation.isPending}
                        onClick={() => rejectMutation.mutate({ id: kyc.id })}
                      >
                        {rejectMutation.isPending ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <ShieldX className="h-3.5 w-3.5" />
                        )}
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
