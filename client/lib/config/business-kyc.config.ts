"use client";


import { KYCFormConfig } from "@/types/kyc";

export const BusinessKYCConfig: KYCFormConfig = {
  formId: "business_partner_kyc",
  title: "Business Partner Onboarding",
  description: "Complete your business KYC to start renting out vehicles",
  totalSteps: 4,
  steps: [
    {
      id: "business_identity",
      title: "Business Identity",
      description: "Please provide your business details. All fields are required.",
      fields: [
        {
          id: "legalBusinessName",
          label: "Legal Business Name",
          type: "text",
          required: true,
          icon: "Building",
          placeholder: "XYZ Nigeria Limited",
          tooltip: "Registered name with CAC",
          validation: (value: string) => value.trim() ? null : "Legal business name is required",
          grid: "full"
        },
        {
          id: "tradingName",
          label: "Trading Name",
          type: "text",
          required: true,
          placeholder: "XYZ Car Rentals",
          tooltip: "Business name used for trading",
          validation: (value: string) => value.trim() ? null : "Trading name is required",
          grid: "full"
        },
        {
          id: "businessType",
          label: "Business Type",
          type: "select",
          required: true,
          options: [
            { value: "sole", label: "Sole Proprietor" },
            { value: "partnership", label: "Partnership" },
            { value: "llc", label: "Limited Liability Company" },
          ],
          tooltip: "Legal structure of your business",
          validation: (value: string) => value ? null : "Business type is required",
          grid: "half"
        },
        {
          id: "rcNumber",
          label: "RC Number (CAC)",
          type: "text",
          required: true,
          placeholder: "RC1234567",
          tooltip: "Corporate Affairs Commission registration number",
          validation: (value: string) => value.trim() ? null : "RC number is required",
          grid: "half"
        },
        {
          id: "dateOfIncorporation",
          label: "Date of Incorporation",
          type: "date",
          required: true,
          icon: "Calendar",
          tooltip: "Date business was registered with CAC",
          validation: (value: string) => value ? null : "Date of incorporation is required",
          grid: "half"
        },
        {
          id: "businessState",
          label: "Operating State",
          type: "select",
          required: true,
          dynamic: true,
          options: [
            { value: "abuja", label: "Abuja FCT", cities: ["Abuja Municipal", "Gwagwalada", "Kuje", "Bwari", "Kwali"] },
            { value: "lagos", label: "Lagos", cities: ["Lagos Island", "Lagos Mainland", "Ikeja", "Surulere", "Mushin", "Apapa"] },
            { value: "port-harcourt", label: "Port Harcourt", cities: ["Port Harcourt City", "Obio/Akpor", "Ikwerre", "Etche"] },
          ],
          tooltip: "State where business operates",
          grid: "half"
        },
        {
          id: "businessCity",
          label: "Operating City",
          type: "select",
          required: true,
          dynamic: true,
          dependsOn: "businessState",
          tooltip: "City where business operates",
          grid: "half"
        },
        {
          id: "businessAddress",
          label: "Business Address",
          type: "text",
          required: true,
          icon: "MapPin",
          placeholder: "123 Business Street",
          tooltip: "Registered business address",
          validation: (value: string) => value.trim() ? null : "Business address is required",
          grid: "full"
        },
        {
          id: "businessPhone",
          label: "Business Phone",
          type: "tel",
          required: true,
          icon: "Phone",
          placeholder: "+234 800 000 0000",
          tooltip: "Official business contact number",
          validation: (value: string) => {
            if (!value.trim()) return "Business phone is required";
            if (value.replace(/\D/g, '').length < 10) return "Phone number is too short";
            if (value.replace(/\D/g, '').length > 15) return "Phone number is too long";
            return null;
          },
          grid: "half"
        },
        {
          id: "businessEmail",
          label: "Business Email",
          type: "email",
          required: true,
          icon: "Mail",
          placeholder: "contact@business.com",
          tooltip: "Official business email address",
          validation: (value: string) => {
            if (!value.trim()) return "Business email is required";
            // Email validation logic
            return null;
          },
          grid: "half"
        }
      ]
    },
    {
      id: "regulatory_tax",
      title: "Regulatory & Tax Information",
      description: "Provide your business tax and regulatory details.",
      fields: [
        {
          id: "tin",
          label: "Tax Identification Number (TIN)",
          type: "text",
          required: true,
          placeholder: "TIN1234567890",
          tooltip: "Issued by Federal Inland Revenue Service",
          validation: (value: string) => value.trim() ? null : "Tax Identification Number is required",
          grid: "full"
        },
        {
          id: "vatStatus",
          label: "VAT Registration Status",
          type: "select",
          required: true,
          options: [
            { value: "yes", label: "Yes - Registered" },
            { value: "no", label: "No - Not Registered" },
            { value: "pending", label: "Pending Registration" },
          ],
          tooltip: "Value Added Tax registration status",
          validation: (value: string) => value ? null : "VAT registration status is required",
          grid: "full"
        },
        {
          id: "frscFleetStatus",
          label: "FRSC Fleet Registration",
          type: "select",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          tooltip: "Federal Road Safety Corps fleet registration",
          validation: (value: string) => value ? null : "FRSC fleet registration status is required",
          grid: "half"
        },
        {
          id: "stateTransportPermit",
          label: "State Transport Permit",
          type: "select",
          required: true,
          options: [
            { value: "yes", label: "Yes" },
            { value: "no", label: "No" },
          ],
          tooltip: "State-issued transport operator permit",
          validation: (value: string) => value ? null : "State transport permit status is required",
          grid: "half"
        }
      ]
    },
    {
      id: "ownership_control",
      title: "Ownership & Control",
      description: "Provide details of the primary owner/director.",
      fields: [
        {
          id: "ownerName",
          label: "Owner / Director Full Name",
          type: "text",
          required: true,
          icon: "User",
          placeholder: "John Doe",
          tooltip: "Full name as on official documents",
          validation: (value: string) => value.trim() ? null : "Owner name is required",
          grid: "full"
        },
        {
          id: "ownerNIN",
          label: "Owner NIN",
          type: "text",
          required: true,
          placeholder: "12345678901",
          tooltip: "National Identity Number",
          validation: (value: string) => {
            if (!value.trim()) return "Owner NIN is required";
            if (value.trim().length !== 11) return "NIN must be exactly 11 digits";
            if (!/^\d+$/.test(value.trim())) return "NIN must contain only digits";
            return null;
          },
          grid: "half"
        },
        {
          id: "ownerDOB",
          label: "Owner Date of Birth",
          type: "date",
          required: true,
          icon: "Calendar",
          tooltip: "Date of birth as on ID",
          validation: (value: string) => value ? null : "Owner date of birth is required",
          grid: "half"
        },
        {
          id: "ownerPhone",
          label: "Owner Phone Number",
          type: "tel",
          required: true,
          icon: "Phone",
          placeholder: "+234 800 000 0000",
          tooltip: "Personal contact number",
          validation: (value: string) => {
            if (!value.trim()) return "Owner phone is required";
            if (value.replace(/\D/g, '').length < 10) return "Phone number is too short";
            if (value.replace(/\D/g, '').length > 15) return "Phone number is too long";
            return null;
          },
          grid: "half"
        },
        {
          id: "ownerEmail",
          label: "Owner Email",
          type: "email",
          required: true,
          icon: "Mail",
          placeholder: "owner@email.com",
          tooltip: "Personal email address",
          validation: (value: string) => {
            if (!value.trim()) return "Owner email is required";
            return null;
          },
          grid: "half"
        },
        {
          id: "ownershipPercentage",
          label: "Percentage Ownership",
          type: "number",
          required: true,
          icon: "Percent",
          placeholder: "100",
          min: 0,
          max: 100,
          tooltip: "Percentage stake in the business",
          validation: (value: string) => {
            if (!value.trim()) return "Ownership percentage is required";
            const num = parseInt(value);
            if (isNaN(num) || num < 0 || num > 100) return "Percentage must be between 0 and 100";
            return null;
          },
          grid: "full"
        }
      ]
    },
    {
      id: "documents",
      title: "Business Verification Documents",
      description: "Upload required business documents for verification.",
      fields: [
        {
          id: "cacCertificate",
          label: "CAC Certificate",
          type: "file",
          required: true,
          accept: "image/*,.pdf",
          hint: "Upload a clear copy of your CAC registration certificate",
          tooltip: "CAC registration certificate",
          validation: (value: File | null) => value ? null : "CAC certificate is required",
          grid: "full"
        },
        {
          id: "cacStatusReport",
          label: "CAC Status Report (Form CAC 1.1)",
          type: "file",
          required: true,
          accept: "image/*,.pdf",
          hint: "Upload your CAC status report showing active status",
          tooltip: "CAC status report",
          validation: (value: File | null) => value ? null : "CAC status report is required",
          grid: "full"
        },
        {
          id: "utilityBill",
          label: "Utility Bill (Business Address)",
          type: "file",
          required: true,
          accept: "image/*,.pdf",
          hint: "Recent utility bill showing business address",
          tooltip: "Proof of business address",
          validation: (value: File | null) => value ? null : "Utility bill is required",
          grid: "full"
        },
        {
          id: "taxClearanceCertificate",
          label: "Tax Clearance Certificate (Optional)",
          type: "file",
          required: false,
          accept: "image/*,.pdf",
          hint: "Most recent tax clearance certificate",
          tooltip: "Tax compliance certificate",
          grid: "full"
        }
      ]
    }
  ],
  submitText: "Complete Setup",
  successMessage: "Your business KYC has been submitted successfully!",
  disclaimer: "Your business information is encrypted and securely stored. We only use your data for verification and partnership purposes."
};