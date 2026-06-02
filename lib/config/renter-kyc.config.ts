import { KYCFormConfig } from "@/@types/kyc";

export const RenterKYCConfig: KYCFormConfig = {
  formId: "renter_onboarding",
  title: "Renter Onboarding",
  description: "Complete your KYC to start renting vehicles",
  totalSteps: 4,
  steps: [
    {
      id: "personal_info",
      title: "Personal Information",
      description: "Please provide your personal details. All fields are required.",
      fields: [
        {
          id: "fullName",
          label: "Full Name",
          type: "text",
          required: true,
          icon: "User",
          placeholder: "John Doe",
          tooltip: "Enter your full name as it appears on your ID",
          validation: (value: string) => value.trim() ? null : "Full name is required",
          grid: "full"
        },
        {
          id: "dateOfBirth",
          label: "Date of Birth",
          type: "date",
          required: true,
          icon: "Calendar",
          tooltip: "You must be at least 18 years old",
          validation: (value: string) => value ? null : "Date of birth is required",
          grid: "half"
        },
        {
          id: "phoneNumber",
          label: "Phone Number",
          type: "tel",
          required: true,
          icon: "Phone",
          placeholder: "+234 800 000 0000",
          tooltip: "Enter a valid phone number with country code",
          validation: (value: string) => {
            if (!value.trim()) return "Phone number is required";
            return null;
          },
          grid: "half"
        },
        {
          id: "state",
          label: "State",
          type: "select",
          required: true,
          dynamic: true,
          options: [
            { value: "abuja", label: "Abuja FCT", cities: ["Abuja Municipal", "Gwagwalada", "Kuje", "Bwari", "Kwali"] },
            { value: "lagos", label: "Lagos", cities: ["Lagos Island", "Lagos Mainland", "Ikeja", "Surulere", "Mushin", "Apapa"] },
            { value: "port-harcourt", label: "Port Harcourt", cities: ["Port Harcourt City", "Obio/Akpor", "Ikwerre", "Etche"] },
          ],
          tooltip: "Currently serving Abuja, Lagos, and Port Harcourt",
          grid: "half"
        },
        {
          id: "city",
          label: "City",
          type: "select",
          required: true,
          dynamic: true,
          dependsOn: "state",
          tooltip: "Select your city within the chosen state",
          grid: "half"
        },
        {
          id: "address",
          label: "Street Address",
          type: "text",
          required: true,
          icon: "MapPin",
          placeholder: "123 Main Street",
          tooltip: "Enter your complete street address",
          validation: (value: string) => value.trim() ? null : "Address is required",
          grid: "full"
        },
        {
          id: "emergencyContactName",
          label: "Emergency Contact Name",
          type: "text",
          required: true,
          placeholder: "Contact Name",
          tooltip: "Person to contact in case of emergency",
          validation: (value: string) => value.trim() ? null : "Emergency contact name is required",
          grid: "half"
        },
        {
          id: "emergencyContactPhone",
          label: "Emergency Contact Phone",
          type: "tel",
          required: true,
          placeholder: "Phone Number",
          tooltip: "Emergency contact's phone number",
          validation: (value: string) => {
            if (!value.trim()) return "Emergency contact phone is required";
            return null;
          },
          grid: "half"
        },
        {
          id: "drivingChoice",
          label: "Will you be driving yourself?",
          type: "select",
          required: true,
          options: [
            { value: "yes", label: "Yes, I'll drive myself", icon: "Car" },
            { value: "no", label: "No, I need a driver", icon: "User" },
            { value: "both", label: "Both, depends on the trip", icon: "Car" },
          ],
          tooltip: "Choose your preferred driving option",
          info: (value: string) => {
            const infoMap: Record<string, { title: string; description: string }> = {
              yes: {
                title: "Self-driving",
                description: "You can rent and drive vehicles yourself"
              },
              no: {
                title: "Driver Required",
                description: "You will need a driver for all bookings"
              },
              both: {
                title: "Flexible Driving Options",
                description: "You can choose between self-driving or with a driver"
              }
            };
            return value ? infoMap[value] : null;
          },
          grid: "full"
        }
      ]
    },
    {
      id: "documents",
      title: "Document Verification",
      description: "Upload required documents for identity verification.",
      fields: [
        {
          id: "identificationType",
          label: "Means of Identification",
          type: "select",
          required: true,
          options: [
            { value: "nin", label: "National Identity Number (NIN)", icon: "FileText" },
            { value: "passport", label: "International Passport", icon: "Shield" },
          ],
          tooltip: "Choose either NIN or International Passport",
          validation: (value: string) => value ? null : "Please select an identification type",
          grid: "full"
        },
        {
          id: "identificationFile",
          label: "Upload ID Document",
          type: "file",
          required: true,
          accept: "image/*",
          hint: (formData: any) => `Upload a clear photo of your ${formData?.identificationType === 'nin' ? 'NIN slip or card' : 'passport bio-data page'}`,
          tooltip: "ID document for verification",
          validation: (value: File | null) => value ? null : "Please upload your ID document",
          grid: "full"
        },
        {
          id: "selfieFile",
          label: "Selfie Verification",
          type: "file",
          required: true,
          accept: "image/*",
          capture: "user",
          hint: "Take a clear photo of your face holding your ID",
          tooltip: "Selfie for face verification",
          validation: (value: File | null) => value ? null : "Please upload a selfie for verification",
          grid: "full"
        },
        {
          id: "driverLicenseSection",
          label: "Driver's License",
          type: "conditional",
          condition: (formData: any) => formData?.drivingChoice !== 'no',
          fields: [
            {
              id: "driverLicenseNumber",
              label: "License Number",
              type: "text",
              required: true,
              placeholder: "DL12345678",
              tooltip: "Enter your driver's license number",
              validation: (value: string) => value.trim() ? null : "Driver license number is required",
              grid: "half"
            },
            {
              id: "driverLicenseExpiry",
              label: "Expiry Date",
              type: "date",
              required: true,
              tooltip: "License must be valid for at least 6 months",
              validation: (value: string) => value ? null : "Expiry date is required",
              grid: "half"
            },
            {
              id: "driverLicenseFile",
              label: "Upload Driver's License (Front)",
              type: "file",
              required: true,
              accept: "image/*",
              hint: "Upload a clear photo of the front of your driver's license",
              tooltip: "Driver's license document",
              validation: (value: File | null) => value ? null : "Please upload driver license",
              grid: "full"
            }
          ]
        }
      ]
    },
    {
      id: "preferences",
      title: "Rental Preferences",
      description: "Tell us about your rental preferences (Optional)",
      fields: [
        {
          id: "preferredCarType",
          label: "Preferred Car Type",
          type: "select",
          required: false,
          options: [
            { value: "luxury", label: "Luxury" },
            { value: "casual", label: "Casual" },
            { value: "family", label: "Family" },
          ],
          tooltip: "Choose your preferred vehicle category",
          grid: "half"
        },
        {
          id: "primaryRentalPurpose",
          label: "Primary Rental Purpose",
          type: "select",
          required: false,
          options: [
            { value: "business", label: "Business / Work" },
            { value: "personal", label: "Casual / Personal" },
            { value: "events", label: "Events (weddings, parties, ceremonies)" },
            { value: "political", label: "Political / Campaign" },
            { value: "tourism", label: "Travel / Tourism" },
            { value: "corporate", label: "Corporate / Executive movement" },
            { value: "other", label: "Other" },
          ],
          tooltip: "Main reason for renting vehicles",
          grid: "half"
        },
        {
          id: "usageFrequency",
          label: "Usage Frequency",
          type: "select",
          required: false,
          options: [
            { value: "one-time", label: "One-time" },
            { value: "occasional", label: "Occasional" },
            { value: "frequent", label: "Frequent" },
          ],
          tooltip: "How often do you plan to rent vehicles?",
          grid: "half"
        },
        {
          id: "typicalTripType",
          label: "Typical Trip Type",
          type: "select",
          required: false,
          options: [
            { value: "short", label: "Short city trips" },
            { value: "inter-city", label: "Inter-city" },
            { value: "multi-day", label: "Multi-day" },
          ],
          tooltip: "Most common type of trips you'll take",
          grid: "half"
        },
        {
          id: "vehiclePreference",
          label: "Vehicle Preference",
          type: "select",
          required: false,
          options: [
            { value: "luxury", label: "Luxury" },
            { value: "standard", label: "Standard" },
            { value: "suv", label: "SUV" },
            { value: "bus-van", label: "Bus / Van" },
          ],
          tooltip: "Preferred vehicle type for your trips",
          grid: "full"
        }
      ]
    },
    {
      id: "review",
      title: "Review & Complete",
      description: "Review your information before submission",
      fields: [
        {
          id: "review",
          label: "Review Information",
          type: "review",
          fields: [
            {
                id: "fullName", label: "Full Name",
                type: "number"
            },
            {
                id: "dateOfBirth", label: "Date of Birth",
                type: "number"
            },
            {
                id: "phoneNumber", label: "Phone",
                type: "number"
            },
            {
                id: "address", label: "Address",
                type: "number"
            },
            {
                id: "state", label: "State", format: (value: string) => {
                    const states = [
                        { value: "abuja", label: "Abuja FCT" },
                        { value: "lagos", label: "Lagos" },
                        { value: "port-harcourt", label: "Port Harcourt" },
                    ];
                    return states.find(s => s.value === value)?.label || value;
                },
                type: "number"
            },
            {
                id: "city", label: "City",
                type: "number"
            },
            {
                id: "emergencyContactName", label: "Emergency Contact",
                type: "number"
            },
            {
                id: "drivingChoice", label: "Driving Status", format: (value: string) => {
                    const statusMap: Record<string, string> = {
                        'yes': 'Self-drive',
                        'no': 'Driver Required',
                        'both': 'Both Self-drive and Driver'
                    };
                    return statusMap[value] || value;
                },
                type: "number"
            }
          ],
          grid: "full"
        }
      ]
    }
  ],
  submitText: "Complete Setup",
  successMessage: "Your KYC has been submitted successfully!",
  disclaimer: "Your information is encrypted and securely stored. We only use your data for verification and booking purposes."
};