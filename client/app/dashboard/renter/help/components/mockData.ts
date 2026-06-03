import { Calendar, CreditCard, Car, Shield, LifeBuoy } from "lucide-react";
import { FAQCategory, SupportTicket } from "./types";

export const faqCategories: FAQCategory[] = [
  {
    id: "booking",
    title: "Bookings & Rentals",
    icon: Calendar,
    description: "How to book, modify, or cancel your rental",
    questions: [
      {
        id: "booking-1",
        question: "How do I book a vehicle?",
        answer: "To book a vehicle, browse our fleet, select your desired dates, choose a vehicle, and complete the checkout process. You'll need to provide your driver's license information and payment details. Once confirmed, you'll receive a booking confirmation via email.",
        related: ["booking-2", "payment-1"],
        helpful: 245
      },
      {
        id: "booking-2",
        question: "Can I modify or extend my booking?",
        answer: "Yes, you can modify or extend your booking through your dashboard. Go to 'My Bookings', select the booking you want to modify, and click 'Modify Booking'. Changes are subject to vehicle availability. Additional charges may apply for extensions.",
        related: ["booking-3", "payment-3"],
        helpful: 189
      },
      {
        id: "booking-3",
        question: "What is your cancellation policy?",
        answer: "Free cancellation is available up to 24 hours before pickup. Cancellations made within 24 hours of pickup are subject to a 50% charge. No-shows are charged the full amount. Refunds are processed within 5-7 business days.",
        helpful: 312
      },
      {
        id: "booking-4",
        question: "How early should I arrive for pickup?",
        answer: "We recommend arriving 15-30 minutes before your scheduled pickup time to complete the vehicle inspection and paperwork. If you're running late, please notify the host through the chat feature.",
        helpful: 156
      }
    ]
  },
  {
    id: "payment",
    title: "Payments & Refunds",
    icon: CreditCard,
    description: "Payment methods, invoices, and refunds",
    questions: [
      {
        id: "payment-1",
        question: "What payment methods do you accept?",
        answer: "We accept Visa, Mastercard, Verve, bank transfers, and wallet payments. All payments are securely processed. Card payments are processed immediately, while bank transfers may take 1-2 hours to reflect.",
        related: ["payment-2"],
        helpful: 203
      },
      {
        id: "payment-2",
        question: "When will I get my security deposit back?",
        answer: "Security deposits are typically released within 3-5 business days after vehicle return, pending inspection. If there are no damages or violations, the full amount is refunded to your original payment method.",
        helpful: 178
      },
      {
        id: "payment-3",
        question: "How do I request a refund?",
        answer: "Refunds for cancellations are automatically processed. If you believe you're eligible for a refund that hasn't been processed, please contact support with your booking details and transaction ID.",
        helpful: 145
      }
    ]
  },
  {
    id: "vehicle",
    title: "Vehicles & Features",
    icon: Car,
    description: "Vehicle information, features, and requirements",
    questions: [
      {
        id: "vehicle-1",
        question: "What documents do I need to rent a car?",
        answer: "You need a valid driver's license (international or local), a government-issued ID, and a verified payment method. International renters may need an International Driving Permit (IDP) depending on their country of origin.",
        helpful: 267
      },
      {
        id: "vehicle-2",
        question: "Is there a minimum age requirement?",
        answer: "The minimum age to rent is 25 years. Drivers aged 21-24 may be subject to a young driver surcharge. Some luxury and high-performance vehicles may have higher age requirements.",
        helpful: 198
      },
      {
        id: "vehicle-3",
        question: "Can I add an additional driver?",
        answer: "Yes, you can add additional drivers for a fee of ₦5,000 per day. Additional drivers must also meet all licensing requirements and be present at pickup with their valid license.",
        helpful: 134
      },
      {
        id: "vehicle-4",
        question: "What is your fuel policy?",
        answer: "All vehicles are provided with a full tank of fuel. Please return the vehicle with a full tank to avoid refueling charges. If returned with less than full tank, you'll be charged at ₦1,000 per liter plus a service fee.",
        helpful: 156
      }
    ]
  },
  {
    id: "account",
    title: "Account & Verification",
    icon: Shield,
    description: "Account management and verification",
    questions: [
      {
        id: "account-1",
        question: "How do I verify my account?",
        answer: "Go to Settings > Verification Status and follow the prompts. You'll need to upload a clear photo of your driver's license and a selfie. Verification typically takes 24-48 hours.",
        helpful: 167
      },
      {
        id: "account-2",
        question: "How do I change my password?",
        answer: "Navigate to Settings > Account Settings and click 'Change Password'. You'll need your current password and a new password (minimum 8 characters with at least one number and one special character).",
        helpful: 89
      },
      {
        id: "account-3",
        question: "I forgot my password - what should I do?",
        answer: "Click 'Forgot Password' on the login page and enter your email address. You'll receive a password reset link that expires in 24 hours. If you don't see it, check your spam folder.",
        helpful: 112
      }
    ]
  },
  {
    id: "support",
    title: "Support & Emergencies",
    icon: LifeBuoy,
    description: "Get help with issues and emergencies",
    questions: [
      {
        id: "support-1",
        question: "What should I do if I have an accident?",
        answer: "1. Ensure everyone's safety first\n2. Contact local authorities if needed\n3. Call our 24/7 emergency support at +234 800 123 4567\n4. Document the scene with photos\n5. Do not admit fault\n6. Wait for our support team to guide you through the next steps",
        helpful: 89
      },
      {
        id: "support-2",
        question: "What if the vehicle breaks down?",
        answer: "Call our 24/7 roadside assistance at +234 800 123 4568. We provide towing services, emergency repairs, and replacement vehicles if needed. Keep your booking number ready when you call.",
        helpful: 76
      },
      {
        id: "support-3",
        question: "How do I report a problem with my rental?",
        answer: "You can report issues directly through your booking page, use the in-app chat, or call our support line. For non-emergencies, creating a support ticket is the fastest way to get help.",
        helpful: 95
      }
    ]
  }
];

