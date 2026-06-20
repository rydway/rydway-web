// app/dashboard/renter/profile/page.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Car,
  Star,
  Clock,
  CheckCircle,
  Award,
  CreditCard,
  Bell,
  Heart,
  AlertCircle,
  Edit2,
  Camera,
  Briefcase,
  Home,
  Globe,
  Twitter,
  Facebook,
  Instagram,
  Linkedin,
  Building2,
  MessageSquare,
  Share2
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatCard } from "@/components/base/cards/StatCard";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// ============ TYPES ============

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  coverImage?: string;
  bio?: string;
  location?: string;
  memberSince: Date;
  lastActive: Date;
  verified: boolean;
  kycStatus: 'verified' | 'pending' | 'unverified';
  accountType: 'personal' | 'business';
  preferences?: {
    notifications: boolean;
    newsletter: boolean;
  };
  stats: {
    totalTrips: number;
    totalSpent: number;
    totalDays: number;
    averageRating: number;
    reviews: number;
  };
  recentVehicles?: {
    id: string;
    name: string;
    image?: string;
    date: Date;
    location: string;
  }[];
  upcomingBookings?: {
    id: string;
    vehicleName: string;
    startDate: Date;
    endDate: Date;
    location: string;
    status: string;
  }[];
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
  };
}



// ============ COMPONENTS ============

