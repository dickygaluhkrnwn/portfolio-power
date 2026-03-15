"use client";

import React, { useState, useEffect, useRef } from "react";
import { Command } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function CommandMenuTrigger() {
  // --- STATE & REF UNTUK FITUR DRAGGABLE ---
  const isDragging = useRef(false);
  const [bounds, setBounds] = useState({ top: -1000, left: -1000, right: 0, bottom: 0 });

  // Update batasan layar agar tombol tidak bisa digeser ke luar window
  useEffect(() => {
    const updateBounds = () => {
      setBounds({
        top: -(window.innerHeight - 150),
        left: -(window.innerWidth - 150),
        right: 0,
        bottom: 80, // Memberikan ruang agar bisa digeser ke bawah
      });
    };
    updateBounds();
    window.addEventListener("resize", updateBounds);
    return () => window.removeEventListener("resize", updateBounds);
  }, []);

  const openPalette = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, ctrlKey: true })
    );
  };

  return (
    <>
      {/* --- FLOATING TRIGGER (Draggable & Expandable Glass Pill) --- */}
      <motion.button
        drag
        dragConstraints={bounds}
        dragElastic={0.1}
        dragMomentum={false}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onDragStart={() => {
          // Tandai bahwa user sedang melakukan drag, bukan klik
          isDragging.current = true;
        }}
        onDragEnd={() => {
          // Berikan jeda kecil agar event onClick tidak langsung terpicu
          setTimeout(() => {
            isDragging.current = false;
          }, 150);
        }}
        onClick={(e) => {
          // Jika user habis nge-drag, batalkan aksi buka command palette
          if (isDragging.current) {
            e.preventDefault();
            return;
          }
          openPalette();
        }}
        className={cn(
          // Posisi default: bottom-[5.5rem] (88px) menempatkannya persis di atas icon AI Chat (h-14/56px + bottom-6/24px = 80px)
          "fixed bottom-[5.5rem] right-6 z-40 flex items-center p-1.5 rounded-full bg-[#0a0a0a]/80 text-gray-400 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(0,0,0,0.5)] border border-white/10 hover:border-white/20 hover:text-white hover:bg-[#111]/90 transition-colors duration-300 group outline-none cursor-grab active:cursor-grabbing"
        )}
        style={{ touchAction: "none" }} // Mencegah layar ikut ter-scroll saat di-drag di Mobile
        aria-label="Open Command Palette"
        title="Command Menu (CTRL+K)"
      >
        {/* Icon Circle */}
        <div className="w-11 h-11 flex items-center justify-center rounded-full bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors shadow-inner pointer-events-none">
          <Command size={18} className="opacity-80 group-hover:opacity-100 group-hover:rotate-12 transition-transform duration-300" />
        </div>
        
        {/* Text Info (Hidden by default, Reveal on Hover) */}
        <div className="max-w-0 overflow-hidden group-hover:max-w-[140px] transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none">
          <div className="flex items-center gap-2 pr-4 pl-3 whitespace-nowrap">
            <span className="text-sm font-medium">Search</span>
            <kbd className="hidden md:inline-flex h-5 items-center justify-center rounded-md border border-white/20 bg-white/10 px-2 font-mono text-[10px] font-bold text-gray-300 shadow-sm">
              CTRL + K
            </kbd>
          </div>
        </div>
      </motion.button>
    </>
  );
}