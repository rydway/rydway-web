export interface CalendarEvent {
  id: string;
  title: string;
  start: string | Date; // UTC date string or Date object
  end: string | Date;   // UTC date string or Date object
  type: 'booking' | 'maintenance' | 'service' | 'inspection' | 'unavailable';
  status: 'pending' | 'confirmed' | 'overdue' | 'returned' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  vehicleId?: string;
  vehicleName?: string;
  renterName?: string;
  location?: string;
  notes?: string;
  allDay?: boolean;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  status: 'available' | 'booked' | 'maintenance' | 'unavailable';
}
