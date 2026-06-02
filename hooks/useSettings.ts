import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsService } from '@/services/settings.service';

export function useSettings() {
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: ['settings-profile'],
    queryFn: () => settingsService.getProfileSettings(),
  });

  const notificationsQuery = useQuery({
    queryKey: ['settings-notifications'],
    queryFn: () => settingsService.getNotificationSettings(),
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: any) => settingsService.updateProfileSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-profile'] });
    },
  });

  const updateNotificationsMutation = useMutation({
    mutationFn: (data: any) => settingsService.updateNotificationSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings-notifications'] });
    },
  });

  const updateSecurityMutation = useMutation({
    mutationFn: (data: any) => settingsService.updateSecuritySettings(data),
  });

  return {
    profileSettings: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    notificationSettings: notificationsQuery.data,
    isNotificationsLoading: notificationsQuery.isLoading,
    
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    
    updateNotifications: updateNotificationsMutation.mutateAsync,
    isUpdatingNotifications: updateNotificationsMutation.isPending,
    
    updateSecurity: updateSecurityMutation.mutateAsync,
    isUpdatingSecurity: updateSecurityMutation.isPending,
  };
}
