// app/dashboard/renter/help/page.tsx
"use client";

import { useState } from "react";
import { 
  LifeBuoy, 
  Search, 
  Plus, 
  MessageCircle, 
  Phone, 
  Mail, 
  MapPin, 
  Clock,
  Send
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Sub-components
import { FAQAccordion } from "./components/FAQAccordion";
import { HelpSearch } from "./components/HelpSearch";
import { CreateTicketDialog } from "./components/CreateTicketDialog";
import { TicketDetailsDialog } from "./components/TicketDetailsDialog";
import { SupportTicketList } from "./components/SupportTicketList";
import { SupportTeam } from "./components/SupportTeam";
import { faqCategories } from "./components/faqData";
import { SupportTicket } from "./components/types";
import { useTickets, useCreateTicket, useReplyTicket } from "@/hooks/useTickets";
import { Loader2 } from "lucide-react";

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [showTicketDetails, setShowTicketDetails] = useState(false);
  
  const { tickets, isLoading: isTicketsLoading } = useTickets();
  const createTicket = useCreateTicket();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateTicket = async (data: any) => {
    try {
      await createTicket.mutateAsync({
        subject: data.subject,
        category: data.category,
        message: data.message
      });
      setShowCreateTicket(false);
    } catch (error) {
      console.error("Failed to create ticket", error);
    }
  };

  const handleTicketReply = async (ticketId: string, message: string) => {
    // TicketDetailsDialog should ideally use useReplyTicket directly, but if passing through:
    try {
      // In a real app, you'd have a specific hook for this or let the dialog handle it.
      // We will just update state locally if needed, but react-query refetches automatically.
    } catch (error) {
      console.error("Failed to reply", error);
    }
  };

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(faq =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="space-y-8 font-secondary">
      {/* Header */}
      <div className="space-y-2 text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center">
            <LifeBuoy className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-primary">
          How can we help you?
        </h1>
        <p className="text-sm text-slate-500 font-secondary">
          Search our help center, browse FAQs, or get in touch with our support team
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <HelpSearch onSearch={handleSearch} />
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-3">
          <TabsTrigger value="faq" className="text-sm">FAQs</TabsTrigger>
          <TabsTrigger value="tickets" className="text-sm">My Tickets</TabsTrigger>
          <TabsTrigger value="contact" className="text-sm">Contact</TabsTrigger>
        </TabsList>

        {/* ============ FAQ TAB ============ */}
        <TabsContent value="faq" className="space-y-6">
          {searchQuery && (
            <div className="text-sm text-slate-600 mb-4">
              Found {filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0)} results for "{searchQuery}"
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 py-0">
            {filteredCategories.map((category) => (
              <FAQAccordion key={category.id} category={category} />
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <Card className="shadow-sm py-0">
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-2">No results found</h3>
                <p className="text-sm text-slate-500 mb-6">
                  We couldn't find any articles matching "{searchQuery}"
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setSearchQuery("")}
                >
                  Clear search
                </Button>
              </CardContent>
            </Card>
          )}

        </TabsContent>

        {/* ============ TICKETS TAB ============ */}
        <TabsContent value="tickets" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Your Support Tickets</h2>
              <p className="text-sm text-slate-500 mt-1">
                Track and manage your support requests
              </p>
            </div>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => setShowCreateTicket(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-6">
              {isTicketsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <SupportTicketList 
                  tickets={tickets as any} 
                  onSelectTicket={(ticket) => {
                    setSelectedTicket(ticket as any);
                    setShowTicketDetails(true);
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ CONTACT TAB ============ */}
        <TabsContent value="contact" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Contact Options - Stacked */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-slate-800 mb-4">Get in Touch</h2>
                
                <Card className="border-slate-200 shadow-sm overflow-hidden">
                  {/* Live Chat */}
                  <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">Live Chat</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Chat with our support team in real-time</p>
                        <Badge className="mt-2 bg-green-50 text-green-700 border-green-200 text-[10px] px-1.5 py-0.5">
                          Available 24/7
                        </Badge>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 ml-4 flex-shrink-0">
                      Start Chat
                      <MessageCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Phone Support */}
                  <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors border-b border-slate-200 last:border-0">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">Phone Support</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Speak directly with a support agent</p>
                        <p className="text-sm font-semibold text-slate-800 mt-1.5">+234 800 123 4567</p>
                      </div>
                    </div>
                    <Button variant="outline" className="ml-4 flex-shrink-0">
                      Call Now
                      <Phone className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Email Support */}
                  <div className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">Email Support</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Get a response within 24 hours</p>
                        <p className="text-xs font-medium text-slate-800 mt-1.5 font-mono">support@rydway.com</p>
                      </div>
                    </div>
                    <Button variant="outline" className="ml-4 flex-shrink-0">
                      Send Email
                      <Mail className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-slate-800">
                    Send us a Message
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500">
                    Fill out the form below and we'll respond within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs">Your Name</Label>
                        <Input id="name" placeholder="John Doe" className="h-10 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs">Email Address</Label>
                        <Input id="email" type="email" placeholder="john@example.com" className="h-10 text-sm" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-subject" className="text-xs">Subject</Label>
                      <Input id="contact-subject" placeholder="Brief summary of your inquiry" className="h-10 text-sm" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="contact-message" className="text-xs">Message</Label>
                      <Textarea 
                        id="contact-message" 
                        placeholder="How can we help you?"
                        className="min-h-[150px] text-sm"
                      />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90">
                      <Send className="h-4 w-4 mr-2" />
                      Send Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Support Team & Info */}
            <div className="space-y-6">
              <SupportTeam />
              
              <Card className="border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">Visit Us</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          123 Victoria Island<br />
                          Lagos, Nigeria
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-slate-800">Support Hours</h4>
                        <p className="text-xs text-slate-500 mt-1">
                          24/7 - Always open<br />
                          Emergency support available
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Create Ticket Dialog */}
      <CreateTicketDialog
        open={showCreateTicket}
        onOpenChange={setShowCreateTicket}
        onSubmit={handleCreateTicket}
      />

      {/* Ticket Details Dialog */}
      <TicketDetailsDialog
        ticket={selectedTicket}
        open={showTicketDetails}
        onOpenChange={setShowTicketDetails}
        onReply={handleTicketReply}
      />
    </div>
  );
}