// app/dashboard/business/vehicles/[id]/page.tsx
"use client";

import { VehicleDetailsComponent } from "@/components/pages/vehicle/view/VehicleDetails";
import { getVehicleById } from "@/data/carData";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function BusinessVehicleDetailsPage({ params }: { params: Promise<{ id: string }> }) {
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
        <p className="text-slate-500 text-sm mt-1">Vehicle ID: {vehicleId ?? "unknown"}</p>
        <button 
          onClick={() => router.push("/dashboard/business/vehicles")}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Fleet
        </button>
      </div>
    );
  }

  const handleEdit = () => {
    router.push(`/dashboard/business/vehicles/${vehicleId}/edit`);
  };

  const handleDelete = () => {
    console.log("Deleting vehicle:", vehicleId);
    router.push("/dashboard/business/vehicles");
  };

  const handleToggleStatus = () => {
    console.log("Toggling status for:", vehicleId);
  };

  const handleArchive = () => {
    console.log("Archiving vehicle:", vehicleId);
  };

  const handleDownloadSpecs = () => {
    console.log("Downloading specs for:", vehicleId);
  };

  return (
    <VehicleDetailsComponent
      vehicle={vehicle}
      role="business"
      onEdit={handleEdit}
      onDelete={handleDelete}
      onToggleStatus={handleToggleStatus}
      onCopyId={() => navigator.clipboard.writeText(vehicle.id)}
      onDownloadSpecs={handleDownloadSpecs}
      onPrint={() => window.print()}
      onArchive={handleArchive}
      isFavorite={isFavorite}
      onFavorite={() => setIsFavorite(!isFavorite)}
    />
  );
}