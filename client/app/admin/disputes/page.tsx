"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  Image as ImageIcon,
  ShieldAlert,
  ShieldCheck,
  X,
  ZoomIn,
} from "lucide-react";
import { useAllDisputes, useResolveDispute } from "@/hooks/useDisputes";
import { format } from "date-fns";
import type { Dispute } from "@/services/dispute.service";

// ─── Status badge ────────────────────────────────────────────────────────────
function DisputeStatusBadge({ status }: { status: string }) {
  const cfg: Record<string, { cls: string; label: string }> = {
    OPEN:     { cls: "bg-red-100 text-red-700 border-red-200",     label: "Open" },
    RESOLVED: { cls: "bg-green-100 text-green-700 border-green-200", label: "Resolved" },
    REJECTED: { cls: "bg-slate-100 text-slate-600 border-slate-200", label: "Rejected" },
  };
  const { cls, label } = cfg[status] ?? cfg.OPEN;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${cls}`}>
      {label}
    </span>
  );
}

// ─── Inspection photo grid ───────────────────────────────────────────────────
function InspectionPhotoGrid({ photos, type }: { photos: string[]; type: "PRE" | "POST" }) {
  const labels = ["Front", "Back", "Left Side", "Right Side"];
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {type === "PRE" ? "Pre-Trip" : "Post-Trip"} Photos
      </p>
      <div className="grid grid-cols-2 gap-2">
        {photos.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={labels[i]}
              className="w-full aspect-video object-cover rounded-lg border border-slate-200 group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 rounded-full p-1.5"><ZoomIn className="h-4 w-4 text-white" /></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">{labels[i]}</p>
          </a>
        ))}
        {photos.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-8 border-2 border-dashed rounded-lg text-slate-300">
            <ImageIcon className="h-6 w-6 mb-1" /><p className="text-xs">No photos</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Resolve Modal ───────────────────────────────────────────────────────────
function ResolveModal({
  dispute,
  onClose,
  onSuccess,
}: {
  dispute: Dispute;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [resolution, setResolution] = useState("");
  const [outcome, setOutcome] = useState<"RESOLVED" | "REJECTED">("RESOLVED");
  const { resolveDispute, isResolving, error } = useResolveDispute();

  const handleSubmit = async () => {
    if (resolution.trim().length < 10) return;
    try {
      await resolveDispute({ id: dispute.id, resolution, outcome });
      onSuccess();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold">Resolve Dispute</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {(dispute as any).booking?.vehicle?.name} — Booking {(dispute as any).booking?.bookingNumber}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {/* Renter's claim */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-orange-700 mb-1">Renter's Claim</p>
            <p className="text-sm text-orange-800">{dispute.reason}</p>
          </div>

          {/* Outcome toggle */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">Outcome</p>
            <div className="flex gap-2">
              <button
                onClick={() => setOutcome("RESOLVED")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  outcome === "RESOLVED"
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-slate-600 border-slate-200 hover:border-green-300"
                }`}
              >
                <CheckCircle2 className="h-4 w-4 inline mr-1.5" />
                Uphold Claim
              </button>
              <button
                onClick={() => setOutcome("REJECTED")}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all ${
                  outcome === "REJECTED"
                    ? "bg-slate-700 text-white border-slate-700"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
              >
                <X className="h-4 w-4 inline mr-1.5" />
                Reject Claim
              </button>
            </div>
          </div>

          {/* Resolution note */}
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Resolution Notes <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Explain your decision based on the inspection evidence..."
              value={resolution}
              onChange={(e) => setResolution(e.target.value)}
              rows={4}
              className="resize-none text-sm"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error.message}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isResolving}>
              Cancel
            </Button>
            <Button
              className={`flex-1 text-white ${outcome === "RESOLVED" ? "bg-green-600 hover:bg-green-700" : "bg-slate-700 hover:bg-slate-800"}`}
              onClick={handleSubmit}
              disabled={isResolving || resolution.trim().length < 10}
            >
              {isResolving ? "Saving…" : `${outcome === "RESOLVED" ? "Uphold" : "Reject"} & Close`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Main Admin Disputes Page ─────────────────────────────────────────────────
export default function AdminDisputesDashboard() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [resolveTarget, setResolveTarget] = useState<Dispute | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { disputes, isLoading, refetch } = useAllDisputes(statusFilter);

  const openCount     = disputes.filter((d) => d.status === "OPEN").length;
  const resolvedCount = disputes.filter((d) => d.status === "RESOLVED").length;
  const rejectedCount = disputes.filter((d) => d.status === "REJECTED").length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading disputes…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
          Disputes &amp; Claims
        </h1>
        <p className="text-sm text-slate-500 font-secondary mt-1">
          Review PRE/POST inspection evidence and issue rulings on active disputes
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-red-700">{openCount}</p>
          <p className="text-xs text-red-600 font-medium mt-1">Open</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{resolvedCount}</p>
          <p className="text-xs text-green-600 font-medium mt-1">Resolved</p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-slate-700">{rejectedCount}</p>
          <p className="text-xs text-slate-600 font-medium mt-1">Rejected</p>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 flex-wrap">
        {([undefined, "OPEN", "RESOLVED", "REJECTED"] as const).map((f) => (
          <button
            key={f ?? "all"}
            onClick={() => setStatusFilter(f)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              statusFilter === f
                ? "bg-primary text-white border-primary"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
            }`}
          >
            {f ?? "All"} {f === "OPEN" && openCount > 0 ? `(${openCount})` : ""}
          </button>
        ))}
      </div>

      {/* Disputes list */}
      {disputes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShieldCheck className="h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No Disputes</h3>
            <p className="text-sm text-slate-400 mt-1">
              {statusFilter ? `No ${statusFilter.toLowerCase()} disputes found.` : "No disputes have been raised yet."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => {
            const booking    = (dispute as any).booking;
            const pre        = booking?.inspections?.find((i: any) => i.type === "PRE");
            const post       = booking?.inspections?.find((i: any) => i.type === "POST");
            const isExpanded = expandedId === dispute.id;

            return (
              <Card
                key={dispute.id}
                className={`border transition-all ${
                  dispute.status === "OPEN" ? "border-red-200 bg-red-50/10" : "border-slate-200"
                } ${isExpanded ? "shadow-md" : ""}`}
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top row */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${dispute.status === "OPEN" ? "bg-red-100" : "bg-slate-100"}`}>
                        <ShieldAlert className={`h-5 w-5 ${dispute.status === "OPEN" ? "text-red-600" : "text-slate-400"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-slate-900 text-sm">{booking?.vehicle?.name ?? "Vehicle"}</p>
                          <DisputeStatusBadge status={dispute.status} />
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Renter: {booking?.renter?.firstName} {booking?.renter?.lastName}
                          {" · Host: "}
                          {booking?.host?.user?.firstName} {booking?.host?.user?.lastName}
                        </p>
                        <p className="text-xs text-slate-400">Filed {format(new Date(dispute.createdAt), "MMM dd, yyyy 'at' h:mm a")}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-primary hover:text-primary/80"
                        onClick={() => setExpandedId(isExpanded ? null : dispute.id)}
                      >
                        {isExpanded ? "Hide Evidence" : "View Evidence"}
                      </Button>
                      {dispute.status === "OPEN" && (
                        <Button
                          size="sm"
                          className="text-xs bg-primary hover:bg-slate-800 text-white gap-1.5"
                          onClick={() => setResolveTarget(dispute)}
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                          Rule
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Claim text */}
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Renter's Claim</p>
                    <p className="text-sm text-slate-700">{dispute.reason}</p>
                  </div>

                  {/* Resolution */}
                  {dispute.resolution && (
                    <div className={`border rounded-xl p-4 ${dispute.status === "RESOLVED" ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                      <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${dispute.status === "RESOLVED" ? "text-green-700" : "text-slate-500"}`}>
                        Admin Ruling
                      </p>
                      <p className="text-sm text-slate-700">{dispute.resolution}</p>
                      {dispute.resolvedAt && (
                        <p className="text-xs text-slate-400 mt-2">
                          Resolved {format(new Date(dispute.resolvedAt), "MMM dd, yyyy")}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Inspection evidence (expandable) */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-slate-100">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                        Inspection Evidence
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <InspectionPhotoGrid photos={pre?.photoUrls ?? []} type="PRE" />
                        <InspectionPhotoGrid photos={post?.photoUrls ?? []} type="POST" />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Resolve modal */}
      {resolveTarget && (
        <ResolveModal
          dispute={resolveTarget}
          onClose={() => setResolveTarget(null)}
          onSuccess={() => {
            setResolveTarget(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}
