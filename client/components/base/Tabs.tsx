"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  count?: number;
}

interface CustomTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function CustomTabs({ 
  tabs, 
  activeTab, 
  onTabChange, 
  className 
}: CustomTabsProps) {
  return (
    <div className={cn(
      "flex border-b border-slate-200 dark:border-slate-800 font-primary",
      className
    )}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 font-medium text-sm transition-all duration-200 relative",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1",
            activeTab === tab.id
              ? "text-primary dark:text-primary/90 font-semibold"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 font-secondary hover:bg-slate-50 dark:hover:bg-slate-800/50"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "h-5 min-w-5 flex items-center justify-center text-xs rounded-full px-1 font-primary transition-colors duration-200",
              activeTab === tab.id
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90"
                : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            )}>
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary/90" />
          )}
        </button>
      ))}
    </div>
  );
}