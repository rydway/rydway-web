// app/dashboard/renter/messages/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ConversationsList, 
  Chat, 
  RENTER_TEMPLATES,
  type Conversation,
  type Message,
  type User,
  type BookingContext
} from "@/components/pages/messages/Messaging";
import { Car } from "lucide-react";



// ============ MAIN PAGE COMPONENT ============
import { useConversations, useMessaging } from "@/hooks/useMessaging";
import { useCurrentUser } from "@/hooks/useUser";

export default function RenterMessagesPage() {
  const { conversations, isLoading: isLoadingConversations } = useConversations();
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const { messages, isLoading: isLoadingMessages, sendMessage } = useMessaging(selectedConversation?.id);
  const { user } = useCurrentUser();

  const currentUser: User = {
    id: user?.id || "renter-1",
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "Renter",
    avatar: user?.profileImageUrl || "/api/placeholder/32/32",
    role: "renter"
  };

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const handleSendMessage = async (text: string, attachments?: File[]) => {
    if (!selectedConversation) return;

    // Logic to upload attachments could be handled inside useMessaging or here
    // For now, we'll just send the text
    await sendMessage({ body: text, attachmentUrl: attachments?.[0]?.name });
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  const mappedConversations: Conversation[] = conversations.map((c: any) => ({
    id: c.id,
    otherParty: {
      id: c.host?.id || "unknown",
      name: c.host?.firstName ? `${c.host.firstName} ${c.host.lastName}` : "Business",
      avatar: c.host?.profileImageUrl || "/api/placeholder/32/32",
      role: "business"
    },
    booking: {
      id: c.bookingId || "no-booking",
      carName: c.vehicle?.name || "Vehicle",
      status: "active",
      type: "self-drive"
    },
    lastMessage: {
      id: c.messages?.[0]?.id || "none",
      senderId: c.messages?.[0]?.senderId || "none",
      text: c.messages?.[0]?.body || "No messages yet",
      timestamp: new Date(c.messages?.[0]?.createdAt || c.updatedAt),
      status: "sent",
      type: "user"
    },
    unreadCount: c.messages?.filter((m: any) => !m.isRead && m.senderId !== currentUser.id).length || 0,
    updatedAt: new Date(c.updatedAt || Date.now())
  }));

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="shrink-0 pb-2 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground font-primary">
              My Messages
            </h1>
            <p className="text-sm text-muted-foreground font-secondary">
              Communicate with car rental businesses
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-muted px-3 py-1.5 rounded-md font-primary">
              {mappedConversations.reduce((acc, c) => acc + c.unreadCount, 0)} unread
            </span>
          </div>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <Card className="flex-1 border-border shadow-sm overflow-hidden bg-white">
        <div className="flex h-full">
          {/* Conversations List - Left Panel */}
          <div className={`w-full lg:w-80 h-full border-r border-border ${
            showMobileChat ? 'hidden lg:block' : 'block'
          }`}>
            {isLoadingConversations ? (
              <div className="flex justify-center p-8"><Car className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : mappedConversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground h-full">
                <p>No conversations yet.</p>
              </div>
            ) : (
              <ConversationsList
                conversations={mappedConversations}
                currentUserId={currentUser.id}
                selectedId={selectedConversation?.id}
                onSelect={handleSelectConversation}
              />
            )}
          </div>

          {/* Chat Area - Right Panel */}
          <div className={`flex-1 h-full ${
            showMobileChat ? 'block' : 'hidden lg:block'
          }`}>
            {selectedConversation ? (
              isLoadingMessages ? (
                <div className="flex h-full items-center justify-center"><Car className="h-8 w-8 animate-spin text-muted-foreground" /></div>
              ) : (
                <Chat
                  conversation={selectedConversation}
                  messages={messages as any} // Ensure types match
                  currentUser={currentUser}
                  onSendMessage={handleSendMessage}
                  onBack={handleBack}
                  templates={RENTER_TEMPLATES}
                />
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Car className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-base font-medium text-foreground mb-2">
                  No conversation selected
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select a conversation from the list to message car rental businesses
                </p>
                <Button className="mt-4 bg-primary hover:bg-primary/90 text-sm text-primary-foreground">
                  Browse available cars
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}