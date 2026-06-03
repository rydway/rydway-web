// components/pages/vehicle/view/VehicleDetails.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Shield,
  Award,
  ChevronLeft,
  MoreVertical,
  Copy,
  Download,
  Printer,
  Archive,
  MapPin,
  Users,
  Fuel,
  Gauge,
  Car
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CreateBookingModal } from "../../booking/renter/create/BookingModal";

// Sub-components
import { VehicleGallery } from "./components/VehicleGallery";
import { VehicleSpecs } from "./components/VehicleSpecs";
import { VehicleFeatures } from "./components/VehicleFeatures";
import { RentalTerms } from "./components/RentalTerms";
import { BusinessInfo } from "./components/BusinessInfo";
import { ReviewsSection } from "./components/ReviewsSection";
import { MaintenanceHistory } from "./components/MaintenanceHistory";
import { BookingStats } from "./components/BookingStats";
import { DocumentStatus } from "./components/DocumentStatus";
import { BusinessActions } from "./components/BusinessActions";
import { RenterActions } from "./components/RenterActions";
import { VehicleDetailsProps } from "./components/types";

export type { VehicleDetails, Review, MaintenanceRecord, AvailabilitySlot, VehicleDetailsProps } from "./components/types";

export function VehicleDetailsComponent({
  vehicle,
  role,
  onBack,
  onEdit,
  onDelete,
  onToggleStatus,
  onBook,
  onContact,
  onShare,
  onFavorite,
  onCopyId,
  onDownloadSpecs,
  onPrint,
  onArchive,
  isFavorite = false,
  showBackButton = true,
  className = "",
  userProfile
}: VehicleDetailsProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("details");
  const [showBookingModal, setShowBookingModal] = useState(false);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleBookClick = () => {
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (bookingData: any) => {
    if (onBook) {
      onBook(bookingData);
    }
    console.log("Booking submitted:", bookingData);
  };

  return (
    <>
      <div className={`space-y-6 font-secondary ${className}`}>
        {/* Header Navigation */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="h-8 px-2">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          )}
          
          <div className="flex items-center gap-2">
            <Badge 
              variant={
                vehicle.status === 'available' ? 'green' : 
                vehicle.status === 'booked' ? 'blue' : 
                vehicle.status === 'maintenance' ? 'amber' : 
                'red'
              }
              className="font-primary"
            >
              {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
            </Badge>
            
            {vehicle.isVerified && (
              <Badge variant="blue" className="bg-blue-100 text-blue-700 border-blue-200">
                <Shield className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            
            {vehicle.isFeatured && (
              <Badge variant="purple" className="bg-purple-100 text-purple-700 border-purple-200">
                <Award className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
          
          <div className="flex-1" />
          
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onCopyId && (
                <DropdownMenuItem onClick={onCopyId}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Vehicle ID
                </DropdownMenuItem>
              )}
              {onDownloadSpecs && (
                <DropdownMenuItem onClick={onDownloadSpecs}>
                  <Download className="h-4 w-4 mr-2" />
                  Download Specs
                </DropdownMenuItem>
              )}
              {onPrint && (
                <DropdownMenuItem onClick={onPrint}>
                  <Printer className="h-4 w-4 mr-2" />
                  Print Details
                </DropdownMenuItem>
              )}
              {onArchive && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={onArchive}>
                    <Archive className="h-4 w-4 mr-2" />
                    Archive Vehicle
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle Gallery */}
            <VehicleGallery 
              images={vehicle.gallery} 
              name={vehicle.name}
              onShare={onShare}
              onFavorite={onFavorite}
              isFavorite={isFavorite}
            />

            {/* Tabs for different sections */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="w-full grid grid-cols-4 bg-slate-100 p-1">
                <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                <TabsTrigger value="features" className="text-sm">Features</TabsTrigger>
                <TabsTrigger value="reviews" className="text-sm">Reviews</TabsTrigger>
                {role === "business" && (
                  <TabsTrigger value="performance" className="text-sm">Performance</TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                {/* Description */}
                <Card className="border-slate-200 shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-slate-800">
                      Description
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                      {vehicle.description}
                    </p>
                  </CardContent>
                </Card>

                {/* Specifications */}
                <VehicleSpecs vehicle={vehicle} />
                
                {/* Business Only Sections */}
                {role === "business" && (
                  <>
                    <DocumentStatus vehicle={vehicle} />
                    <MaintenanceHistory history={vehicle.maintenanceHistory} />
                  </>
                )}
              </TabsContent>

              <TabsContent value="features" className="space-y-6">
                <VehicleFeatures features={vehicle.features} />
                <RentalTerms vehicle={vehicle} />
              </TabsContent>

              <TabsContent value="reviews">
                <ReviewsSection 
                  reviews={vehicle.reviews} 
                  rating={vehicle.rating} 
                  totalReviews={vehicle.totalReviews} 
                />
              </TabsContent>

              {role === "business" && (
                <TabsContent value="performance" className="space-y-6">
                  <BookingStats stats={vehicle.bookingStats} />
                </TabsContent>
              )}
            </Tabs>
          </div>

          {/* Right Column - Booking/Actions & Business Info */}
          <div className="space-y-6">
            {/* Price Card & Actions */}
            <Card className="border-slate-200 shadow-sm sticky top-6">
              <CardContent className="p-6 space-y-6">
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-slate-800">
                    ₦{vehicle.dailyRate.toLocaleString()}
                  </span>
                  <span className="text-sm text-slate-500">/ day</span>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{vehicle.location}</span>
                </div>

                <Separator />

                {/* Quick Specs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Users className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Seats</p>
                      <p className="text-sm font-medium">{vehicle.seats}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Fuel className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Fuel</p>
                      <p className="text-sm font-medium">{vehicle.fuelType}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Gauge className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Transmission</p>
                      <p className="text-sm font-medium">{vehicle.transmission}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg">
                    <Car className="h-4 w-4 text-slate-500" />
                    <div>
                      <p className="text-xs text-slate-500">Type</p>
                      <p className="text-sm font-medium capitalize">{vehicle.vehicleType}</p>
                    </div>
                  </div>
                </div>

                {/* Actions based on role */}
                {role === "business" ? (
                  <BusinessActions 
                    vehicle={vehicle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onToggleStatus={onToggleStatus}
                  />
                ) : (
                  <RenterActions 
                    vehicle={vehicle}
                    onBook={handleBookClick}
                    onContact={onContact}
                  />
                )}
              </CardContent>
            </Card>

            {/* Business Information */}
            <BusinessInfo vehicle={vehicle} />

            {/* Insurance & Deposit Info */}
            <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-800 mb-1">
                      Insurance Included
                    </h4>
                    <p className="text-xs text-slate-600">
                      Comprehensive insurance coverage included in your rental. 
                      Security deposit of ₦{vehicle.securityDeposit.toLocaleString()} is required.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {role === "renter" && (
        <CreateBookingModal
          open={showBookingModal}
          onOpenChange={setShowBookingModal}
          vehicle={vehicle}
          userProfile={userProfile}
          onSubmit={handleBookingSubmit}
        />
      )}
    </>
  );
}