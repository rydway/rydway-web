"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Add this import
import { Search, Menu, User, Bell, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/pages/search/Search";
import { popularCars, recommendedCars } from "@/data/carData";
import CarCard from "@/components/base/cards/VehicleCard";
import Navbar from "@/components/layout/NavBar";
import { SearchFilters } from "@/@types";
import VehicleCard from "@/components/base/cards/VehicleCard";

const allCars = [...popularCars, ...recommendedCars];

export default function SearchWithNavbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCars, setFilteredCars] = useState(allCars);
  const [activeFilter, setActiveFilter] = useState("all");
  const router = useRouter(); // Initialize the router

  // Handle search
  const handleSearch = (filters: SearchFilters) => {
    const query = (filters.query ?? "").toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setFilteredCars(allCars);
      return;
    }

    const filtered = allCars.filter(
      (car) =>
        car.name.toLowerCase().includes(query) ||
        car.category.toLowerCase().includes(query) ||
        car.fuel.toLowerCase().includes(query) ||
        car.transmission.toLowerCase().includes(query)
    );

    setFilteredCars(filtered);
  };

  // Handle filter change
  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    
    let filtered = allCars;
    
    if (filter !== "all") {
      filtered = allCars.filter(car => 
        filter === "favorites" 
          ? car.isFavorite 
          : car.category.toLowerCase() === filter.toLowerCase()
      );
    }
    
    setFilteredCars(searchQuery ? 
      filtered.filter(car => 
        car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        car.category.toLowerCase().includes(searchQuery.toLowerCase())
      ) 
      : filtered
    );
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (carId: string) => {
    console.log("Toggled favorite for car:", carId);
    // You can implement API call here
  };

  // Handle rent now - Navigate to vehicle details
  const handleRentNow = (carId: string) => {
    console.log("Rent now for car:", carId);
    router.push(`/dashboard/renter/vehicles/${carId}`);
  };

  return (
    <div className="space-y-6 font-primary">
      {/* Search Header */}
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

      {/* Search Bar */}
      <div className="max-w-4xl">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          variant={activeFilter === "all" ? "default" : "outline"}
          className={`rounded-full font-primary ${activeFilter === "all" ? "bg-primary text-white hover:bg-primary/95" : ""}`}
          onClick={() => handleFilterChange("all")}
        >
          All Cars
        </Button>
        <Button
          variant={activeFilter === "sport" ? "default" : "outline"}
          className={`rounded-full font-primary ${activeFilter === "sport" ? "bg-primary text-white hover:bg-primary/95" : ""}`}
          onClick={() => handleFilterChange("sport")}
        >
          Sport
        </Button>
        <Button
          variant={activeFilter === "suv" ? "default" : "outline"}
          className={`rounded-full font-primary ${activeFilter === "suv" ? "bg-primary text-white hover:bg-primary/95" : ""}`}
          onClick={() => handleFilterChange("suv")}
        >
          SUV
        </Button>
        <Button
          variant={activeFilter === "luxury" ? "default" : "outline"}
          className={`rounded-full font-primary ${activeFilter === "luxury" ? "bg-primary text-white hover:bg-primary/95" : ""}`}
          onClick={() => handleFilterChange("luxury")}
        >
          Luxury
        </Button>
        <Button
          variant={activeFilter === "hatchback" ? "default" : "outline"}
          className={`rounded-full font-primary ${activeFilter === "hatchback" ? "bg-primary text-white hover:bg-primary/95" : ""}`}
          onClick={() => handleFilterChange("hatchback")}
        >
          Hatchback
        </Button>
        <Button
          variant={activeFilter === "favorites" ? "default" : "outline"}
          className={`rounded-full font-primary ${activeFilter === "favorites" ? "bg-primary text-white hover:bg-primary/95" : ""}`}
          onClick={() => handleFilterChange("favorites")}
        >
          Favorites
        </Button>
      </div>

      {/* Results Count */}
      <div>
        <p className="text-sm text-slate-500 font-secondary">
          Showing <span className="font-bold text-primary font-primary">{filteredCars.length}</span> cars
          {searchQuery && (
            <span> for "<span className="font-bold">{searchQuery}</span>"</span>
          )}
        </p>
      </div>

      {/* Car Grid */}
      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCars.map((car) => (
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