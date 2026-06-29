import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/services/user.service';
import { User } from '@/types/models';

export function useCurrentUser() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['current-user'],
    queryFn: () => userService.getMe(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<User>) => userService.updateMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: any) => userService.updatePassword(data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => userService.deleteMe(),
    onSuccess: () => {
      queryClient.clear();
      // Handle logout/redirect if needed
    },
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
    updateUser: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    updatePassword: updatePasswordMutation.mutateAsync,
    isUpdatingPassword: updatePasswordMutation.isPending,
    deleteAccount: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

export function useUser(id: string) {
  const query = useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getUser(id),
    enabled: !!id,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useVendors(page: number = 1, limit: number = 12) {
  const query = useQuery({
    queryKey: ['vendors', page, limit],
    queryFn: () => userService.getVendors(page, limit),
  });

  return {
    vendors: query.data?.data || [],
    meta: query.data?.meta,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}
