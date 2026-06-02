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
const mockBusinessData: BusinessProfileData = {
  id: "business-123",
  name: "Premium Car Rentals Lagos",
  logo: "/businessLogo.jpg",
  coverImage: "/coverImage.jpg",
  tagline: "Luxury & Economy Cars for Every Occasion",
  description: "Established in 2010, we provide premium car rental services in Lagos with a fleet of well-maintained vehicles. Our commitment to customer satisfaction and safety has made us the preferred choice for both business and leisure travelers.",
  address: "123 Victoria Island",
  city: "Lagos",
  phone: "+234 801 234 5678",
  email: "info@premiumrentals.com",
  website: "www.premiumrentals.com",
  rating: 4.8,
  totalReviews: 342,
  yearsInBusiness: 14,
  verified: true,
  fleetSize: 48,
  responseTime: "Under 15 minutes",
  policies: {
    cancellation: "Free cancellation up to 24 hours before pickup",
    insurance: "Full comprehensive insurance included",
    driverRequirements: "Valid driver's license required, minimum age 25"
  },
  isFavorite: false,
  totalFavorites: 256
};

const mockVehicles: VehicleCardData[] = [
  {
    id: "vehicle-1",
    image: "/car/car2.png",
    name: "Toyota Camry 2023",
    make: "Toyota",
    model: "Camry",
    year: 2023,
    vehicleType: "sedan",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    dailyRate: 25000,
    weeklyRate: 150000,
    location: "Victoria Island, Lagos",
    rating: 4.9,
    totalReviews: 124,
    status: "available",
    features: ["Air Conditioning", "Navigation", "Bluetooth"],
    isVerified: true,
    securityDeposit: 50000,
    minimumRentalDays: 1,
    isFeatured: true,
    bookingStats: {
      totalBookings: 42,
      revenue: 1050000,
      utilizationRate: 78
    }
  },
  {
    id: "vehicle-2",
    image:  "/car/car3.png",
    name: "Mercedes-Benz GLE",
    make: "Mercedes-Benz",
    model: "GLE",
    year: 2022,
    vehicleType: "suv",
    fuelType: "Diesel",
    transmission: "Automatic",
    seats: 7,
    dailyRate: 75000,
    weeklyRate: 450000,
    location: "Ikoyi, Lagos",
    rating: 4.8,
    totalReviews: 89,
    status: "booked",
    features: ["Leather Seats", "Sunroof", "Rear Camera"],
    isVerified: true,
    securityDeposit: 150000,
    minimumRentalDays: 2,
    isFeatured: true,
    nextAvailable: "in 3 days",
    bookingStats: {
      totalBookings: 31,
      revenue: 2325000,
      utilizationRate: 85
    }
  },
  // Add more mock vehicles...
];

export default function BusinessPage() {
  const router = useRouter();
  const params = useParams();
  const businessId = params.id as string;
  
  const [role, setRole] = useState<"renter" | "business">("renter");
  const [isEditing, setIsEditing] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessProfileData>(mockBusinessData);
  const [vehicles, setVehicles] = useState<VehicleCardData[]>(mockVehicles);

  const handleSaveProfile = (updatedData: BusinessProfileData) => {
    setBusinessData(updatedData);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleContact = () => {
    console.log("Contact business:", businessData.id);
  };

  const handleShare = () => {
    console.log("Share business:", businessData.id);
  };

  const handleToggleFavorite = () => {
    setBusinessData((prev: BusinessProfileData) => ({
      ...prev,
      isFavorite: !prev.isFavorite,
      totalFavorites: prev.isFavorite
        ? (prev.totalFavorites ?? 0) - 1
        : (prev.totalFavorites ?? 0) + 1
    }));
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
    setVehicles(prev => prev.filter(v => v.id !== vehicleId));
  };

  const handleBookVehicle = (vehicleId: string) => {
    router.push(`/dashboard/business/vehicles/${vehicleId}`);
  };

  const handleToggleVehicleStatus = (vehicleId: string) => {
    setVehicles(prev => prev.map(vehicle => {
      if (vehicle.id === vehicleId) {
        const newStatus = vehicle.status === "available" ? "unavailable" : "available";
        return {
          ...vehicle,
          status: newStatus
        };
      }
      return vehicle;
    }));
  };

  const handleToggleRole = () => {
    setRole(role === "renter" ? "business" : "renter");
  };

  return (
    <div className="space-y-6 font-secondary">
      {/* Role Toggle (for demo purposes) */}
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleRole}
          className="font-primary"
        >
          View as: {role === "renter" ? "Renter" : "Business"}
        </Button>
      </div>

      {/* Business Profile Header */}
      <BusinessProfileHeader
        data={businessData}
        role={role}
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
          {role === "business" && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
        </TabsList>

        {/* Fleet Tab */}
        <TabsContent value="fleet" className="space-y-6">
          <VehicleCatalog
            vehicles={vehicles}
            role={role}
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

        {/* Analytics Tab (Business Only) */}
        {role === "business" && (
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-6">Business Analytics</h3>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <DollarSign className="h-5 w-5 text-green-500" />
                      <span className="text-2xl font-bold text-slate-800">₦2.4M</span>
                    </div>
                    <p className="text-sm text-slate-600">Monthly Revenue</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Car className="h-5 w-5 text-blue-500" />
                      <span className="text-2xl font-bold text-slate-800">68%</span>
                    </div>
                    <p className="text-sm text-slate-600">Fleet Utilization</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="h-5 w-5 text-purple-500" />
                      <span className="text-2xl font-bold text-slate-800">156</span>
                    </div>
                    <p className="text-sm text-slate-600">Active Customers</p>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <TrendingUp className="h-5 w-5 text-amber-500" />
                      <span className="text-2xl font-bold text-slate-800">+24%</span>
                    </div>
                    <p className="text-sm text-slate-600">Growth Rate</p>
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
        )}
      </Tabs>
    </div>
  );
}