// components/business/CreateBookingModal.tsx
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CalendarDayButton } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  Info,
  Clock,
  MapPin,
  User,
  Phone,
  IdCard,
  ArrowRight,
  Navigation,
  Briefcase,
  AlertTriangle,
  FileText,
} from "lucide-react";
import {
  format,
  addDays,
  differenceInDays,
  isBefore,
  startOfDay,
} from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

/* ──────────────────────────── Types ──────────────────────────────────── */

interface PricingSnapshot {
  rentalDays: number;
  rentalCost: number;
  driverCost: number;
  deliveryFee: number;
  insuranceCost: number;
  serviceFee: number;
  tax: number;
  cautionDeposit: number;
  totalPayable: number;
  refundableDeposit: number;
}

interface CreateBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle: {
    id: string;
    name: string;
    dailyRate: number;
    driverDailyRate?: number;
    securityDeposit?: number;
    lateFeePerHour?: number;
    minimumRentalDays?: number;
    businessSettings?: {
      driverOption?: "chauffeur-only" | "both";
      minimumDuration?: number;
      workingHours?: { start: string; end: string };
      overtimeRate?: number;
      deliveryFee?: number;
      insuranceRequired?: boolean;
      insuranceRate?: number;
      serviceFee?: number;
      taxRate?: number;
    };
  };
  userProfile?: {
    driverPreference?: "chauffeur_only" | "self_drive";
    hasDriverLicense?: boolean;
    driverLicense?: { number: string; fullName: string; phone: string };
  };
  onSubmit: (data: BookingFormData) => void;
}

interface BookingFormData {
  driverType: "self" | "business";
  primaryDriver?: {
    isSelf: boolean;
    fullName?: string;
    phone?: string;
    licenseNumber?: string;
  };
  schedule: {
    startDate: Date;
    endDate: Date;
    pickupTime: string;
    returnTime: string;
    pickupLocation: string;
    dropoffLocation: string;
    primaryUsageLocation: string;
    bookingPurpose: string;
  };
  pricing: PricingSnapshot;
  agreedToTerms: boolean;
}

const BOOKING_PURPOSES = [
  "Personal / Leisure",
  "Corporate / Business Travel",
  "Airport Transfer",
  "Wedding / Event",
  "Interstate Journey",
  "Medical / Appointment",
  "Other",
] as const;

/* ─────────────────────────────────────────────────────────────────────────
 * Fonts are registered in tailwind.config under theme.extend.fontFamily:
 *   primary:   ['Figtree', 'sans-serif']
 *   secondary: ['Syne', 'sans-serif']
 * Import both in your global CSS with @import from Google Fonts.
 * Usage in JSX: className="font-primary"  /  className="font-secondary"
 * ──────────────────────────────────────────────────────────────────────── */

/* ─────────────── Pure sub-components (no inline style objects) ──────── */

const SectionLabel = React.memo(({ text }: { text: string }) => (
  <p
    className="font-secondary text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-3"
  >
    {text}
  </p>
));
SectionLabel.displayName = "SectionLabel";

const LineItem = React.memo(({ label, value }: { label: string; value: number }) => (
  <div className="flex justify-between">
    <span className="text-slate-500">{label}</span>
    <span className="font-medium text-slate-800">₦{value.toLocaleString()}</span>
  </div>
));
LineItem.displayName = "LineItem";

