"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paymentService } from "@/services/payment.service";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("Verifying your payment...");
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    const ref = searchParams.get("reference") || searchParams.get("trxref");

    if (!ref) {
      setStatus("failed");
      setMessage("No transaction reference found. Please contact support.");
      return;
    }

    paymentService
      .verifyPayment(ref)
      .then((payment) => {
        setStatus("success");
        setAmount(payment.amount ?? null);
        setMessage("Your payment was successful! Your booking is now confirmed.");
      })
      .catch((err) => {
        console.error("Payment verification failed:", err);
        setStatus("failed");
        setMessage(
          err?.message || "Payment could not be verified. Please contact support if funds were deducted."
        );
      });
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center space-y-6">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-blue-600 mx-auto" />
            <h1 className="text-xl font-bold text-slate-800 font-primary">
              Verifying Payment
            </h1>
            <p className="text-sm text-slate-500 font-secondary">{message}</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800 font-primary">
                Payment Successful!
              </h1>
              {amount && (
                <p className="text-3xl font-bold text-green-600">
                  ₦{amount.toLocaleString()}
                </p>
              )}
              <p className="text-sm text-slate-500 font-secondary">{message}</p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full"
                onClick={() => router.push("/dashboard/renter/booking")}
              >
                View My Bookings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dashboard/renter")}
              >
                Go to Dashboard
              </Button>
            </div>
          </>
        )}

        {status === "failed" && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-800 font-primary">
                Payment Failed
              </h1>
              <p className="text-sm text-slate-500 font-secondary">{message}</p>
            </div>
            <div className="flex flex-col gap-3 pt-2">
              <Button
                className="bg-blue-600 hover:bg-blue-700 w-full"
                onClick={() => router.push("/dashboard/renter/booking")}
              >
                Back to Bookings
              </Button>
              <Button
                variant="outline"
                className="w-full text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => router.push("/support")}
              >
                Contact Support
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <PaymentCallbackContent />
    </Suspense>
  );
}
