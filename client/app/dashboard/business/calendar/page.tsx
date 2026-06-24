// app/dashboard/business/calendar/page.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { 
  Calendar as CalendarIcon,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Download,
  CheckCircle,
  AlertTriangle,
  Wrench,
  Loader2
} from "lucide-react";
import { format } from "date-fns";
import { Calendar, momentLocalizer, View, SlotInfo } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/base/cards/StatCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sub-components
import { CalendarLegend } from "./components/CalendarLegend";
import { EventDetailsDialog } from "./components/EventDetailsDialog";
import { NewEventDialog } from "./components/NewEventDialog";
import { CalendarEvent } from "./components/types";

// Real data hooks
import { useVehicles, useVehicleCalendar } from "@/hooks/useVehicles";

import { PolicyGate } from "@/components/base/PolicyGate";

// Setup moment localizer for react-big-calendar
const localizer = momentLocalizer(moment);

/** Maps the API calendar response to react-big-calendar's CalendarEvent format */
function apiEventsToCalendarEvents(apiEvents: any[]): CalendarEvent[] {
  return apiEvents.map((e) => ({
    id: e.id,
    title: e.type === 'booking'
      ? `🚙 Booking`
      : `🛑 ${e.reason || 'Blocked'}`,
    start: e.startDate,
    end: e.endDate,
    type: e.type === 'booking' ? 'booking' : 'unavailable',
    status: e.type === 'booking' ? 'confirmed' : 'scheduled',
    notes: e.reason,
    allDay: true,
  }));
}

