// components/business/VehicleCatalog.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Car, 
  Fuel, 
  Users, 
  MapPin, 
  Star, 
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  Grid,
  List,
  Settings,
  BarChart3,
  Plus
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CustomPagination } from "@/components/base/Pagination";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

import { VehicleFormData } from "@/lib/config/add-car.config";
import { AddVehicleModal } from "../../vehicle/add/AddVehicleModal";
import { CustomTabs } from "@/components/base/Tabs";

export interface VehicleCardData {
  id: string;
  image: string;
  name: string;
  make: string;
  model: string;
  year: number;
  vehicleType: string;
  fuelType: string;
  transmission: string;
  seats: number;
  dailyRate: number;
  hourlyRate?: number;
  weeklyRate?: number;
  monthlyRate?: number;
  location: string;
  rating: number;
  totalReviews: number;
  status: 'available' | 'booked' | 'maintenance' | 'unavailable';
  features: string[];
  isVerified: boolean;
  securityDeposit: number;
  minimumRentalDays: number;
  nextAvailable?: string;
  isFeatured?: boolean;
  bookingStats?: {
    totalBookings: number;
    revenue: number;
    utilizationRate: number;
  };
}

interface VehicleCatalogProps {
  vehicles: VehicleCardData[];
  role?: "renter" | "business";
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onBook?: (id: string) => void;
  onToggleStatus?: (id: string) => void;
  onAddVehicle?: (data: VehicleFormData) => void;
  className?: string;
}