export const mockTickets: SupportTicket[] = [
  {
    id: "TKT-001",
    subject: "Issue with vehicle return",
    category: "vehicle",
    status: "resolved",
    priority: "medium",
    createdAt: new Date(2026, 2, 10, 14, 30),
    updatedAt: new Date(2026, 2, 12, 9, 15),
    orderNumber: "RWD-2026-0310-001",
    vehicle: "Toyota Camry 2023",
    messages: [
      {
        id: "msg-1",
        sender: "user",
        senderName: "John Doe",
        message: "I returned the vehicle but haven't received my deposit refund yet. It's been 5 days.",
        timestamp: new Date(2026, 2, 10, 14, 30),
      },
      {
        id: "msg-2",
        sender: "support",
        senderName: "Sarah (Support)",
        message: "Hi John, I've checked your booking and see that the refund was processed yesterday. It should appear in your account within 2-3 business days.",
        timestamp: new Date(2026, 2, 11, 10, 15),
      },
      {
        id: "msg-3",
        sender: "user",
        senderName: "John Doe",
        message: "Thank you Sarah, I can see it now!",
        timestamp: new Date(2026, 2, 12, 8, 45),
      },
      {
        id: "msg-4",
        sender: "support",
        senderName: "Sarah (Support)",
        message: "Great! I'm glad we could help. Is there anything else I can assist you with?",
        timestamp: new Date(2026, 2, 12, 9, 15),
      }
    ]
  },
  {
    id: "TKT-002",
    subject: "Payment not processed",
    category: "payment",
    status: "in-progress",
    priority: "high",
    createdAt: new Date(2026, 2, 14, 11, 20),
    updatedAt: new Date(2026, 2, 14, 15, 45),
    orderNumber: "RWD-2026-0314-002",
    vehicle: "Mercedes GLE",
    messages: [
      {
        id: "msg-5",
        sender: "user",
        senderName: "John Doe",
        message: "I tried to pay for my booking but the payment is stuck on 'processing' for over an hour. My card hasn't been charged yet.",
        timestamp: new Date(2026, 2, 14, 11, 20),
      },
      {
        id: "msg-6",
        sender: "support",
        senderName: "Mike (Support)",
        message: "Hi John, I can see the payment is pending. Let me investigate this for you. Could you try using a different payment method in the meantime?",
        timestamp: new Date(2026, 2, 14, 13, 30),
      },
      {
        id: "msg-7",
        sender: "user",
        senderName: "John Doe",
        message: "I tried another card and it worked. But the first payment is still showing as pending. Will it cancel automatically?",
        timestamp: new Date(2026, 2, 14, 14, 15),
      },
      {
        id: "msg-8",
        sender: "support",
        senderName: "Mike (Support)",
        message: "Yes, the pending payment will automatically cancel within 24 hours. I'll monitor it to ensure it's properly cancelled. Your booking is confirmed with the successful payment.",
        timestamp: new Date(2026, 2, 14, 15, 45),
      }
    ]
  }
];

export const supportTeam = [
  {
    name: "Sarah Johnson",
    role: "Senior Support",
    avatar: "/api/placeholder/32/32",
    availability: "online"
  },
  {
    name: "Mike Chen",
    role: "Technical Support",
    avatar: "/api/placeholder/32/32",
    availability: "busy"
  },
  {
    name: "Amara Okafor",
    role: "Customer Care",
    avatar: "/api/placeholder/32/32",
    availability: "online"
  }
];
