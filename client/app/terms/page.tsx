import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-primary">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <Link href="/" className="inline-flex items-center text-sm text-primary hover:underline mb-8">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Terms and Conditions</h1>
        
        <div className="space-y-6 text-slate-600 font-secondary">
          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using Rydway, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">2. User Responsibilities</h2>
            <p>Users are responsible for maintaining the confidentiality of their account and password. Rental businesses must ensure all listed vehicles meet our safety standards. Renters must possess a valid driver's license.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-slate-800 mb-3">3. Payments and Cancellations</h2>
            <p>All payments are processed securely. Cancellations must be made at least 24 hours in advance for a full refund. Late cancellations may be subject to fees as outlined by the specific rental business policy.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
