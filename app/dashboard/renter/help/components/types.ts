export interface FAQCategory {
  id: string;
  title: string;
  icon: any;
  description: string;
  questions: FAQ[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  related?: string[];
  views?: number;
  helpful?: number;
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  messages: TicketMessage[];
  orderNumber?: string;
  vehicle?: string;
}

export interface TicketMessage {
  id: string;
  sender: 'user' | 'support';
  senderName: string;
  message: string;
  timestamp: Date;
  attachments?: {
    name: string;
    size: number;
    url: string;
  }[];
}
