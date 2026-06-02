"use client";

import { Calendar as CalendarIcon, Wrench, Ban } from "lucide-react";

export function CalendarLegend() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border border-slate-200 rounded-lg font-secondary">
      {/* Booking Group */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className="h-4 w-4 text-blue-600" />
          <h3 className="text-sm font-semibold text-slate-700">Bookings</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-50 border border-blue-200"></div>
            <span className="text-xs text-slate-600">Pending</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-300"></div>
            <span className="text-xs text-slate-600">Confirmed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-red-50 border border-red-200"></div>
            <span className="text-xs text-slate-600">Overdue</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-blue-50 border border-blue-200 opacity-60"></div>
            <span className="text-xs text-slate-600">Returned</span>
          </div>
        </div>
      </div>

      {/* Maintenance Group */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Wrench className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-semibold text-slate-700">Maintenance</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200"></div>
            <span className="text-xs text-slate-600">Maintenance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200"></div>
            <span className="text-xs text-slate-600">Service</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-amber-50 border border-amber-200"></div>
            <span className="text-xs text-slate-600">Inspection</span>
          </div>
        </div>
      </div>

      {/* Unavailable Group */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Ban className="h-4 w-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-700">Unavailable</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-slate-50 border border-slate-200"></div>
            <span className="text-xs text-slate-600">Out of Service</span>
          </div>
        </div>
      </div>
    </div>
  );
}
