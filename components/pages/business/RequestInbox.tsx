"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { formatPrice, formatDate } from "@/lib/utils";
import { Check, X, Calendar } from "lucide-react";
import { Booking } from "@/@types";
import StatusBadge from "@/components/base/StatusBadge";

interface RequestInboxProps {
  requests: Booking[];
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function RequestInbox({ requests, onAccept, onReject }: RequestInboxProps) {
  return (
    <div className="space-y-4">
      {requests.length === 0 ? (
        <Card className="glassmorphism-card p-12 text-center">
          <p className="text-slate-600 font-secondary">No pending requests</p>
        </Card>
      ) : (
        requests.map((request) => (
          <Card key={request.id} className="glassmorphism-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <StatusBadge status={request.status} />
                <h3 className="text-lg font-bold font-primary mt-2">
                  Booking Request #{request.id}
                </h3>
                <p className="text-sm text-slate-600 font-secondary">
                  Vehicle ID: {request.vehicleId}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary font-primary">
                  {formatPrice(request.totalAmount)}
                </p>
                <p className="text-xs text-slate-500 font-secondary">
                  {request.daysCount} days
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-slate-600 font-secondary mb-4">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </span>
            </div>

            {request.status === 'requested' && (
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <Button
                  onClick={() => onAccept?.(request.id)}
                  className="flex-1 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={() => onReject?.(request.id)}
                  variant="outline"
                  className="flex-1 rounded-xl border-red-500 text-red-600 hover:bg-red-50"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            )}
          </Card>
        ))
      )}
    </div>
  );
}
