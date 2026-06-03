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
  FileText,
  ShieldAlert,
  X,
} from "lucide-react";
import TripInspection from "@/components/pages/booking/TripInspection";
import { useRenterBookings } from "@/hooks/useBookings";
import { useMyDisputes, useRaiseDispute } from "@/hooks/useDisputes";
import { format } from "date-fns";
import { Booking } from "@/types/models";

// ─── Types ──────────────────────────────────────────────────────────────────
type InspectionType = "PRE" | "POST";

// ─── Dispute Status Badge ────────────────────────────────────────────────────
function DisputeStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    OPEN: "bg-red-100 text-red-700 border-red-200",
    RESOLVED: "bg-green-100 text-green-700 border-green-200",
    REJECTED: "bg-slate-100 text-slate-600 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status] ?? styles.OPEN}`}>
      {status}
    </span>
  );
}

// ─── Raise Dispute Modal ─────────────────────────────────────────────────────
function RaiseDisputeModal({
  bookingId,
  bookingRef,
  onClose,
  onSuccess,
}: {
  bookingId: string;
  bookingRef: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [reason, setReason] = useState("");
  const { raiseDispute, isRaising, error } = useRaiseDispute();

  const handleSubmit = async () => {
    if (reason.trim().length < 20) return;
    try {
      await raiseDispute({ bookingId, reason });
      onSuccess();
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">Raise a Dispute</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Booking: {bookingRef}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700">
              Raising a dispute will pause the host's payout until an admin reviews your claim.
              Only dispute if you have a genuine issue backed by inspection photos.
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              Describe the issue in detail <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="e.g. The vehicle was returned with a dent on the rear bumper that was not present in the PRE-trip inspection photos…"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={5}
              className="resize-none text-sm"
              maxLength={500}
            />
            <div className="flex justify-between mt-1">
              {reason.trim().length < 20 && reason.length > 0 && (
                <p className="text-xs text-red-500">Please provide at least 20 characters.</p>
              )}
              <p className="text-xs text-slate-400 ml-auto">{reason.length}/500</p>
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error.message ?? "Failed to raise dispute. Please try again."}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isRaising}>
              Cancel
            </Button>
            <Button
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={handleSubmit}
              disabled={isRaising || reason.trim().length < 20}
            >
              {isRaising ? "Submitting…" : "Submit Dispute"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Booking Row ─────────────────────────────────────────────────────────────
function BookingInspectionRow({
  booking,
  onOpenInspection,
  onOpenDispute,
}: {
  booking: Booking;
  onOpenInspection: (id: string, type: InspectionType) => void;
  onOpenDispute: (id: string, ref: string) => void;
}) {
  const isPaid    = booking.status === "paid" || booking.status === "confirmed";
  const isActive  = booking.status === "active";
  const isCompleted = booking.status === "completed";
  const bookingRef = (booking as any).bookingNumber ?? booking.id.slice(0, 8).toUpperCase();

  return (
    <Card className="border border-slate-200 hover:border-slate-300 transition-colors">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left – booking info */}
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-xl">
              <FileText className="h-5 w-5 text-slate-600" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">
                {booking.vehicle?.name ?? "Vehicle"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Ref: {bookingRef} · {format(new Date(booking.startDate), "MMM dd")} –{" "}
                {format(new Date(booking.endDate), "MMM dd, yyyy")}
              </p>
              <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                isActive ? "bg-blue-100 text-blue-700" :
                isPaid ? "bg-yellow-100 text-yellow-700" :
                isCompleted ? "bg-green-100 text-green-700" :
                "bg-slate-100 text-slate-600"
              }`}>
                {booking.status}
              </span>
            </div>
          </div>

          {/* Right – action buttons */}
          <div className="flex flex-wrap gap-2">
            {(isPaid || isActive) && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={() => onOpenInspection(booking.id, "PRE")}
              >
                <Camera className="h-3.5 w-3.5" />
                PRE Photos
              </Button>
            )}
            {isActive && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 border-purple-200 text-purple-700 hover:bg-purple-50"
                onClick={() => onOpenInspection(booking.id, "POST")}
              >
                <Camera className="h-3.5 w-3.5" />
                POST Photos
              </Button>
            )}
            {isCompleted && (
              <Button
                size="sm"
                variant="outline"
                className="text-xs gap-1.5 border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => onOpenDispute(booking.id, bookingRef)}
              >
                <ShieldAlert className="h-3.5 w-3.5" />
                Raise Dispute
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function RenterInspectionsAndDisputesPage() {
  const { bookings, isLoading: bookingsLoading } = useRenterBookings();
  const { disputes, isLoading: disputesLoading } = useMyDisputes();

  const [activeTab, setActiveTab] = useState<"inspections" | "disputes">("inspections");
  const [inspectionModal, setInspectionModal] = useState<{ bookingId: string; type: InspectionType } | null>(null);
  const [disputeModal, setDisputeModal] = useState<{ bookingId: string; bookingRef: string } | null>(null);
  const [successBookingId, setSuccessBookingId] = useState<string | null>(null);

  const tripBookings = bookings.filter(
    (b) => ["confirmed", "paid", "active", "completed"].includes(b.status)
  );

  const isLoading = bookingsLoading || disputesLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-3">
          <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
          Inspections & Disputes
        </h1>
        <p className="text-sm text-slate-500 font-secondary mt-1">
          Upload trip inspection photos and manage any issues with your rentals
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {(["inspections", "disputes"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "inspections" ? <Camera className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
            {tab === "inspections" ? "Trip Inspections" : "My Disputes"}
            {tab === "disputes" && disputes.filter((d) => d.status === "OPEN").length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {disputes.filter((d) => d.status === "OPEN").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── INSPECTIONS TAB ── */}
      {activeTab === "inspections" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
            <Camera className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-900">Why inspections matter</p>
              <p className="text-xs text-blue-700 mt-0.5">
                Upload 4 exterior photos (Front, Back, Left, Right) before and after every trip.
                These protect you in any dispute — your evidence is permanent and timestamped.
              </p>
            </div>
          </div>

          {tripBookings.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Camera className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">No Active Trips</h3>
                <p className="text-sm text-slate-400 mt-1">Inspections appear here once you have active or completed bookings.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {tripBookings.map((booking) => (
                <BookingInspectionRow
                  key={booking.id}
                  booking={booking}
                  onOpenInspection={(id, type) => setInspectionModal({ bookingId: id, type })}
                  onOpenDispute={(id, ref) => setDisputeModal({ bookingId: id, bookingRef: ref })}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── DISPUTES TAB ── */}
      {activeTab === "disputes" && (
        <div className="space-y-4">
          {disputes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ShieldAlert className="h-12 w-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-semibold text-slate-700">No Disputes Filed</h3>
                <p className="text-sm text-slate-400 mt-1 text-center max-w-sm">
                  You haven't raised any disputes yet. If you have an issue with a completed trip,
                  go to Inspections and click "Raise Dispute".
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {disputes.map((dispute) => (
                <Card
                  key={dispute.id}
                  className={`border ${dispute.status === "OPEN" ? "border-orange-200 bg-orange-50/20" : "border-slate-200"}`}
                >
                  <CardContent className="p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${dispute.status === "OPEN" ? "bg-orange-100" : "bg-slate-100"}`}>
                          <ShieldAlert className={`h-5 w-5 ${dispute.status === "OPEN" ? "text-orange-600" : "text-slate-400"}`} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">
                            {dispute.booking?.vehicle?.name ?? "Vehicle"}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Filed {format(new Date(dispute.createdAt), "MMM dd, yyyy")}
                          </p>
                        </div>
                      </div>
                      <DisputeStatusBadge status={dispute.status} />
                    </div>

                    <div className="bg-white border border-slate-100 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-500 mb-1">Your claim</p>
                      <p className="text-sm text-slate-700">{dispute.reason}</p>
                    </div>

                    {dispute.status === "OPEN" && (
                      <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        Under review by our team — usually resolved within 48 hours.
                      </div>
                    )}

                    {dispute.resolution && (
                      <div className={`border rounded-lg p-3 ${dispute.status === "RESOLVED" ? "bg-green-50 border-green-200" : "bg-slate-50 border-slate-200"}`}>
                        <p className={`text-xs font-semibold mb-1 ${dispute.status === "RESOLVED" ? "text-green-700" : "text-slate-500"}`}>
                          Admin resolution
                        </p>
                        <p className="text-sm text-slate-700">{dispute.resolution}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Inspection Upload Modal ── */}
      {inspectionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg mt-8">
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setInspectionModal(null)}
                className="bg-white rounded-full p-1.5 shadow-lg text-slate-500 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <TripInspection
              bookingId={inspectionModal.bookingId}
              type={inspectionModal.type}
              onComplete={() => setInspectionModal(null)}
            />
          </div>
        </div>
      )}

      {/* ── Raise Dispute Modal ── */}
      {disputeModal && (
        <RaiseDisputeModal
          bookingId={disputeModal.bookingId}
          bookingRef={disputeModal.bookingRef}
          onClose={() => setDisputeModal(null)}
          onSuccess={() => {
            setSuccessBookingId(disputeModal.bookingId);
            setDisputeModal(null);
            setActiveTab("disputes");
          }}
        />
      )}
    </div>
  );
}
