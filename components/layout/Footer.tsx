import React from "react";
import { Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-primary mb-4 font-primary">Rydway</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs font-secondary">
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6 font-primary">About</h3>
            <ul className="space-y-4 font-secondary">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  How it works
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Featured
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Partnership
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Business Relation
                </a>
              </li>
            </ul>
          </div>

          {/* Community Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6 font-primary">Community</h3>
            <ul className="space-y-4 font-secondary">
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Events
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Podcast
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Invite a friend
                </a>
              </li>
            </ul>
          </div>

          {/* Socials Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-6 font-primary">Socials</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-secondary"
                >
                  <Instagram className="h-4 w-4" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors font-secondary"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
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
            <a
              href="#"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Privacy & Policy
            </a>
            <a
              href="#"
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
            >
              Terms & Condition
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}