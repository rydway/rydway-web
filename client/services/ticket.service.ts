import { api } from '@/lib/api/client';

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  messages?: TicketMessage[];
}

export interface TicketMessage {
  id: string;
  body: string;
  senderId: string;
  createdAt: string;
}

export const ticketService = {
  getTickets: async (): Promise<Ticket[]> => {
    return api.get<Ticket[]>('/tickets');
  },

  getTicket: async (id: string): Promise<Ticket> => {
    return api.get<Ticket>(`/tickets/${id}`);
  },

  createTicket: async (data: { subject: string; category: string; message: string }): Promise<Ticket> => {
    return api.post<Ticket>('/tickets', data);
  },

  replyTicket: async (id: string, body: string): Promise<TicketMessage> => {
    return api.post<TicketMessage>(`/tickets/${id}/messages`, { body });
  }
};
