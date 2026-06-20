import React from "react";
import { Instagram, Twitter, Mail } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-primary mb-4 font-primary">Rydway</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm font-secondary">
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>

          {/* Socials Links */}
          <div className="lg:col-start-4">
            <h3 className="text-lg font-semibold text-foreground mb-6 font-primary">Socials</h3>
            <ul className="space-y-4">
              <li>
                <span className="flex items-center gap-2 text-sm text-muted-foreground font-secondary">
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </span>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-muted-foreground font-secondary">
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </span>
              </li>
              <li>
                <a
                  href="mailto:support@rydway.com"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-secondary"
                >
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm font-semibold text-foreground font-secondary">
            ©2025 Rydway. All rights reserved
          </p>
          <div className="flex items-center gap-8 font-secondary">
            <Link href="/privacy" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm font-semibold text-muted-foreground hover:text-primary transition-colors">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}