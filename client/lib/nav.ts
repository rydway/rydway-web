import {
  Home,
  Car,
  Calendar,
  MessageSquare,
  CreditCard,
  User,
  HelpCircle,
  Settings,
  LogOut,
  BarChart,
  DollarSign,
  Building,
  Shield,
  Users,
  FileText,
  Bell,
  MapPin,
  Clock,
  Star,
  Wallet,
  CarTaxiFront,
  CheckSquare,
  Package,
  AlertCircle,
  Eye
} from "lucide-react";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  badge?: number | string;
  badgeColor?: "blue" | "red" | "green" | "amber";
  disabled?: boolean;
  disabledTooltip?: string;
}

export interface NavigationConfig {
  role: 'renter' | 'business';
  primary: NavItem[];
  secondary: NavItem[];
  utility: NavItem[];
}

// Renter Navigation
const renterNavigation: NavigationConfig = {
  role: 'renter',
  primary: [
    {
      id: 'discover',
      label: 'Discover',
      icon: Home,
      href: '/dashboard/renter/discover',
    },
    {
      id: 'my-bookings',
      label: 'My Bookings',
      icon: Calendar,
      href: '/dashboard/renter/booking',
      badge: 1,
      badgeColor: 'blue',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/renter/messages',
      badge: 3,
      badgeColor: 'blue',
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
      href: '/dashboard/renter/payments',
    }
  ],
  secondary: [

  ],
  utility: [
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      href: '/dashboard/renter/profile',
    },
    {
      id: 'help',
      label: 'Help',
      icon: HelpCircle,
      href: '/dashboard/renter/help',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/renter/settings',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      href: '/',
    }
  ]
};

// Business Navigation (MVP Simplified)
const businessNavigation: NavigationConfig = {
  role: 'business',
  primary: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      href: '/dashboard/business',
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      href: '/dashboard/business/booking',
      badge: 4,
      badgeColor: 'blue',
    },
    {
      id: 'vehicles',
      label: 'Vehicles',
      icon: Car,
      href: '/dashboard/business/vehicles',
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      href: '/dashboard/business/calendar',
    },
    {
      id: 'earnings',
      label: 'Earnings',
      icon: DollarSign,
      href: '/dashboard/business/earnings',
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      href: '/dashboard/business/messages',
      badge: 5,
      badgeColor: 'blue',
    }
  ],
  secondary: [

  ],
  utility: [
    {
      id: 'business-profile',
      label: 'Business Profile',
      icon: Building,
      href: '/dashboard/business/profile',
    },
    {
      id: 'help',
      label: 'Help & Support',
      icon: HelpCircle,
      href: '/dashboard/business/help',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      href: '/dashboard/business/settings',
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      href: '/logout',
    }
  ]
};

// Export navigation based on role
export const getNavigation = (role: 'renter' | 'business' = 'renter'): NavigationConfig => {
  return role === 'business' ? businessNavigation : renterNavigation;
};

// Simple role switcher function
export const toggleRole = (currentRole: 'renter' | 'business'): 'renter' | 'business' => {
  return currentRole === 'renter' ? 'business' : 'renter';
};