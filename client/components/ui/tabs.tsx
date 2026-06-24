"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("w-full", className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  "inline-flex items-center justify-center text-muted-foreground",
  {
    variants: {
      variant: {
        default: "bg-muted rounded-lg p-1",
        underline: "border-b border-slate-200 dark:border-border",
      },
    },
    defaultVariants: {
      variant: "underline",
    },
  }
)

function TabsList({
  className,
  variant = "underline",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
        "data-[state=active]:text-primary data-[state=active]:font-semibold dark:data-[state=active]:text-primary/90",
        "data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50",
        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary dark:after:bg-primary/90 after:opacity-0 after:transition-opacity",
        "data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 justify-center">
        {children}
      </span>
    </TabsPrimitive.Trigger>
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    />
  )
}

// Optional: Custom component for tabs with count badges
interface TabWithCount {
  id: string
  label: string
  count?: number
}

interface CountBadgeProps {
  count: number
  isActive?: boolean
  className?: string
}

function CountBadge({ count, isActive = false, className }: CountBadgeProps) {
  return (
    <span
      className={cn(
        "h-5 min-w-5 flex items-center justify-center text-xs rounded-full px-1 transition-colors duration-200 font-medium",
        isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary/90"
          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
        className
      )}
    >
      {count}
    </span>
  )
}

// Enhanced TabsTrigger with centered content
function CenteredTabsTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "inline-flex items-center justify-center px-4 py-3 text-sm font-medium transition-all duration-200 relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 w-full min-w-0",
        "data-[state=active]:text-primary data-[state=active]:font-semibold dark:data-[state=active]:text-primary/90",
        "data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400 hover:text-slate-900 dark:hover:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50",
        "after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary dark:after:bg-primary/90 after:opacity-0 after:transition-opacity",
        "data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    >
      <span className="flex items-center gap-2 justify-center w-full">
        {children}
      </span>
    </TabsPrimitive.Trigger>
  )
}

// Example usage component with centered tabs
interface TabItem {
  id: string
  label: string
  count?: number
  content?: React.ReactNode
}

interface TabDemoProps {
  tabs: TabItem[]
  defaultValue?: string
  className?: string
}

function TabDemo({ tabs, defaultValue, className }: TabDemoProps) {
  return (
    <Tabs defaultValue={defaultValue || tabs[0]?.id} className={className}>
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <CenteredTabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
            {tab.count !== undefined && (
              <CountBadge 
                count={tab.count} 
                isActive={tab.id === defaultValue || tabs[0]?.id === tab.id}
              />
            )}
          </CenteredTabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  )
}

export { 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  CenteredTabsTrigger,
  TabsContent, 
  tabsListVariants,
  CountBadge,
  TabDemo 
}

export type { TabWithCount, TabItem, TabDemoProps }