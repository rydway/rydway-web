import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function CustomPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  className
}: CustomPaginationProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pageNumbers.push(i);
    } else if (
      i === currentPage - 2 ||
      i === currentPage + 2
    ) {
      pageNumbers.push('...');
    }
  }

  // Remove duplicates and maintain order
  const uniquePageNumbers = [...new Set(pageNumbers)];

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      {/* Items info */}
      <div className="text-sm text-slate-600 dark:text-slate-400 font-secondary">
        Showing <span className="font-semibold text-slate-800 dark:text-white font-primary">{startItem}-{endItem}</span> of{" "}
        <span className="font-semibold text-slate-800 dark:text-white font-primary">{totalItems}</span> bookings
      </div>

      {/* Pagination controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            "h-8 w-8 p-0 border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:border-primary/50 dark:hover:bg-primary/10",
            "text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary",
            "font-primary transition-colors duration-200"
          )}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {uniquePageNumbers.map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className="px-2 text-slate-400 font-secondary"
            >
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={cn(
                "h-8 w-8 p-0 text-sm font-primary transition-colors duration-200",
                currentPage === page 
                  ? "bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-sm" 
                  : "border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:border-primary/50 dark:hover:bg-primary/10 text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary"
              )}
            >
              {page}
            </Button>
          )
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            "h-8 w-8 p-0 border-slate-300 dark:border-slate-700 hover:border-primary/50 hover:bg-primary/5 dark:hover:border-primary/50 dark:hover:bg-primary/10",
            "text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-primary",
            "font-primary transition-colors duration-200"
          )}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}