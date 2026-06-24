"use client";

import { Card } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { TrendingUp, DollarSign, Clock, CheckCircle } from "lucide-react";

interface PayoutSummaryProps {
  totalEarnings: number;
  pendingAmount: number;
  availableAmount: number;
  completedBookings: number;
}

export default function PayoutSummary({
  totalEarnings,
  pendingAmount,
  availableAmount,
  completedBookings
}: PayoutSummaryProps) {
  const stats = [
    {
      label: "Total Earnings",
      value: formatPrice(totalEarnings),
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Pending Release",
      value: formatPrice(pendingAmount),
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      label: "Available Now",
      value: formatPrice(availableAmount),
      icon: DollarSign,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Completed Trips",
      value: completedBookings.toString(),
      icon: CheckCircle,
      color: "text-muted-foreground",
      bgColor: "bg-muted"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className="glassmorphism-card p-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-secondary">{stat.label}</p>
              <p className="text-2xl font-bold font-primary mt-1">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}