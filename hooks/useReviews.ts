import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { reviewService } from '@/services/review.service';
import { Review } from '@/types/models';

export function useMyReviews() {
  const query = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => reviewService.getMyReviews(),
  });

  return {
    reviews: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useVehicleReviews(vehicleId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['vehicle-reviews', vehicleId],
    queryFn: () => reviewService.getVehicleReviews(vehicleId),
    enabled: !!vehicleId,
  });

  const submitReviewMutation = useMutation({
    mutationFn: (data: Partial<Review>) => reviewService.submitVehicleReview({ ...data, vehicleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicle-reviews', vehicleId] });
      queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
    },
  });

  return {
    reviews: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    submitReview: submitReviewMutation.mutateAsync,
    isSubmitting: submitReviewMutation.isPending,
  };
}
