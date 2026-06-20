// app/business/[id]/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { 
  MessageSquare,
  Share2,
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Car,
  TrendingUp,
  Users,
  Calendar,
  DollarSign
} from "lucide-react";

import { BusinessProfileData, BusinessProfileHeader } from "@/components/pages/profile/business/ProfileHeader";
import { VehicleCardData, VehicleCatalog } from "@/components/pages/profile/business/VehicleCatalog";
 // Add import if needed

// Mock data with proper typing


import { useCurrentUser } from "@/hooks/useUser";
import { useHostDashboard } from "@/hooks/useDashboard";
import { useVehicles } from "@/hooks/useVehicles";
import { Loader2 } from "lucide-react";
import { userService } from "@/services/user.service";
import { toast } from "sonner";

export default function BusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);

  const { user, isLoading: isUserLoading } = useCurrentUser();
  const { summary, isLoading: isSummaryLoading } = useHostDashboard();
  const { vehicles: apiVehicles, isLoading: isVehiclesLoading } = useVehicles({ businessId: user?.id || '' });

  if (isUserLoading || isSummaryLoading || isVehiclesLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 font-secondary text-slate-500">Loading business profile...</span>
      </div>
    );
  }

  const businessData: BusinessProfileData = {
    id: user?.id || "business-1",
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Premium Car Rentals",
    logo: user?.profileImageUrl || "/businessLogo.jpg",
    coverImage: "",
    tagline: "Quality Rentals",
    description: "Business profile description. Add more details about your fleet and services.",
    address: "Not specified",
    city: "Not specified",
    phone: user?.phone || "No phone",
    email: user?.email || "No email",
    website: "",
    rating: 0,
    totalReviews: 0,
    yearsInBusiness: 1,
    verified: user?.kycStatus === 'verified',
    fleetSize: apiVehicles?.length || 0,
    responseTime: "Under 1 hour",
    policies: {
      cancellation: "Standard cancellation policy",
      insurance: "Basic insurance included",
      driverRequirements: "Valid driver's license"
    },
    isFavorite: false,
    totalFavorites: 0
  };

  const vehicles: VehicleCardData[] = apiVehicles.map((v) => ({
    id: v.id,
    image: v.images?.[0]?.url || "/car/car2.png",
    name: v.name || "Unknown Vehicle",
    make: (v as any).make || "Unknown",
    model: (v as any).model || "Unknown",
    year: (v as any).year || 2023,
    vehicleType: v.category,
    fuelType: v.fuelType,
    transmission: v.transmission,
    seats: v.seats || 5,
    dailyRate: v.dailyRate || 0,
    weeklyRate: (v.dailyRate || 0) * 6,
    location: v.location,
    rating: v.avgRating || 0,
    totalReviews: v.totalReviews || 0,
    status: "available",
    features: (v as any).features || [],
    isVerified: true,
    securityDeposit: v.securityDeposit || 0,
    minimumRentalDays: 1,
    isFeatured: false,
    bookingStats: {
      totalBookings: v.totalReviews || 0,
      revenue: 0,
      utilizationRate: 0
    }
  }));

  const handleSaveProfile = async (updatedData: BusinessProfileData) => {
    try {
      await userService.updateMe({
        firstName: updatedData.name.split(" ")[0] || "",
        lastName: updatedData.name.split(" ").slice(1).join(" ") || "",
        phone: updatedData.phone,
        // Assuming description and other details are added to the User or HostProfile model in the future
      });
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleContact = () => {
    router.push(`/dashboard/renter/messages?userId=${businessData.id}`);
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const handleToggleFavorite = () => {
    console.log("Toggle favorite");
  };

  const handleAddVehicle = () => {
    router.push(`/dashboard/business/vehicles`);
  };

  const handleViewBookings = () => {
    router.push(`/dashboard/business/booking`);
  };

  const handleViewVehicle = (vehicleId: string) => {
    router.push(`/dashboard/business/vehicles/${vehicleId}`);
  };

  const handleEditVehicle = (vehicleId: string) => {
    router.push(`/dashboard/business/vehicles/${vehicleId}/edit`);
  };

  const handleDeleteVehicle = (vehicleId: string) => {
    console.log("Delete vehicle", vehicleId);
  };

  const handleBookVehicle = (vehicleId: string) => {
    router.push(`/dashboard/business/vehicles/${vehicleId}`);
  };

  const handleToggleVehicleStatus = (vehicleId: string) => {
    console.log("Toggle vehicle status", vehicleId);
  };

  return (
    <div className="space-y-6 font-secondary">
      {/* Business Profile Header */}
      <BusinessProfileHeader
        data={businessData}
        role="business"
        isEditing={isEditing}
        onEditToggle={handleEditToggle}
        onSave={handleSaveProfile}
        onCancel={() => setIsEditing(false)}
        onContact={handleContact}
        onShare={handleShare}
        onToggleFavorite={handleToggleFavorite}
        onAddVehicle={handleAddVehicle}
        onViewBookings={handleViewBookings}
      />

      {/* Main Content Tabs */}
      <Tabs defaultValue="fleet" className="space-y-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="fleet">Vehicle Fleet</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="space-y-6">
          <VehicleCatalog
            vehicles={vehicles}
            role="business"
            onView={handleViewVehicle}
            onEdit={handleEditVehicle}
            onDelete={handleDeleteVehicle}
            onBook={handleBookVehicle}
            onToggleStatus={handleToggleVehicleStatus}
            onAddVehicle={handleAddVehicle}
          />
        </TabsContent>

        {/* Reviews Tab */}
        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-slate-800">
                    Customer Reviews
                  </h3>
                  <p className="text-slate-600">
                    {businessData.totalReviews} reviews • {businessData.rating?.toFixed(1)} average rating
                  </p>
                </div>
                <Button>
                  <Star className="h-4 w-4 mr-2" />
                  Write a Review
                </Button>
              </div>
              
              {/* Reviews list would go here */}
              <div className="text-center py-12">
                <Star className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">Reviews will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-slate-800">Business Policies</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-slate-800 mb-2">Insurance Coverage</h4>
                    <p className="text-slate-600">{businessData.policies?.insurance}</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800">Cancellation Policy</h4>
                      <p className="text-slate-600">{businessData.policies?.cancellation}</p>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-800">Driver Requirements</h4>
                      <p className="text-slate-600">{businessData.policies?.driverRequirements}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">Business Analytics</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-slate-800">₦{((summary as any)?.totalEarned || 0).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-600">Total Earnings</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-slate-800">
                        {(() => {
                          const s = summary as any;
                          if (!s?.totalVehicles || s.totalVehicles === 0) return "0%";
                          const utilized = s.totalVehicles - (s.availableVehicles || 0);
                          const percentage = (utilized / s.totalVehicles) * 100;
                          return `${Math.round(percentage)}%`;
                        })()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600">Fleet Utilization</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-slate-800">{(summary as any)?.totalBookings || 0}</span>
                    </div>
                    <p className="text-sm text-slate-600">Total Bookings</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-slate-800">{(summary as any)?.activeBookings || 0}</span>
                    </div>
                    <p className="text-sm text-slate-600">Active Bookings</p>
                  </div>
                </div>
                
                {/* Analytics charts would go here */}
                <div className="text-center py-12">
                  <TrendingUp className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">Analytics charts will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
      </Tabs>
    </div>
  );
}