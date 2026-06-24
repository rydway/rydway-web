"use client";

import { Calendar as CalendarIcon, Wrench, Ban } from "lucide-react";

export function CalendarLegend() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-border rounded-lg font-secondary">
      {/* Booking Group */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-foreground">Bookings</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-500/10 border border-blue-500/20"></div>
            <span className="text-xs text-muted-foreground">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-300"></div>
            <span className="text-xs text-muted-foreground">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-destructive/10 border border-destructive/20"></div>
            <span className="text-xs text-muted-foreground">Overdue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-500/10 border border-blue-500/20 opacity-60"></div>
            <span className="text-xs text-muted-foreground">Returned</span>
          </div>
        </div>
      </div>

      {/* Maintenance Group */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-foreground">Maintenance</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500/10 border border-amber-500/20"></div>
            <span className="text-xs text-muted-foreground">Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500/10 border border-amber-500/20"></div>
            <span className="text-xs text-muted-foreground">Service</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-500/10 border border-amber-500/20"></div>
            <span className="text-xs text-muted-foreground">Inspection</span>
          </div>
        </div>
      </div>

      {/* Unavailable Group */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Ban className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Unavailable</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-muted/50 border border-border"></div>
            <span className="text-xs text-muted-foreground">Out of Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
