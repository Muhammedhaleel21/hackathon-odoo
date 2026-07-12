"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface UsersSearchBarProps {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export default function UsersSearchBar({
  value,
  onChange,
  className,
}: UsersSearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      <input
        id="users-search"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name, email, phone, or ID…"
        aria-label="Search employees"
        className={cn(
          "w-full pl-9 pr-9 py-2 text-sm rounded-xl border border-slate-200 bg-white",
          "placeholder-slate-400 text-slate-900",
          "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
          "transition-shadow duration-150"
        )}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
