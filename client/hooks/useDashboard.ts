import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useCurrentUser } from './useUser';

export function useRenterDashboard() {
  const { user } = useCurrentUser();
  const hasKyc = user?.kycStatus !== 'unsubmitted';

  const query = useQuery({
    queryKey: ['dashboard-renter-summary'],
    queryFn: () => dashboardService.getRenterSummary(),
    enabled: hasKyc,
  });

  return {
    summary: query.data,
    isLoading: query.isLoading && hasKyc,
    error: query.error as Error | null,
  };
}

export function useHostDashboard() {
  const { user } = useCurrentUser();
  const hasKyc = user?.kycStatus !== 'unsubmitted';

  const query = useQuery({
    queryKey: ['dashboard-host-summary'],
    queryFn: () => dashboardService.getHostSummary(),
    enabled: hasKyc,
  });

  return {
    summary: query.data,
    isLoading: query.isLoading && hasKyc,
    error: query.error as Error | null,
  };
}
