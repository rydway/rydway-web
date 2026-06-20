"use client";

import { useState } from "react";
import { 
  User as UserIcon,
  Shield,
  Bell,
  Plus,
  Clock,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  CreditCard
} from "lucide-react";

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

import { PaymentMethodCard, PaymentMethod } from "@/components/base/cards/PaymentMethodCard";
import { AddPaymentMethodDialog } from "@/components/base/modals/AddPaymentMethodDialog";
import { User, NotificationPreferences } from "./types";

// ============ MOCK DATA ============
const mockRenter: User = {
  id: "renter-1",
  name: "John Doe",
  email: "john.doe@email.com",
  phone: "+234 812 345 6789",
  avatar: "/api/placeholder/32/32",
  role: "renter",
  verified: true,
  kycStatus: "verified",
  licenseStatus: "verified"
};

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    type: "visa",
    last4: "4242",
    expiryMonth: 12,
    expiryYear: 2028,
    cardholderName: "John Doe",
    isDefault: true
  },
  {
    id: "pm-2",
    type: "mastercard",
    last4: "8888",
    expiryMonth: 8,
    expiryYear: 2027,
    cardholderName: "John Doe",
    isDefault: false
  }
];

const mockRenterNotifications: NotificationPreferences = {
  bookingUpdates: true,
  promotions: false,
  newBookings: false,
  cancellations: false,
  securityAlerts: true
};

// ============ SUB-COMPONENTS ============

function RenterAccountSettings() {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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
          <UserIcon className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
            Account Settings
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-slate-500 font-secondary">
          Manage your account security and preferences
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Password</h4>
              <p className="text-xs text-slate-500 mt-1">
                Last changed 3 months ago
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
                <Label htmlFor="current-password" className="text-xs">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
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
                <Label htmlFor="new-password" className="text-xs">New Password</Label>
                <div className="relative">
                  <Input
                    id="new-password"
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
                <Label htmlFor="confirm-password" className="text-xs">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirm-password"
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
                Temporarily disable your account
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

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Delete Account</h4>
              <p className="text-xs text-slate-500 mt-1">
                Permanently delete your account and data
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
            >
              Delete
            </Button>
          </div>
        </div>
      </CardContent>

      <AlertDialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-primary">Are you sure?</AlertDialogTitle>
            <AlertDialogDescription className="font-secondary">
              Are you sure you want to deactivate your account? You can reactivate it at any time by logging in.
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

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-primary text-red-600">Delete Account</AlertDialogTitle>
            <AlertDialogDescription className="font-secondary">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="confirm-delete" className="text-xs">
              Type "DELETE" to confirm
            </Label>
            <Input 
              id="confirm-delete" 
              placeholder="DELETE"
              className="mt-1 h-9 text-sm"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-xs">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => setShowDeleteDialog(false)}
              className="bg-red-600 hover:bg-red-700 text-xs"
            >
              Delete Permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}

function RenterPaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods);
  const [showAddCard, setShowAddCard] = useState(false);

  const handleSetDefault = (id: string) => {
    setPaymentMethods(prev => prev.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
  };

  const handleRemoveCard = (id: string) => {
    setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
  };

  const handleAddPaymentSubmit = (data: any) => {
    const newMethod: PaymentMethod = {
      id: `pm-${Date.now()}`,
      type: data.type === 'card' ? 'visa' : 'bank',
      last4: data.number ? data.number.slice(-4) : undefined,
      expiryMonth: data.expiry ? parseInt(data.expiry.split('/')[0]) : undefined,
      expiryYear: data.expiry ? 2000 + parseInt(data.expiry.split('/')[1]) : undefined,
      cardholderName: data.name || undefined,
      bankName: data.bankName || undefined,
      accountNumber: data.accountNumber || undefined,
      accountName: data.accountName || undefined,
      isDefault: paymentMethods.length === 0
    };
    setPaymentMethods([...paymentMethods, newMethod]);
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
              Payment Methods
            </CardTitle>
          </div>
          <Button 
            size="sm" 
            onClick={() => setShowAddCard(true)}
            className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Add Card
          </Button>
        </div>
        <CardDescription className="text-sm text-slate-500 font-secondary">
          Manage your payment methods for bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <PaymentMethodCard 
                key={method.id}
                method={method}
                onSetDefault={handleSetDefault}
                onRemove={handleRemoveCard}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-slate-200 rounded-lg">
              <CreditCard className="h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm text-slate-600 mb-1">No payment methods</p>
              <p className="text-xs text-slate-500 text-center">
                Add a card to start booking vehicles
              </p>
            </div>
          )}
        </div>
      </CardContent>

      <AddPaymentMethodDialog 
        open={showAddCard} 
        onOpenChange={setShowAddCard}
        onSubmit={handleAddPaymentSubmit}
      />
    </Card>
  );
}

