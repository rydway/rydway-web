// app/dashboard/renter/vehicles/[id]/page.tsx
"use client";

import { VehicleDetailsComponent } from "@/components/pages/vehicle/view/VehicleDetails";
import { useVehicle } from "@/hooks/useVehicles";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function RenterVehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  // Unwrap params promise
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        setVehicleId(resolvedParams.id);
      } catch (error) {
        console.error("Error unwrapping params:", error);
      }
    };
    
    unwrapParams();
  }, [params]);

  const { vehicle, isLoading } = useVehicle(vehicleId || "");

  if (isLoading || !vehicleId) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        <p className="text-slate-600 mt-4 font-secondary">Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-96 font-primary">
        <h2 className="text-2xl font-bold text-slate-800">Vehicle Not Found</h2>
        <p className="text-slate-600 mt-2 font-secondary">The vehicle you're looking for doesn't exist.</p>
        <p className="text-slate-500 text-sm mt-1 font-secondary">Vehicle ID: {vehicleId}</p>
        <button 
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const handleBook = () => {
    router.push(`/dashboard/renter/booking`);
  };

  const handleContact = (type: 'call' | 'message') => {
    if (type === 'call') {
      window.location.href = `tel:${(vehicle as any).businessPhone || ''}`;
    } else {
      router.push(`/dashboard/renter/messages?businessId=${vehicle.hostId}&vehicleId=${vehicle.id}`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vehicle.name,
        text: `Check out this ${vehicle.name} available for rent!`,
        url: window.location.href,
      });
    }
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // API call to toggle favorite
  };

  const mappedVehicle = {
    id: vehicle.id,
    image: vehicle.images?.[0]?.url || "/car/car2.png",
    name: vehicle.name || "Unknown Vehicle",
    make: (vehicle as any).make || vehicle.name?.split(' ')[0] || "Unknown",
    model: (vehicle as any).model || vehicle.name?.split(' ').slice(1).join(' ') || "Unknown",
    year: (vehicle as any).year || 2023,
    vehicleType: vehicle.category || "Sedan",
    fuelType: vehicle.fuelType || "Petrol",
    transmission: vehicle.transmission || "Automatic",
    seats: vehicle.seats || 5,
    dailyRate: vehicle.dailyRate || 0,
    securityDeposit: vehicle.securityDeposit || 0,
    minimumRentalDays: vehicle.minimumRentalDays || 1,
    location: vehicle.location || "Not specified",
    city: (vehicle as any).city || "Lagos",
    state: (vehicle as any).state || "Lagos",
    status: vehicle.status || "available",
    isVerified: vehicle.isVerified || false,
    isFeatured: vehicle.isFeatured || false,
    features: (vehicle as any).features || [],
    gallery: vehicle.images?.map((img: any) => img.url) || ["/car/car2.png"],
    description: vehicle.description || "",
    businessId: vehicle.hostId || "",
    businessName: (vehicle as any).businessName || "Rydway Partner",
    businessPhone: (vehicle as any).businessPhone || "",
    businessEmail: (vehicle as any).businessEmail || "",
    businessRating: (vehicle as any).businessRating || 5,
    businessTotalReviews: (vehicle as any).businessTotalReviews || 0,
    businessVerified: true,
    rating: vehicle.avgRating || 0,
    totalReviews: vehicle.totalReviews || 0,
    reviews: (vehicle as any).reviews || [],
    bookingStats: (vehicle as any).bookingStats || {
      totalBookings: 0,
      revenue: 0,
      utilizationRate: 0,
      averageDaysPerBooking: 0,
      repeatCustomers: 0
    },
    maintenanceHistory: (vehicle as any).maintenanceHistory || []
  };

  return (
    <VehicleDetailsComponent
      vehicle={mappedVehicle as any}
      role="renter"
      onBook={handleBook}
      onContact={handleContact}
      onShare={handleShare}
      onFavorite={handleFavorite}
      isFavorite={isFavorite}
    />
  );
}