// Profile Header (UNCHANGED)
function ProfileHeader({
  profile,
  onEditProfile,
  onShare,
  onContact
}: {
  profile: UserProfile;
  onEditProfile: () => void;
  onShare?: () => void;
  onContact?: () => void;
}) {
  const [showAvatarDialog, setShowAvatarDialog] = useState(false);

  const renderStars = (rating: number, reviews: number) => {
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
        <span className="ml-2 text-sm font-primary text-slate-700">
          {rating.toFixed(1)} ({reviews} reviews)
        </span>
      </div>
    );
  };

  return (
    <Card className=" py-0 dark:border-slate-800 overflow-hidden">
      {/* Cover Image */}
      <div className="relative h-32 md:h-48 bg-slate-200 dark:bg-slate-800 flex items-center justify-center group cursor-pointer">
        {profile.coverImage ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300">
            <Camera className="h-6 w-6" />
            <span className="text-xs font-medium font-secondary">Add Cover Photo</span>
          </div>
        )}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />


        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onShare}
            className="bg-white hover:bg-white/90 font-secondary px-2 md:px-3"
          >
            <Share2 className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Share</span>
          </Button>

          <Button
            size="sm"
            onClick={onContact}
            className="bg-primary hover:bg-primary/90 text-white font-secondary px-2 md:px-3"
          >
            <MessageSquare className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Contact</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <CardContent className="relative ">
        {/* Logo/Avatar and Basic Info */}
        <div className="flex flex-col md:flex-row md:items-end gap-4">
          <div className="relative lg:-top-8 self-start md:self-auto">
            <div className="relative w-24 h-24 md:w-32 md:h-32 -top-12 md:-top-6 rounded-lg border-4 border-white dark:border-slate-900 bg-white overflow-hidden">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                  <User className="h-16 w-16 text-slate-400" />
                </div>
              )}
            </div>
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-10 md:bottom-0 right-0 h-8 w-8 rounded-full bg-white hover:bg-slate-50"
              onClick={() => setShowAvatarDialog(true)}
            >
              <Camera className="h-4 w-4 text-slate-600" />
            </Button>
          </div>

          <div className="mb-6 flex-1 w-full -mt-10 md:-mt-2 pt-0 md:pt-2">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-primary font-bold text-slate-800 dark:text-white">
                    {profile.name}
                  </h1>
                  {profile.verified && (
                    <Badge variant="blue" className="font-secondary">
                      Verified Renter
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    {profile.email}
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {profile.phone}
                    </div>
                  )}
                </div>
              </div>

              <Button
                size="sm"
                onClick={onEditProfile}
                className="bg-primary hover:bg-primary/90 text-white font-secondary flex-shrink-0 px-2 md:px-3"
              >
                <Edit2 className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Edit Profile</span>
              </Button>
            </div>

            {profile.location && (
              <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </div>
            )}

            {renderStars(profile.stats.averageRating, profile.stats.reviews)}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="space-y-4 mb-6">
            <h3 className="font-primary font-semibold text-slate-800">About Me</h3>
            <div className="flex-1">
              <p className="text-slate-600 font-primary leading-relaxed">{profile.bio}</p>
            </div>
          </div>
        )}

        {/* Member Since */}
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            Member since {format(profile.memberSince, 'MMMM yyyy')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            Last active {format(profile.lastActive, 'h:mm a')}
          </div>
        </div>
      </CardContent>

      {/* Avatar Upload Dialog */}
      <Dialog open={showAvatarDialog} onOpenChange={setShowAvatarDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-primary">Change Profile Photo</DialogTitle>
            <DialogDescription className="font-secondary">
              Upload a new profile picture
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="h-32 w-32 rounded-full bg-slate-100 flex items-center justify-center">
                <Camera className="h-10 w-10 text-slate-400" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="font-secondary">
                  Upload Photo
                </Button>
                <Button variant="ghost" size="sm" className="font-secondary">
                  Remove
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// Edit Profile Dialog
import { userService } from "@/services/user.service";
import { toast } from "sonner";

function EditProfileDialog({
  profile,
  open,
  onOpenChange
}: {
  profile: UserProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone || '',
    location: profile.location || '',
    bio: profile.bio || ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await userService.updateMe({
        firstName: formData.name.split(" ")[0] || "",
        lastName: formData.name.split(" ").slice(1).join(" ") || "",
        phone: formData.phone,
      });
      toast.success("Profile updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-primary text-lg">Edit Profile</DialogTitle>
          <DialogDescription className="font-secondary text-sm">
            Update your personal information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-xs font-secondary">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-10 text-sm font-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-xs font-secondary">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="h-10 text-sm font-primary"
              placeholder="+234 XXX XXX XXXX"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs font-secondary">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="h-10 text-sm font-primary"
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio" className="text-xs font-secondary">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="min-h-[100px] text-sm font-primary"
              placeholder="Tell us a little about yourself"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)} className="font-secondary" disabled={isSaving}>
            Cancel
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90 font-secondary" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Stats Cards (MODIFIED - Refactored to use unified StatCard component)
function ProfileStats({ stats }: { stats: UserProfile['stats'] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard
        title="Total Trips"
        value={stats.totalTrips.toString()}
        icon={Car}
        trend="Trips completed"
        trendUp={true}
        className="shadow-sm"
      />
      <StatCard
        title="Days Rented"
        value={stats.totalDays.toString()}
        icon={Calendar}
        trend="Total rented duration"
        trendUp={true}
        className="shadow-sm"
      />
      <StatCard
        title="Rating"
        value={`${stats.averageRating.toFixed(1)} (${stats.reviews})`}
        icon={Star}
        trend="Average rating"
        trendUp={true}
        className="shadow-sm"
      />
      <StatCard
        title="Total Spent"
        value={`₦${(stats.totalSpent / 1000000).toFixed(1)}M`}
        icon={CreditCard}
        trend="Lifetime expenditure"
        trendUp={true}
        className="shadow-sm"
      />
    </div>
  );
}

// Verification Status (MODIFIED - Added h-full flex flex-col and flex-1 to ensure content fills height)
function VerificationStatus({ profile }: { profile: UserProfile }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'verified':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          text: 'Verified',
          message: 'Your identity has been verified. You can book any vehicle.'
        };
      case 'pending':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: Clock,
          iconColor: 'text-amber-600',
          text: 'Pending Review',
          message: 'Your verification is being reviewed. This usually takes 1-2 business days.'
        };
      default:
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          icon: AlertCircle,
          iconColor: 'text-amber-600',
          text: 'Not Verified',
          message: 'Complete your KYC verification to start booking vehicles.',
          btnVariant: 'outline'
        };
    }
  };

  const config = getStatusConfig(profile.kycStatus);
  const Icon = config.icon;

  return (
    <Card className=" shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold font-primary text-slate-800 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className={cn("p-4 rounded-lg border", config.bg, config.border)}>
          <div className="flex items-start gap-3">
            <Icon className={cn("h-4 w-4 flex-shrink-0 mt-0.5", config.iconColor)} />
            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className={cn("text-sm font-medium font-primary", config.iconColor)}>
                  KYC Verification: {config.text}
                </p>
                {profile.kycStatus !== 'verified' && (
                  <Button size="sm" className="flex-shrink-0 text-xs h-7 px-3 font-secondary bg-amber-600 text-white hover:bg-amber-700 border-none">
                    Complete Now
                  </Button>
                )}
              </div>
              <p className="text-xs font-secondary text-slate-500 mt-1">
                {config.message}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Recent Activity (MODIFIED - Added h-full flex flex-col and flex-1 to ensure content fills height)
function RecentActivity({ vehicles }: { vehicles: UserProfile['recentVehicles'] }) {
  if (!vehicles || vehicles.length === 0) return null;

  return (
    <Card className=" shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold font-primary text-slate-800 flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="h-4 w-4 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium font-primary text-slate-800 truncate">{vehicle.name}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs font-secondary text-slate-500 truncate">{vehicle.location}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-secondary text-slate-500 whitespace-nowrap">{format(vehicle.date, 'MMM d, yyyy')}</span>
                  </div>
                </div>
              </div>
              <Badge variant="green" className="text-[10px] font-secondary bg-green-50 text-green-700 border-green-200 flex-shrink-0 ml-2">
                Completed
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Upcoming Bookings (MODIFIED - Added h-full flex flex-col and flex-1 to ensure content fills height)
function UpcomingBookings({ bookings }: { bookings: UserProfile['upcomingBookings'] }) {
  if (!bookings || bookings.length === 0) return null;

  return (
    <Card className=" shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold font-primary text-slate-800 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Upcoming Trips
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Car className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium font-primary text-slate-800 truncate">{booking.vehicleName}</p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="text-xs font-secondary text-slate-500 truncate">{booking.location}</span>
                    <span className="text-xs text-slate-300">•</span>
                    <span className="text-xs font-secondary text-slate-500 whitespace-nowrap">
                      {format(booking.startDate, 'MMM d')} - {format(booking.endDate, 'MMM d')}
                    </span>
                  </div>
                </div>
              </div>
              <Badge
                variant={booking.status === 'confirmed' ? 'blue' : 'amber'}
                className="text-[10px] font-secondary flex-shrink-0 ml-2"
              >
                {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
              </Badge>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" className="w-full mt-4 text-xs text-primary hover:text-primary/70 font-secondary">
          View All Bookings
          <Calendar className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}

// Social Links (MODIFIED - Added h-full flex flex-col and flex-1 to ensure content fills height)
function SocialLinks({ links }: { links?: UserProfile['socialLinks'] }) {
  if (!links) return null;

  const hasLinks = Object.values(links).some(Boolean);
  if (!hasLinks) return null;

  return (
    <Card className=" shadow-sm h-full flex flex-col">
      <CardHeader className="">
        <CardTitle className="text-base font-semibold font-primary text-slate-800 flex items-center gap-2">
          <Globe className="h-5 w-5 text-primary" />
          Social Profiles
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex flex-wrap gap-3">
          {links.twitter && (
            <div className="flex items-center h-8 gap-2 font-secondary">
              <Twitter className="h-3.5 w-3.5 text-sky-500" />
              @{links.twitter}
            </div>
          )}
          {links.instagram && (
            <div className="flex items-center h-8 gap-2 font-secondary">
              <Instagram className="h-3.5 w-3.5 text-pink-500" />
              @{links.instagram}
            </div>
          )}
          {links.facebook && (
            <div className="flex items-center h-8 gap-2 font-secondary">
              <Facebook className="h-3.5 w-3.5 text-blue-600" />
              {links.facebook}
            </div>
          )}
          {links.linkedin && (
            <div className="flex items-center h-8 gap-2 font-secondary">
              <Linkedin className="h-3.5 w-3.5 text-blue-700" />
              {links.linkedin}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Account Type Badge (UNCHANGED)
function AccountTypeBadge({ type }: { type: string }) {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full">
      {type === 'personal' ? (
        <User className="h-3.5 w-3.5 text-primary" />
      ) : (
        <Briefcase className="h-3.5 w-3.5 text-primary" />
      )}
      <span className="text-xs font-medium font-secondary text-primary capitalize">
        {type} Account
      </span>
    </div>
  );
}

// Achievement Card (MODIFIED - Added h-full and flex flex-col to ensure content fills height)
function AchievementCard({ stats }: { stats: UserProfile['stats'] }) {
  return (
    <Card className=" shadow-sm bg-gradient-to-br from-amber-50 to-white h-full flex flex-col">
      <CardContent className="p-5 flex-1">
        <div className="flex items-start gap-3 h-full">
          <div className="p-2 bg-amber-100 rounded-lg flex-shrink-0">
            <Award className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold font-primary text-slate-800 mb-1">
              Renter Milestone
            </h3>
            <p className="text-xs font-secondary text-slate-600">
              You've completed {stats.totalTrips} trips!
              {stats.totalTrips >= 20 ? ' 🎉' : ' 5 more to reach 25 trips.'}
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-secondary text-slate-600">Progress to Gold</span>
                <span className="font-medium font-primary text-amber-600">{stats.totalTrips}/50</span>
              </div>
              <Progress value={(stats.totalTrips / 50) * 100} className="h-1.5 bg-amber-100" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Personal Information Card (MODIFIED - Added h-full and flex flex-col)
function PersonalInformation({ profile }: { profile: UserProfile }) {
  return (
    <Card className=" shadow-sm h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold font-primary text-slate-800 flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          Personal Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-secondary text-slate-500 mb-1">Full Name</p>
              <p className="text-sm font-medium font-primary text-slate-800">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs font-secondary text-slate-500 mb-1">Email</p>
              <p className="text-sm font-medium font-primary text-slate-800">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs font-secondary text-slate-500 mb-1">Phone</p>
              <p className="text-sm font-medium font-primary text-slate-800">{profile.phone || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs font-secondary text-slate-500 mb-1">Location</p>
              <p className="text-sm font-medium font-primary text-slate-800">{profile.location || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs font-secondary text-slate-500 mb-1">Member Since</p>
              <p className="text-sm font-medium font-primary text-slate-800">{format(profile.memberSince, 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-xs font-secondary text-slate-500 mb-1">Account Type</p>
              <div className="mt-0.5">
                <AccountTypeBadge type={profile.accountType} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============ MAIN PAGE ============

import { useCurrentUser } from "@/hooks/useUser";
import { useRenterDashboard } from "@/hooks/useDashboard";
import { useRenterBookings } from "@/hooks/useBookings";
import { Loader2 } from "lucide-react";

export default function RenterProfilePage() {
  const { user, isLoading: isUserLoading } = useCurrentUser();
  const { summary, isLoading: isSummaryLoading } = useRenterDashboard();
  const { bookings, isLoading: isBookingsLoading } = useRenterBookings();

  const [showEditDialog, setShowEditDialog] = useState(false);

  if (isUserLoading || isSummaryLoading || isBookingsLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 font-secondary text-slate-500">Loading profile data...</span>
      </div>
    );
  }

  const profile: UserProfile = {
    id: user?.id || "user-1",
    name: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "Renter User",
    email: user?.email || "No email provided",
    phone: user?.phone,
    avatar: user?.profileImageUrl,
    coverImage: "", // Leave blank so default placeholder applies
    bio: "User bio goes here. Edit your profile to add more details.",
    location: "Not specified",
    memberSince: user?.createdAt ? new Date(user.createdAt) : new Date(),
    lastActive: new Date(),
    verified: user?.kycStatus === 'verified',
    kycStatus: (user?.kycStatus === 'verified' || user?.kycStatus === 'pending') ? user.kycStatus : 'unverified',
    accountType: "personal",
    preferences: {
      notifications: true,
      newsletter: true
    },
    stats: {
      totalTrips: summary?.totalBookings || 0,
      totalSpent: summary?.totalSpend || 0,
      totalDays: summary?.completedBookings ? summary.completedBookings * 2 : 0, // Mocked days
      averageRating: 0,
      reviews: 0
    },
    recentVehicles: bookings
      .filter((b) => b.status === "completed")
      .map((b) => ({
        id: b.id,
        name: b.vehicle?.name || "Unknown Vehicle",
        date: new Date(b.endDate),
        location: b.pickupLocation
      })),
    upcomingBookings: bookings
      .filter((b) => b.status === "active" || b.status === "confirmed" || b.status === "paid")
      .map((b) => ({
        id: b.id,
        vehicleName: b.vehicle?.name || "Unknown Vehicle",
        startDate: new Date(b.startDate),
        endDate: new Date(b.endDate),
        location: b.pickupLocation,
        status: b.status as any
      })),
    socialLinks: {}
  };

  const handleShare = () => {
    console.log("Share profile");
  };

  const handleContactSupport = () => {
    console.log("Contact support");
  };

  return (
    <div className="space-y-6">
      {/* Profile Header (UNCHANGED) */}
      <ProfileHeader
        profile={profile}
        onEditProfile={() => setShowEditDialog(true)}
        onShare={handleShare}
        onContact={handleContactSupport}
      />

      {/* Stats (now with h-full) */}
      <ProfileStats stats={profile.stats} />

      {/* Main Content - Using flex for equal height columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Personal Information */}
        <div className="h-full flex flex-col">
          <PersonalInformation profile={profile} />
        </div>

        {/* Recent Activity */}
        {profile.recentVehicles && profile.recentVehicles.length > 0 && (
          <div className="h-full flex flex-col">
            <RecentActivity vehicles={profile.recentVehicles} />
          </div>
        )}

        {/* Verification Status */}
        <div className="h-full flex flex-col">
          <VerificationStatus profile={profile} />
        </div>

        {/* Upcoming Bookings */}
        {profile.upcomingBookings && profile.upcomingBookings.length > 0 && (
          <div className="h-full flex flex-col">
            <UpcomingBookings bookings={profile.upcomingBookings} />
          </div>
        )}

        {/* Social Links */}
        {profile.socialLinks && Object.values(profile.socialLinks).some(Boolean) && (
          <div className="h-full flex flex-col">
            <SocialLinks links={profile.socialLinks} />
          </div>
        )}

        {/* Achievement Card */}
        <div className="h-full flex flex-col">
          <AchievementCard stats={profile.stats} />
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        profile={profile}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
      />
    </div>
  );
}