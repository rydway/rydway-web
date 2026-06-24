"use client";

import { ReactNode } from "react";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Car, 
  Shield, 
  Navigation,
  Phone,
  MessageSquare,
  FileText,
  Download,
  CheckCircle,
  XCircle,
  ChevronLeft,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import StatusBadge from "../../base/StatusBadge";


export interface BookingDetailsData {
  id: string;
  carId: string;
  carName: string;
  carImage: string;
  carType: string;
  renterId: string;
  renterName: string;
  renterAvatar?: string;
  renterPhone: string;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalDays: number;
  dailyRate: number;
  totalAmount: number;
  status: 'requested' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
  extras: {
    insurance: boolean;
    gps: boolean;
    childSeat: boolean;
  };
  notes?: string;
  currentLocation?: string;
  fuelLevel?: number;
  mileage?: number;
}

interface BookingDetailsBaseProps {
  data: BookingDetailsData;
  role: 'renter' | 'business';
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  onBack?: () => void;
  children?: ReactNode;
  actionBanner?: ReactNode;
  leftColumn?: ReactNode;
  rightColumn?: ReactNode;
}

export function BookingDetailsBase({
  data,
  role,
  activeTab = "details",
  onTabChange = () => {},
  onBack,
  children,
  actionBanner,
  leftColumn,
  rightColumn
}: BookingDetailsBaseProps) {
  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid': return 'green';
      case 'pending': return 'amber';
      case 'refunded': return 'slate';
      default: return 'default';
    }
  };

  const defaultLeftColumn = (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid w-full grid-cols-3 font-primary">
        <TabsTrigger value="details" className="font-primary">Details</TabsTrigger>
        <TabsTrigger value="timeline" className="font-primary">Timeline</TabsTrigger>
        <TabsTrigger value="documents" className="font-primary">Documents</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-6">
        {/* Car & Contact Info */}
        <Card className="border-border dark:border-border">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Car Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Car className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground dark:text-white font-primary">Vehicle Information</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Car Model</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">{data.carName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Car Type</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">{data.carType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Daily Rate</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">₦{data.dailyRate.toLocaleString()}/day</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground dark:text-white font-primary">
                    {role === 'renter' ? 'Owner' : 'Renter'} Information
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Name</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">
                      {role === 'renter' ? data.ownerName : data.renterName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Phone</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">
                      {role === 'renter' ? data.ownerPhone : data.renterPhone}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-2 font-primary">
                      <Phone className="h-4 w-4" />
                      Call
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 font-primary">
                      <MessageSquare className="h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rental Details */}
        <Card className="border-border dark:border-border">
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Dates & Times */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground dark:text-white font-primary">Dates & Times</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Rental Period</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">
                      {data.startDate} - {data.endDate} ({data.totalDays} days)
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Pickup Time</p>
                      <p className="font-medium text-foreground dark:text-white font-primary">{data.pickupTime}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Dropoff Time</p>
                      <p className="font-medium text-foreground dark:text-white font-primary">{data.dropoffTime}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground dark:text-white font-primary">Locations</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Pickup Location</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">{data.pickupLocation}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 font-secondary">Dropoff Location</p>
                    <p className="font-medium text-foreground dark:text-white font-primary">{data.dropoffLocation}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        {data.status === 'active' && data.currentLocation && (
          <Card className="border-border dark:border-border">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Navigation className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-foreground dark:text-white font-primary">Current Status</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground dark:text-slate-300 mb-1 font-secondary">Current Location</p>
                  <p className="font-medium text-foreground dark:text-white font-primary">{data.currentLocation}</p>
                </div>
                {data.fuelLevel && (
                  <div>
                    <p className="text-sm text-muted-foreground dark:text-slate-300 mb-1 font-secondary">Fuel Level</p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-secondary dark:bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-emerald-500/100"
                          style={{ width: `${data.fuelLevel}%` }}
                        />
                      </div>
                      <span className="font-medium font-primary">{data.fuelLevel}%</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Extras & Notes */}
        <Card className="border-border dark:border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground dark:text-white mb-3 font-primary">Additional Services</h3>
                <div className="flex flex-wrap gap-3">
                  {data.extras.insurance && (
                    <Badge className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90 dark:border-primary/30 font-primary text-primary-foreground">
                      <Shield className="h-3 w-3" />
                      Insurance
                    </Badge>
                  )}
                  {data.extras.gps && (
                    <Badge className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90 dark:border-primary/30 font-primary text-primary-foreground">
                      <Navigation className="h-3 w-3" />
                      GPS
                    </Badge>
                  )}
                  {data.extras.childSeat && (
                    <Badge className="flex items-center gap-1 bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90 dark:border-primary/30 font-primary text-primary-foreground">
                      Child Seat
                    </Badge>
                  )}
                </div>
              </div>

              {data.notes && (
                <div>
                  <h3 className="font-semibold text-foreground dark:text-white mb-2 font-primary">Special Notes</h3>
                  <p className="text-muted-foreground dark:text-slate-300 bg-muted/50 dark:bg-slate-800 p-3 rounded font-secondary">
                    {data.notes}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="timeline">
        {/* Timeline Content */}
        <Card className="border-border dark:border-border">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground dark:text-white font-primary">Booking Requested</p>
                  <p className="text-sm text-muted-foreground dark:text-muted-foreground font-secondary">{data.createdAt} • 10:30 AM</p>
                  <p className="text-sm text-muted-foreground dark:text-slate-300 mt-1 font-secondary">
                    Booking request submitted by {data.renterName}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="documents">
        {/* Documents Content */}
        <Card className="border-border dark:border-border">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-border dark:border-border rounded-lg gap-4">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="min-w-0">
                    <p className="font-medium text-foreground dark:text-white font-primary truncate">Rental Agreement</p>
                    <p className="text-sm text-muted-foreground dark:text-muted-foreground font-secondary">PDF • 2.4 MB</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2 font-primary flex-shrink-0">
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  const defaultRightColumn = (
    <>
      {/* Price Summary */}
      <Card className="border-border dark:border-border">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground dark:text-white mb-4 font-primary">Price Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground dark:text-slate-300 font-secondary">Daily Rate × {data.totalDays} days</span>
              <span className="font-medium font-primary">₦{(data.dailyRate * data.totalDays).toLocaleString()}</span>
            </div>
            {data.extras.insurance && (
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-slate-300 font-secondary">Insurance</span>
                <span className="font-medium font-primary">₦5,000</span>
              </div>
            )}
            {data.extras.childSeat && (
              <div className="flex justify-between">
                <span className="text-muted-foreground dark:text-slate-300 font-secondary">Child Seat</span>
                <span className="font-medium font-primary">₦3,000</span>
              </div>
            )}
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span className="text-foreground dark:text-white font-primary">Total Amount</span>
              <span className="text-primary dark:text-primary/90 font-primary">₦{data.totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground dark:text-muted-foreground font-secondary">Payment Status</span>
              <Badge variant={getPaymentBadgeVariant(data.paymentStatus)} className="font-primary">
                {data.paymentStatus}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Info */}
      <Card className="border-border dark:border-border">
        <CardContent className="p-6">
          <h3 className="font-semibold text-foreground dark:text-white mb-4 font-primary">Quick Info</h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-muted-foreground dark:text-muted-foreground font-secondary">Booking ID</p>
              <p className="font-medium text-foreground dark:text-white font-primary">{data.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground dark:text-muted-foreground font-secondary">Created On</p>
              <p className="font-medium text-foreground dark:text-white font-primary">{data.createdAt}</p>
            </div>
            <div>
              <p className="text-muted-foreground dark:text-muted-foreground font-secondary">Booking Status</p>
              <div className="mt-1">
                <StatusBadge status={data.status} showIcon={true} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );

  return (
    <div className="space-y-6 font-primary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          {onBack ? (
            <Button variant="outline" size="sm" onClick={onBack} className="font-primary">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          ) : (
            <Button variant="outline" size="sm" asChild className="font-primary">
              <Link href={role === "business" ? "/dashboard/business/booking" : "/dashboard/renter/booking"} className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          )}
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-primary">
              Booking #{data.id}
            </h1>
            <p className="text-sm text-muted-foreground font-secondary">
              {data.carName} • {data.carType}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={data.status} showIcon={true} />
          <Badge variant={getPaymentBadgeVariant(data.paymentStatus)} className="font-primary">
            {data.paymentStatus}
          </Badge>
        </div>
      </div>

      {/* Action Banner */}
      {actionBanner}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {leftColumn || defaultLeftColumn}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {rightColumn || defaultRightColumn}
          {children}
        </div>
      </div>
    </div>
  );
}