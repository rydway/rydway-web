"use client";

import { Bell } from "lucide-react";

export default function RenterNotificationsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <div className="bg-muted dark:bg-slate-800 p-4 rounded-full mb-4">
        <Bell className="h-8 w-8 text-muted-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground dark:text-white font-primary mb-2">
        No Notifications
      </h1>
      <p className="text-muted-foreground font-secondary text-center max-w-sm">
        You don't have any notifications right now. We'll let you know when there are updates to your bookings or account.
      </p>
    </div>
  );
}
