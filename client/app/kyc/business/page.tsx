"use client";

import { KYCForm } from "@/components/pages/kyc/KycForm";
import { BusinessKYCConfig } from "@/lib/config/business-kyc.config";
import { useKyc } from "@/hooks/useKyc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { uploadService } from "@/services/upload.service";

export default function BusinessKYCPage() {
  const { submitHostKyc } = useKyc();
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      const payload = { ...data };
      const fileFields = ["cacCertificate", "cacStatusReport", "utilityBill", "taxClearanceCertificate"];

      for (const field of fileFields) {
        if (payload[field] instanceof File) {
          const file = payload[field] as File;
          const { uploadUrl, downloadUrl } = await uploadService.getSignUrl(file.name, file.type);
          await uploadService.uploadToSignedUrl(uploadUrl, file);
          payload[field] = downloadUrl;
        } else if (payload[field] && typeof payload[field] === "object" && Object.keys(payload[field]).length === 0) {
          // Clean up empty objects if they slip through
          delete payload[field];
        }
      }
      
      if (payload.ownershipPercentage) {
        payload.ownershipPercentage = Number(payload.ownershipPercentage);
      }

      await submitHostKyc(payload);
      toast.success(BusinessKYCConfig.successMessage);
      router.push("/dashboard/business");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit KYC. Please try again.");
    }
  };

  return <KYCForm config={BusinessKYCConfig} onSubmit={handleSubmit} />;
}