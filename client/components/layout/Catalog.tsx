
"use client";


import { popularCars, recommendedCars } from "@/data/carData";
import VehicleCard from "../base/cards/VehicleCard";

export default function VehicleCatalog() {
  return (
    <section className="w-full py-8 px-4 sm:px-6 lg:px-8 font-primary">
      <div className="mx-auto max-w-7xl">
        {/* Popular Car Section */}
        <div className="mb-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold  text-slate-800 dark:text-white">
              Popular 
            </h2>
            <button className="text-primary text-sm font-semibold hover:text-blue-600 transition-colors">
              View All
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {popularCars.map((car) => (
              <VehicleCard
                key={car.id}
                vehicle={car}
              />
            ))}
          </div>
        </div>

        {/* Recommendation Car Section */}
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-800  dark:text-white">
              Recommendations
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {recommendedCars.map((car) => (
              <VehicleCard
                key={car.id}
                vehicle={car}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}