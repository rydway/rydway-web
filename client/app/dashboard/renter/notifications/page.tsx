"use client";

import { Bell } from "lucide-react";

export default function RenterNotificationsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full mb-4">
        <Bell className="h-8 w-8 text-slate-400" />
      </div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white font-primary mb-2">
        No Notifications
      </h1>
      <p className="text-slate-500 font-secondary text-center max-w-sm">
        You don't have any notifications right now. We'll let you know when there are updates to your bookings or account.
      </p>
    </div>
  );
}
