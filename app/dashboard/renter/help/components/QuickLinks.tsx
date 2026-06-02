"use client";

import { BookOpen, Shield, FileText, Lock } from "lucide-react";

export function QuickLinks() {
  const links = [
    { icon: BookOpen, title: "User Guide", description: "Learn how to use our platform", href: "#" },
    { icon: Shield, title: "Safety Tips", description: "Stay safe while renting", href: "#" },
    { icon: FileText, title: "Terms of Service", description: "Our terms and conditions", href: "#" },
    { icon: Lock, title: "Privacy Policy", description: "How we protect your data", href: "#" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-secondary">
      {links.map((link) => (
        <a
          key={link.title}
          href={link.href}
          className="p-4 bg-white border border-slate-200 rounded-lg hover:border-blue-200 hover:shadow-sm transition-all group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
              <link.icon className="h-5 w-5 text-blue-600" />
            </div>
            <h4 className="text-sm font-medium text-slate-800 mb-1">{link.title}</h4>
            <p className="text-xs text-slate-500">{link.description}</p>
          </div>
        </a>
      ))}
    </div>
  );
}
