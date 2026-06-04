"use client";

import { useState } from "react";
import { 
  Building,
  Shield,
  Bell,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
  Landmark,
  FileText
} from "lucide-react";
import { format } from "date-fns/format";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { User, PayoutDetails, NotificationPreferences } from "./types";

// ============ MOCK DATA ============
const mockBusiness: User = {
  id: "business-1",
  name: "Premium Car Rentals",
  email: "info@premiumrentals.com",
  phone: "+234 801 234 5678",
  avatar: "/api/placeholder/32/32",
  role: "business",
  verified: true,
  businessVerification: "verified",
  documentExpiry: new Date(2026, 11, 31)
};

const mockPayoutDetails: PayoutDetails = {
  bankName: "Guaranty Trust Bank",
  accountNumber: "0123456789",
  accountName: "Premium Car Rentals Ltd",
  bankCode: "058"
};

const mockBusinessNotifications: NotificationPreferences = {
  bookingUpdates: false,
  promotions: false,
  newBookings: true,
  cancellations: true,
  securityAlerts: true
};

// ============ SUB-COMPONENTS ============

function BusinessAccountSettings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = () => {
    console.log('Password changed');
    setShowChangePassword(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
            Account Settings
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-slate-500 font-secondary">
          Manage your business account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Password</h4>
              <p className="text-xs text-slate-500 mt-1">
                Last changed 2 months ago
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="text-xs h-8"
            >
              Change password
            </Button>
          </div>

          {showChangePassword && (
            <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="business-current-password" className="text-xs">Current Password</Label>
                <div className="relative">
                  <Input
                    id="business-current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pr-10 h-9 text-sm"
                    placeholder="Enter current password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 w-9 p-0"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-new-password" className="text-xs">New Password</Label>
                <div className="relative">
                  <Input
                    id="business-new-password"
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pr-10 h-9 text-sm"
                    placeholder="Enter new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 w-9 p-0"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="business-confirm-password" className="text-xs">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="business-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pr-10 h-9 text-sm"
                    placeholder="Confirm new password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-9 w-9 p-0"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Button 
                  size="sm" 
                  onClick={handleChangePassword}
                  className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
                  disabled={!currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                >
                  Update Password
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowChangePassword(false)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Deactivate Account</h4>
              <p className="text-xs text-slate-500 mt-1">
                Temporarily disable your business account
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDeactivateDialog(true)}
              className="text-xs h-8 text-amber-600 border-amber-200 hover:bg-amber-50"
            >
              Deactivate
            </Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-primary">Deactivate Business Account</AlertDialogTitle>
            <AlertDialogDescription className="font-secondary">
              Are you sure you want to deactivate your business account? 
              Your listings will be hidden and you won't receive new bookings.
              You can reactivate at any time by logging in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => setShowDeactivateDialog(false)}
              className="bg-amber-600 hover:bg-amber-700 text-xs"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function BusinessPayoutDetails({ 
  payoutDetails, 
  onUpdate 
}: { 
  payoutDetails: PayoutDetails;
  onUpdate: (details: PayoutDetails) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<PayoutDetails>(payoutDetails);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Landmark className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
              Payout Details
            </CardTitle>
          </div>
          {!isEditing ? (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="text-xs h-8"
            >
              Edit Details
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setFormData(payoutDetails);
                  setIsEditing(false);
                }}
                className="text-xs h-8"
              >
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
              >
                Save Changes
              </Button>
            </div>
          )}
        </div>
        <CardDescription className="text-sm text-slate-500 font-secondary">
          Bank account details for receiving payouts
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bank-name" className="text-xs">Bank Name</Label>
              <Select value={formData.bankName} onValueChange={(value) => setFormData({...formData, bankName: value})}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Guaranty Trust Bank">Guaranty Trust Bank</SelectItem>
                  <SelectItem value="First Bank">First Bank</SelectItem>
                  <SelectItem value="Access Bank">Access Bank</SelectItem>
                  <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                  <SelectItem value="UBA">UBA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-number" className="text-xs">Account Number</Label>
              <Input
                id="account-number"
                value={formData.accountNumber}
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                className="h-9 text-sm"
                placeholder="Enter account number"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="account-name" className="text-xs">Account Name</Label>
              <Input
                id="account-name"
                value={formData.accountName}
                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                className="h-9 text-sm"
                placeholder="Enter account name"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500">Bank</span>
              <span className="text-sm font-medium text-slate-800">{payoutDetails.bankName}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500">Account Number</span>
              <span className="text-sm font-medium text-slate-800">{payoutDetails.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <span className="text-xs text-slate-500">Account Name</span>
              <span className="text-sm font-medium text-slate-800">{payoutDetails.accountName}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function BusinessNotificationSettings({ 
  preferences, 
  onUpdate 
}: { 
  preferences: NotificationPreferences;
  onUpdate: (prefs: NotificationPreferences) => void;
}) {
  const handleToggle = (key: keyof NotificationPreferences) => {
    onUpdate({
      ...preferences,
      [key]: !preferences[key]
    });
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
            Notifications
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-slate-500 font-secondary">
          Manage your business notification preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="new-bookings" className="text-sm font-medium text-slate-800">
                New bookings
              </Label>
              <p className="text-xs text-slate-500">
                Get notified when you receive a new booking
              </p>
            </div>
            <Switch
              id="new-bookings"
              checked={preferences.newBookings}
              onCheckedChange={() => handleToggle('newBookings')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="cancellations" className="text-sm font-medium text-slate-800">
                Cancellations
              </Label>
              <p className="text-xs text-slate-500">
                Get notified when a booking is cancelled
              </p>
            </div>
            <Switch
              id="cancellations"
              checked={preferences.cancellations}
              onCheckedChange={() => handleToggle('cancellations')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between opacity-70">
            <div className="space-y-0.5">
              <Label htmlFor="business-security" className="text-sm font-medium text-slate-800">
                Security alerts
              </Label>
              <p className="text-xs text-slate-500">
                Important security notifications about your account
              </p>
            </div>
            <Switch
              id="business-security"
              checked={true}
              disabled
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BusinessVerificationStatus({ user }: { user: User }) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="green" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case 'pending':
        return <Badge variant="amber" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'unverified':
        return <Badge variant="red" className="bg-red-50 text-red-700 border-red-200">Not Submitted</Badge>;
      default:
        return <Badge variant="slate">Unknown</Badge>;
    }
  };

  const getDaysUntilExpiry = (expiryDate?: Date) => {
    if (!expiryDate) return null;
    const today = new Date();
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const expiryDays = getDaysUntilExpiry(user.documentExpiry);

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
            Business Verification
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-slate-500 font-secondary">
          Your business verification status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Business Verification</h4>
              <p className="text-xs text-slate-500 mt-1">
                CAC registration, tax ID, etc.
              </p>
            </div>
            {getStatusBadge(user.businessVerification)}
          </div>

          {user.documentExpiry && (
            <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-amber-800 mb-1">
                    Document Expiry Reminder
                  </h4>
                  <p className="text-xs text-amber-700">
                    Your business documents will expire on {format(user.documentExpiry, 'MMMM d, yyyy')}
                  </p>
                  {expiryDays && expiryDays <= 30 && (
                    <div className="mt-2">
                      <Badge variant="red" className="bg-red-50 text-red-700 border-red-200 text-[10px]">
                        {expiryDays} days remaining
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {user.businessVerification === 'pending' && (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">
                  Your verification is being reviewed. This usually takes 2-3 business days.
                </span>
              </div>
            </div>
          )}

          {user.businessVerification === 'unverified' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-xs font-medium text-blue-700">
                  Complete your business verification to start receiving bookings.
                </span>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="mt-3 w-full border-blue-200 bg-white text-blue-700 hover:bg-blue-100 text-xs h-8"
              >
                Start Verification
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ EXPORTED COMPONENT ============
import { useCurrentUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";

export function BusinessSettingsPage() {
  const { user, isLoading } = useCurrentUser();
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(mockBusinessNotifications);
  const [payoutDetails, setPayoutDetails] = useState<PayoutDetails>(mockPayoutDetails);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const mappedBusinessUser: User = {
    id: user.id,
    name: user.firstName ? `${user.firstName} ${user.lastName}` : "Business Owner",
    email: user.email,
    phone: user.phone || "Not provided",
    avatar: user.profileImageUrl || "/api/placeholder/32/32",
    role: "business",
    verified: user.kycStatus === 'verified',
    businessVerification: user.kycStatus as any, // Using kycStatus as proxy
    documentExpiry: new Date(2026, 11, 31) // Keep mock expiry for now until backend provides it
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Business Settings
          </h1>
          <p className="text-sm text-slate-500 font-secondary">
            Manage your business account, payouts, and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BusinessAccountSettings />
          <BusinessPayoutDetails 
            payoutDetails={payoutDetails}
            onUpdate={setPayoutDetails}
          />
        </div>

        <div className="space-y-6">
          <BusinessVerificationStatus user={mappedBusinessUser} />
          <BusinessNotificationSettings 
            preferences={notificationPrefs}
            onUpdate={setNotificationPrefs}
          />
          
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={mappedBusinessUser.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {mappedBusinessUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{mappedBusinessUser.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{mappedBusinessUser.email}</p>
                  {mappedBusinessUser.phone && (
                    <p className="text-xs text-slate-500 mt-0.5">{mappedBusinessUser.phone}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
