"use client";

import { KYCForm } from "@/components/pages/kyc/KycForm";
import { RenterKYCConfig } from "@/lib/config/renter-kyc.config";
import { useKyc } from "@/hooks/useKyc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadService } from "@/services/upload.service";

export default function RenterKYCPage() {
  const { submitRenterKyc } = useKyc();
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const payload = { ...data };
      const fileFields = ["identificationFile", "selfieFile", "driverLicenseFile"];

      for (const field of fileFields) {
        if (payload[field] instanceof File) {
          const file = payload[field] as File;
          const { uploadUrl, downloadUrl } = await uploadService.getSignUrl(file.name, file.type);
          await uploadService.uploadToSignedUrl(uploadUrl, file);
          payload[field] = downloadUrl;
        } else if (payload[field] && typeof payload[field] === "object" && Object.keys(payload[field]).length === 0) {
          delete payload[field];
        }
      }

      // Map frontend field names to backend DTO field names
      const mapped: Record<string, any> = {
        licenseNumber: payload.driverLicenseNumber || undefined,
        licenseExpiry: payload.driverLicenseExpiry ? new Date(payload.driverLicenseExpiry).toISOString() : undefined,
        licenseDocumentUrl: payload.driverLicenseFile || undefined,
        selfieUrl: payload.selfieFile,
        dateOfBirth: payload.dateOfBirth ? new Date(payload.dateOfBirth).toISOString() : undefined,
        state: payload.state,
        city: payload.city,
        address: payload.address,
        emergencyContactName: payload.emergencyContactName,
        emergencyContactPhone: payload.emergencyContactPhone,
        drivingChoice: payload.drivingChoice,
        identificationType: payload.identificationType,
        identificationDocumentUrl: payload.identificationFile,
        preferredCarType: payload.preferredCarType || undefined,
        primaryRentalPurpose: payload.primaryRentalPurpose || undefined,
        usageFrequency: payload.usageFrequency || undefined,
        typicalTripType: payload.typicalTripType || undefined,
        vehiclePreference: payload.vehiclePreference || undefined,
      };

      await submitRenterKyc(mapped);
      toast.success(RenterKYCConfig.successMessage);
      router.push("/dashboard/renter");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit KYC. Please try again.");
    }
  };

  return <KYCForm config={RenterKYCConfig} onSubmit={handleSubmit} />;
}