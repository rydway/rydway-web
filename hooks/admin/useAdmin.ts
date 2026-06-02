import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';

export function useAdminDashboard() {
  const query = useQuery({
    queryKey: ['admin-dashboard-summary'],
    queryFn: () => adminService.getDashboardSummary(),
  });

  return {
    summary: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useAdminUsers(params?: Record<string, string>) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['admin-users', params],
    queryFn: () => adminService.getUsers(params),
  });

  const updateUserStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminService.updateUserStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  return {
    users: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    updateUserStatus: updateUserStatusMutation.mutateAsync,
    isUpdatingStatus: updateUserStatusMutation.isPending,
  };
}

export function useAdminKyc(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['admin-kyc', params],
    queryFn: () => adminService.getKycSubmissions(params),
  });

  return {
    kycSubmissions: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useAdminVehicles(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['admin-vehicles', params],
    queryFn: () => adminService.getVehicles(params),
  });

  return {
    vehicles: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useAdminBookings(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['admin-bookings', params],
    queryFn: () => adminService.getBookings(params),
  });

  return {
    bookings: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useAdminPayments(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['admin-payments', params],
    queryFn: () => adminService.getPayments(params),
  });

  return {
    payments: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useAdminAuditLogs(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['admin-audit-logs', params],
    queryFn: () => adminService.getAuditLogs(params),
  });

  return {
    logs: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}
