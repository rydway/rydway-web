"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/pages/search/Search";
import VehicleCard from "@/components/base/cards/VehicleCard";
import { useVehicles } from "@/hooks/useVehicles";
import { SearchFilters } from "@/types";

export default function SearchWithNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter();
  
  const { vehicles, isLoading } = useVehicles();

  const handleSearch = (filters: SearchFilters) => {
    const query = (filters.query ?? "").toLowerCase();
    setSearchQuery(query);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const handleFavoriteToggle = (carId: string) => {
    console.log("Toggled favorite for car:", carId);
  };

  const handleRentNow = (carId: string) => {
    router.push(`/dashboard/renter/vehicles/${carId}`);
  };

  const filteredCars = useMemo(() => {
    if (!vehicles) return [];
    
    let filtered = vehicles;
    
    if (activeFilter !== "all") {
      filtered = vehicles.filter((car: any) => 
        activeFilter === "favorites" 
          ? car.isFavorite 
          : car.category?.toLowerCase() === activeFilter.toLowerCase()
      );
    }
    
    if (searchQuery) {
      filtered = filtered.filter((car: any) => 
        car.name?.toLowerCase().includes(searchQuery) ||
        car.category?.toLowerCase().includes(searchQuery) ||
        car.fuel?.toLowerCase().includes(searchQuery) ||
        car.transmission?.toLowerCase().includes(searchQuery)
      );
    }
    
    return filtered;
  }, [vehicles, activeFilter, searchQuery]);

  return (
    <div className="space-y-6 font-primary">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Find Your Perfect Car
          </h1>
          <p className="text-sm text-slate-500 font-secondary">
            Search from our wide collection of premium vehicles
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="flex flex-wrap gap-3">
        {["all", "sport", "suv", "luxury", "hatchback", "favorites"].map((filter) => (
          <Button
            key={filter}
            variant={activeFilter === filter ? "default" : "outline"}
            className={`rounded-full font-primary capitalize ${activeFilter === filter ? "bg-primary text-white hover:bg-primary/95" : ""}`}
            onClick={() => handleFilterChange(filter)}
          >
            {filter === "all" ? "All Cars" : filter}
          </Button>
        ))}
      </div>

      <div>
        <p className="text-sm text-slate-500 font-secondary">
          Showing <span className="font-bold text-primary font-primary">{filteredCars.length}</span> cars
          {searchQuery && (
            <span> for "<span className="font-bold">{searchQuery}</span>"</span>
          )}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-24">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCars.map((car: any) => (
            <VehicleCard
              key={car.id}
              vehicle={car}
              onFavoriteToggle={handleFavoriteToggle}
              onRentNow={handleRentNow}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-6 dark:bg-slate-800">
            <Search className="h-12 w-12 text-slate-400" />
          </div>
          <h3 className="mb-2 text-lg font-bold text-slate-800 dark:text-white font-primary">
            No cars found
          </h3>
          <p className="text-sm text-slate-500 font-secondary">
            Try adjusting your search or filter to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}