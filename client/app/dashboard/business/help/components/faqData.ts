import { Car, DollarSign, ShieldCheck, BarChart3, HelpCircle } from 'lucide-react';

export const businessFaqCategories = [
  {
    id: "listing",
    title: "Listing Your Vehicles",
    description: "How to add and manage your fleet on Rydway",
    icon: Car,
    questions: [
      { id: "b1", question: "How do I list my first vehicle?", answer: "Go to Fleet Management and click 'Add Vehicle'. Fill in the vehicle details including make, model, year, category, pricing, and upload high-quality photos. Your listing will be reviewed within 24 hours before going live.", helpful: 48 },
      { id: "b2", question: "How many vehicles can I list?", answer: "There is no cap on the number of vehicles you can list. You can grow your fleet at any time through the Fleet Management dashboard.", helpful: 36 },
      { id: "b3", question: "How do I set pricing for my vehicles?", answer: "Set a daily rate per vehicle. You can also configure a security deposit amount. Consider your vehicle category, age, features, and market demand when setting rates. You can update pricing at any time.", helpful: 42 },
      { id: "b4", question: "Can I block dates for my vehicle?", answer: "Yes. From the vehicle's detail page in your dashboard, you can block specific dates for maintenance, personal use, or any other reason. Blocked dates will not appear as available to renters.", helpful: 31 }
    ]
  },
  {
    id: "payouts",
    title: "Payouts & Revenue",
    description: "How earnings and payouts work on the platform",
    icon: DollarSign,
    questions: [
      { id: "b5", question: "When do I receive my payout?", answer: "Payouts are initiated after a booking is completed and the return inspection is approved. Funds typically arrive in your registered bank account within 2–5 business days.", helpful: 67 },
      { id: "b6", question: "What is Rydway's commission?", answer: "Rydway charges a platform fee on each completed booking. The exact percentage is visible during KYC setup and in your Earnings dashboard. The renter's total includes this fee transparently.", helpful: 54 },
      { id: "b7", question: "How do I update my bank account details?", answer: "Go to Settings and select the 'Bank Account' section. You can update your bank name, account number, and account name. Changes take effect on the next payout cycle.", helpful: 29 }
    ]
  },
  {
    id: "kyc-business",
    title: "Business Verification (KYC)",
    description: "Requirements and process for business verification",
    icon: ShieldCheck,
    questions: [
      { id: "b8", question: "What documents are required for business KYC?", answer: "You'll need your CAC registration certificate, CAC status report, TIN certificate, a utility bill (address proof), and valid ID for the business owner. Ensure all documents are current and legible.", helpful: 73 },
      { id: "b9", question: "How long does business verification take?", answer: "Business KYC verification typically takes 2–5 business days. You'll receive an email notification once approved or if additional documents are required.", helpful: 58 },
      { id: "b10", question: "Can I operate while my KYC is pending?", answer: "No. You must complete and pass KYC verification before you can list vehicles or receive payouts. This protects both your business and renters on the platform.", helpful: 45 }
    ]
  },
  {
    id: "bookings-management",
    title: "Managing Bookings",
    description: "Handling booking requests, approvals, and disputes",
    icon: BarChart3,
    questions: [
      { id: "b11", question: "How do I approve or decline a booking request?", answer: "Go to Bookings → Requests tab. For each request, you can view renter details, trip dates, and amount before choosing to Approve or Decline. You have 24 hours to respond before the request auto-expires.", helpful: 52 },
      { id: "b12", question: "What happens if a renter cancels?", answer: "If a renter cancels more than 24 hours before pickup, you will not receive a payout for that booking. Cancellations within 24 hours may entitle you to a partial payout based on our cancellation policy.", helpful: 39 },
      { id: "b13", question: "How do I handle a dispute with a renter?", answer: "Open a support ticket and provide all evidence including photos, messages, and booking details. Our team will review and mediate within 48 hours. Always document vehicle condition with pre and post trip photos.", helpful: 44 }
    ]
  },
  {
    id: "platform",
    title: "Platform & Account",
    description: "General platform questions for business accounts",
    icon: HelpCircle,
    questions: [
      { id: "b14", question: "How do I get my vehicles featured?", answer: "Featured status is awarded to high-performing vehicles with strong ratings, consistent availability, and good response times. You can also contact our partnership team to discuss premium placement options.", helpful: 37 },
      { id: "b15", question: "What is the fleet performance report?", answer: "The Earnings page shows a breakdown of your revenue, utilization rates, and booking trends. Use it to identify your top-performing vehicles and optimize availability for peak periods.", helpful: 41 }
    ]
  }
];
