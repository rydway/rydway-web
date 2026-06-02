import { api } from '@/lib/api/client';
import { Conversation, Message } from '@/types/models';

export const messagingService = {
  async getConversations(): Promise<Conversation[]> {
    return api.get<Conversation[]>('/messaging/conversations');
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return api.get<Message[]>(`/messaging/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, body: string, attachmentUrl?: string): Promise<Message> {
    return api.post<Message>(`/messaging/conversations/${conversationId}/messages`, {
      body,
      attachmentUrl,
    });
  },

  async markAsRead(conversationId: string): Promise<void> {
    return api.post<void>(`/messaging/conversations/${conversationId}/read`, {});
  },
};
