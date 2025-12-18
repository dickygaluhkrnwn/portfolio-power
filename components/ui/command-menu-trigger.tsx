"use client";

import React from "react";
import { Command } from "lucide-react";

export function CommandMenuTrigger() {
  const openPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true })
    );
  };

  return (
    <>
      {/* --- MOBILE TRIGGER DIHAPUS --- */}
      
      {/* --- DESKTOP TRIGGER (Expandable Pill) --- */}
      <button
        onClick={openPalette}
        className="fixed bottom-4 right-48 z-40 hidden md:flex items-center p-1 rounded-full bg-secondary/80 text-foreground backdrop-blur-md shadow-2xl border border-white/10 hover:bg-secondary/90 transition-all group"
        aria-label="Open Command Palette"
        title="Command Menu (⌘+K)"
      >
        {/* Icon Circle */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-transparent group-hover:bg-white/5 transition-colors">
          <Command size={24} className="opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        
        {/* Text Info (Hidden by default, Reveal on Hover) */}
        <div className="max-w-0 overflow-hidden group-hover:max-w-[120px] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100">
          <div className="flex items-center gap-2 pr-5 pl-1 whitespace-nowrap">
            <span className="text-sm font-medium">Search</span>
            <kbd className="inline-flex h-5 items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
      </button>
    </>
  );
}