const Pill = React.memo(({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">
    {icon}{children}
  </span>
));
Pill.displayName = "Pill";

/* ─────────────────────────── Step 1 ─────────────────────────────────── */
/*
 * KEY: errors is NOT passed as a prop.
 * Step1 manages its own error display via an errors ref passed from parent.
 * This means parent state changes (typing in other fields) never
 * touch Step1's prop signature → React.memo holds → no re-render → no shake.
 */
interface Step1Props {
  driverType: "self" | "business";
  isSelfDriver: boolean;
  driverDetails: { fullName: string; phone: string; licenseNumber: string };
  step1Errors: Record<string, string>;           // ← separate slice, only Step1 errors
  onDriverTypeChange: (v: "self" | "business") => void;
  onSelfDriverChange: (c: boolean) => void;
  onDriverDetailChange: (key: string, value: string) => void;
  onClearError: (key: string) => void;
  vehicle: CreateBookingModalProps["vehicle"];
  businessSettings: NonNullable<CreateBookingModalProps["vehicle"]["businessSettings"]>;
  hideSelfDrive: boolean;
  pickupLocation: string;
  dropoffLocation: string;
  primaryUsageLocation: string;
  bookingPurpose: string;
  onPickupLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDropoffLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPrimaryUsageLocationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBookingPurposeChange: (v: string) => void;
}

const Step1 = React.memo(({
  driverType, isSelfDriver, driverDetails, step1Errors,
  onDriverTypeChange, onSelfDriverChange, onDriverDetailChange, onClearError,
  vehicle, businessSettings, hideSelfDrive,
  pickupLocation, dropoffLocation, primaryUsageLocation, bookingPurpose,
  onPickupLocationChange, onDropoffLocationChange,
  onPrimaryUsageLocationChange, onBookingPurposeChange,
}: Step1Props) => (
  <div className="space-y-5">
    <SectionLabel text="Driver Option" />

    {hideSelfDrive ? (
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 -mt-2">
        <p className="text-sm text-blue-700">This vehicle is available with a professional driver only.</p>
        <p className="font-secondary text-sm font-semibold text-blue-800 mt-1">Business-provided driver</p>
      </div>
    ) : (
      <RadioGroup value={driverType} onValueChange={onDriverTypeChange} className="grid grid-cols-2 gap-3 -mt-2">
        {(["self", "business"] as const).map((type) => (
          <label
            key={type}
            htmlFor={type}
            className={cn(
              "flex items-start gap-3 border rounded-xl p-4 cursor-pointer transition-colors",
              driverType === type ? "border-primary bg-primary/5 shadow-sm" : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            )}
          >
            <RadioGroupItem value={type} id={type} className="mt-0.5 shrink-0" />
            <div>
              <span className="font-secondary font-semibold text-sm block text-slate-900">
                {type === "self" ? "Self Drive" : "With Driver"}
              </span>
              <span className="text-xs text-slate-500 mt-0.5 block">
                {type === "self" ? "Drive the vehicle yourself" : `₦${(vehicle.driverDailyRate ?? 0).toLocaleString()}/day`}
              </span>
            </div>
          </label>
        ))}
      </RadioGroup>
    )}

    {driverType === "self" && (
      <div className="p-4 border rounded-xl bg-slate-50 space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox id="self-driver" checked={isSelfDriver} onCheckedChange={(c) => onSelfDriverChange(c as boolean)} />
          <Label htmlFor="self-driver" className="text-sm font-medium cursor-pointer">I will be the primary driver</Label>
        </div>
        {!isSelfDriver && (
          <div className="space-y-3 pt-1">
            {([
              { id: "d-name",  icon: User,   key: "fullName",     label: "Full Name",             ph: "Driver's full name" },
              { id: "d-phone", icon: Phone,  key: "phone",         label: "Phone Number",          ph: "Driver's phone number" },
              { id: "d-lic",   icon: IdCard, key: "licenseNumber", label: "Driver License Number", ph: "License number" },
            ] as const).map(({ id, icon: Icon, key, label, ph }) => (
              <div key={id}>
                <Label htmlFor={id} className="text-xs text-slate-600 mb-1 block">{label}</Label>
                <div className="relative">
                  <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id={id}
                    value={driverDetails[key]}
                    onChange={(e) => { onDriverDetailChange(key, e.target.value); onClearError(key); }}
                    placeholder={ph}
                    className={cn("pl-9 h-10", step1Errors[key] && "border-red-500")}
                  />
                </div>
                {step1Errors[key] && <p className="text-xs text-red-500 mt-1">{step1Errors[key]}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    )}

    {driverType === "business" && (
      <div className="space-y-2.5 p-4 bg-slate-50 rounded-xl border text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Driver Daily Rate</span>
          <span className="font-semibold">₦{(vehicle.driverDailyRate ?? 0).toLocaleString()}</span>
        </div>
        {businessSettings.workingHours && (
          <div className="flex justify-between">
            <span className="text-slate-500">Working Hours</span>
            <span className="font-medium">{businessSettings.workingHours.start} – {businessSettings.workingHours.end}</span>
          </div>
        )}
        {businessSettings.overtimeRate && (
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-400" />
            Overtime: ₦{businessSettings.overtimeRate}/hr beyond working hours
          </p>
        )}
      </div>
    )}

    <div className="border-t border-slate-100 pt-4">
      <SectionLabel text="Trip Locations & Purpose" />
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="primary-usage" className="text-xs text-slate-600 mb-1 block">
            Primary Usage Location <span className="text-slate-400">(optional)</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input id="primary-usage" value={primaryUsageLocation} onChange={onPrimaryUsageLocationChange} placeholder="e.g. Lagos, Abuja" className="pl-9 h-10" />
          </div>
          {primaryUsageLocation.length > 0 && (
            <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
              <Info className="h-3 w-3 shrink-0" />Out-of-state usage may attract extra fees.
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="booking-purpose" className="text-xs text-slate-600 mb-1 block">
            Purpose of Booking <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 z-10 pointer-events-none" />
            <Select value={bookingPurpose} onValueChange={onBookingPurposeChange}>
              <SelectTrigger id="booking-purpose" className={cn("h-10 pl-9 w-full", step1Errors.bookingPurpose && "border-red-500")}>
                <SelectValue placeholder="Select a purpose" />
              </SelectTrigger>
              <SelectContent>
                {BOOKING_PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {step1Errors.bookingPurpose && <p className="text-xs text-red-500 mt-1">{step1Errors.bookingPurpose}</p>}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="pickup-location" className="text-xs text-slate-600 mb-1 block">
            Pick-up Location <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input id="pickup-location" value={pickupLocation} onChange={onPickupLocationChange} placeholder="e.g. Victoria Island" className={cn("pl-9 h-10", step1Errors.pickupLocation && "border-red-500")} />
          </div>
          {step1Errors.pickupLocation && <p className="text-xs text-red-500 mt-1">{step1Errors.pickupLocation}</p>}
        </div>
        <div>
          <Label htmlFor="dropoff-location" className="text-xs text-slate-600 mb-1 block">
            Drop-off Location <span className="text-red-400">*</span>
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input id="dropoff-location" value={dropoffLocation} onChange={onDropoffLocationChange} placeholder="e.g. Ikeja Airport" className={cn("pl-9 h-10", step1Errors.dropoffLocation && "border-red-500")} />
          </div>
          {step1Errors.dropoffLocation && <p className="text-xs text-red-500 mt-1">{step1Errors.dropoffLocation}</p>}
        </div>
      </div>
    </div>
  </div>
));
Step1.displayName = "Step1";

/* ─────────────────────────── Step 2 ─────────────────────────────────── */

interface Step2Props {
  dateRange: { from: Date | undefined; to: Date | undefined };
  pickupTime: string;
  returnTime: string;
  step2Errors: Record<string, string>;
  onDateSelect: (range: { from?: Date; to?: Date } | undefined) => void;
  onPickupTimeChange: (v: string) => void;
  onReturnTimeChange: (v: string) => void;
  businessSettings: NonNullable<CreateBookingModalProps["vehicle"]["businessSettings"]>;
  timeOptions: string[];
  todayStart: Date;
}

const Step2 = React.memo(({
  dateRange, pickupTime, returnTime, step2Errors,
  onDateSelect, onPickupTimeChange, onReturnTimeChange,
  businessSettings, timeOptions, todayStart,
}: Step2Props) => (
  <div className="space-y-5">
    <SectionLabel text="Select Trip Dates" />

    {dateRange.from && dateRange.to && (
      <div className="flex items-center gap-2 flex-wrap -mt-2">
        <span className="font-secondary inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
          <Clock className="h-3 w-3" />
          {format(dateRange.from, "dd MMM yyyy")} → {format(dateRange.to, "dd MMM yyyy")}
        </span>
        <span className="text-xs text-slate-500">
          {differenceInDays(dateRange.to, dateRange.from)} day{differenceInDays(dateRange.to, dateRange.from) !== 1 ? "s" : ""}
        </span>
      </div>
    )}

    <div className={cn("rounded-xl border overflow-hidden", step2Errors.dateRange ? "border-red-400" : "border-slate-200")}>
  <Calendar
  mode="range"
  selected={dateRange}
  onSelect={onDateSelect}
  disabled={(date: Date) => isBefore(date, todayStart)}
  initialFocus
  numberOfMonths={2}
  defaultMonth={new Date()}
  className="p-3 w-full [&_.rdp-day_today>button]:border-2 [&_.rdp-day_today>button]:border-primary [&_.rdp-day_today>button]:rounded-md [&_.rdp-day_today>button]:bg-transparent [&_.rdp-day_today>button]:!bg-transparent [&_.rdp-day_today]:!bg-transparent [&_.rdp-day_today.rdp-day_selected>button]:border-0 [&_.rdp-day_today.rdp-day_range_start>button]:border-0 [&_.rdp-day_today.rdp-day_range_end>button]:border-0 [&_.rdp-day_range_middle]:bg-primary/10 [&_.rdp-day_range_middle]:text-primary [&_.rdp-day_range_middle]:rounded-none [&_.rdp-day_range_start]:bg-primary [&_.rdp-day_range_start]:text-white [&_.rdp-day_range_end]:bg-primary [&_.rdp-day_range_end]:text-white [&_.rdp-day]:mx-px"
  components={{
    DayButton: ({ className, day, modifiers, ...props }) => {
      const isToday = modifiers.today;
      const isSelected = modifiers.selected || modifiers.range_start || modifiers.range_end;
      return (
        <CalendarDayButton
          day={day}
          modifiers={modifiers}
          className={cn(
            className,
            isToday && !isSelected && "border-2 border-primary !"
          )}
          {...props}
        />
      );
    },
  }}
/>
    </div>

    {step2Errors.dateRange && <p className="text-xs text-red-500 mt-1">{step2Errors.dateRange}</p>}

    <div className="space-y-1">
      {(businessSettings.minimumDuration ?? 1) > 1 && (
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <Info className="h-3 w-3" />
          Minimum {businessSettings.minimumDuration} day{(businessSettings.minimumDuration ?? 1) > 1 ? "s" : ""} rental required
        </p>
      )}
      <p className="text-xs text-slate-400 flex items-center gap-1">
        <Info className="h-3 w-3" />
        Today has a primary border. You can book from today onwards.
      </p>
    </div>

    <div className="border-t border-slate-100 pt-4">
      <SectionLabel text="Pickup & Return Times" />
      <div className="grid grid-cols-2 gap-4 -mt-2">
        <div>
          <Label htmlFor="pickup-time" className="text-xs text-slate-600 mb-1 block">Pickup Time</Label>
          <Select value={pickupTime} onValueChange={onPickupTimeChange}>
            <SelectTrigger id="pickup-time" className="h-11 w-full">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <SelectValue placeholder="Select time" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="return-time" className="text-xs text-slate-600 mb-1 block">Return Time</Label>
          <Select value={returnTime} onValueChange={onReturnTimeChange}>
            <SelectTrigger id="return-time" className="h-11 w-full">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <SelectValue placeholder="Select time" />
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeOptions.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  </div>
));
Step2.displayName = "Step2";

/* ─────────────────────────── Step 3 ─────────────────────────────────── */

interface Step3Props {
  pricing: PricingSnapshot;
  agreedToTerms: boolean;
  termsError: string | undefined;
  onTermsChange: (c: boolean) => void;
  onClearTermsError: () => void;
  businessSettings: NonNullable<CreateBookingModalProps["vehicle"]["businessSettings"]>;
  driverType: "self" | "business";
  dateRange: { from: Date | undefined; to: Date | undefined };
  pickupLocation: string;
  dropoffLocation: string;
  bookingPurpose: string;
  lateFee: number;
}

const Step3 = React.memo(({
  pricing, agreedToTerms, termsError, onTermsChange, onClearTermsError,
  businessSettings, driverType, dateRange,
  pickupLocation, dropoffLocation, bookingPurpose, lateFee,
}: Step3Props) => (
  <div className="space-y-5">
    <div className="flex flex-wrap gap-2">
      {dateRange.from && dateRange.to && (
        <Pill icon={<Clock className="h-3 w-3" />}>
          {format(dateRange.from, "dd MMM")} – {format(dateRange.to, "dd MMM yyyy")}
        </Pill>
      )}
      {pickupLocation && <Pill icon={<Navigation className="h-3 w-3" />}>{pickupLocation}</Pill>}
      {dropoffLocation && <Pill icon={<MapPin className="h-3 w-3" />}>{dropoffLocation}</Pill>}
      {bookingPurpose && <Pill icon={<Briefcase className="h-3 w-3" />}>{bookingPurpose}</Pill>}
    </div>

    <div className="bg-slate-50 rounded-xl border p-5">
      <h3 className="font-secondary font-bold text-slate-900 mb-4 text-lg">Price Breakdown</h3>
      <div className="space-y-3 text-sm">
        <LineItem label={`Rental (${pricing.rentalDays} ${pricing.rentalDays === 1 ? "day" : "days"})`} value={pricing.rentalCost} />
        {driverType === "business" && <LineItem label="Driver Service" value={pricing.driverCost} />}
        {pricing.deliveryFee > 0 && <LineItem label="Delivery Fee" value={pricing.deliveryFee} />}
        {pricing.insuranceCost > 0 && <LineItem label="Insurance" value={pricing.insuranceCost} />}
        {pricing.serviceFee > 0 && <LineItem label="Service Fee" value={pricing.serviceFee} />}
        {pricing.tax > 0 && <LineItem label={`Tax (${businessSettings.taxRate ?? 0}%)`} value={pricing.tax} />}
        {pricing.cautionDeposit > 0 && (
          <>
            <div className="border-t border-slate-200 my-1" />
            <div className="flex justify-between text-sm">
              <span className="text-slate-600 flex items-center gap-1">
                Caution Deposit
                <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded-full ml-1">Refundable</span>
              </span>
              <span className="font-medium text-slate-700">₦{pricing.cautionDeposit.toLocaleString()}</span>
            </div>
          </>
        )}
        <div className="border-t border-slate-200 pt-3 mt-1">
          <div className="flex justify-between font-bold text-base">
            <span>Total Payable Now</span>
            <span className="text-primary">₦{(pricing.totalPayable + pricing.cautionDeposit).toLocaleString()}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Includes ₦{pricing.cautionDeposit.toLocaleString()} refundable caution deposit</p>
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
        <div>
          <p className="font-secondary text-sm font-semibold text-amber-800 mb-1">Late Return Policy</p>
          <p className="text-xs text-amber-700 leading-relaxed">
            If the vehicle is not returned by the agreed return time, a late fee of{" "}
            <span className="font-semibold">₦{lateFee.toLocaleString()}/hour</span> will be charged automatically.
            After 3 hours, the full next day's rental rate applies. Repeated late returns may affect future booking eligibility.
          </p>
        </div>
      </div>
    </div>

    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        <FileText className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
        <div>
          <p className="font-secondary text-sm font-semibold text-slate-700 mb-1">Vehicle Care & Return Disclaimer</p>
          <p className="text-xs text-slate-500 leading-relaxed">
            The renter is responsible for the vehicle in their care. The vehicle must be returned in the same condition
            as received — clean, with a full fuel tank, and free of damage. Any damage, excessive dirt, fuel deficit,
            or missing accessories will be deducted from the caution deposit. The renter bears liability for any
            traffic violations or fines incurred during the rental period.
          </p>
        </div>
      </div>
    </div>

    <div className={cn("rounded-xl border p-4", termsError ? "border-red-300 bg-red-50" : "border-slate-200 bg-white")}>
      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms"
          checked={agreedToTerms}
          onCheckedChange={(c) => { onTermsChange(c as boolean); onClearTermsError(); }}
          className="mt-0.5"
        />
        <div className="text-xs text-slate-600 leading-relaxed">
          I have read and agree to the{" "}
          <Link href="#" className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">Terms & Conditions</Link>
          {" "}and{" "}
          <Link href="#" className="text-primary font-semibold underline underline-offset-2 hover:text-primary/80">Rental Policy</Link>
          . I understand the late return, vehicle care, and caution deposit policies outlined above.
        </div>
      </div>
      {termsError && <p className="text-xs text-red-500 mt-2 ml-7">{termsError}</p>}
    </div>
  </div>
));
Step3.displayName = "Step3";

/* ──────────────────────────── Main Component ────────────────────────── */

export function CreateBookingModal({ open, onOpenChange, vehicle, userProfile, onSubmit }: CreateBookingModalProps) {
  const [currentStep, setCurrentStep] = useState(0);

  /* Computed once at mount, stored in refs — never change identity */
  const todayStart = useRef(startOfDay(new Date())).current;
  const tomorrowStart = useRef(addDays(todayStart, 1)).current;

  const businessSettings = useMemo(
    () => vehicle.businessSettings ?? {
      driverOption: "both" as const,
      minimumDuration: 1,
      deliveryFee: 0,
      insuranceRequired: false,
      insuranceRate: 0,
      serviceFee: 0,
      taxRate: 0,
    },
    [vehicle.businessSettings]
  );

  const defaultEnd = useMemo(
    () => addDays(tomorrowStart, Math.max(1, businessSettings.minimumDuration ?? 1)),
    [tomorrowStart, businessSettings.minimumDuration]
  );

  /* ── Form state ── */
  const [driverType, setDriverType] = useState<"self" | "business">(() =>
    vehicle.businessSettings?.driverOption === "chauffeur-only" || userProfile?.driverPreference === "chauffeur_only"
      ? "business" : "self"
  );
  const [isSelfDriver, setIsSelfDriver] = useState(true);
  const [driverDetails, setDriverDetails] = useState({ fullName: "", phone: "", licenseNumber: "" });
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [primaryUsageLocation, setPrimaryUsageLocation] = useState("");
  const [bookingPurpose, setBookingPurpose] = useState("");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>(
    { from: tomorrowStart, to: defaultEnd }
  );
  const [pickupTime, setPickupTime] = useState("09:00");
  const [returnTime, setReturnTime] = useState("09:00");
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  /*
   * ERRORS ARE SPLIT BY STEP — not one shared object.
   * Step1 only receives step1Errors, Step2 only step2Errors, Step3 only termsError.
   * A change to step1Errors does NOT touch Step2/Step3 props → those components
   * never re-render when the user is typing in Step1.
   */
  const [step1Errors, setStep1Errors] = useState<Record<string, string>>({});
  const [step2Errors, setStep2Errors] = useState<Record<string, string>>({});
  const [termsError, setTermsError] = useState<string | undefined>(undefined);

  /* Pricing snapshot — computed once on Next from Step2, never live */
  const [pricingSnapshot, setPricingSnapshot] = useState<PricingSnapshot | null>(null);

  const timeOptions = useMemo(
    () => Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`),
    []
  );

  const lateFee = useMemo(
    () => vehicle.lateFeePerHour ?? Math.round((vehicle.dailyRate / 24) * 1.5),
    [vehicle.lateFeePerHour, vehicle.dailyRate]
  );

  const hideSelfDrive =
    businessSettings.driverOption === "chauffeur-only" || userProfile?.driverPreference === "chauffeur_only";

  /* ── Auto-fill ── */
  useEffect(() => {
    if (isSelfDriver && userProfile?.hasDriverLicense && userProfile.driverLicense) {
      setDriverDetails({
        fullName: userProfile.driverLicense.fullName ?? "",
        phone: userProfile.driverLicense.phone ?? "",
        licenseNumber: userProfile.driverLicense.number ?? "",
      });
    }
  }, [isSelfDriver, userProfile]);

  /* ── Stable handlers — all useCallback ── */
  const handleDriverTypeChange = useCallback((v: "self" | "business") => setDriverType(v), []);
  const handleSelfDriverChange = useCallback((c: boolean) => { setIsSelfDriver(c); setStep1Errors({}); }, []);
  const handleDriverDetailChange = useCallback((key: string, value: string) => {
    setDriverDetails((prev) => ({ ...prev, [key]: value }));
  }, []);

  const clearStep1Error = useCallback((key: string) => {
    setStep1Errors((prev) => { if (!prev[key]) return prev; const n = { ...prev }; delete n[key]; return n; });
  }, []);

  const handlePickupLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPickupLocation(e.target.value);
    clearStep1Error("pickupLocation");
  }, [clearStep1Error]);

  const handleDropoffLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setDropoffLocation(e.target.value);
    clearStep1Error("dropoffLocation");
  }, [clearStep1Error]);

  const handlePrimaryUsageLocationChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPrimaryUsageLocation(e.target.value);
  }, []);

  const handleBookingPurposeChange = useCallback((v: string) => {
    setBookingPurpose(v);
    clearStep1Error("bookingPurpose");
  }, [clearStep1Error]);

  const handleDateSelect = useCallback((range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      const days = differenceInDays(range.to, range.from);
      const min = businessSettings.minimumDuration ?? 1;
      setDateRange({ from: range.from, to: days < min ? addDays(range.from, min) : range.to });
    } else {
      setDateRange({ from: range?.from, to: range?.to });
    }
    setStep2Errors((prev) => { if (!prev.dateRange) return prev; const n = { ...prev }; delete n.dateRange; return n; });
  }, [businessSettings.minimumDuration]);

  const handlePickupTimeChange = useCallback((v: string) => setPickupTime(v), []);
  const handleReturnTimeChange = useCallback((v: string) => setReturnTime(v), []);
  const handleTermsChange = useCallback((c: boolean) => setAgreedToTerms(c), []);
  const clearTermsError = useCallback(() => setTermsError(undefined), []);

  /* ── Pure pricing calculation ── */
  const computePricing = useCallback((): PricingSnapshot | null => {
    if (!dateRange.from || !dateRange.to) return null;
    const days = Math.max(1, differenceInDays(dateRange.to, dateRange.from));
    const rentalCost = days * vehicle.dailyRate;
    const driverCost = driverType === "business" ? days * (vehicle.driverDailyRate ?? 0) : 0;
    const deliveryFee = businessSettings.deliveryFee ?? 0;
    const insuranceCost = businessSettings.insuranceRequired ? (businessSettings.insuranceRate ?? 0) : 0;
    const cautionDeposit = vehicle.securityDeposit ?? 0;
    const serviceFee = businessSettings.serviceFee ?? 0;
    const tax = (rentalCost + driverCost + deliveryFee + insuranceCost + serviceFee) * ((businessSettings.taxRate ?? 0) / 100);
    const totalPayable = rentalCost + driverCost + deliveryFee + insuranceCost + serviceFee + tax;
    return { rentalDays: days, rentalCost, driverCost, deliveryFee, insuranceCost, serviceFee, tax, cautionDeposit, totalPayable, refundableDeposit: cautionDeposit };
  }, [
    dateRange.from, dateRange.to, driverType,
    vehicle.dailyRate, vehicle.driverDailyRate, vehicle.securityDeposit,
    businessSettings.deliveryFee, businessSettings.insuranceRequired,
    businessSettings.insuranceRate, businessSettings.serviceFee, businessSettings.taxRate,
  ]);

  /* ── Validation — writes only to the relevant error state ── */
  const validateStep = useCallback((step: number): boolean => {
    if (step === 0) {
      const errs: Record<string, string> = {};
      if (driverType === "self" && !isSelfDriver) {
        if (!driverDetails.fullName) errs.fullName = "Full name is required";
        if (!driverDetails.phone) errs.phone = "Phone number is required";
        if (!driverDetails.licenseNumber) errs.licenseNumber = "License number is required";
      }
      if (!pickupLocation.trim()) errs.pickupLocation = "Pick-up location is required";
      if (!dropoffLocation.trim()) errs.dropoffLocation = "Drop-off location is required";
      if (!bookingPurpose) errs.bookingPurpose = "Please select a booking purpose";
      setStep1Errors(errs);
      return Object.keys(errs).length === 0;
    }
    if (step === 1) {
      if (!dateRange.from || !dateRange.to) {
        setStep2Errors({ dateRange: "Please select pickup and return dates" });
        return false;
      }
      setStep2Errors({});
      return true;
    }
    if (step === 2) {
      if (!agreedToTerms) {
        setTermsError("You must agree to the terms and conditions");
        return false;
      }
      setTermsError(undefined);
      return true;
    }
    return true;
  }, [driverType, isSelfDriver, driverDetails, pickupLocation, dropoffLocation, bookingPurpose, dateRange.from, dateRange.to, agreedToTerms]);

  const handleNextStep = useCallback(() => {
    if (!validateStep(currentStep)) return;
    if (currentStep === 1) setPricingSnapshot(computePricing());
    setCurrentStep((s) => s + 1);
  }, [currentStep, validateStep, computePricing]);

  const handlePreviousStep = useCallback(() => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  }, [currentStep]);

  const handleSubmit = useCallback(() => {
    if (!validateStep(2)) return;
    if (!dateRange.from || !dateRange.to || !pricingSnapshot) return;
    onSubmit({
      driverType,
      primaryDriver: driverType === "self" ? { isSelf: isSelfDriver, ...(isSelfDriver ? {} : driverDetails) } : undefined,
      schedule: { startDate: dateRange.from, endDate: dateRange.to, pickupTime, returnTime, pickupLocation, dropoffLocation, primaryUsageLocation, bookingPurpose },
      pricing: pricingSnapshot,
      agreedToTerms,
    });
    onOpenChange(false);
    resetForm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [driverType, isSelfDriver, driverDetails, dateRange, pickupTime, returnTime, pickupLocation, dropoffLocation, primaryUsageLocation, bookingPurpose, pricingSnapshot, agreedToTerms, onSubmit, onOpenChange, validateStep]);

  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setStep1Errors({}); setStep2Errors({}); setTermsError(undefined);
    setPricingSnapshot(null);
    setDriverType(vehicle.businessSettings?.driverOption === "chauffeur-only" || userProfile?.driverPreference === "chauffeur_only" ? "business" : "self");
    setIsSelfDriver(true);
    setDriverDetails({ fullName: "", phone: "", licenseNumber: "" });
    setDateRange({ from: tomorrowStart, to: defaultEnd });
    setPickupTime("09:00"); setReturnTime("09:00");
    setPickupLocation(""); setDropoffLocation(""); setPrimaryUsageLocation(""); setBookingPurpose("");
    setAgreedToTerms(false);
  }, [vehicle.businessSettings?.driverOption, userProfile?.driverPreference, tomorrowStart, defaultEnd]);

  const handleDialogClose = useCallback((o: boolean) => {
    if (!o) resetForm();
    onOpenChange(o);
  }, [onOpenChange, resetForm]);

  const steps = [{ title: "Driver & Trip Details" }, { title: "Trip Schedule" }, { title: "Summary" }];

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent data-booking-modal className="font-primary max-h-[90vh] overflow-y-auto max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-primary text-2xl font-bold text-slate-900 tracking-tight">
            Book {vehicle.name}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-sm">
            Complete the steps below to create your booking
          </DialogDescription>
        </DialogHeader>

        <div className="mb-5 mt-1">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span className="font-secondary font-semibold text-slate-700">{steps[currentStep].title}</span>
          </div>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", currentStep >= i ? "bg-primary" : "bg-slate-200")} />
            ))}
          </div>
        </div>

        {currentStep === 0 && (
          <Step1
            driverType={driverType} isSelfDriver={isSelfDriver} driverDetails={driverDetails}
            step1Errors={step1Errors}
            onDriverTypeChange={handleDriverTypeChange} onSelfDriverChange={handleSelfDriverChange}
            onDriverDetailChange={handleDriverDetailChange} onClearError={clearStep1Error}
            vehicle={vehicle} businessSettings={businessSettings} hideSelfDrive={hideSelfDrive}
            pickupLocation={pickupLocation} dropoffLocation={dropoffLocation}
            primaryUsageLocation={primaryUsageLocation} bookingPurpose={bookingPurpose}
            onPickupLocationChange={handlePickupLocationChange}
            onDropoffLocationChange={handleDropoffLocationChange}
            onPrimaryUsageLocationChange={handlePrimaryUsageLocationChange}
            onBookingPurposeChange={handleBookingPurposeChange}
          />
        )}

        {currentStep === 1 && (
          <Step2
            dateRange={dateRange} pickupTime={pickupTime} returnTime={returnTime}
            step2Errors={step2Errors}
            onDateSelect={handleDateSelect} onPickupTimeChange={handlePickupTimeChange}
            onReturnTimeChange={handleReturnTimeChange}
            businessSettings={businessSettings} timeOptions={timeOptions} todayStart={todayStart}
          />
        )}

        {currentStep === 2 && pricingSnapshot && (
          <Step3
            pricing={pricingSnapshot} agreedToTerms={agreedToTerms}
            termsError={termsError}
            onTermsChange={handleTermsChange} onClearTermsError={clearTermsError}
            businessSettings={businessSettings} driverType={driverType}
            dateRange={dateRange} pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation} bookingPurpose={bookingPurpose}
            lateFee={lateFee}
          />
        )}

        <div className="flex gap-3 mt-8">
          <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl border-slate-300 font-medium" onClick={handlePreviousStep} disabled={currentStep === 0}>
            <ChevronLeft className="h-4 w-4 mr-1" />Previous
          </Button>
          <Button type="button" className="font-secondary flex-1 h-12 rounded-xl text-white font-semibold" onClick={currentStep === steps.length - 1 ? handleSubmit : handleNextStep}>
            {currentStep === steps.length - 1
              ? <> Confirm Booking <ArrowRight className="h-4 w-4 ml-2" /> </>
              : <> Next <ChevronRight className="h-4 w-4 ml-1" /> </>
            }
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}