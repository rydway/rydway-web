// components/pages/messages/Messaging.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  ChevronLeft,
  Car,
  Calendar,
  Shield,
  Check,
  AlertCircle,
  FileText,
  Download,
  X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// ============ TYPES (EXPORTED) ============

export interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'renter' | 'business' | 'admin';
}

export interface BookingContext {
  id: string;
  carName: string;
  status: 'active' | 'completed' | 'cancelled';
  type: 'self-drive' | 'with-driver';
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  status: 'sent' | 'failed';
  type: 'user' | 'system' | 'template';
  attachments?: {
    id: string;
    type: 'image' | 'pdf';
    url: string;
    name: string;
    size?: number;
  }[];
}

export interface Conversation {
  id: string;
  booking: BookingContext;
  otherParty: User;
  lastMessage?: {
    text: string;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: number;
  updatedAt: Date;
}

export interface SupportConversation {
  id: string;
  subject: string;
  category: 'Payment' | 'Technical' | 'Dispute';
  status: 'open' | 'resolved';
  updatedAt: Date;
  unreadCount: number;
}

// ============ SYSTEM MESSAGES ============

export const SYSTEM_MESSAGES = {
  booking_confirmed: "✓ Booking confirmed",
  payment_received: "💰 Payment received",
  contract_uploaded: "📄 Contract uploaded",
  booking_cancelled: "✕ Booking cancelled",
  pickup_completed: "🚗 Car picked up",
  return_completed: "🏁 Car returned"
} as const;

// ============ TEMPLATES ============

export const BUSINESS_TEMPLATES = [
  { id: 'confirm_booking', text: 'Booking confirmed.', requiresAttachment: false },
  { id: 'payment_received', text: 'Payment confirmed.', requiresAttachment: false },
  { id: 'share_location', text: 'Pickup location: [address]', requiresAttachment: false },
  { id: 'driver_assigned', text: 'Driver assigned. Will arrive at 9:00 AM.', requiresAttachment: false },
  { id: 'contract_attached', text: 'Contract attached.', requiresAttachment: true, attachmentType: 'pdf' as const },
  { id: 'request_damage_photos', text: 'Please send damage photos.', requiresAttachment: false }
] as const;

export const RENTER_TEMPLATES = [
  { id: 'payment_sent', text: 'Payment sent.', requiresAttachment: false },
  { id: 'running_late', text: 'Running 15 minutes late.', requiresAttachment: false },
  { id: 'need_assistance', text: 'Need assistance.', requiresAttachment: false },
  { id: 'extending_rental', text: 'Would like to extend rental.', requiresAttachment: false },
  { id: 'issue_with_vehicle', text: 'Issue with vehicle.', requiresAttachment: true, attachmentType: 'image' as const }
] as const;

// ============ CONVERSATION LIST COMPONENT ============

interface ConversationsListProps {
  conversations: Conversation[];
  currentUserId: string;
  selectedId?: string;
  onSelect: (conversation: Conversation) => void;
}

export function ConversationsList({ 
  conversations, 
  currentUserId, 
  selectedId, 
  onSelect 
}: ConversationsListProps) {
  return (
    <div className="h-full flex flex-col border-r border-slate-200">
      <div className="p-3 border-b border-slate-200">
        <h2 className="text-sm font-semibold text-slate-700">Messages</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="divide-y divide-slate-100">
          {conversations.map((conv) => {
            const isSelected = conv.id === selectedId;
            
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`w-full px-3 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors text-left
                  ${isSelected ? 'bg-blue-50' : ''}`}
              >
                <Avatar className="h-10 w-10 shrink-0 border border-slate-200">
                  <AvatarImage src={conv.otherParty.avatar} />
                  <AvatarFallback className="bg-slate-100 text-xs">
                    {conv.otherParty.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-800 truncate">
                      {conv.otherParty.name}
                    </span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">
                      {formatDistanceToNow(conv.updatedAt, { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 mt-0.5">
                    <Car className="h-3 w-3 text-slate-400 shrink-0" />
                    <span className="text-[11px] text-slate-600 truncate">
                      {conv.booking.carName}
                    </span>
                  </div>
                  
                  {conv.lastMessage && (
                    <p className="text-xs text-slate-500 truncate mt-1">
                      {conv.lastMessage.senderId === currentUserId ? 'You: ' : ''}
                      {conv.lastMessage.text}
                    </p>
                  )}
                </div>
                
                {conv.unreadCount > 0 && (
                  <span className="min-w-[1.25rem] h-5 flex items-center justify-center bg-blue-500 text-white text-[10px] font-medium rounded-full px-1.5 ml-1">
                    {conv.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// ============ CHAT HEADER ============

interface ChatHeaderProps {
  booking: BookingContext;
  otherParty: User;
  onBack?: () => void;
}

function ChatHeader({ booking, otherParty, onBack }: ChatHeaderProps) {
  const getStatusColor = (status: BookingContext['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700 border-green-200';
      case 'completed': return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white shrink-0">
      {onBack && (
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:hidden" onClick={onBack}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Avatar className="h-10 w-10 border border-slate-200 shrink-0">
        <AvatarImage src={otherParty.avatar} />
        <AvatarFallback className="bg-slate-100 text-slate-700">
          {otherParty.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-slate-800 truncate">
            {otherParty.name}
          </h3>
          <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-50">
            {booking.type === 'with-driver' ? 'With Driver' : 'Self-Drive'}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-600 truncate">
            {booking.carName}
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-500">
            #{booking.id.slice(-6)}
          </span>
          <Badge 
            variant="outline" 
            className={`text-[10px] h-5 px-1.5 ${getStatusColor(booking.status)}`}
          >
            {booking.status}
          </Badge>
        </div>
      </div>
    </div>
  );
}

// ============ MESSAGE BUBBLES ============

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  senderName: string;
}

function MessageBubble({ message, isOwn, senderName }: MessageBubbleProps) {
  // System message
  if (message.type === 'system') {
    return (
      <div className="flex justify-center my-3">
        <div className="px-4 py-2 bg-slate-100 rounded-full">
          <span className="text-xs text-slate-600">{message.text}</span>
        </div>
      </div>
    );
  }

  // User or template message
  return (
    <div className={`flex mb-4 ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${isOwn ? 'order-2' : 'order-1'}`}>
        {!isOwn && (
          <span className="text-[10px] text-slate-500 ml-1 mb-1 block">
            {senderName}
          </span>
        )}
        
        <div
          className={`px-3 py-2 rounded-lg ${
            isOwn 
              ? 'bg-blue-500 text-white' 
              : 'bg-slate-100 text-slate-800'
          }`}
        >
          <p className="text-sm break-words">{message.text}</p>
          
          {/* Attachments */}
          {message.attachments?.map((att) => (
            <div key={att.id} className="mt-2">
              {att.type === 'image' ? (
                <div className="rounded-lg overflow-hidden border border-slate-200">
                  <img 
                    src={att.url} 
                    alt={att.name}
                    className="max-w-full h-auto max-h-48 object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-2 p-2 bg-white/10 rounded border border-slate-200">
                  <FileText className="h-4 w-4 shrink-0" />
                  <span className="text-xs truncate flex-1">{att.name}</span>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className={`flex items-center gap-1 mt-1 text-[10px] text-slate-500 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span>{format(message.timestamp, 'h:mm a')}</span>
          {isOwn && message.status === 'failed' && (
            <span className="flex items-center gap-1 text-red-500">
              <AlertCircle className="h-3 w-3" />
              Failed
            </span>
          )}
          {isOwn && message.status === 'sent' && (
            <Check className="h-3 w-3 text-slate-400" />
          )}
        </div>
      </div>
    </div>
  );
}

// ============ QUICK REPLIES ============

interface QuickRepliesProps {
  templates: readonly any[];
  onSelect: (template: string, requiresAttachment: boolean, attachmentType?: string) => void;
}

function QuickReplies({ templates, onSelect }: QuickRepliesProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="h-8 text-xs border-slate-200"
      >
        Quick Replies
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 mb-2 w-64 bg-white border border-slate-200 rounded-lg shadow-lg z-50 p-2">
            <div className="flex flex-wrap gap-1.5">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelect(template.text, template.requiresAttachment, template.attachmentType);
                    setIsOpen(false);
                  }}
                  className="px-2.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-md border border-slate-200 transition-colors text-left"
                >
                  {template.text}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ============ MESSAGE INPUT ============

interface MessageInputProps {
  onSendMessage: (text: string, attachments?: File[]) => void;
  templates: readonly any[];
  maxFileSize?: number;
}

function MessageInput({ onSendMessage, templates, maxFileSize = 10 }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() || attachments.length > 0) {
      onSendMessage(message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      setError(null);
    }
  };

  const handleFileSelect = (files: FileList | null, type: 'image' | 'pdf') => {
    if (!files) return;
    
    const file = files[0];
    const fileSizeMB = file.size / (1024 * 1024);
    
    if (fileSizeMB > maxFileSize) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      return;
    }
    
    if (type === 'image' && !file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }
    
    if (type === 'pdf' && file.type !== 'application/pdf') {
      setError('Please select a PDF file');
      return;
    }
    
    setAttachments(prev => [...prev, file]);
    setError(null);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleTemplateSelect = (templateText: string, requiresAttachment: boolean, attachmentType?: string) => {
    setMessage(templateText);
    if (requiresAttachment && attachmentType === 'image') {
      imageInputRef.current?.click();
    } else if (requiresAttachment && attachmentType === 'pdf') {
      fileInputRef.current?.click();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white shrink-0">
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {attachments.map((file, index) => (
            <div key={index} className="flex items-center gap-2 px-2 py-1 bg-slate-100 rounded-md text-xs">
              {file.type.startsWith('image/') ? (
                <ImageIcon className="h-3 w-3" />
              ) : (
                <FileText className="h-3 w-3" />
              )}
              <span className="max-w-[150px] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() => removeAttachment(index)}
                className="text-slate-500 hover:text-slate-700"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {error && (
        <div className="mb-3 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <Textarea
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[40px] max-h-[120px] resize-none text-sm border-slate-200"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          
          <div className="absolute right-2 bottom-2 flex items-center gap-1">
            <input
              type="file"
              ref={imageInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files, 'image')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => imageInputRef.current?.click()}
            >
              <ImageIcon className="h-4 w-4 text-slate-500" />
            </Button>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={(e) => handleFileSelect(e.target.files, 'pdf')}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0"
              onClick={() => fileInputRef.current?.click()}
            >
              <Paperclip className="h-4 w-4 text-slate-500" />
            </Button>
          </div>
        </div>
        
        <QuickReplies 
          templates={templates} 
          onSelect={handleTemplateSelect}
        />
        
        <Button 
          type="submit" 
          size="sm" 
          className="h-9 px-3 bg-blue-600 hover:bg-blue-700 text-white shrink-0"
          disabled={!message.trim() && attachments.length === 0}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}

// ============ MAIN CHAT COMPONENT ============

export interface ChatProps {
  conversation: Conversation;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string, attachments?: File[]) => void;
  onBack?: () => void;
  templates: readonly any[];
}

export function Chat({ 
  conversation, 
  messages, 
  currentUser, 
  onSendMessage, 
  onBack,
  templates 
}: ChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const otherParty = conversation.otherParty;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader 
        booking={conversation.booking} 
        otherParty={otherParty}
        onBack={onBack}
      />
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser.id}
              senderName={message.senderId === currentUser.id ? 'You' : otherParty.name}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <MessageInput 
        onSendMessage={onSendMessage}
        templates={templates}
      />
    </div>
  );
}

// ============ SUPPORT CHAT COMPONENT ============

export interface SupportChatProps {
  conversation: SupportConversation;
  messages: Message[];
  currentUser: User;
  onSendMessage: (text: string, attachments?: File[]) => void;
  onBack?: () => void;
}

export function SupportChat({ 
  conversation, 
  messages, 
  currentUser, 
  onSendMessage, 
  onBack 
}: SupportChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center gap-3 p-4 border-b border-slate-200 bg-white shrink-0">
        {onBack && (
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 lg:hidden" onClick={onBack}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-800 truncate">
              {conversation.subject}
            </h3>
            <Badge variant="outline" className="text-[10px] h-5 px-1.5 bg-slate-50">
              {conversation.category}
            </Badge>
          </div>
          <span className="text-xs text-slate-500">
            Support conversation
          </span>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isOwn={message.senderId === currentUser.id}
              senderName={message.senderId === currentUser.id ? 'You' : 'Support Agent'}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <MessageInput 
        onSendMessage={onSendMessage}
        templates={[]}
      />
    </div>
  );
}