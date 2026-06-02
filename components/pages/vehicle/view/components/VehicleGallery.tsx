"use client";

import { useState } from "react";
import Image from "next/image";
import { Share2, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VehicleGalleryProps {
  images: string[];
  name: string;
  onShare?: () => void;
  onFavorite?: () => void;
  isFavorite?: boolean;
}

export function VehicleGallery({ 
  images, 
  name, 
  onShare, 
  onFavorite, 
  isFavorite 
}: VehicleGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || "/api/placeholder/400/300");

  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardContent className="p-4">
        {/* Main Image */}
        <div className="relative h-80 w-full bg-slate-50 rounded-lg overflow-hidden mb-4">
          <Image
            src={mainImage}
            alt={name}
            fill
            className="object-contain p-4"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {onShare && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm"
                onClick={onShare}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            )}
            {onFavorite && (
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 bg-white/80 backdrop-blur-sm"
                onClick={onFavorite}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            )}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div
                key={idx}
                className={`relative h-20 bg-slate-50 rounded-lg overflow-hidden cursor-pointer border-2 transition-all
                  ${mainImage === img ? 'border-blue-500' : 'border-transparent hover:border-slate-300'}`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img}
                  alt={`${name} - ${idx + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