function RenterNotificationSettings({ 
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
          Choose what notifications you receive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="booking-updates" className="text-sm font-medium text-slate-800">
                Booking updates
              </Label>
              <p className="text-xs text-slate-500">
                Get notified about booking confirmations, changes, and reminders
              </p>
            </div>
            <Switch
              id="booking-updates"
              checked={preferences.bookingUpdates}
              onCheckedChange={() => handleToggle('bookingUpdates')}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promotions" className="text-sm font-medium text-slate-800">
                Promotions
              </Label>
              <p className="text-xs text-slate-500">
                Receive special offers and discounts
              </p>
            </div>
            <Switch
              id="promotions"
              checked={preferences.promotions}
              onCheckedChange={() => handleToggle('promotions')}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between opacity-70">
            <div className="space-y-0.5">
              <Label htmlFor="security-alerts" className="text-sm font-medium text-slate-800">
                Security alerts
              </Label>
              <p className="text-xs text-slate-500">
                Important security notifications about your account
              </p>
            </div>
            <Switch
              id="security-alerts"
              checked={true}
              disabled
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RenterVerificationStatus({ user }: { user: User }) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="green" className="bg-green-50 text-green-700 border-green-200">Verified</Badge>;
      case 'pending':
        return <Badge variant="amber" className="bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>;
      case 'unverified':
        return <Badge variant="amber" className="bg-amber-50 text-amber-700 border-amber-200">Not Verified</Badge>;
      default:
        return <Badge variant="slate">Unknown</Badge>;
    }
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-lg font-semibold text-slate-800 font-primary">
            Verification Status
          </CardTitle>
        </div>
        <CardDescription className="text-sm text-slate-500 font-secondary">
          Your current verification status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-800">KYC Verification</h4>
              <p className="text-xs text-slate-500 mt-1">
                Identity verification
              </p>
            </div>
            {getStatusBadge(user.kycStatus)}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-slate-800">Driver's License</h4>
              <p className="text-xs text-slate-500 mt-1">
                License verification
              </p>
            </div>
            {getStatusBadge(user.licenseStatus)}
          </div>

          {user.kycStatus === 'verified' && user.licenseStatus === 'verified' && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  You're fully verified! You can book any vehicle.
                </span>
              </div>
            </div>
          )}

          {user.kycStatus === 'pending' || user.licenseStatus === 'pending' ? (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-amber-600" />
                <span className="text-xs font-medium text-amber-700">
                  Your verification is being reviewed. This usually takes 1-2 business days.
                </span>
              </div>
            </div>
          ) : null}

          {user.kycStatus === 'unverified' || user.licenseStatus === 'unverified' ? (
            <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <div className="flex items-start gap-3 w-full">
                <AlertCircle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="text-xs font-medium text-amber-700 block">
                    Complete your verification to start booking vehicles.
                  </span>
                  <div className="flex justify-start">
                    <Button 
                      size="sm" 
                      className="mt-3 w-auto px-4 bg-amber-600 text-white hover:bg-amber-700 border-none text-xs h-8"
                    >
                      Start Verification
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

// ============ EXPORTED COMPONENT ============
import { useCurrentUser } from "@/hooks/useUser";
import { Loader2 } from "lucide-react";

export function RenterSettingsPage() {
  const { user, isLoading } = useCurrentUser();
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>(mockRenterNotifications);

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

  const mappedUser: User = {
    id: user.id,
    name: user.firstName ? `${user.firstName} ${user.lastName}` : "Renter",
    email: user.email,
    phone: user.phone || "Not provided",
    avatar: user.profileImageUrl || "/api/placeholder/32/32",
    role: "renter",
    verified: user.kycStatus === 'verified',
    kycStatus: user.kycStatus as any,
    licenseStatus: user.kycStatus as any // Using kycStatus as a proxy for now
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
            Settings
          </h1>
          <p className="text-sm text-slate-500 font-secondary">
            Manage your account and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RenterAccountSettings />
        </div>

        <div className="space-y-6">
          <RenterVerificationStatus user={mappedUser} />
          <RenterNotificationSettings 
            preferences={notificationPrefs}
            onUpdate={setNotificationPrefs}
          />
          
          <Card className="border-slate-200 shadow-sm bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                  <AvatarImage src={mappedUser.avatar} />
                  <AvatarFallback className="bg-blue-100 text-blue-700">
                    {mappedUser.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">{mappedUser.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{mappedUser.email}</p>
                  {mappedUser.phone && (
                    <p className="text-xs text-slate-500 mt-0.5">{mappedUser.phone}</p>
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
