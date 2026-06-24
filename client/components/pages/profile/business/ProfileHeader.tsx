// components/business/BusinessProfileHeader.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Edit2, 
  Save, 
  X,
  Star,
  CheckCircle,
  Clock,
  Users,
  Car,
  MessageSquare,
  Share2,
  Heart,
  Verified,
  Camera
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export interface BusinessProfileData {
  id: string;
  name: string;
  logo: string;
  coverImage?: string;
  tagline?: string;
  description: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  totalReviews: number;
  yearsInBusiness: number;
  verified: boolean;
  fleetSize: number;
  responseTime: string;
  policies?: {
    cancellation: string;
    insurance: string;
    driverRequirements: string;
  };
  isFavorite?: boolean;
  totalFavorites?: number;
}

interface BusinessProfileHeaderProps {
  data: BusinessProfileData;
  role?: "renter" | "business";
  isEditing?: boolean;
  onEditToggle?: () => void;
  onSave?: (data: BusinessProfileData ) => void;
  onCancel?: () => void;
  onContact?: () => void;
  onShare?: () => void;
  onToggleFavorite?: () => void;
  onAddVehicle?: () => void;
  onViewBookings?: () => void;
  className?: string;
}

export function BusinessProfileHeader({ 
  data, 
  role = "renter",
  isEditing = false,
  onEditToggle,
  onSave,
  onCancel,
  onContact,
  onShare,
  onToggleFavorite,
  onAddVehicle,
  onViewBookings,
  className 
}: BusinessProfileHeaderProps) {
  const router = useRouter();
  const [editData, setEditData] = useState<BusinessProfileData>(data);
  const [isFavorite, setIsFavorite] = useState(data.isFavorite || false);

  const handleSave = () => {
    onSave?.(editData);
  };

  const handleCancel = () => {
    setEditData(data);
    onCancel?.();
  };

  const handleChange = (field: keyof BusinessProfileData, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    onToggleFavorite?.();
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              i < Math.floor(rating) ? "text-amber-500 fill-amber-500" : "text-slate-300"
            )}
          />
        ))}
        <span className="ml-2 text-sm font-primary text-foreground">
          {rating.toFixed(1)} ({data.totalReviews} reviews)
        </span>
      </div>
    );
  };

  const renderField = (
    label: string,
    value: string,
    field: keyof BusinessProfileData,
    icon?: React.ReactNode,
    multiline?: boolean
  ) => {
    if (isEditing) {
      return (
        <div className="space-y-2">
          <Label htmlFor={field} className="text-sm font-secondary text-foreground">
            {label}
          </Label>
          {multiline ? (
            <Textarea
              id={field}
              value={value}
              onChange={(e) => handleChange(field, e.target.value)}
              className="min-h-[100px] font-primary"
            />
          ) : (
            <div className="relative">
              {icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {icon}
                </div>
              )}
              <Input
                id={field}
                value={value}
                onChange={(e) => handleChange(field, e.target.value)}
                className={cn(icon ? "pl-11" : "", "font-primary")}
              />
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="flex items-start gap-3">
        {icon && (
          <div className="p-2 bg-muted rounded-lg">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <p className="text-sm font-secondary text-foreground mb-1">{label}</p>
          <p className="text-muted-foreground font-primary">{value || "Not specified"}</p>
        </div>
      </div>
    );
  };

  const quickStats = [
    {
      label: "Fleet Size",
      value: data.fleetSize,
      icon: Car,
      color: "text-primary"
    },
    {
      label: "Response Time",
      value: data.responseTime,
      icon: Clock,
      color: "text-blue-500"
    },
    {
      label: "Years in Business",
      value: data.yearsInBusiness,
      icon: Users,
      color: "text-green-500"
    }
  ];

  return (
    <Card className={cn("border-border py-0 dark:border-border overflow-hidden", className)}>
      {/* Cover Image */}
      <div className="relative h-48 bg-secondary dark:bg-slate-800 flex items-center justify-center group cursor-pointer">
        {data.coverImage ? (
          <Image
            src={data.coverImage}
            alt="Cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground dark:text-muted-foreground dark:hover:text-slate-300">
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium font-secondary">Add Cover Photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />

        
        {/* Logo and Basic Info */}
   

        {/* Action Buttons */}
        <div className="absolute  top-4 right-4 flex gap-2">
          {/* Favorite Button (Renter only) */}
          {role === "renter" && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleFavoriteToggle}
              className={cn(
                "bg-white hover:bg-white/90 font-secondary",
                isFavorite && "bg-destructive/10 border-destructive/20 hover:bg-red-100"
              )}
            >
              <Heart className={cn(
                "h-4 w-4 mr-2",
                isFavorite && "fill-red-500 text-red-500"
              )} />
              {isFavorite ? "Saved" : "Save"}
            </Button>
          )}

          {/* Share Button */}
          <Button
            size="sm"
            variant="outline"
            onClick={onShare}
            className=" hover:bg-white/90 font-secondary"
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

        
          {role === "business" ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={onViewBookings}
                className=" hover:bg-white/90 font-secondary"
              >
                View Bookings
              </Button>
              <Button
                size="sm"
               
                onClick={onEditToggle}
                className={cn(
                  "bg-primary hover:bg-primary/90 text-white font-secondary",
                  isEditing && "bg-primary text-white hover:bg-primary/90"
                )}
              >
                {isEditing ? (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              onClick={onContact}
              className="bg-primary hover:bg-primary/90 text-white font-secondary"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Contact
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <CardContent className="relative -top-6 ">
        {/* Quick Stats */}
        {/* <div className="grid grid-cols-3 gap-4 mb-8">
          {quickStats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className="text-2xl font-primary font-bold text-foreground">{stat.value}</span>
              </div>
              <p className="text-sm font-secondary text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div> */}

        {/* Description */}
        <div className="space-y-4 mb-6 ">
               <div className=" left-6 flex items-end gap-4">
          <div className="relative w-32 h-32 -top-6 rounded-lg border-4 border-white dark:border-primary bg-white">
            <Image
              src={data.logo}
              alt={data.name}
              fill
              className="object-cover rounded-lg"
            />
      
          </div>
          
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-primary font-bold text-foreground dark:text-white">
                {data.name}
              </h1>
              {data.verified && (
                <Badge variant="blue" className="font-secondary">
                  Verified Business
                </Badge>
              )}
            </div>
            {data.tagline && (
              <p className="text-muted-foreground font-secondary mb-2">{data.tagline}</p>
            )}
            {renderStars(data.rating)}
          </div>
        </div>
          <h3 className="font-primary font-semibold text-foreground">About Us</h3>
          {renderField(
            "About Us",
            isEditing ? editData.description : data.description,
            "description",
            <Building2 className="h-4 w-4" />,
            true
          )}
        </div>

        <Separator className="my-6" />

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="font-primary font-semibold text-foreground mb-4">Contact Information</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {renderField(
              "Address",
              isEditing ? editData.address : `${data.address}, ${data.city}`,
              "address",
              <MapPin className="h-4 w-4" />
            )}
            
            {renderField(
              "Phone",
              isEditing ? editData.phone : data.phone,
              "phone",
              <Phone className="h-4 w-4" />
            )}
            
            {renderField(
              "Email",
              isEditing ? editData.email : data.email,
              "email",
              <Mail className="h-4 w-4" />
            )}
            
            {renderField(
              "Website",
              isEditing ? editData.website || "" : data.website || "",
              "website",
              <Globe className="h-4 w-4" />
            )}
          </div>
        </div>

        {/* Business Actions */}
        {role === "business" && (
          <>
            <Separator className="my-6" />
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onAddVehicle}
                className="flex-1 font-secondary"
              >
                <Car className="h-4 w-4 mr-2" />
                Add New Vehicle
              </Button>
              <Button
                variant="outline"
                onClick={onViewBookings}
                className="flex-1 font-secondary"
              >
                <Clock className="h-4 w-4 mr-2" />
                View All Bookings
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}