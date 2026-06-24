// app/dashboard/business/help/page.tsx
"use client";

import { useState } from "react";
import {
  Headphones,
  Search,
  Plus,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  Building2,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Shared sub-components from renter help (re-useable)
import { FAQAccordion } from "../../renter/help/components/FAQAccordion";
import { HelpSearch } from "../../renter/help/components/HelpSearch";
import { CreateTicketDialog } from "../../renter/help/components/CreateTicketDialog";
import { TicketDetailsDialog } from "../../renter/help/components/TicketDetailsDialog";
import { SupportTicketList } from "../../renter/help/components/SupportTicketList";
import { SupportTicket } from "../../renter/help/components/types";
import { businessFaqCategories } from "./components/faqData";
import { useTickets, useCreateTicket } from "@/hooks/useTickets";
import { Loader2 } from "lucide-react";

export default function BusinessHelpPage() {
  const [activeTab, setActiveTab] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
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
        message: data.message,
      });
      setShowCreateTicket(false);
    } catch (error) {
      console.error("Failed to create ticket", error);
    }
  };

  const handleTicketReply = async (ticketId: string, message: string) => {
    // Handled internally by TicketDetailsDialog
  };

  const filteredCategories = businessFaqCategories
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="space-y-8 font-secondary">
      {/* Header */}
      <div className="space-y-2 text-center max-w-3xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary-foreground">
            <Headphones className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground font-primary">
          Business Partner Support
        </h1>
        <p className="text-sm text-muted-foreground font-secondary">
          Dedicated support for Rydway business partners — fleet management, payouts, and compliance
        </p>

        {/* Business-specific quick info badges */}
        <div className="flex items-center justify-center gap-3 mt-4 flex-wrap">
          <Badge variant="outline" className="gap-1.5 py-1 px-3 text-xs border-primary/30 text-primary">
            <Building2 className="h-3 w-3" />
            Business Account
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1 px-3 text-xs border-green-300 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            Priority Support
          </Badge>
          <Badge variant="outline" className="gap-1.5 py-1 px-3 text-xs border-amber-300 text-amber-600 dark:text-amber-400">
            <DollarSign className="h-3 w-3" />
            Revenue & Payouts Help
          </Badge>
        </div>
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
            <div className="text-sm text-muted-foreground mb-4">
              Found {filteredCategories.reduce((acc, cat) => acc + cat.questions.length, 0)} results for &ldquo;{searchQuery}&rdquo;
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
                <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
                <p className="text-sm text-muted-foreground mb-6">
                  We couldn&apos;t find any articles matching &ldquo;{searchQuery}&rdquo;
                </p>
                <Button variant="outline" onClick={() => setSearchQuery("")}>
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
              <h2 className="text-lg font-semibold text-foreground">Your Support Tickets</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Track and manage your business support requests
              </p>
            </div>
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setShowCreateTicket(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ticket
            </Button>
          </div>

          <Card className="border-border shadow-sm">
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
            {/* Contact Options */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-1">Business Partner Hotline</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  As a business partner, you have access to our dedicated fleet support team.
                </p>

                <Card className="border-border shadow-sm overflow-hidden">
                  {/* Priority Chat */}
                  <div className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-foreground">
                        <MessageCircle className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Priority Live Chat</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Dedicated business support line — skip the queue</p>
                        <Badge className="mt-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px] px-1.5 py-0.5">
                          Business Priority
                        </Badge>
                      </div>
                    </div>
                    <Button className="bg-primary hover:bg-primary/90 ml-4 flex-shrink-0 text-primary-foreground">
                      Start Chat
                      <MessageCircle className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Fleet Ops Phone */}
                  <div className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors border-b border-border">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Fleet Operations Line</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Speak with our fleet operations team</p>
                        <p className="text-sm font-semibold text-foreground mt-1.5">+234 800 123 9999</p>
                      </div>
                    </div>
                    <Button variant="outline" className="ml-4 flex-shrink-0">
                      Call Now
                      <Phone className="h-4 w-4 ml-2" />
                    </Button>
                  </div>

                  {/* Partner Email */}
                  <div className="flex items-center justify-between p-5 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-foreground">Partner Email</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">Response within 4 business hours for partners</p>
                        <p className="text-xs font-medium text-foreground mt-1.5 font-mono">partners@rydway.com</p>
                      </div>
                    </div>
                    <Button variant="outline" className="ml-4 flex-shrink-0">
                      Email Us
                      <Mail className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Contact Form */}
              <Card className="border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base font-semibold text-foreground">
                    Send a Business Inquiry
                  </CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">
                    For fleet, payout, or compliance questions — we'll respond within 4 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="b-name" className="text-xs">Contact Name</Label>
                        <Input id="b-name" placeholder="Jane Doe" className="h-10 text-sm" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="b-email" className="text-xs">Business Email</Label>
                        <Input id="b-email" type="email" placeholder="jane@company.com" className="h-10 text-sm" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="b-subject" className="text-xs">Subject</Label>
                      <Input id="b-subject" placeholder="e.g. Payout delay, KYC review, Fleet issue" className="h-10 text-sm" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="b-message" className="text-xs">Message</Label>
                      <Textarea
                        id="b-message"
                        placeholder="Describe your issue or inquiry in detail..."
                        className="min-h-[150px] text-sm"
                      />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      <Send className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Account manager card */}
              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Your Support Details</h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary-foreground">
                        <Clock className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Response Times</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Chat: Immediate<br />
                          Email: Within 4 hours<br />
                          Phone: Mon – Sat, 8am – 8pm
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg text-primary-foreground">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-foreground">Partner Office</h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          123 Victoria Island<br />
                          Lagos, Nigeria
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/20 text-primary-foreground">
                      <p className="text-xs text-primary font-medium">
                        Business partners receive priority support across all channels. Include your business name in all communications for faster resolution.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Useful links */}
              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <h4 className="text-sm font-semibold text-foreground mb-4">Quick Resources</h4>
                  <div className="space-y-2">
                    {[
                      "Fleet Management Guide",
                      "Payout Schedule",
                      "KYC Requirements",
                      "Vehicle Listing Best Practices",
                      "Dispute Resolution Policy",
                    ].map((link) => (
                      <button
                        key={link}
                        className="w-full text-left text-sm text-primary hover:underline flex items-center gap-2 py-1"
                      >
                        <span className="h-1 w-1 bg-primary rounded-full shrink-0 text-primary-foreground" />
                        {link}
                      </button>
                    ))}
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
