import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ticketService } from '@/services/ticket.service';

export function useTickets() {
  const query = useQuery({
    queryKey: ['tickets'],
    queryFn: () => ticketService.getTickets(),
  });

  return {
    tickets: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useTicket(id: string) {
  const query = useQuery({
    queryKey: ['ticket', id],
    queryFn: () => ticketService.getTicket(id),
    enabled: !!id,
  });

  return {
    ticket: query.data,
    isLoading: query.isLoading,
    error: query.error as Error | null,
  };
}

export function useCreateTicket() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ticketService.createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}

export function useReplyTicket(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: string) => ticketService.replyTicket(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ticket', id] });
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    },
  });
}
