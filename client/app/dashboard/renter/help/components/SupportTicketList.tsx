"use client";

import { ChevronRight, Car, Clock, MessageCircle, Receipt } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { SupportTicket } from "./types";

interface SupportTicketListProps {
  tickets: SupportTicket[];
  onSelectTicket: (ticket: SupportTicket) => void;
}

export function SupportTicketList({ 
  tickets, 
  onSelectTicket 
}: SupportTicketListProps) {
  const getStatusBadge = (status: SupportTicket['status']) => {
    switch (status) {
      case 'open':
        return <Badge variant="blue" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Open</Badge>;
      case 'in-progress':
        return <Badge variant="amber" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">In Progress</Badge>;
      case 'resolved':
        return <Badge variant="green" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Resolved</Badge>;
      case 'closed':
        return <Badge variant="slate" className="bg-muted/50 text-foreground border-border">Closed</Badge>;
    }
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    switch (priority) {
      case 'low':
        return <Badge variant="slate" className="bg-muted/50 text-muted-foreground border-border">Low</Badge>;
      case 'medium':
        return <Badge variant="blue" className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Medium</Badge>;
      case 'high':
        return <Badge variant="amber" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">High</Badge>;
      case 'urgent':
        return <Badge variant="red" className="bg-destructive/10 text-destructive dark:text-red-400 border-destructive/20">Urgent</Badge>;
    }
  };

  return (
    <div className="space-y-3 font-secondary">
      {tickets.length > 0 ? (
        tickets.map((ticket) => (
          <div
            key={ticket.id}
            className="p-4 bg-white border border-border rounded-lg hover:border-blue-500/20 hover:shadow-sm transition-all cursor-pointer"
            onClick={() => onSelectTicket(ticket)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">{ticket.subject}</span>
                  {getStatusBadge(ticket.status)}
                  {getPriorityBadge(ticket.priority)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Ticket #{ticket.id} • {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
              {ticket.vehicle && (
                <span className="flex items-center gap-1">
                  <Car className="h-3.5 w-3.5" />
                  {ticket.vehicle}
                </span>
              )}
              {ticket.orderNumber && (
                <span className="flex items-center gap-1">
                  <Receipt className="h-3.5 w-3.5" />
                  {ticket.orderNumber}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Updated {formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-sm font-medium text-foreground mb-2">No support tickets</h3>
          <p className="text-xs text-muted-foreground">You haven't created any support tickets yet.</p>
        </div>
      )}
    </div>
  );
}
