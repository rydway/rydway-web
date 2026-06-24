"use client";

import { useState } from "react";
import { Send, Paperclip } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SupportTicket } from "./types";

interface TicketDetailsDialogProps {
  ticket: SupportTicket | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReply: (ticketId: string, message: string) => void;
}

export function TicketDetailsDialog({ 
  ticket, 
  open, 
  onOpenChange,
  onReply 
}: TicketDetailsDialogProps) {
  const [replyMessage, setReplyMessage] = useState("");

  if (!ticket) return null;

  const getStatusColor = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'in-progress': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'resolved': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      case 'closed': return 'bg-muted/50 text-foreground border-border';
    }
  };

  const handleSendReply = () => {
    if (replyMessage.trim()) {
      onReply(ticket.id, replyMessage);
      setReplyMessage("");
    }
  };

  // Helper function for date formatting
  const formatTime = (dateVal: Date) => {
    const date = new Date(dateVal);
    const hour = date.getHours();
    const minute = date.getMinutes().toString().padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute} ${ampm}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] font-secondary">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-primary text-lg">
              Ticket #{ticket.id}
            </DialogTitle>
            <Badge className={getStatusColor(ticket.status)}>
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </Badge>
          </div>
          <DialogDescription className="font-secondary text-sm text-muted-foreground">
            {ticket.subject}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4 py-2">
            {ticket.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold">
                      {msg.senderName}
                    </span>
                    <span className="text-[10px] opacity-70">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                  {msg.attachments && msg.attachments.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      {msg.attachments.map((att) => (
                        <div key={att.name} className="flex items-center gap-2 text-xs">
                          <Paperclip className="h-3 w-3" />
                          {att.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {ticket.status !== 'closed' && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                placeholder="Type your reply..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <Button 
                className="self-end bg-primary hover:bg-primary/90 text-primary-foreground"
                size="sm"
                onClick={handleSendReply}
                disabled={!replyMessage.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
