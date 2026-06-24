"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  Image as ImageIcon,
  Shield,
  ShieldAlert,
  X,
  ZoomIn,
  AlertTriangle,
} from "lucide-react";
import { useHostBookings } from "@/hooks/useBookings";
import { useAllDisputes } from "@/hooks/useDisputes";
import { useBookingInspections } from "@/hooks/useInspections";
import { format } from "date-fns";
import { Booking } from "@/types/models";
import { Inspection } from "@/services/inspection.service";

// ─── Dispute Status Badge ────────────────────────────────────────────────────
function DisputeStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: "bg-red-100 text-destructive dark:text-red-400 border-destructive/20",
    RESOLVED: "bg-green-100 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    REJECTED: "bg-muted text-muted-foreground border-border",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] ?? styles.OPEN}`}>
      {status}
    </span>
  );
}

// ─── Photo grid ──────────────────────────────────────────────────────────────
function InspectionPhotoGrid({ photos, type }: { photos: string[]; type: "PRE" | "POST" }) {
  const labels = ["Front", "Back", "Left Side", "Right Side"];
  return (
    <div className="space-y-2">
      <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        {type === "PRE" ? "Pre-Trip" : "Post-Trip"} Photos
      </h5>
      <div className="grid grid-cols-2 gap-2">
        {photos.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={labels[i] ?? `Photo ${i + 1}`}
              className="w-full aspect-video object-cover rounded-lg border border-border group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 rounded-full p-1.5">
                <ZoomIn className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{labels[i] ?? `Photo ${i + 1}`}</p>
          </a>
        ))}
        {photos.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-8 text-slate-300 border-2 border-dashed rounded-lg">
            <ImageIcon className="h-6 w-6 mb-1" />
            <p className="text-xs">Not submitted yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Per-booking inspection card ─────────────────────────────────────────────
function BookingInspectionCard({ booking }: { booking: Booking }) {
  const [expanded, setExpanded] = useState(false);
  const { preInspection, postInspection } = useBookingInspections(booking.id);

  const isPaid      = booking.status === "paid" || booking.status === "confirmed";
  const isActive    = booking.status === "active";

  return (
    <Card className={`border transition-all ${expanded ? "border-primary/30 shadow-sm" : "border-border hover:border-input"}`}>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-muted rounded-xl">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">{booking.vehicle?.name ?? "Vehicle"}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Renter: {(booking as any).renter?.firstName} {(booking as any).renter?.lastName}
                {" · "}
                {format(new Date(booking.startDate), "MMM dd")} –{" "}
                {format(new Date(booking.endDate), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${preInspection ? "bg-green-100 text-emerald-600 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:text-amber-400"}`}>
              {preInspection ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              PRE
            </div>
            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${postInspection ? "bg-green-100 text-emerald-600 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
              {postInspection ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              POST
            </div>
            <Button size="sm" variant="ghost" className="text-xs text-primary" onClick={() => setExpanded(!expanded)}>
              {expanded ? "Hide" : "View"} Photos
            </Button>
          </div>
        </div>

        {/* Pending notice */}
        {!preInspection && (isPaid || isActive) && (
          <div className="mt-3 flex items-center gap-2 text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            Waiting on renter to submit PRE-trip inspection photos
          </div>
        )}
        {!postInspection && isActive && (
          <div className="mt-2 flex items-center gap-2 text-xs text-amber-600 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
            <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0" />
            Waiting on renter to submit POST-trip inspection photos
          </div>
        )}

        {expanded && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InspectionPhotoGrid photos={preInspection?.photoUrls ?? []} type="PRE" />
            <InspectionPhotoGrid photos={postInspection?.photoUrls ?? []} type="POST" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function HostInspectionsAndDisputesPage() {
  const [activeTab, setActiveTab] = useState<"inspections" | "disputes">("inspections");
  const [disputeFilter, setDisputeFilter] = useState<string | undefined>(undefined);

  const { bookings, isLoading: bookingsLoading } = useHostBookings();
  const { disputes, isLoading: disputesLoading } = useAllDisputes(disputeFilter);

  const tripBookings = bookings.filter((b) =>
    ["confirmed", "paid", "active", "completed"].includes(b.status)
  );
  const openDisputeCount = disputes.filter((d) => d.status === "OPEN").length;

  if (bookingsLoading || disputesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pb-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-primary">
            Inspections & Disputes
          </h1>
          <p className="text-sm text-muted-foreground font-secondary mt-1">
            Review renter inspection photos and manage any disputes raised on your vehicles
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex gap-3">
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-green-600 font-medium">Trips Inspected</p>
              <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {tripBookings.filter((b) => b.status === "completed").length}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-2.5">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-xs text-red-600 font-medium">Open Disputes</p>
              <p className="text-lg font-bold text-destructive dark:text-red-400">{openDisputeCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-muted p-1 rounded-xl w-fit">
        {(["inspections", "disputes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === "inspections" ? <Camera className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            {tab === "inspections" ? "Trip Inspections" : "Disputes"}
            {tab === "disputes" && openDisputeCount > 0 && (
              <span className="bg-destructive/100 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {openDisputeCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── INSPECTIONS TAB ── */}
      {activeTab === "inspections" && (
        <div className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex gap-3">
            <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Your protection as a host</p>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                Renters must upload 4 exterior photos before and after each rental.
                These photos are automatically used as evidence if a dispute is raised.
              </p>
            </div>
          </div>

          {tripBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Camera className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No Active Bookings</h3>
                <p className="text-sm text-muted-foreground mt-1">Inspection records appear once you have active or completed rentals.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tripBookings.map((booking) => (
                <BookingInspectionCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DISPUTES TAB ── */}
      {activeTab === "disputes" && (
        <div className="space-y-4">
          {/* Filter bar */}
          <div className="flex gap-2">
            {([undefined, "OPEN", "RESOLVED", "REJECTED"] as const).map((f) => (
              <button
                key={f ?? "all"}
                onClick={() => setDisputeFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  disputeFilter === f
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-muted-foreground border-border hover:border-slate-400"
                }`}
              >
                {f ?? "All"}
              </button>
            ))}
          </div>

          {disputes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Shield className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-foreground">No Disputes</h3>
                <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                  {disputeFilter ? `No ${disputeFilter.toLowerCase()} disputes.` : "No renters have raised disputes on your vehicles yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {disputes.map((dispute) => (
                <Card key={dispute.id} className={`border ${dispute.status === "OPEN" ? "border-destructive/20 bg-destructive/10/20" : "border-border"}`}>
                  <CardContent className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${dispute.status === "OPEN" ? "bg-red-100" : "bg-muted"}`}>
                          <ShieldAlert className={`h-5 w-5 ${dispute.status === "OPEN" ? "text-red-600" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-foreground text-sm">
                              {(dispute as any).booking?.vehicle?.name ?? "Vehicle"}
                            </p>
                            <DisputeStatusBadge status={dispute.status} />
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Filed {format(new Date(dispute.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      {dispute.status === "OPEN" && (
                        <div className="flex items-center gap-1.5 text-xs text-red-600 bg-destructive/10 border border-destructive/20 px-3 py-1.5 rounded-full font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          Pending admin review
                        </div>
                      )}
                    </div>

                    <div className="bg-white border border-border rounded-xl p-4">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Renter's Claim</p>
                      <p className="text-sm text-foreground">{dispute.reason}</p>
                    </div>

                    {dispute.resolution && (
                      <div className={`border rounded-xl p-4 ${dispute.status === "RESOLVED" ? "bg-emerald-500/10 border-emerald-500/20" : "bg-muted/50 border-border"}`}>
                        <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${dispute.status === "RESOLVED" ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"}`}>
                          Admin Resolution
                        </p>
                        <p className="text-sm text-foreground">{dispute.resolution}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
