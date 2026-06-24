"use client";

import React from 'react';
import { usePolicy } from '@/hooks/usePolicy';
import { AlertTriangle, ShieldAlert, CheckCircle, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PolicyGateProps {
  children: React.ReactNode;
  policy: 'active' | 'booking' | 'listing' | 'chat';
  fallback?: React.ReactNode;
  hideCompletely?: boolean;
}

export const PolicyGate: React.FC<PolicyGateProps> = ({
  children,
  policy,
  fallback,
  hideCompletely = false,
}) => {
  const policies = usePolicy();

  const getPolicyStatus = () => {
    switch (policy) {
      case 'active':
        return { allowed: policies.isActive && !policies.isSuspended, type: 'active' };
      case 'booking':
        return { allowed: policies.canBook, type: 'booking' };
      case 'listing':
        return { allowed: policies.canListVehicle, type: 'listing' };
      case 'chat':
        return { allowed: policies.canChat, type: 'chat' };
      default:
        return { allowed: true, type: 'none' };
    }
  };

  const { allowed } = getPolicyStatus();

  if (allowed) {
    return <>{children}</>;
  }

  if (hideCompletely) {
    return null;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  // Suspended state styling (Beautiful glassmorphism warning)
  if (policies.isSuspended) {
    return (
      <div className="w-full max-w-2xl mx-auto my-8 p-8 rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/20 via-black/40 to-slate-900/30 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-300 hover:shadow-red-500/5 hover:border-red-500/30">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-red-500 via-orange-500 to-red-600"></div>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 rounded-2xl bg-destructive/100/10 border border-red-500/20 text-red-400">
            <ShieldAlert size={36} className="animate-pulse" />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold tracking-tight text-red-400">Account Access Suspended</h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {policies.suspensionReason}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link 
                href="/support"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-destructive/100 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 hover:shadow-red-600/30 transition-all duration-200"
              >
                Contact Support
              </Link>
              <Link 
                href="/dashboard/renter/help"
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200"
              >
                View Help Guidelines
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // KYC pending or missing state
  if (policy === 'booking' && !policies.isKycVerified) {
    const isPending = policies.isKycPending;
    return (
      <div className="w-full max-w-2xl mx-auto my-8 p-8 rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-950/10 via-black/40 to-slate-900/30 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-amber-500 to-orange-500"></div>
        <div className="flex flex-col md:flex-row items-start gap-6">
          <div className="p-4 rounded-2xl bg-amber-500/100/10 border border-amber-500/20 text-amber-400">
            <AlertTriangle size={36} />
          </div>
          <div className="flex-1 space-y-3">
            <h3 className="text-xl font-bold tracking-tight text-amber-400">
              {isPending ? 'Verification in Progress' : 'KYC Verification Required'}
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              {isPending 
                ? 'Your identity documents are currently being reviewed by our administration team. Once verified, you will be able to instantly book premium rentals.'
                : 'To ensure safety and security, Rydway requires all renters to submit document verification (driver license & ID selfie) before making reservations.'}
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              {!isPending ? (
                <Link 
                  href="/dashboard/renter/kyc"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-amber-500/100 text-black hover:bg-amber-600 transition-all duration-200 flex items-center gap-2 group font-bold"
                >
                  <FileText size={16} />
                  Complete Verification
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                  <CheckCircle size={16} className="text-green-500 animate-pulse" />
                  We are reviewing your submission.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default block warning
  return (
    <div className="w-full max-w-2xl mx-auto my-8 p-8 rounded-2xl border border-border bg-black/40 backdrop-blur-xl text-center space-y-4">
      <div className="inline-block p-4 rounded-full bg-primary border border-border text-muted-foreground text-primary-foreground">
        <ShieldAlert size={28} />
      </div>
      <h3 className="text-lg font-bold tracking-tight text-white">Action Prohibited</h3>
      <p className="text-muted-foreground text-sm max-w-md mx-auto">
        Your current account profile tier, status, or configuration restricts access to this premium feature.
      </p>
    </div>
  );
};
