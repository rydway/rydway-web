"use client";

import { KYCForm } from "@/components/pages/kyc/KycForm";
import { BusinessKYCConfig } from "@/lib/config/business-kyc.config";
import { useKyc } from "@/hooks/useKyc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function BusinessKYCPage() {
  const { submitHostKyc } = useKyc();
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await submitHostKyc(data);
      toast.success(BusinessKYCConfig.successMessage);
      router.push("/dashboard/business");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit KYC. Please try again.");
    }
  };

  return <KYCForm config={BusinessKYCConfig} onSubmit={handleSubmit} />;
}