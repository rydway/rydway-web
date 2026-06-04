"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Filter, X } from "lucide-react";
import { SearchFilters } from "@/types";
import { formatPrice } from "@/lib/utils";

interface FilterPanelProps {
  onApply: (filters: SearchFilters) => void;
  onClear: () => void;
}

export function FilterPanel({ onApply, onClear }: FilterPanelProps) {
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [categories, setCategories] = useState<string[]>([]);
  const [transmission, setTransmission] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [capacity, setCapacity] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(0);

  const handleApply = () => {
    onApply({
      priceMin: priceRange[0],
      priceMax: priceRange[1],
      category: categories.length > 0 ? categories : undefined,
      transmission: transmission.length > 0 ? transmission : undefined,
      fuelType: fuelTypes.length > 0 ? fuelTypes : undefined,
      capacity: capacity.length > 0 ? capacity : undefined,
      rating: minRating > 0 ? minRating : undefined,
      query: ""
    });
  };

  const handleClear = () => {
    setPriceRange([0, 100000]);
    setCategories([]);
    setTransmission([]);
    setFuelTypes([]);
    setCapacity([]);
    setMinRating(0);
    onClear();
  };

  return (
    <Card className="glassmorphism-card p-6 font-primary">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" />
          Filters
        </h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClear}
          className="text-sm text-slate-600"
        >
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Price per Day</Label>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={100000}
            step={5000}
            className="mb-2"
          />
          <div className="flex justify-between text-sm text-slate-600 font-secondary">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>

        {/* Category */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Car Type</Label>
          <div className="space-y-2">
            {['luxury', 'casual', 'family', 'suv', 'electric'].map((cat) => (
              <div key={cat} className="flex items-center gap-2">
                <Checkbox
                  checked={categories.includes(cat)}
                  onCheckedChange={(checked) => {
                    setCategories(checked 
                      ? [...categories, cat]
                      : categories.filter(c => c !== cat)
                    );
                  }}
                />
                <span className="text-sm capitalize font-secondary">{cat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Transmission */}
        <div>
          <Label className="text-sm font-medium mb-3 block">Transmission</Label>
          <div className="space-y-2">
            {['Automatic', 'Manual'].map((trans) => (
              <div key={trans} className="flex items-center gap-2">
                <Checkbox
                  checked={transmission.includes(trans)}
                  onCheckedChange={(checked) => {
                    setTransmission(checked 
                      ? [...transmission, trans]
                      : transmission.filter(t => t !== trans)
                    );
                  }}
                />
                <span className="text-sm font-secondary">{trans}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Apply Button */}
        <Button 
          onClick={handleApply}
          className="w-full rounded-xl bg-primary hover:bg-blue-600 text-white font-semibold"
        >
          Apply Filters
        </Button>
      </div>
    </Card>
  );
}