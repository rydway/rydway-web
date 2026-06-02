"use client";

import { KYCForm } from "@/components/pages/kyc/KycForm";
import { BusinessKYCConfig } from "@/lib/config/business-kyc.config";


export default function BusinessKYCPage() {
  const handleSubmit = async (data: Record<string, any>) => {
    // API call to submit business KYC
    console.log("Business KYC Data:", data);
    
    // Example API call
    const response = await fetch("/api/kyc/business", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    
    if (response.ok) {
      // Handle success
      alert(BusinessKYCConfig.successMessage);
    } else {
      // Handle error
      alert("Failed to submit KYC. Please try again.");
    }
  };

  return <KYCForm config={BusinessKYCConfig} onSubmit={handleSubmit} />;
}