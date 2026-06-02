import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehicleService } from '@/services/vehicle.service';

export function useVehicles(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['vehicles', params],
    queryFn: () => vehicleService.getVehicles(params),
  });

  return {
    vehicles: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useHostVehicles() {
  const query = useQuery({
    queryKey: ['host-vehicles'],
    queryFn: () => vehicleService.getHostVehicles(),
  });

  return {
    vehicles: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useVehicle(id: string) {
  const query = useQuery({
    queryKey: ['vehicle', id],
    queryFn: () => vehicleService.getVehicleById(id),
    enabled: !!id,
  });

  return {
    vehicle: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useVehicleCalendar(id: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['vehicle-calendar', id],
    queryFn: () => vehicleService.getCalendar(id),
    enabled: !!id,
  });

  const addBlockMutation = useMutation({
    mutationFn: (data: { startDate: string; endDate: string; reason?: string }) => 
      vehicleService.addCalendarBlock(id, data.startDate, data.endDate, data.reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-calendar', id] });
    },
  });

  const removeBlockMutation = useMutation({
    mutationFn: (blockId: string) => vehicleService.removeCalendarBlock(id, blockId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-calendar', id] });
    },
  });

  return {
    events: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    addBlock: addBlockMutation.mutateAsync,
    isAddingBlock: addBlockMutation.isPending,
    removeBlock: removeBlockMutation.mutateAsync,
    isRemovingBlock: removeBlockMutation.isPending,
  };
}
