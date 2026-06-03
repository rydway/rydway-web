"use client";

import { KYCForm } from "@/components/pages/kyc/KycForm";
import { RenterKYCConfig } from "@/lib/config/renter-kyc.config";
import { useKyc } from "@/hooks/useKyc";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RenterKYCPage() {
  const { submitRenterKyc } = useKyc();
  const router = useRouter();

  const handleSubmit = async (data: Record<string, any>) => {
    try {
      await submitRenterKyc(data);
      toast.success(RenterKYCConfig.successMessage);
      router.push("/dashboard/renter");
    } catch (err: any) {
      toast.error(err?.message || "Failed to submit KYC. Please try again.");
    }
  };

  return <KYCForm config={RenterKYCConfig} onSubmit={handleSubmit} />;
}