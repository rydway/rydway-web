// app/dashboard/business/messages/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ConversationsList, 
  Chat, 
  BUSINESS_TEMPLATES,
  type Conversation,
  type Message,
  type User,
  type BookingContext
} from "@/components/pages/messages/Messaging";
import { Car } from "lucide-react";

// ============ MOCK DATA USING COMPONENT TYPES ============

const currentUser: User = {
  id: "business-1",
  name: "Premium Car Rentals",
  avatar: "/api/placeholder/32/32",
  role: "business"
};

const mockConversations: Conversation[] = [
  {
    id: "conv-1",
    booking: {
      id: "BK-2026-001",
      carName: "Toyota Camry 2023",
      status: "active",
      type: "self-drive"
    },
    otherParty: {
      id: "user-1",
      name: "John Doe",
      avatar: "/api/placeholder/32/32",
      role: "renter"
    },
    lastMessage: {
      text: "Payment sent. Transaction ID: TRX-001",
      timestamp: new Date(2026, 2, 15, 11, 23),
      senderId: "user-1"
    },
    unreadCount: 2,
    updatedAt: new Date(2026, 2, 15, 11, 23)
  },
  {
    id: "conv-2",
    booking: {
      id: "BK-2026-002",
      carName: "Mercedes GLE 350",
      status: "active",
      type: "with-driver"
    },
    otherParty: {
      id: "user-2",
      name: "Sarah Smith",
      avatar: "/api/placeholder/32/32",
      role: "renter"
    },
    lastMessage: {
      text: "Driver will arrive at 9:00 AM tomorrow",
      timestamp: new Date(2026, 2, 15, 9, 15),
      senderId: "business-1"
    },
    unreadCount: 0,
    updatedAt: new Date(2026, 2, 15, 9, 15)
  },
  {
    id: "conv-3",
    booking: {
      id: "BK-2026-003",
      carName: "BMW 3 Series",
      status: "active",
      type: "self-drive"
    },
    otherParty: {
      id: "user-3",
      name: "Mike Johnson",
      avatar: "/api/placeholder/32/32",
      role: "renter"
    },
    lastMessage: {
      text: "Contract attached. Please review and sign.",
      timestamp: new Date(2026, 2, 14, 18, 42),
      senderId: "business-1"
    },
    unreadCount: 1,
    updatedAt: new Date(2026, 2, 14, 18, 42)
  },
  {
    id: "conv-4",
    booking: {
      id: "BK-2026-004",
      carName: "Ford Explorer",
      status: "completed",
      type: "with-driver"
    },
    otherParty: {
      id: "user-4",
      name: "Emma Thompson",
      avatar: "/api/placeholder/32/32",
      role: "renter"
    },
    lastMessage: {
      text: "Thank you for renting with us!",
      timestamp: new Date(2026, 2, 13, 14, 20),
      senderId: "business-1"
    },
    unreadCount: 0,
    updatedAt: new Date(2026, 2, 13, 14, 20)
  },
  {
    id: "conv-5",
    booking: {
      id: "BK-2026-005",
      carName: "Toyota Hilux",
      status: "active",
      type: "self-drive"
    },
    otherParty: {
      id: "user-5",
      name: "David Williams",
      avatar: "/api/placeholder/32/32",
      role: "renter"
    },
    lastMessage: {
      text: "Issue with vehicle - dashboard warning light",
      timestamp: new Date(2026, 2, 12, 10, 5),
      senderId: "user-5"
    },
    unreadCount: 0,
    updatedAt: new Date(2026, 2, 12, 10, 5)
  }
];

