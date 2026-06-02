"use client";

import { BookingStatus } from "@/@types";
import { Check, Clock, X } from "lucide-react";


interface BookingTimelineProps {
  currentStatus: BookingStatus;
}

export default function BookingTimeline({ currentStatus }: BookingTimelineProps) {
  const steps = [
    { status: 'requested', label: 'Requested' },
    { status: 'accepted', label: 'Accepted' },
    { status: 'paid', label: 'Paid' },
    { status: 'active', label: 'Active' },
    { status: 'returned', label: 'Returned' },
    { status: 'completed', label: 'Completed' },
  ];

  const statusOrder = {
    requested: 0,
    accepted: 1,
    rejected: -1,
    pending_payment: 1,
    paid: 2,
    active: 3,
    returned: 4,
    completed: 5,
    cancelled: -1,
    disputed: -1,
  };

  const currentStep = statusOrder[currentStatus] || 0;
  const isFailed = currentStep === -1;

  return (
    <div className="w-full font-primary">
      <div className="flex items-center justify-between relative">
        {/* Connection Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200">
          <div 
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, idx) => {
          const isComplete = idx < currentStep;
          const isCurrent = idx === currentStep;
          const isPending = idx > currentStep;

          return (
            <div key={step.status} className="relative flex flex-col items-center gap-2 bg-white px-2">
              <div
                className={`
                  relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all
                  ${isComplete ? 'bg-primary border-primary' : ''}
                  ${isCurrent ? 'bg-primary/10 border-primary scale-110' : ''}
                  ${isPending ? 'bg-white border-slate-200' : ''}
                  ${isFailed ? 'bg-red-50 border-red-500' : ''}
                `}
              >
                {isComplete && <Check className="h-5 w-5 text-white" />}
                {isCurrent && <Clock className="h-5 w-5 text-primary" />}
                {isFailed && <X className="h-5 w-5 text-red-500" />}
              </div>
              <span className={`text-xs font-medium ${isCurrent ? 'text-primary' : 'text-slate-600'} font-secondary`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
