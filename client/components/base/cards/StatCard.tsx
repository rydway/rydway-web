import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  trendUp: boolean;
  className?: string;
  iconClassName?: string; // Added for custom icon colors
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  trendUp, 
  className,
  iconClassName
}: StatCardProps) {
  return (
    <Card className={cn(
      " dark:border-border  hover:shadow-md transition-all duration-200 font-primary",
      className
    )}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground dark:text-muted-foreground font-secondary">
              {title}
            </p>
            <p className="text-xl font-semibold text-foreground dark:text-white font-primary">
              {value}
            </p>
            <p className={cn(
              "text-xs font-secondary",
              trendUp ? 'text-primary dark:text-primary/90' : 'text-secondary dark:text-secondary/90'
            )}>
              {trendUp ? '↗' : '→'} {trend}
            </p>
          </div>
          <div className={cn(
            "p-2.5 rounded-lg",
            "bg-primary/10 dark:bg-primary/20"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              "text-primary dark:text-primary/90"
            )} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}