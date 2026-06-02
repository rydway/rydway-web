// app/dashboard/renter/vehicles/[id]/page.tsx
"use client";

import { VehicleDetailsComponent } from "@/components/pages/vehicle/view/VehicleDetails";
import { getVehicleById } from "@/data/carData";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function RenterVehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [vehicle, setVehicle] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [vehicleId, setVehicleId] = useState<string | null>(null);

  // Unwrap params promise
  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params;
        setVehicleId(resolvedParams.id);
      } catch (error) {
        console.error("Error unwrapping params:", error);
        setLoading(false);
      }
    };
    
    unwrapParams();
  }, [params]);

  // Fetch vehicle once we have the ID
  useEffect(() => {
    if (!vehicleId) return;
    
    console.log("Looking for vehicle with ID:", vehicleId);
    const foundVehicle = getVehicleById(vehicleId);
    console.log("Found vehicle:", foundVehicle);
    
    setVehicle(foundVehicle);
    setLoading(false);
  }, [vehicleId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-slate-600 mt-4">Loading vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold text-slate-800">Vehicle Not Found</h2>
        <p className="text-slate-600 mt-2">The vehicle you're looking for doesn't exist.</p>
        <p className="text-slate-500 text-sm mt-1">Vehicle ID: {vehicleId}</p>
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
      window.location.href = `tel:${vehicle.businessPhone}`;
    } else {
      router.push(`/dashboard/renter/messages?businessId=${vehicle.businessId}&vehicleId=${vehicle.id}`);
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

  return (
    <VehicleDetailsComponent
      vehicle={vehicle}
      role="renter"
      onBook={handleBook}
      onContact={handleContact}
      onShare={handleShare}
      onFavorite={handleFavorite}
      isFavorite={isFavorite}
    />
  );
}