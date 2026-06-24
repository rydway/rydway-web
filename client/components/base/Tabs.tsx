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
      "flex overflow-x-auto scrollbar-hide whitespace-nowrap border-b border-border dark:border-border font-primary w-full max-w-full",
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
              : "text-muted-foreground dark:text-muted-foreground hover:text-foreground dark:hover:text-slate-300 font-secondary hover:bg-muted/50 dark:hover:bg-slate-800/50"
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              "h-5 min-w-5 flex items-center justify-center text-xs rounded-full px-1 font-primary transition-colors duration-200",
              activeTab === tab.id
                ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90"
                : "bg-muted text-muted-foreground dark:bg-slate-800 dark:text-muted-foreground"
            )}>
              {tab.count}
            </span>
          )}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary/90 text-primary-foreground" />
          )}
        </button>
      ))}
    </div>
  );
}