export default function BusinessCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<View>('month');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>("all");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isNewEventDialogOpen, setIsNewEventDialogOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'unavailable',
    status: 'scheduled',
    start: new Date().toISOString(),
    end: new Date(Date.now() + 86400000).toISOString(),
  });

  // Real data
  const { vehicles, isLoading: loadingVehicles } = useVehicles();
  const calendarVehicleId = selectedVehicleId !== 'all' ? selectedVehicleId : (vehicles?.[0]?.id ?? '');
  const { events: apiEvents, isLoading: loadingCalendar, addBlock, isAddingBlock, removeBlock } = useVehicleCalendar(calendarVehicleId);

  // Merge API events into CalendarEvent format
  const events = useMemo(() => apiEventsToCalendarEvents(apiEvents), [apiEvents]);


  // Convert string dates to Date objects for the calendar
  const parsedEvents = useMemo(() => {
    return events.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));
  }, [events]);

  // Filter events
  const filteredEvents = useMemo(() => {
    return parsedEvents.filter(event => {
      const matchesType = filterType === "all" || event.type === filterType;
      const matchesStatus = filterStatus === "all" || event.status === filterStatus;
      return matchesType && matchesStatus;
    });
  }, [parsedEvents, filterType, filterStatus]);


  // Google Calendar-like event styling
  const eventStyleGetter = (event: CalendarEvent & { start: Date; end: Date }) => {
    let className = '';
    
    // Booking group - Blue shades
    if (event.type === 'booking') {
      switch (event.status) {
        case 'pending':
          className = 'booking-pending';
          break;
        case 'confirmed':
          className = 'booking-confirmed';
          break;
        case 'overdue':
          className = 'booking-overdue';
          break;
        case 'returned':
          className = 'booking-returned';
          break;
      }
    }
    
    // Maintenance group - Amber shades
    if (event.type === 'maintenance' || event.type === 'service' || event.type === 'inspection') {
      switch (event.type) {
        case 'maintenance':
          className = 'maintenance-scheduled';
          break;
        case 'service':
          className = 'service-scheduled';
          break;
        case 'inspection':
          className = 'inspection-scheduled';
          break;
      }
    }
    
    // Unavailable group - Slate shades
    if (event.type === 'unavailable') {
      className = 'unavailable';
    }
    
    return { className };
  };

  // Calculate metrics
  const metrics = useMemo(() => {
    const now = new Date();
    
    const pendingBookings = events.filter(e => 
      e.type === 'booking' && e.status === 'pending'
    ).length;
    
    const confirmedBookings = events.filter(e => 
      e.type === 'booking' && e.status === 'confirmed'
    ).length;
    
    const overdueBookings = events.filter(e => 
      e.type === 'booking' && e.status === 'overdue'
    ).length;
    
    const scheduledMaintenance = events.filter(e => 
      (e.type === 'maintenance' || e.type === 'service' || e.type === 'inspection') && 
      e.status === 'scheduled'
    ).length;

    return { 
      pendingBookings,
      confirmedBookings,
      overdueBookings,
      scheduledMaintenance
    };
  }, [events]);

  // Business stats
  const businessStats = [
    {
      title: "Pending Bookings",
      value: metrics.pendingBookings.toString(),
      icon: Clock,
      trend: "Awaiting confirmation",
      trendUp: false,
      iconColor: "text-blue-600"
    },
    {
      title: "Active Bookings",
      value: metrics.confirmedBookings.toString(),
      icon: CheckCircle,
      trend: "Currently rented",
      trendUp: true,
      iconColor: "text-blue-600 dark:text-blue-400"
    },
    {
      title: "Overdue Returns",
      value: metrics.overdueBookings.toString(),
      icon: AlertTriangle,
      trend: "Action required",
      trendUp: false,
      iconColor: "text-red-600"
    },
    {
      title: "Scheduled Maintenance",
      value: metrics.scheduledMaintenance.toString(),
      icon: Wrench,
      trend: "Upcoming service",
      trendUp: true,
      iconColor: "text-amber-600"
    }
  ];

  // Navigation
  const navigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    const newDate = new Date(currentDate);
    switch (action) {
      case 'PREV':
        if (view === 'month') newDate.setUTCMonth(newDate.getUTCMonth() - 1);
        else if (view === 'week') newDate.setUTCDate(newDate.getUTCDate() - 7);
        else newDate.setUTCDate(newDate.getUTCDate() - 1);
        break;
      case 'NEXT':
        if (view === 'month') newDate.setUTCMonth(newDate.getUTCMonth() + 1);
        else if (view === 'week') newDate.setUTCDate(newDate.getUTCDate() + 7);
        else newDate.setUTCDate(newDate.getUTCDate() + 1);
        break;
      case 'TODAY':
        newDate.setTime(Date.now());
        break;
    }
    setCurrentDate(newDate);
  };

  // Handle slot selection
  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setNewEvent({
      ...newEvent,
      start: slotInfo.start.toISOString(),
      end: slotInfo.end.toISOString(),
    });
    setIsNewEventDialogOpen(true);
  };

  // Handle event selection
  const handleSelectEvent = (event: CalendarEvent & { start: Date; end: Date }) => {
    const originalEvent = events.find(e => e.id === event.id);
    if (originalEvent) {
      setSelectedEvent(originalEvent);
      setIsEventDialogOpen(true);
    }
  };

  // Create new event → calls real API block
  const handleCreateEvent = async () => {
    if (!newEvent.start || !newEvent.end) return;
    try {
      await addBlock({
        startDate: new Date(newEvent.start).toISOString(),
        endDate: new Date(newEvent.end).toISOString(),
        reason: newEvent.title || newEvent.notes || 'Manual block',
      });
    } catch (e) {
      console.error('Failed to create block', e);
    }
    setIsNewEventDialogOpen(false);
  };

  // Update event — blocks can't be updated, just re-show details
  const handleUpdateEvent = (_updatedEvent: CalendarEvent) => {
    setIsEventDialogOpen(false);
  };

  // Delete event → calls real API remove block
  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this block?')) {
      try {
        await removeBlock(id);
      } catch (e) {
        console.error('Failed to remove block', e);
      }
      setIsEventDialogOpen(false);
    }
  };


  // Custom toolbar
  const CustomToolbar = (toolbar: any) => {
    return (
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('TODAY')}
            className="font-primary text-sm"
          >
            Today
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('PREV')}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('NEXT')}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <span className="ml-2 text-lg font-semibold text-foreground font-primary">
            {moment(currentDate).format('MMMM YYYY')}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Select value={view} onValueChange={(value) => setView(value as View)}>
            <SelectTrigger className="w-[110px] h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="agenda">Agenda</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => console.log("Export")}
            className="h-8"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button
            size="sm"
            onClick={() => setIsNewEventDialogOpen(true)}
            className="bg-primary hover:bg-primary/90 h-8 text-sm text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create
          </Button>
        </div>
      </div>
    );
  };

  return (
    <PolicyGate policy="listing">
      <div className="space-y-6 font-secondary">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-primary">
            Calendar & Availability
          </h1>
          <p className="text-sm text-muted-foreground font-secondary">
            Manage bookings, maintenance, and vehicle availability
          </p>
        </div>
        {/* Vehicle selector */}
        <div className="w-full md:w-64">
          <Select value={selectedVehicleId} onValueChange={setSelectedVehicleId}>
            <SelectTrigger className="h-9 text-sm">
              <SelectValue placeholder="Select a vehicle..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All vehicles (first)</SelectItem>
              {(vehicles ?? []).map(v => (
                <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {businessStats.map((stat, index) => (
          <StatCard 
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
            trendUp={stat.trendUp}
            iconClassName={stat.iconColor}
            className="border border-border shadow-sm"
          />
        ))}
      </div>

      {/* Filters */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[160px] h-8 text-sm">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="booking">Bookings</SelectItem>
                  <SelectItem value="unavailable">Blocked Dates</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[160px] h-8 text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calendar Legend */}
      <CalendarLegend />

      {/* Calendar */}
      <Card className="border border-border shadow-sm overflow-hidden">
        <CardContent className="p-6">
          {loadingCalendar || loadingVehicles ? (
            <div className="flex items-center justify-center h-[700px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <style jsx global>{`
                .rbc-calendar { font-family: inherit; }
                .rbc-header { padding: 8px; font-weight: 500; font-size: 0.875rem; color: #475569; border-bottom: 1px solid #e2e8f0; }
                .rbc-header + .rbc-header { border-left: 1px solid #e2e8f0; }
                .rbc-month-view { border: 1px solid #e2e8f0; border-radius: 0.5rem; }
                .rbc-day-bg + .rbc-day-bg { border-left: 1px solid #f1f5f9; }
                .rbc-off-range-bg { background-color: #f8fafc; }
                .rbc-today { background-color: #eff6ff; }
                .rbc-event { border-radius: 4px; padding: 2px 4px; font-size: 0.75rem; font-weight: 500; border: none; box-shadow: none; }
                .rbc-event.booking-pending { background-color: #eff6ff; border-left: 3px solid #3b82f6; color: #1e40af; }
                .rbc-event.booking-confirmed { background-color: #dbeafe; border-left: 3px solid #2563eb; color: #1e3a8a; }
                .rbc-event.booking-overdue { background-color: #fef2f2; border-left: 3px solid #dc2626; color: #991b1b; }
                .rbc-event.booking-returned { background-color: #eff6ff; border-left: 3px solid #3b82f6; color: #1e40af; opacity: 0.8; }
                .rbc-event.maintenance-scheduled, .rbc-event.service-scheduled, .rbc-event.inspection-scheduled { background-color: #fffbeb; border-left: 3px solid #f59e0b; color: #92400e; }
                .rbc-event.unavailable { background-color: #fee2e2; border-left: 3px solid #ef4444; color: #7f1d1d; }
                .rbc-event:hover { filter: brightness(0.98); }
                .rbc-show-more { color: #3b82f6; font-size: 0.75rem; font-weight: 500; }
              `}</style>

              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
                date={currentDate}
                view={view}
                onView={setView}
                onNavigate={setCurrentDate}
                onSelectSlot={handleSelectSlot}
                onSelectEvent={handleSelectEvent}
                selectable={true}
                eventPropGetter={eventStyleGetter}
                components={{ toolbar: CustomToolbar }}
                popup
                tooltipAccessor={(event) => `${event.title}${event.notes ? ` — ${event.notes}` : ''}`}
                messages={{
                  showMore: (count) => `+${count} more`,
                  noEventsInRange: "No events scheduled for this period",
                }}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Event Details Dialog */}
      <EventDetailsDialog
        event={selectedEvent}
        open={isEventDialogOpen}
        onOpenChange={setIsEventDialogOpen}
        onDelete={handleDeleteEvent}
        onUpdate={handleUpdateEvent}
      />

      {/* New Event Dialog */}
      <NewEventDialog
        open={isNewEventDialogOpen}
        onOpenChange={setIsNewEventDialogOpen}
        vehicles={(vehicles ?? []).map(v => ({ id: v.id, name: v.name, plateNumber: '', status: 'available' }))}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        onCreate={handleCreateEvent}
      />
    </div>
    </PolicyGate>
  );
}