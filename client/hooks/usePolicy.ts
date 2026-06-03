import { useAuth } from '@/context/AuthContext';

export interface UserPolicies {
  user: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Policies & capabilities
  isActive: boolean;
  isSuspended: boolean;
  suspensionReason: string | null;
  
  canBook: boolean;
  canListVehicle: boolean;
  canChat: boolean;
  canManageCalendar: boolean;
  
  kycStatus: string;
  isKycVerified: boolean;
  isKycPending: boolean;
}

export function usePolicy(): UserPolicies {
  const { user, isAuthenticated, isLoading } = useAuth();

  const isActive = user?.isActive ?? false;
  const isSuspended = user?.isSuspended ?? false;
  const suspensionReason = isSuspended ? (user?.suspensionReason || 'Your account has been suspended by an administrator. Please contact support.') : null;
  
  const kycStatus = user?.kycStatus ?? 'unsubmitted';
  const isKycVerified = kycStatus === 'verified';
  const isKycPending = kycStatus === 'pending';

  // Core policy checks
  const canBook = isAuthenticated && !isSuspended && isActive && user?.role === 'renter' && isKycVerified;
  const canListVehicle = isAuthenticated && !isSuspended && isActive && user?.role === 'host';
  const canChat = isAuthenticated && !isSuspended && isActive;
  const canManageCalendar = isAuthenticated && !isSuspended && isActive && user?.role === 'host';

  return {
    user,
    isAuthenticated,
    isLoading,
    
    isActive,
    isSuspended,
    suspensionReason,
    
    canBook,
    canListVehicle,
    canChat,
    canManageCalendar,
    
    kycStatus,
    isKycVerified,
    isKycPending,
  };
}
