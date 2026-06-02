"use client"; // Add this line

import { KYCForm } from "@/components/pages/kyc/KycForm";
import { RenterKYCConfig } from "@/lib/config/renter-kyc.config";

export default function RenterKYCPage() {
  const handleSubmit = async (data: Record<string, any>) => {
    // API call to submit renter KYC
    console.log("Renter KYC Data:", data);
    
    // Example API call
    const response = await fetch("/api/kyc/renter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      alert(RenterKYCConfig.successMessage);
    } else {
      alert("Failed to submit KYC. Please try again.");
    }
  };

  return <KYCForm config={RenterKYCConfig} onSubmit={handleSubmit} />;
}