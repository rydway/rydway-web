import { useQuery } from '@tanstack/react-query';
import { searchService } from '@/services/search.service';

export function useVehicleSearch(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['search-vehicles', params],
    queryFn: () => searchService.searchVehicles(params),
  });

  return {
    results: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useHostSearch(params?: Record<string, string>) {
  const query = useQuery({
    queryKey: ['search-hosts', params],
    queryFn: () => searchService.searchHosts(params),
  });

  return {
    results: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useSearchFilters() {
  const query = useQuery({
    queryKey: ['search-filters'],
    queryFn: () => searchService.getFilters(),
  });

  return {
    filters: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useAutocomplete(searchQuery: string) {
  const query = useQuery({
    queryKey: ['autocomplete', searchQuery],
    queryFn: () => searchService.getAutocomplete(searchQuery),
    enabled: searchQuery.length > 2, // Only fetch if more than 2 chars
  });

  return {
    suggestions: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}
