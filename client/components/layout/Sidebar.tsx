"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, Car as CarIcon, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { getNavigation, NavItem } from "@/lib/nav";
import { useRenterBookings, useHostBookings } from "@/hooks/useBookings";
import { useConversations } from "@/hooks/useMessaging";
import { useCurrentUser } from "@/hooks/useUser";

interface SidebarProps {
  role?: 'renter' | 'business';
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export default function Sidebar({ 
  role = 'renter', 
  collapsed = false,
  onToggleCollapse,
  className
}: SidebarProps) {
  const pathname = usePathname();
  const navigation = getNavigation(role);

  const { user } = useCurrentUser();
  // Only fetch the bookings that are relevant to the current role to avoid forbidden API calls
  const { bookings: renterBookings } = useRenterBookings();
  const { bookings: hostBookings } = useHostBookings();
  const { conversations } = useConversations();

  // BookingStatus uses 'requested' not 'pending' - match the backend enum
  const renterPending = role === 'renter'
    ? renterBookings.filter(b => b.status === 'requested').length
    : 0;
  const hostPending = role === 'business'
    ? hostBookings.filter(b => b.status === 'requested').length
    : 0;
  const unreadConvs = conversations.filter(c =>
    c.messages?.some(m => !m.isRead && m.senderId !== user?.id)
  ).length;

  const dynamicNavigation = {
    ...navigation,
    primary: navigation.primary.map(item => {
      if (item.id === 'my-bookings' || item.id === 'bookings') {
        const count = role === 'business' ? hostPending : renterPending;
        return { ...item, badge: count > 0 ? count : undefined };
      }
      if (item.id === 'messages') {
        return { ...item, badge: unreadConvs > 0 ? unreadConvs : undefined };
      }
      return item;
    })
  };

  const isActive = (href: string) => {
    // Exact match
    if (pathname === href) {
      return true;
    }
    
    // For parent routes like /dashboard, also match direct children like /dashboard/analytics
    if (href === '/dashboard' && pathname.startsWith('/dashboard/')) {
      return true;
    }
    
    return false;
  };
  return (
    <aside className={cn(
      "flex flex-col h-screen border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-200 font-primary",
      collapsed ? "w-16" : "w-64",
      className
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
             <Image src="/rydway3.png" alt="rydwaylogo" width={20} height={20}/>
          </div>
          {!collapsed && (
            <span className="font-bold text-lg text-slate-800 dark:text-white font-primary">
              Rydway
            </span>
          )}
        </div>
        
        {onToggleCollapse && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="h-8 w-8 p-0 hover:bg-primary/5 dark:hover:bg-primary/10 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors duration-200"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-1 mb-6">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-primary">
              Navigation
            </h3>
          )}
          
          {dynamicNavigation.primary.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200 group",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
                  active 
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-200",
                  active 
                    ? "text-primary dark:text-primary/90" 
                    : "text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary"
                )} />
                
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className={cn(
                      "text-sm truncate transition-colors duration-200 font-secondary",
                      active ? "font-semibold " : "font-medium "
                    )}>
                      {item.label}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      {item.disabled && (
                        <Lock className="h-3 w-3 text-amber-500" />
                      )}
                      
                      {item.badge && (
                        <Badge 
                          variant="outline"
                          className={cn(
                            "h-5 min-w-5 flex items-center justify-center text-xs px-1 font-primary",
                            item.badgeColor === 'red' 
                              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
                              : "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary/90 dark:border-primary/30"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            );
          })}
        </div>

        {navigation.secondary.length > 0 && (
          <div className="space-y-1 mb-6">
            {!collapsed && (
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-secondary">
                Saved
              </h3>
            )}
            
            {navigation.secondary.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.disabled ? "#" : item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
                    active 
                      ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                    item.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <item.icon className={cn(
                    "h-4 w-4 flex-shrink-0 transition-colors duration-200",
                    active 
                      ? "text-primary dark:text-primary/90" 
                      : "text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary"
                  )} />
                  
                  {!collapsed && (
                    <span className={cn(
                      "text-sm transition-colors duration-200",
                      active ? "font-semibold font-primary" : "font-medium font-secondary"
                    )}>
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <Separator className="my-4" />

        <div className="space-y-1">
          {!collapsed && (
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 font-secondary">
              Account
            </h3>
          )}
          
          {navigation.utility.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.disabled ? "#" : item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors duration-200",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
                  active 
                    ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon className={cn(
                  "h-4 w-4 flex-shrink-0 transition-colors duration-200",
                  active 
                    ? "text-primary dark:text-primary/90" 
                    : "text-slate-500 dark:text-slate-400 group-hover:text-primary dark:group-hover:text-primary"
                )} />
                
                {!collapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className={cn(
                      "text-sm transition-colors duration-200",
                      active ? "font-semibold font-primary" : "font-medium font-secondary"
                    )}>
                      {item.label}
                    </span>
                    
                    {item.disabled && (
                      <Lock className="h-3 w-3 text-amber-500" />
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      <div className={cn(
        "p-4 border-t border-slate-200 dark:border-slate-800",
        collapsed && "px-2"
      )}>
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary dark:text-primary/90" />
          </div>
          
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 dark:text-white truncate font-primary">
                {role === 'business' ? 'Business Account' : 'Personal Account'}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize font-secondary">
                {role}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}