// app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";

import { usePolicy } from "@/hooks/usePolicy";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  const userRole = user?.role === 'host' ? 'business' : 'renter';
  const policies = usePolicy();

  return (
    <div className="flex h-screen">
      {/* Sidebar for desktop */}
      <div className="hidden md:block">
        <Sidebar 
          role={userRole}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </div>

      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-10 w-10 p-0"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      {/* Mobile sidebar overlay */}
      {collapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setCollapsed(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={cn(
        "md:hidden fixed top-0 left-0 h-full z-40 transition-transform",
        collapsed ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar 
          role={userRole}
          collapsed={false}
          className="w-64"
        />
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-4 md:pt-0">
        {policies.isSuspended && (
          <div className="bg-red-500/10 border-b border-red-500/20 px-6 py-3.5 backdrop-blur-md flex items-center gap-3 text-red-400 text-sm font-medium animate-fadeIn">
            <ShieldAlert size={18} className="shrink-0 animate-pulse" />
            <span className="flex-1">
              <strong>Account Suspended:</strong> {policies.suspensionReason}
            </span>
          </div>
        )}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}