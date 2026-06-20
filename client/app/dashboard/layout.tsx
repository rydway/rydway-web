// app/dashboard/layout.tsx
"use client";

import { useState, useEffect } from "react";
import { Menu, Bell, Settings, X, LogOut, User, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";

import { usePolicy } from "@/hooks/usePolicy";
import { useAuth } from "@/context/AuthContext";
import { useCurrentUser } from "@/hooks/useUser";
import { useNotifications } from "@/hooks/useNotifications";
import { ShieldAlert } from "lucide-react";
import { BaseLoader } from "@/components/ui/BaseLoader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { user: authUser, isLoading: authLoading, logout } = useAuth();
  const { user } = useCurrentUser();
  const { unreadCount } = useNotifications();
  const userRole = authUser?.role === "host" ? "business" : "renter";
  const policies = usePolicy();
  const router = useRouter();
  const pathname = usePathname();

  // Client-side auth guard
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.replace("/auth");
    }
  }, [authLoading, authUser, router]);

  // Role-based route protection
  useEffect(() => {
    if (!authLoading && authUser) {
      const isHostRoute =
        pathname.startsWith("/dashboard/business") ||
        pathname.startsWith("/dashboard/host");
      const isRenterRoute = pathname.startsWith("/dashboard/renter");
      const role = authUser.role; // 'renter' | 'host' | 'admin'

      if (role === "renter" && isHostRoute) {
        router.replace("/dashboard/renter");
      } else if (role === "host" && isRenterRoute) {
        router.replace("/dashboard/business");
      }
    }
  }, [authLoading, authUser, pathname, router]);

  if (authLoading) {
    return <BaseLoader fullScreen />;
  }

  if (!authUser) return null;

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : (authUser?.firstName ?? "User");

  const avatarUrl = user?.profileImageUrl;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profilePath =
    userRole === "business"
      ? "/dashboard/business/profile"
      : "/dashboard/renter/profile";

  const settingsPath =
    userRole === "business"
      ? "/dashboard/business/settings"
      : "/dashboard/renter/settings";

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Desktop Sidebar */}
      <div className="hidden md:block shrink-0">
        <Sidebar
          role={userRole}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar drawer */}
      <div
        className={cn(
          "md:hidden fixed top-0 left-0 h-full z-50 transition-transform duration-300",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="relative">
          <Sidebar
            role={userRole}
            collapsed={false}
            className="w-64 h-screen"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="absolute top-4 right-4 p-1 rounded-md text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main column */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 md:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          {/* Left: mobile hamburger */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            {/* Personalized greeting */}
            <div className="hidden md:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-800 dark:text-white font-primary">
                Welcome back, {displayName}
              </span>
              <span className="text-xs text-slate-400 font-secondary capitalize">
                {userRole === "business" ? "Business Account" : "Renter Account"}
              </span>
            </div>
          </div>

          {/* Right: action icons + avatar */}
          <div className="flex items-center gap-1">
            {/* Notifications */}
            <Link href={`/dashboard/${userRole}/notifications`}>
              <button className="relative p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </button>
            </Link>

            {/* Settings */}
            <Link href={settingsPath}>
              <button className="p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </Link>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Avatar dropdown */}
            <div className="relative group">
              <Link href={profilePath}>
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/10 flex items-center justify-center ring-2 ring-primary/20">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName}
                        width={32}
                        height={32}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <span className="text-xs font-bold text-primary font-primary">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-slate-800 dark:text-white font-primary leading-tight">
                      {displayName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-secondary capitalize leading-tight">
                      {userRole}
                    </p>
                  </div>
                </button>
              </Link>

              {/* Dropdown on hover */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 font-secondary px-2 py-1">
                    Signed in as
                  </p>
                  <p className="text-sm font-medium text-slate-800 dark:text-white font-primary px-2 truncate">
                    {displayName}
                  </p>
                </div>
                <div className="p-1">
                  <Link href={profilePath}>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-secondary transition-colors">
                      <User className="h-4 w-4" />
                      My Profile
                    </button>
                  </Link>
                  <Link href={settingsPath}>
                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md font-secondary transition-colors">
                      <Settings className="h-4 w-4" />
                      Settings
                    </button>
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md font-secondary transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Suspension banner */}
        {policies.isSuspended && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-3 flex items-center gap-3 text-red-600 text-sm font-medium">
            <ShieldAlert size={16} className="shrink-0 animate-pulse" />
            <span>
              <strong>Account Suspended:</strong> {policies.suspensionReason}
            </span>
          </div>
        )}

        {/* KYC Banner */}
        {authUser && authUser.kycStatus !== 'verified' && !policies.isSuspended && (
          <div className="bg-primary px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-white shadow-inner">
            <div className="flex items-center gap-3">
              <ShieldAlert size={20} className="shrink-0" />
              <div>
                <h3 className="font-semibold text-base font-primary">
                  {authUser.kycStatus === 'pending' ? 'KYC Under Review' : 'Complete Your KYC'}
                </h3>
                <p className="text-sm text-white/90 font-secondary mt-0.5">
                  {authUser.kycStatus === 'pending'
                    ? 'Your documents are currently being reviewed. You will be notified once verified.'
                    : 'You need to verify your identity to unlock all platform features and start earning/renting.'}
                </p>
              </div>
            </div>
            {authUser.kycStatus !== 'pending' && (
              <Link href={`/kyc/${userRole}`}>
                <Button variant="secondary" className="bg-white/20 ml-6 text-white hover:bg-white/30 font-semibold whitespace-nowrap border-none">
                  Complete KYC Now
                </Button>
              </Link>
            )}
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 md:p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