export function VehicleCatalog({ 
  vehicles, 
  role = "renter",
  onView,
  onEdit,
  onDelete,
  onBook,
  onToggleStatus,
  onAddVehicle,
  className
}: VehicleCatalogProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedSort, setSelectedSort] = useState<string>("featured");
  const [activeTab, setActiveTab] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const pageSize = viewMode === "grid" ? 8 : 4;

  // Define tabs for CustomTabs
  const vehicleTabs = [
    { id: "all", label: "All Vehicles" },
    { id: "available", label: "Available" },
    { id: "booked", label: "Booked" },
    ...(role === "business" ? [
      { id: "maintenance", label: "Maintenance" },
      { id: "featured", label: "Featured" }
    ] : [])
  ];

  // Filter vehicles based on active tab
  const filteredByTab = vehicles.filter(vehicle => {
    if (activeTab === "all") return true;
    if (activeTab === "available") return vehicle.status === "available";
    if (activeTab === "booked") return vehicle.status === "booked";
    if (activeTab === "maintenance") return vehicle.status === "maintenance";
    if (activeTab === "featured") return vehicle.isFeatured;
    return true;
  });

  // Additional filters
  const filteredVehicles = filteredByTab.filter(vehicle => {
    const matchesSearch = searchQuery === "" || 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === "all" || vehicle.status === selectedStatus;
    const matchesType = selectedType === "all" || vehicle.vehicleType === selectedType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort vehicles
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    switch (selectedSort) {
      case "price-low":
        return a.dailyRate - b.dailyRate;
      case "price-high":
        return b.dailyRate - a.dailyRate;
      case "rating":
        return b.rating - a.rating;
      case "year-new":
        return b.year - a.year;
      case "featured":
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      case "bookings":
        return (b.bookingStats?.totalBookings || 0) - (a.bookingStats?.totalBookings || 0);
      default:
        return 0;
    }
  });

  // Pagination
  const totalItems = sortedVehicles.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentVehicles = sortedVehicles.slice(startIndex, startIndex + pageSize);

  const getStatusBadge = (status: VehicleCardData['status']) => {
    switch (status) {
      case 'available':
        return <Badge variant="green" className="font-primary">Available</Badge>;
      case 'booked':
        return <Badge variant="blue" className="font-primary">Booked</Badge>;
      case 'maintenance':
        return <Badge variant="amber" className="font-primary">Maintenance</Badge>;
      case 'unavailable':
        return <Badge variant="red" className="font-primary">Unavailable</Badge>;
    }
  };

  const getRatingStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-3 w-3",
              i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-slate-300"
            )}
          />
        ))}
        <span className="font-secondary text-xs text-muted-foreground ml-1">{rating.toFixed(1)}</span>
      </div>
    );
  };

  const renderVehicleCard = (vehicle: VehicleCardData) => (
    <Card key={vehicle.id} className="overflow-hidden hover:border-primary/20 transition-colors group flex flex-col h-full pt-0">
      {/* Image - Fixed height at top */}
      <div className="relative h-48 w-full flex-shrink-0 bg-muted/50">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          fill
          className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Status & Featured Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[70%]">
          {getStatusBadge(vehicle.status)}
          {vehicle.isFeatured && (
            <Badge variant="purple" className="font-primary text-xs whitespace-nowrap">
              Featured
            </Badge>
          )}
          {vehicle.isVerified && role === "renter" && (
            <Badge variant="blue" className="font-primary text-xs whitespace-nowrap">
              <Shield className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        
        {/* Action Menu */}
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-white/80 hover:bg-white"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 font-primary">
              <DropdownMenuItem onClick={() => onView?.(vehicle.id)} className="font-secondary">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              
              {role === "business" && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(vehicle.id)} className="font-secondary">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Vehicle
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onToggleStatus?.(vehicle.id)}
                    className={`font-secondary ${vehicle.status === 'available' ? 'text-amber-600' : 'text-green-600'}`}
                  >
                    {vehicle.status === 'available' ? (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Mark as Unavailable
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Available
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(vehicle.id)}
                    className="text-red-600 font-secondary"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Vehicle
                  </DropdownMenuItem>
                </>
              )}
              
              {role === "renter" && vehicle.status === 'available' && (
                <DropdownMenuItem 
                  onClick={() => onBook?.(vehicle.id)}
                  className="text-primary font-semibold font-secondary"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Book Now
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Content - Takes remaining space */}
      <CardContent className="p-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Title & Price - Side by side on all screens */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-primary font-semibold text-foreground text-base sm:text-lg line-clamp-1">
                {vehicle.name}
              </h3>
              <p className="font-secondary text-xs sm:text-sm text-muted-foreground line-clamp-1">
                {vehicle.year} • {vehicle.make} {vehicle.model}
              </p>
      
            </div>
            <div className="text-right flex-shrink-0 max-w-[40%]">
              <p className="font-primary text-xl sm:text-2xl font-bold text-primary leading-tight truncate">
                ₦{vehicle.dailyRate.toLocaleString()}
              </p>
              <p className="font-secondary text-xs text-muted-foreground">per day</p>
            </div>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            {getRatingStars(vehicle.rating)}
            <span className="font-secondary text-xs text-muted-foreground whitespace-nowrap">
              {vehicle.totalReviews} reviews
            </span>
          </div>

          {/* Features - Responsive grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            <div className="flex items-center gap-1 font-secondary text-xs sm:text-sm text-muted-foreground bg-muted/50 p-2 rounded min-w-0">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{vehicle.seats} seats</span>
            </div>
            <div className="flex items-center gap-1 font-secondary text-xs sm:text-sm text-muted-foreground bg-muted/50 p-2 rounded min-w-0">
              <Fuel className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1 font-secondary text-xs sm:text-sm text-muted-foreground bg-muted/50 p-2 rounded col-span-2 sm:col-span-1 min-w-0">
              <Car className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
          </div>

          {/* Location & Availability */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 font-secondary text-xs sm:text-sm text-muted-foreground min-w-0 flex-1">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span className="truncate">{vehicle.location}</span>
              </div>
              
              {vehicle.nextAvailable && vehicle.status !== 'available' && (
                <div className="flex items-center gap-1 font-secondary text-xs text-muted-foreground flex-shrink-0">
                  <Clock className="h-3 w-3" />
                  <span className="whitespace-nowrap">Available {vehicle.nextAvailable}</span>
                </div>
              )}
            </div>
          </div>

          {/* Business Stats */}
          {role === "business" && vehicle.bookingStats && (
            <div className="grid grid-cols-3 gap-1 sm:gap-2 font-secondary text-xs mt-2">
              <div className="text-center p-1 sm:p-2 bg-muted/50 rounded min-w-0">
                <p className="font-primary font-medium text-sm sm:text-base truncate" title={`₦${vehicle.bookingStats.revenue.toLocaleString()}`}>
                  ₦{vehicle.bookingStats.revenue.toLocaleString()}
                </p>
                <p className="text-muted-foreground text-xs truncate">Revenue</p>
              </div>
              <div className="text-center p-1 sm:p-2 bg-muted/50 rounded min-w-0">
                <p className="font-primary font-medium text-sm sm:text-base truncate" title={`${vehicle.bookingStats.utilizationRate}%`}>
                  {vehicle.bookingStats.utilizationRate}%
                </p>
                <p className="text-muted-foreground text-xs truncate">Utilization</p>
              </div>
              <div className="text-center p-1 sm:p-2 bg-muted/50 rounded min-w-0">
                <p className="font-primary font-medium text-sm sm:text-base truncate" title={`${vehicle.bookingStats.totalBookings} bookings`}>
                  {vehicle.bookingStats.totalBookings}
                </p>
                <p className="text-muted-foreground text-xs truncate">Bookings</p>
              </div>
            </div>
          )}
        </div>

        {/* Book Now Button - Only at bottom for renters */}
        {role !== "business" && (
          <div className="mt-4 pt-2 border-t border-slate-100">
            {vehicle.status === 'available' ? (
              <Button
                className="w-full font-secondary"
                onClick={() => onBook?.(vehicle.id)}
              >
                Book Now
              </Button>
            ) : (
              <Button
                variant="outline"
                className="w-full font-secondary"
                disabled
              >
                Currently Unavailable
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      {/* Add Vehicle Modal */}
      {role === "business" && (
        <AddVehicleModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onAddVehicle={onAddVehicle || (() => {})}
        />
      )}

      <div className={cn("space-y-6", className)}>
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-primary text-xl font-bold text-foreground">Vehicle Fleet</h2>
            <p className="font-secondary text-sm text-muted-foreground">
              {sortedVehicles.length} vehicle{sortedVehicles.length !== 1 ? 's' : ''} found
            </p>
          </div>

          <div className="flex items-center gap-4">
  
            {/* {role === "business" && (
              <Button onClick={() => setIsAddModalOpen(true)} className="font-secondary">
                <Plus className="h-4 w-4 mr-2" />
                Add New Vehicle
              </Button>
            )} */}

            {/* View Toggle */}
            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                className="rounded-none font-secondary"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                className="rounded-none font-secondary"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Custom Tabs */}
        <CustomTabs 
          tabs={vehicleTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="mt-2"
        />

        {/* Filters */}
        <div className="w-full">
          <div className="pb-2">
            <div className="flex flex-col gap-3">
              {/* Search */}
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search vehicles..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-10 h-12 font-secondary w-full"
                />
              </div>

              {/* Filters */}
              <div className="flex overflow-x-auto pb-2 gap-2 scrollbar-hide w-full">
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-[180px] shrink-0 font-secondary">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-secondary">All Status</SelectItem>
                    <SelectItem value="available" className="font-secondary">Available</SelectItem>
                    <SelectItem value="booked" className="font-secondary">Booked</SelectItem>
                    <SelectItem value="maintenance" className="font-secondary">Maintenance</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-[180px] shrink-0 font-secondary">
                    <Car className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Vehicle Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-secondary">All Types</SelectItem>
                    <SelectItem value="sedan" className="font-secondary">Sedan</SelectItem>
                    <SelectItem value="suv" className="font-secondary">SUV</SelectItem>
                    <SelectItem value="bus-van" className="font-secondary">Bus/Van</SelectItem>
                    <SelectItem value="truck" className="font-secondary">Truck</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-[180px] shrink-0 font-secondary">
                    <Settings className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured" className="font-secondary">Featured</SelectItem>
                    <SelectItem value="price-low" className="font-secondary">Price: Low to High</SelectItem>
                    <SelectItem value="price-high" className="font-secondary">Price: High to Low</SelectItem>
                    <SelectItem value="rating" className="font-secondary">Highest Rated</SelectItem>
                    <SelectItem value="year-new" className="font-secondary">Year: Newest</SelectItem>
                    {role === "business" && (
                      <SelectItem value="bookings" className="font-secondary">Most Booked</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Grid/List */}
        {currentVehicles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Car className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-primary text-lg font-semibold text-foreground mb-2">
                No Vehicles Found
              </h3>
              <p className="font-secondary text-muted-foreground text-center mb-6">
                {searchQuery 
                  ? `No vehicles match "${searchQuery}"` 
                  : "No vehicles available in this category"}
              </p>
              {role === "business" && (
                <Button onClick={() => setIsAddModalOpen(true)} className="font-secondary">
                  Add Your First Vehicle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {currentVehicles.map(vehicle => renderVehicleCard(vehicle))}
          </div>
        ) : (
          <div className="space-y-4">
            {currentVehicles.map(vehicle => (
              <Card key={vehicle.id} className="hover:border-primary/20 transition-colors">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="relative md:w-64 h-48 md:h-auto">
                    <Image
                      src={vehicle.image}
                      alt={vehicle.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="font-primary font-semibold text-foreground text-xl">
                            {vehicle.name}
                          </h3>
                          <div className="flex gap-2">
                            {getStatusBadge(vehicle.status)}
                            {vehicle.isFeatured && (
                              <Badge variant="purple" className="font-primary">Featured</Badge>
                            )}
                          </div>
                        </div>
                        
                        <p className="font-secondary text-muted-foreground mb-2">
                          {vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.vehicleType}
                        </p>

                        <div className="flex items-center gap-4 mb-4">
                          <div className="flex items-center gap-2 font-secondary">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span>{vehicle.seats} seats</span>
                          </div>
                          <div className="flex items-center gap-2 font-secondary">
                            <Fuel className="h-4 w-4 text-muted-foreground" />
                            <span>{vehicle.fuelType}</span>
                          </div>
                          <div className="flex items-center gap-2 font-secondary">
                            <Car className="h-4 w-4 text-muted-foreground" />
                            <span>{vehicle.transmission}</span>
                          </div>
                          <div className="flex items-center gap-2 font-secondary">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>{vehicle.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {getRatingStars(vehicle.rating)}
                          <span className="font-secondary text-muted-foreground">
                            {vehicle.totalReviews} reviews
                          </span>
                        </div>
                      </div>

                      {/* Price & Actions */}
                      <div className="mt-4 md:mt-0 md:ml-6 flex flex-col items-end">
                        <div className="text-right mb-4">
                          <p className="font-primary text-3xl font-bold text-primary">
                            ₦{vehicle.dailyRate.toLocaleString()}
                          </p>
                          <p className="font-secondary text-sm text-muted-foreground">per day</p>
                        </div>

                        <div className="flex gap-2">
                          {role === "business" ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onView?.(vehicle.id)}
                                className="font-secondary"
                              >
                                View Details
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onEdit?.(vehicle.id)}
                                className="font-secondary"
                              >
                                Edit
                              </Button>
                            </>
                          ) : vehicle.status === 'available' ? (
                            <Button onClick={() => onBook?.(vehicle.id)} className="font-secondary">
                              Book Now
                            </Button>
                          ) : (
                            <Button variant="outline" disabled className="font-secondary">
                              Currently Unavailable
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <CustomPagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            className="mt-6"
          />
        )}
      </div>
    </>
  );
}