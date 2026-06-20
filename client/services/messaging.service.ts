import { api } from '@/lib/api/client';
import { Conversation, Message } from '@/types/models';

export const messagingService = {
  async getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('/conversations');
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return api.get<Message[]>(`/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, body: string, attachmentUrl?: string): Promise<Message> {
    return api.post<Message>(`/conversations/messages`, {
      conversationId,
      body,
      attachmentUrl,
    });
  },

  async markAsRead(conversationId: string): Promise<void> {
    return api.post<void>(`/conversations/${conversationId}/read`, {});
  },

  async createConversation(data: { vehicleId: string; hostUserId: string; initialMessage: string; bookingId?: string }): Promise<Conversation> {
    return api.post<Conversation>('/conversations', data);
  },
};
