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

export function useVendors() {
  const query = useQuery({
    queryKey: ['vendors'],
    queryFn: () => userService.getVendors(),
  });

  return {
    vendors: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}
