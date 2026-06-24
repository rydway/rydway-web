"use client";

import { useState } from "react";
import { BookingDetailsBase, BookingDetailsData } from "../BookingDetails";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare, 
  Navigation, 
  CheckCircle, 
  XCircle,
  FileText,
  TrendingUp,
  BarChart,
  AlertTriangle,
  MapPin,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BusinessBookingDetailsProps {
  data: BookingDetailsData;
  onBack?: () => void;
  onContactRenter?: () => void;
  onTrackVehicle?: () => void;
  onApproveBooking?: () => void;
  onDeclineBooking?: () => void;
  onDownloadDocuments?: () => void;
  onViewAnalytics?: () => void;
  onUpdateStatus?: () => void;
  onReportIssue?: () => void;
  showApproveDecline?: boolean;
}

export function BusinessBookingDetails({
  data,
  onBack,
  onContactRenter,
  onTrackVehicle,
  onApproveBooking,
  onDeclineBooking,
  onDownloadDocuments,
  onViewAnalytics,
  onUpdateStatus,
  onReportIssue,
  showApproveDecline = false
}: BusinessBookingDetailsProps) {
  const [activeTab, setActiveTab] = useState("details");

const router = useRouter();

    const handleBack = () => {
    router.push("/dashboard/business/booking");
  };

  const getBusinessActions = () => {
    const actions = [];
    
    // Always available
    actions.push(
      <Button 
        key="contact" 
        className="w-full font-primary"
        onClick={onContactRenter}
      >
        <MessageSquare className="h-4 w-4 mr-2" />
        Contact Renter
      </Button>
    );

    // Status-specific actions
    switch (data.status) {
      case 'requested':
        if (showApproveDecline) {
          actions.push(
            <Button 
              key="approve" 
              className="w-full bg-green-600 hover:bg-green-700 font-primary"
              onClick={onApproveBooking}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Booking
            </Button>
          );
          actions.push(
            <Button 
              key="decline" 
              variant="destructive" 
              className="w-full font-primary"
              onClick={onDeclineBooking}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Decline Booking
            </Button>
          );
        }
        break;
      
      case 'active':
        actions.push(
          <Button 
            key="track" 
            variant="outline" 
            className="w-full font-primary"
            onClick={onTrackVehicle}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Track Vehicle
          </Button>
        );
        actions.push(
          <Button 
            key="update" 
            variant="outline" 
            className="w-full font-primary"
            onClick={onUpdateStatus}
          >
            Update Status
          </Button>
        );
        break;
      
      case 'completed':
        actions.push(
          <Button 
            key="analytics" 
            variant="outline" 
            className="w-full font-primary"
            onClick={onViewAnalytics}
          >
            <TrendingUp className="h-4 w-4 mr-2" />
            View Analytics
          </Button>
        );
        break;
    }

    // Common actions
    actions.push(
      <Button 
        key="documents" 
        variant="outline" 
        className="w-full font-primary"
        onClick={onDownloadDocuments}
      >
        <FileText className="h-4 w-4 mr-2" />
        Download Documents
      </Button>
    );

    // Report issue for active bookings
    if (data.status === 'active') {
      actions.push(
        <Button 
          key="report" 
          variant="outline" 
          className="w-full font-primary border-red-300 text-red-600 hover:bg-destructive/10 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
          onClick={onReportIssue}
        >
          <AlertTriangle className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      );
    }

    return actions;
  };

  const businessStats = [
    {
      label: "Daily Revenue",
      value: `₦${data.dailyRate.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      label: "Trip Duration",
      value: `${data.totalDays} days`,
      icon: Clock,
      color: "text-blue-500"
    },
    {
      label: "Distance Traveled",
      value: data.mileage ? `${data.mileage} km` : "N/A",
      icon: MapPin,
      color: "text-purple-500"
    }
  ];

  return (
    <BookingDetailsBase
      data={data}
      role="business"
      activeTab={activeTab}
      onTabChange={setActiveTab}
      onBack={handleBack}
      rightColumn={
        <>
          {/* Business Stats */}
          <Card className="border-border dark:border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground dark:text-white mb-4 font-primary">Trip Stats</h3>
              <div className="space-y-4">
                {businessStats.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${stat.color.replace('text-', 'bg-')} bg-opacity-10`}>
                        <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      </div>
                      <span className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">
                        {stat.label}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground dark:text-white font-primary">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Business Actions */}
          <Card className="border-border dark:border-border">
            <CardContent className="p-6">
              <h3 className="font-semibold text-foreground dark:text-white mb-4 font-primary">Management</h3>
              <div className="space-y-3">
                {getBusinessActions()}
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics (for completed trips) */}
          {data.status === 'completed' && (
            <Card className="border-border dark:border-border">
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground dark:text-white mb-4 font-primary">Performance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Vehicle Condition</span>
                    <Badge variant="green" className="font-primary">Excellent</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Fuel Used</span>
                    <span className="font-medium font-primary">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Late Return</span>
                    <span className="font-medium font-primary">No</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      }
    />
  );
}