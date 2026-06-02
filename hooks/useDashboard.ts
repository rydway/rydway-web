import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';

export function useRenterDashboard() {
  const query = useQuery({
    queryKey: ['dashboard-renter-summary'],
    queryFn: () => dashboardService.getRenterSummary(),
  });

  return {
    summary: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useHostDashboard() {
  const query = useQuery({
    queryKey: ['dashboard-host-summary'],
    queryFn: () => dashboardService.getHostSummary(),
  });

  return {
    summary: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}
