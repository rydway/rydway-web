"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = [
    { label: "Onboard Business", href: "#" },
    { label: "Login", href: "#" },
    { label: "Signup", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "Refer a Business", href: "#" },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-white/10 shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
        {/* Logo with primary font */}
        <span className="text-xl font-bold text-foreground font-primary">
          Rydway.
        </span>

        {/* Navigation with primary font */}
        <nav className="hidden items-center gap-8 text-sm text-muted-foreground md:flex font-primary">
          <Link href="#" className="hover:text-[#0074D1] transition-colors duration-200">
            About us
          </Link>
          <Link href="#" className="hover:text-[#0074D1] transition-colors duration-200">
            Contact
          </Link>
          <Link href="#" className="hover:text-[#0074D1] transition-colors duration-200">
            View more
          </Link>
        </nav>

        {/* Auth buttons and hamburger menu */}
        <div className="flex items-center gap-4">
          <button 
            className="hidden rounded-lg px-4 py-2 text-sm font-medium text-foreground transition hover:bg-muted font-primary md:block"
          >
           Join as Partner
          </button>
          
          {/* Popover Trigger for Mobile */}
          <div className="">
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-muted transition-colors"
                  aria-label="Toggle menu"
                >
                  <Menu size={24} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-2 mr-4 mt-2">
                <div className="flex flex-col space-y-1">
                  {menuItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-[#0074D1] rounded-md transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 pt-1">
                    <button className="w-full px-3 py-2 text-sm font-medium text-foreground hover:bg-gray-100 rounded-md text-left transition-colors">
                      Join as Partner
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>
    </header>
  );
}