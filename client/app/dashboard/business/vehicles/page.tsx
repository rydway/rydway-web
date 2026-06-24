// app/dashboard/business/vehicles/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  DollarSign, 
  TrendingUp, 
  Calendar,
  BarChart3,
  Shield,
  Clock,
  Plus
} from "lucide-react";

import { StatCard } from "@/components/base/cards/StatCard";
import { CustomTabs } from "@/components/base/Tabs";
import type { VehicleFormData } from "@/lib/config/add-car.config";

import { AddVehicleModal } from "@/components/pages/vehicle/add/AddVehicleModal";
import { VehicleCardData, VehicleCatalog } from "@/components/pages/profile/business/VehicleCatalog";
import { useHostVehicles } from "@/hooks/useVehicles";
import { Vehicle } from "@/types/models";
import { vehicleService } from "@/services/vehicle.service";
import { uploadVehicleImages } from "@/lib/supabase/uploads";
import { toast } from "sonner";

export default function BusinessVehiclesPage() {
  const router = useRouter();
  const { vehicles: apiVehicles, isLoading, refetch } = useHostVehicles();
  const [activeTab, setActiveTab] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Map Prisma Vehicle to VehicleCardData expected by the UI
  const mappedVehicles: VehicleCardData[] = (apiVehicles || []).map((v: Vehicle) => {
    return {
      id: v.id,
      image: v.images?.[0]?.url || "/car/car2.png", // fallback image
      name: v.name,
      make: v.name.split(" ")[0] || "Unknown",
      model: v.name.split(" ").slice(1).join(" ") || "Unknown",
      year: new Date().getFullYear(), // Fallback or parse from name
      vehicleType: v.category,
      fuelType: v.fuelType,
      transmission: v.transmission,
      seats: v.seats,
      dailyRate: v.dailyRate,
      weeklyRate: v.dailyRate * 7,
      monthlyRate: v.dailyRate * 30,
      location: v.location,
      rating: v.avgRating || 0,
      totalReviews: v.totalReviews || 0,
      status: v.status as any,
      features: [], // If Prisma schema eventually supports features array
      isVerified: v.isVerified,
      securityDeposit: v.securityDeposit,
      minimumRentalDays: v.minimumRentalDays,
      isFeatured: v.isFeatured,
      bookingStats: {
        totalBookings: 0,
        revenue: 0,
        utilizationRate: 0,
      }
    };
  });

  // Calculate business metrics using the live mapped vehicles
  const calculateMetrics = () => {
    const totalVehicles = mappedVehicles.length;
    const availableVehicles = mappedVehicles.filter(v => v.status === "available").length;
    const bookedVehicles = mappedVehicles.filter(v => v.status === "booked").length;
    
    const totalRevenue = mappedVehicles.reduce((sum, vehicle) => 
      sum + (vehicle.bookingStats?.revenue || 0), 0
    );
    
    const averageUtilization = mappedVehicles.length > 0 
      ? mappedVehicles.reduce((sum, vehicle) => sum + (vehicle.bookingStats?.utilizationRate || 0), 0) / mappedVehicles.length
      : 0;
    
    const featuredVehicles = mappedVehicles.filter(v => v.isFeatured).length;

    return {
      totalVehicles,
      availableVehicles,
      bookedVehicles,
      totalRevenue,
      averageUtilization,
      featuredVehicles
    };
  };

  const metrics = calculateMetrics();

  // Business stats
  const businessStats = [
    {
      title: "Total Fleet",
      value: metrics.totalVehicles.toString(),
      icon: Car,
      trend: `${metrics.availableVehicles} available`,
      trendUp: true,
      iconColor: "text-primary"
    },
    {
      title: "Monthly Revenue",
      value: `₦${(metrics.totalRevenue / 1000000).toFixed(2)}M`,
      icon: DollarSign,
      trend: "Current total",
      trendUp: true,
      iconColor: "text-green-600"
    },
    {
      title: "Utilization Rate",
      value: `${Math.round(metrics.averageUtilization)}%`,
      icon: TrendingUp,
      trend: "Average across fleet",
      trendUp: true,
      iconColor: "text-amber-600"
    },
    {
      title: "Featured Vehicles",
      value: metrics.featuredVehicles.toString(),
      icon: Shield,
      trend: "Top performers",
      trendUp: true,
      iconColor: "text-purple-600"
    }
  ];

  // Vehicle tabs for business view
  const vehicleTabs = [
    { 
      id: "all", 
      label: "All Vehicles", 
      count: mappedVehicles.length 
    },
    { 
      id: "available", 
      label: "Available", 
      count: mappedVehicles.filter(v => v.status === "available").length 
    },
    { 
      id: "booked", 
      label: "Booked", 
      count: mappedVehicles.filter(v => v.status === "booked").length 
    },
    { 
      id: "maintenance", 
      label: "Maintenance", 
      count: mappedVehicles.filter(v => v.status === "maintenance").length 
    },
    { 
      id: "featured", 
      label: "Featured", 
      count: mappedVehicles.filter(v => v.isFeatured).length 
    },
  ];

  // Filter vehicles based on active tab
  const getFilteredVehicles = () => {
    switch (activeTab) {
      case "available":
        return mappedVehicles.filter(v => v.status === "available");
      case "booked":
        return mappedVehicles.filter(v => v.status === "booked");
      case "maintenance":
        return mappedVehicles.filter(v => v.status === "maintenance");
      case "featured":
        return mappedVehicles.filter(v => v.isFeatured);
      default:
        return mappedVehicles;
    }
  };

  // Event handlers
  const handleViewVehicle = (id: string) => {
    router.push(`/dashboard/business/vehicles/${id}`);
  };

  const handleEditVehicle = (id: string) => {
    router.push(`/dashboard/business/vehicles/${id}/edit`);
  };

  const handleDeleteVehicle = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await vehicleService.deleteVehicle(id);
        refetch();
      } catch (err: any) {
        toast.error(`Failed to delete vehicle: ${err?.message || "Unknown error"}`);
      }
    }
  };

  const handleBookVehicle = (id: string) => {
    handleViewVehicle(id);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const vehicle = (apiVehicles || []).find((v: Vehicle) => v.id === id);
      if (!vehicle) return;
      const newStatus = vehicle.status === "available" ? "maintenance" : "available";
      await vehicleService.updateVehicle(id, { status: newStatus });
      refetch();
    } catch (err: any) {
      toast.error(`Failed to update status: ${err?.message || "Unknown error"}`);
    }
  };

 
  const handleAddVehicle = async (data: VehicleFormData) => {
    try {
      const year = parseInt(data.year, 10) || new Date().getFullYear();
      const seats = parseInt(data.seats, 10) || 5;
      const dailyRate = parseInt(data.basePrice, 10) || 0;
      const minimumRentalDays = parseInt(data.minimumDuration, 10) || 1;
      const securityDeposit = data.securityDeposit && data.depositAmount
        ? parseInt(data.depositAmount, 10)
        : 0;

      // 1. Upload vehicle images to Supabase Storage
      const imageFiles: File[] = Array.isArray(data.images)
        ? data.images.filter((f): f is File => f instanceof File)
        : [];

      let uploadedImages: { url: string; isPrimary: boolean }[] = [];
      if (imageFiles.length > 0) {
        const uploadResults = await uploadVehicleImages(imageFiles);
        uploadedImages = uploadResults.map((r, idx) => ({
          url: r.publicUrl,
          isPrimary: idx === 0,
        }));
      }

      // 2. Create vehicle via API with image URLs
      const payload: Partial<Vehicle> = {
        name: `${data.make} ${data.model} ${year}`,
        category: data.vehicleType,
        fuelType: data.fuelType,
        transmission: data.transmission,
        seats,
        dailyRate,
        securityDeposit,
        location: data.location,
        status: "available",
        isFeatured: false,
        isVerified: false,
        minimumRentalDays,
        requiresDriver: false,
        images: uploadedImages as any,
      };

      await vehicleService.createVehicle(payload);
      refetch();
      setIsAddModalOpen(false);
      toast.success("Vehicle added successfully");
    } catch (err: any) {
      console.error("Failed to add vehicle:", err?.message || err);
      toast.error(`Failed to add vehicle: ${err?.message || "Unknown error"}`);
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case "export":
        console.log("Exporting vehicle data...");
        break;
      case "import":
        console.log("Importing vehicles...");
        break;
      case "bulk-edit":
        console.log("Bulk editing vehicles...");
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-primary">
            Vehicle Fleet Management
          </h1>
          <p className="text-sm text-muted-foreground font-secondary">
            Manage your rental fleet, track performance, and optimize availability
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => handleQuickAction("export")}
          >
            Export Data
          </Button> */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessStats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
            iconClassName={stat.iconColor}
          />
        ))}
      </div>

      <VehicleCatalog
        vehicles={isLoading ? [] : getFilteredVehicles()}
        role="business"
        onView={handleViewVehicle}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
        onBook={handleBookVehicle}
        onToggleStatus={handleToggleStatus}
        className="mt-4"
      />

      {/* Add Vehicle Modal */}
      <AddVehicleModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddVehicle={handleAddVehicle}
      />

      {/* Performance Insights */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-foreground font-primary">
                Performance Insights
              </h3>
              <p className="text-muted-foreground font-secondary">
                Key metrics and recommendations for your fleet
              </p>
            </div>
      
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Top Performing Vehicle */}
            <div className="p-4 bg-emerald-500/10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-foreground">Top Performer</h4>
              </div>
              {(() => {
                if (mappedVehicles.length === 0) return null;
                const topVehicle = mappedVehicles.reduce((top, current) => 
                  (current.bookingStats?.revenue || 0) > (top.bookingStats?.revenue || 0) ? current : top
                , mappedVehicles[0]);
                return (
                  <>
                    <p className="text-lg font-bold text-foreground">{topVehicle?.name}</p>
                    <p className="text-muted-foreground">
                      ₦{topVehicle?.bookingStats?.revenue?.toLocaleString()} revenue
                    </p>
                  </>
                );
              })()}
            </div>

            {/* Low Utilization Alert */}
            <div className="p-4 bg-amber-500/10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="h-5 w-5 text-amber-600" />
                <h4 className="font-semibold text-foreground">Needs Attention</h4>
              </div>
              {(() => {
                const lowUtilizationVehicles = mappedVehicles.filter(v => 
                  (v.bookingStats?.utilizationRate || 0) < 50
                );
                return (
                  <>
                    <p className="text-lg font-bold text-foreground">
                      {lowUtilizationVehicles.length} vehicles
                    </p>
                    <p className="text-muted-foreground">Below 50% utilization</p>
                  </>
                );
              })()}
            </div>

            {/* Upcoming Availability */}
            <div className="p-4 bg-blue-500/10 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-foreground">Coming Available</h4>
              </div>
              {(() => {
                const upcomingVehicles = mappedVehicles.filter(v => 
                  v.status === "booked" || v.status === "maintenance"
                );
                return (
                  <>
                    <p className="text-lg font-bold text-foreground">
                      {upcomingVehicles.length} vehicles
                    </p>
                    <p className="text-muted-foreground">Will be available soon</p>
                  </>
                );
              })()}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}