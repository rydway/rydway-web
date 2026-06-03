"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { SearchFilters } from "@/@types";

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  className?: string;
}

export default function SearchBar({ onSearch, className }: SearchBarProps) {
  const [location, setLocation] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const [carType, setCarType] = useState("");

  const locations = [
    { name: "Abuja", disabled: false },
    { name: "Lagos", disabled: true },
    { name: "Port Harcourt", disabled: true },
    { name: "Calabar", disabled: true },
  ];

  const carTypes = [
    { value: "luxury", label: "Luxury" },
    { value: "casual", label: "Casual" },
    { value: "family", label: "Family" },
    { value: "suv", label: "SUV" },
    { value: "electric", label: "Electric" },
  ];

  const handleSearch = () => {
    const filters: SearchFilters = {
      location: location || undefined,
      startDate: dateRange.from,
      endDate: dateRange.to,
      category: carType ? [carType] : undefined,
      query: ""
    };
    onSearch(filters);
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="glassmorphism-card rounded-xl sm:rounded-2xl shadow-glass p-3 sm:p-4 md:p-2 flex flex-col md:flex-row items-stretch justify-between gap-3 sm:gap-4 md:gap-2">
        {/* Location */}
        <div className="flex-1 min-w-0 px-3 sm:px-4 py-3 md:border-r border-white/30">
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 font-primary">
            Location
          </label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full h-10 sm:h-11 border-0 p-0 shadow-none focus:ring-0 text-sm sm:text-base bg-transparent backdrop-blur-sm font-secondary">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <SelectValue placeholder="Where are you going?" />
              </div>
            </SelectTrigger>
            <SelectContent className="glassmorphism-dropdown backdrop-blur-xl border-white/30">
              {locations.map((loc) => (
                <SelectItem 
                  key={loc.name} 
                  value={loc.name}
                  disabled={loc.disabled}
                  className={cn(
                    loc.disabled && "opacity-50 cursor-not-allowed",
                    "hover:bg-white/30"
                  )}
                >
                  {loc.name}{loc.disabled && " (Coming Soon)"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="flex-1 min-w-0 px-3 sm:px-4 py-3 md:border-r border-white/30">
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 font-primary">
            Date Range
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full h-10 sm:h-11 justify-start text-left font-normal border-0 shadow-none p-0 hover:bg-white/20 bg-white/10 backdrop-blur-sm text-gray-900 text-sm sm:text-base font-secondary",
                  !dateRange.from && "text-gray-500"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-gray-600" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      <span className="hidden sm:inline">
                        {format(dateRange.from, "MMM dd")} - {format(dateRange.to, "MMM dd")}
                      </span>
                      <span className="sm:hidden">
                        {format(dateRange.from, "MM/dd")} - {format(dateRange.to, "MM/dd")}
                      </span>
                    </>
                  ) : (
                    format(dateRange.from, "MMM dd, yyyy")
                  )
                ) : (
                  <span>Select dates</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 glassmorphism-dropdown backdrop-blur-xl border-white/30" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={dateRange}
                onSelect={(range) => setDateRange({
                  from: range?.from,
                  to: range?.to,
                })}
                numberOfMonths={2}
                className="rounded-md"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Car Type */}
        <div className="flex-1 min-w-0 px-3 sm:px-4 py-3">
          <label className="block text-xs sm:text-sm font-medium text-gray-600 mb-1 sm:mb-2 font-primary">
            Car Type
          </label>
          <Select value={carType} onValueChange={setCarType}>
            <SelectTrigger className="w-full h-10 sm:h-11 border-0 p-0 shadow-none focus:ring-0 text-sm sm:text-base bg-transparent backdrop-blur-sm font-secondary">
              <SelectValue placeholder="Choose car type" />
            </SelectTrigger>
            <SelectContent className="glassmorphism-dropdown backdrop-blur-xl border-white/30">
              {carTypes.map((type) => (
                <SelectItem 
                  key={type.value} 
                  value={type.value}
                  className="hover:bg-white/30"
                >
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Search Button */}
        <div className="px-3 sm:px-4 py-3 flex items-center md:justify-center">
          <Button
            onClick={handleSearch}
            className="glassmorphism-button h-11 sm:h-12 w-full md:w-auto px-4 sm:px-6 rounded-xl bg-[#0074D1]/90 hover:bg-[#0074D1] backdrop-blur-sm transition-all duration-200 shadow-md hover:shadow-lg text-white text-sm sm:text-base"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            <span className="font-semibold">Search</span>
          </Button>
        </div>
      </div>
    </div>
  );
}