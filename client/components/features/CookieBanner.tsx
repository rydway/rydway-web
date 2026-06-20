"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if the user has already accepted cookies
    const hasAccepted = localStorage.getItem("rydway_cookies_accepted");
    if (!hasAccepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("rydway_cookies_accepted", "true");
    setIsVisible(false);
  };

  const handleDecline = () => {
    // We can still hide it, but maybe note they declined non-essential cookies.
    localStorage.setItem("rydway_cookies_accepted", "false");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-20 sm:pb-6 pointer-events-none">
      <div className="max-w-4xl mx-auto pointer-events-auto">
        <div className="bg-white border border-slate-200 shadow-xl rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row gap-4 items-center justify-between font-primary">
          <div className="flex-1 pr-8 relative">
            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-0 right-0 sm:hidden text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-sm font-bold text-slate-900 mb-1">We use cookies</h3>
            <p className="text-sm text-slate-600 font-secondary">
              We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            <Button 
              variant="outline" 
              className="flex-1 sm:flex-none font-secondary"
              onClick={handleDecline}
            >
              Decline
            </Button>
            <Button 
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white font-secondary"
              onClick={handleAccept}
            >
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
