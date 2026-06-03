import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { messagingService } from '@/services/messaging.service';
import { Message, Conversation } from '@/types/models';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export function useConversations() {
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingService.getConversations(),
  });

  return {
    conversations: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    refetch: query.refetch,
  };
}

export function useMessaging(conversationId?: string) {
  const queryClient = useQueryClient();
  const socketRef = useRef<Socket | null>(null);

  // Fetch messages via REST
  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagingService.getMessages(conversationId!),
    enabled: !!conversationId,
  });

  // Setup WebSocket connection
  useEffect(() => {
    if (!conversationId) return;

    const token = localStorage.getItem('rydway_token');
    
    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      path: '/socket.io',
      auth: { token },
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    // Join the conversation room
    socket.emit('joinConversation', { conversationId });

    // Listen for new messages
    socket.on('newMessage', (message: Message) => {
      // Optimistically update the react-query cache
      queryClient.setQueryData(['messages', conversationId], (oldMessages: Message[] | undefined) => {
        if (!oldMessages) return [message];
        // Prevent duplicates
        if (oldMessages.some(m => m.id === message.id)) return oldMessages;
        return [...oldMessages, message];
      });
      
      // Also invalidate conversations list to update latest message preview
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    });

    return () => {
      socket.emit('leaveConversation', { conversationId });
      socket.disconnect();
    };
  }, [conversationId, queryClient]);

  // Send message mutation (REST fallback/primary)
  const sendMessageMutation = useMutation({
    mutationFn: ({ body, attachmentUrl }: { body: string; attachmentUrl?: string }) => {
      if (!conversationId) throw new Error("No conversation selected");
      return messagingService.sendMessage(conversationId, body, attachmentUrl);
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(['messages', conversationId], (oldMessages: Message[] | undefined) => {
        if (!oldMessages) return [newMessage];
        if (oldMessages.some(m => m.id === newMessage.id)) return oldMessages;
        return [...oldMessages, newMessage];
      });
    },
  });

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    sendMessage: sendMessageMutation.mutateAsync,
    isSending: sendMessageMutation.isPending,
  };
}