const mockMessages: Record<string, Message[]> = {
  "conv-1": [
    {
      id: "msg-1",
      senderId: "user-1",
      text: "Hi, I'd like to book the Toyota Camry for March 15-20.",
      timestamp: new Date(2026, 2, 15, 9, 30),
      status: "sent",
      type: "user"
    },
    {
      id: "msg-2",
      senderId: "business-1",
      text: "Booking confirmed.",
      timestamp: new Date(2026, 2, 15, 9, 45),
      status: "sent",
      type: "template"
    },
    {
      id: "msg-3",
      senderId: "system",
      text: "💰 Payment received",
      timestamp: new Date(2026, 2, 15, 10, 0),
      status: "sent",
      type: "system"
    },
    {
      id: "msg-4",
      senderId: "business-1",
      text: "Contract attached.",
      timestamp: new Date(2026, 2, 15, 10, 15),
      status: "sent",
      type: "template",
      attachments: [
        {
          id: "att-1",
          type: "pdf",
          url: "#",
          name: "rental-contract-toyota-camry.pdf",
          size: 450000
        }
      ]
    },
    {
      id: "msg-5",
      senderId: "user-1",
      text: "Payment sent.",
      timestamp: new Date(2026, 2, 15, 11, 23),
      status: "sent",
      type: "template"
    }
  ],
  "conv-2": [
    {
      id: "msg-6",
      senderId: "user-2",
      text: "Hello, I need to confirm the driver for tomorrow.",
      timestamp: new Date(2026, 2, 15, 8, 45),
      status: "sent",
      type: "user"
    },
    {
      id: "msg-7",
      senderId: "business-1",
      text: "Driver assigned. Will arrive at 9:00 AM.",
      timestamp: new Date(2026, 2, 15, 9, 15),
      status: "sent",
      type: "template"
    }
  ],
  "conv-3": [
    {
      id: "msg-8",
      senderId: "user-3",
      text: "Ready to proceed with the booking.",
      timestamp: new Date(2026, 2, 14, 17, 30),
      status: "sent",
      type: "user"
    },
    {
      id: "msg-9",
      senderId: "business-1",
      text: "Contract attached.",
      timestamp: new Date(2026, 2, 14, 18, 42),
      status: "sent",
      type: "template",
      attachments: [
        {
          id: "att-2",
          type: "pdf",
          url: "#",
          name: "bmw-3series-contract.pdf",
          size: 380000
        }
      ]
    }
  ],
  "conv-4": [
    {
      id: "msg-10",
      senderId: "system",
      text: "✓ Booking confirmed",
      timestamp: new Date(2026, 2, 10, 11, 0),
      status: "sent",
      type: "system"
    },
    {
      id: "msg-11",
      senderId: "system",
      text: "🏁 Car returned",
      timestamp: new Date(2026, 2, 13, 14, 20),
      status: "sent",
      type: "system"
    }
  ],
  "conv-5": [
    {
      id: "msg-12",
      senderId: "user-5",
      text: "There's a warning light on the dashboard.",
      timestamp: new Date(2026, 2, 12, 9, 30),
      status: "sent",
      type: "user"
    },
    {
      id: "msg-13",
      senderId: "business-1",
      text: "Please send damage photos.",
      timestamp: new Date(2026, 2, 12, 10, 5),
      status: "sent",
      type: "template",
      attachments: [
        {
          id: "att-3",
          type: "image",
          url: "/api/placeholder/400/300",
          name: "dashboard-warning.jpg",
          size: 1200000
        }
      ]
    }
  ]
};

// ============ MAIN PAGE COMPONENT ============

export default function BusinessMessagesPage() {
  const [conversations, setConversations] = useState<Conversation[]>(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [showMobileChat, setShowMobileChat] = useState(false);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      setMessages(mockMessages[selectedConversation.id] || []);
      
      // Mark as read
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation.id 
          ? { ...conv, unreadCount: 0 } 
          : conv
      ));
    }
  }, [selectedConversation]);

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setShowMobileChat(true);
  };

  const handleSendMessage = (text: string, attachments?: File[]) => {
    if (!selectedConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      text,
      timestamp: new Date(),
      status: "sent",
      type: "user",
      attachments: attachments?.map((file, index) => ({
        id: `att-${Date.now()}-${index}`,
        type: file.type.startsWith('image/') ? 'image' : 'pdf',
        url: URL.createObjectURL(file),
        name: file.name,
        size: file.size
      }))
    };

    setMessages(prev => [...prev, newMessage]);

    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation.id
        ? {
            ...conv,
            lastMessage: {
              text: newMessage.text,
              timestamp: newMessage.timestamp,
              senderId: currentUser.id
            },
            updatedAt: newMessage.timestamp
          }
        : conv
    ));
  };

  const handleBack = () => {
    setShowMobileChat(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Page Header */}
      <div className="shrink-0 pb-2 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 font-primary">
              Messages
            </h1>
            <p className="text-sm text-slate-500 font-secondary">
              Manage booking conversations with renters
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md font-primary">
              {conversations.filter(c => c.unreadCount > 0).length} unread
            </span>
          </div>
        </div>
      </div>

      {/* Main Messaging Interface */}
      <Card className="flex-1 border-slate-200 shadow-sm overflow-hidden bg-white">
        <div className="flex h-full">
          {/* Conversations List - Left Panel */}
          <div className={`w-full lg:w-80 h-full border-r border-slate-200 ${
            showMobileChat ? 'hidden lg:block' : 'block'
          }`}>
            <ConversationsList
              conversations={conversations}
              currentUserId={currentUser.id}
              selectedId={selectedConversation?.id}
              onSelect={handleSelectConversation}
            />
          </div>

          {/* Chat Area - Right Panel */}
          <div className={`flex-1 h-full ${
            showMobileChat ? 'block' : 'hidden lg:block'
          }`}>
            {selectedConversation ? (
              <Chat
                conversation={selectedConversation}
                messages={messages}
                currentUser={currentUser}
                onSendMessage={handleSendMessage}
                onBack={handleBack}
                templates={BUSINESS_TEMPLATES}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                  <Car className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-base font-medium text-slate-700 mb-2">
                  No conversation selected
                </h3>
                <p className="text-sm text-slate-500 max-w-sm">
                  Choose a conversation from the list to start messaging with renters
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}