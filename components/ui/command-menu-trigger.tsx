"use client";

import React from "react";
import { Search } from "lucide-react";

export function CommandMenuTrigger() {
  // Fungsi untuk memicu Command Palette secara programatik
  // Kita menggunakan dispatchEvent untuk mensimulasikan penekanan Ctrl+K
  // Ini trik cerdas agar kita tidak perlu mengubah state global yang rumit
  const openPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true })
    );
  };

  return (
    <>
      {/* --- MOBILE TRIGGER (Floating Action Button) --- */}
      {/* Hanya muncul di layar kecil (md:hidden) */}
      <button
        onClick={openPalette}
        className="fixed bottom-8 right-8 z-40 md:hidden flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-2xl shadow-primary/30 border border-white/10 active:scale-95 transition-transform"
        aria-label="Open Command Menu"
      >
        <Search size={20} />
      </button>

      {/* --- DESKTOP HINT (Visual Cue) --- */}
      {/* Hanya muncul di layar besar (hidden md:flex) */}
      <div
        onClick={openPalette}
        className="fixed bottom-8 right-8 z-40 hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl cursor-pointer hover:bg-white/10 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-1000"
      >
        <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Command</p>
        <div className="flex items-center gap-1 text-xs font-bold text-foreground/80">
          <kbd className="bg-white/10 px-2 py-1 rounded min-w-[20px] text-center font-mono">⌘</kbd>
          <span className="text-muted-foreground">+</span>
          <kbd className="bg-white/10 px-2 py-1 rounded min-w-[20px] text-center font-mono">K</kbd>
        </div>
      </div>
    </>
  );
}