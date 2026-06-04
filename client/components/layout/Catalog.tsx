"use client";

import { useVehicles } from "@/hooks/useVehicles";
import VehicleCard from "../base/cards/VehicleCard";
import { Loader2, Car } from "lucide-react";

export default function VehicleCatalog() {
  const { vehicles, isLoading } = useVehicles();

  const popularCars = vehicles?.slice(0, 4) || [];
  const recommendedCars = vehicles?.slice(4, 8) || [];

  if (isLoading) {
    return (
      <div className="w-full py-24 flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <section className="w-full py-16 px-4 sm:px-6 lg:px-8 font-primary flex flex-col items-center justify-center">
        <div className="h-16 w-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Car className="h-8 w-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Vehicles Found</h2>
        <p className="text-slate-500 text-center max-w-md">
          There are currently no vehicles available for rent. Check back later or try adjusting your search filters.
        </p>
      </section>
    );
  }

  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 font-primary">
      <div className="mx-auto max-w-7xl">
        {/* Popular Car Section */}
        {popularCars.length > 0 && (
          <div className="mb-10">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Popular 
              </h2>
              <button className="text-primary text-sm font-semibold hover:text-blue-600 transition-colors">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {popularCars.map((car: any) => (
                <VehicleCard
                  key={car.id}
                  vehicle={car}
                />
              ))}
            </div>
          </div>
        )}

        {/* Recommendation Car Section */}
        {recommendedCars.length > 0 && (
          <div>
            <div className="mb-5">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">
                Recommendations
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {recommendedCars.map((car: any) => (
                <VehicleCard
                  key={car.id}
                  vehicle={car}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}