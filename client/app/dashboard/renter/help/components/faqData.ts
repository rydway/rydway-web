import { CalendarDays, CreditCard, Car, ShieldCheck, HelpCircle } from 'lucide-react';

export const faqCategories = [
  {
    id: "booking",
    title: "Booking & Reservations",
    description: "Learn how to book, modify, or cancel your rentals",
    icon: CalendarDays,
    questions: [
      { id: "q1", question: "How do I book a car?", answer: "To book a car, search for your desired dates and location, select a vehicle, review the details and pricing, then confirm your booking. Payment is processed securely at checkout.", helpful: 42 },
      { id: "q2", question: "Can I cancel my reservation?", answer: "Yes, you can cancel up to 24 hours before the pickup time for a full refund. Cancellations within 24 hours may incur a fee. Go to My Bookings → select booking → Cancel.", helpful: 38 },
      { id: "q3", question: "How do I modify my booking dates?", answer: "You can request a date change through My Bookings if the vehicle is available. The host must approve the change, and any price difference will be adjusted accordingly.", helpful: 29 }
    ]
  },
  {
    id: "payment",
    title: "Payments & Pricing",
    description: "Understand pricing, payments, and refunds",
    icon: CreditCard,
    questions: [
      { id: "q4", question: "What payment methods do you accept?", answer: "We accept all major debit/credit cards (Visa, Mastercard) and bank transfers via Paystack and Moniepoint. Cash payments are not accepted.", helpful: 55 },
      { id: "q5", question: "When do I pay for my rental?", answer: "Payment is required at the time of booking to secure your reservation. A security deposit is held and released within 3–5 business days after the vehicle is returned in good condition.", helpful: 47 },
      { id: "q6", question: "How do refunds work?", answer: "Refunds are processed within 5–10 business days to your original payment method. For eligible cancellations, the full amount including security deposit is returned.", helpful: 33 }
    ]
  },
  {
    id: "rental",
    title: "During Your Rental",
    description: "What to do during your active rental period",
    icon: Car,
    questions: [
      { id: "q7", question: "What if I get into an accident?", answer: "Ensure everyone's safety first and call emergency services if needed. Then contact our 24/7 support immediately. Do not admit fault. Document the scene with photos and gather witness information.", helpful: 61 },
      { id: "q8", question: "Can I extend my rental period?", answer: "Yes, subject to vehicle availability. Request an extension through the app at least 12 hours before your scheduled return. The host must approve and you'll be charged for the additional days.", helpful: 28 },
      { id: "q9", question: "What if the car breaks down?", answer: "Contact our support team immediately. Most vehicles are covered by roadside assistance. Do not attempt repairs yourself. We will arrange a replacement vehicle where possible.", helpful: 44 }
    ]
  },
  {
    id: "safety",
    title: "Safety & Insurance",
    description: "Insurance coverage and safety policies",
    icon: ShieldCheck,
    questions: [
      { id: "q10", question: "Is insurance included?", answer: "Basic third-party insurance is included with every booking. Comprehensive coverage is available as an add-on during checkout. Check the vehicle listing for specific coverage details.", helpful: 71 },
      { id: "q11", question: "What documents do I need to rent?", answer: "You need a valid driver's license, a verified Rydway account (KYC completed), and a payment method. For certain vehicle categories, additional requirements may apply.", helpful: 58 }
    ]
  },
  {
    id: "account",
    title: "Account & KYC",
    description: "Managing your account and verification",
    icon: HelpCircle,
    questions: [
      { id: "q12", question: "How do I complete KYC verification?", answer: "Go to your Profile → Verification section. Upload a clear photo of your government-issued ID and a selfie. Verification typically takes 1–2 business days.", helpful: 39 },
      { id: "q13", question: "Why was my KYC rejected?", answer: "Common reasons include blurry images, expired documents, or mismatched information. You'll receive an email with the specific reason. Resubmit with corrected documents.", helpful: 22 }
    ]
  }
];

