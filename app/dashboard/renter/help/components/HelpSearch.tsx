"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HelpSearchProps {
  onSearch: (query: string) => void;
}

export function HelpSearch({ onSearch }: HelpSearchProps) {
  const [query, setQuery] = useState("");

  const handleQueryChange = (val: string) => {
    setQuery(val);
    onSearch(val);
  };

  return (
    <div className="relative max-w-2xl mx-auto font-secondary">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
        <Input
          placeholder="Search help articles, FAQs, and topics..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          className="pl-12 pr-4 h-14 text-base border-2 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-xl shadow-sm"
        />
      </div>
      <div className="absolute -bottom-6 left-4 text-xs text-slate-400">
        Popular: booking, payment, cancellation, verification
      </div>
    </div>
  );
}
