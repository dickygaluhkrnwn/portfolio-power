import React from "react";
import { cn } from "@/lib/utils";

export function TabBtn({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={cn(
        "relative flex items-center justify-center gap-2 py-2 px-4 text-xs md:text-sm font-medium transition-colors whitespace-nowrap outline-none rounded-xl",
        active 
          ? "text-white font-bold bg-white/10" 
          : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
      )}
    >
      <span className={cn(active ? "text-primary" : "opacity-70")}>{icon}</span>
      {label}
    </button>
  );
}
