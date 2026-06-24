"use client";

import { useState } from "react";
import Image from "next/image";
import { Check, Car, Shield, CreditCard, Headphones } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex font-primary">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 md:p-8 lg:p-12 relative z-10">
        <div className="max-w-md mx-auto w-full">
       
          <div className="mb-8">
            <Link href="/" className="inline-block mb-6">
            <h1 className="text-xl md:text-xl font-bold text-foreground">Rydway.</h1>
            </Link>
          </div>

          {children}
        </div>
      </div>
      

      {/* Right Side - Image Background with Overlay */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/auth4.jpg" // Make sure to add your auth1.jpg to the public folder
            alt="Rydway background"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
        </div>
        
        {/* Gradient Overlay on left side of image */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent z-0" />
        
        {/* Additional teal accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-teal-500/20 to-secondary/30 mix-blend-overlay z-0" />

        {/* Content */}
        <div className="relative z-10 p-12 flex flex-col justify-center text-white">
          <div className="max-w-md ml-8">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <h2 className="text-4xl font-bold">
                  Rent rides easy
                </h2>
              </div>
              <p className="text-lg opacity-90 mb-8 font-secondary">
                Join renters and drivers across the city. 
                Safe, reliable, and efficient transportation at your fingertips.
              </p>
            </div>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Shield className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Safe & Secure</h3>
                  <p className="text-sm opacity-90 font-secondary">
                    Verified drivers and real-time ride tracking for your peace of mind
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Flexible Payments</h3>
                  <p className="text-sm opacity-90 font-secondary">
                    Multiple payment options including cash, card, and mobile wallets
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Headphones className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">24/7 Support</h3>
                  <p className="text-sm opacity-90 font-secondary">
                    Round-the-clock customer support to assist you anytime
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Background */}
      <div className="lg:hidden absolute inset-0 -z-10 bg-gradient-to-b from-primary/10 to-transparent" />
    </div>
  );
}