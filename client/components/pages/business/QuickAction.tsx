"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Calendar, MessageSquare, Star, FileText } from "lucide-react";

interface QuickActionsProps {
  onSearchCars?: () => void;
  onViewBookings?: () => void;
  onMessages?: () => void;
  onReviews?: () => void;
  onReceipts?: () => void;
}

export default function QuickActions({
  onSearchCars,
  onViewBookings,
  onMessages,
  onReviews,
  onReceipts
}: QuickActionsProps) {
  const actions = [
    { label: "Search Cars", icon: Search, onClick: onSearchCars, color: "bg-blue-500/100" },
    { label: "My Bookings", icon: Calendar, onClick: onViewBookings, color: "bg-emerald-500/100" },
    { label: "Messages", icon: MessageSquare, onClick: onMessages, color: "bg-purple-500" },
    { label: "Reviews", icon: Star, onClick: onReviews, color: "bg-yellow-500" },
    { label: "Receipts", icon: FileText, onClick: onReceipts, color: "bg-muted/500" },
  ];

  return (
    <Card className="glassmorphism-card p-6">
      <h3 className="text-lg font-bold font-primary mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {actions.map((action, idx) => (
          <Button
            key={idx}
            onClick={action.onClick}
            variant="outline"
            className="flex-col h-auto py-4 rounded-xl hover:bg-muted/50"
          >
            <div className={`p-3 rounded-full ${action.color} mb-2`}>
              <action.icon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xs font-semibold font-secondary">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}