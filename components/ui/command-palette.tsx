"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Home, User, Briefcase, Mail, Github, 
  ArrowRight, Laptop, FileText, Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";

// Definisi tipe aksi
type Action = {
  id: string;
  label: string;
  icon: React.ReactNode;
  perform: () => void;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // --- DAFTAR AKSI (Command List) ---
  const actions: Action[] = [
    { id: "home", label: "Go to Home", icon: <Home className="w-4 h-4" />, perform: () => router.push("/") },
    { id: "about", label: "Go to About", icon: <User className="w-4 h-4" />, perform: () => router.push("/about") },
    { id: "projects", label: "Go to Projects", icon: <Briefcase className="w-4 h-4" />, perform: () => router.push("/projects") },
    { id: "services", label: "Go to Services", icon: <Sparkles className="w-4 h-4" />, perform: () => router.push("/services") },
    { id: "contact", label: "Go to Contact", icon: <Mail className="w-4 h-4" />, perform: () => router.push("/contact") },
    { id: "source", label: "View Source Code", icon: <Github className="w-4 h-4" />, perform: () => window.open("https://github.com/dickygaluhkrnwn", "_blank") },
    { id: "resume", label: "View Resume", icon: <FileText className="w-4 h-4" />, perform: () => window.open("/resume.pdf", "_blank") },
  ];

  // Filter aksi berdasarkan query pencarian
  const filteredActions = actions.filter((action) =>
    action.label.toLowerCase().includes(query.toLowerCase())
  );

  // --- KEYBOARD EVENT HANDLERS ---
  
  // 1. Toggle Open/Close (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 2. Navigasi List (Arrow Up/Down/Enter)
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredActions.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredActions.length) % filteredActions.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selectedAction = filteredActions[selectedIndex];
        if (selectedAction) {
          selectedAction.perform();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener("keydown", handleNavigation);
    return () => window.removeEventListener("keydown", handleNavigation);
  }, [isOpen, filteredActions, selectedIndex]);

  // Reset index saat query berubah
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Prevent scroll saat modal terbuka
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4 sm:pt-[15vh]">
          
          {/* Backdrop Blur Pekat */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container Ala Spotlight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: -20, filter: "blur(10px)" }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl bg-[#0a0a0a]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-[0_0_50px_-10px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col max-h-[65vh] sm:max-h-[500px]"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-4 border-b border-white/10 bg-white/[0.02]">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Ketik perintah atau cari rute..."
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-gray-600 text-lg font-medium"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="hidden sm:flex text-[10px] font-bold text-gray-500 border border-white/10 px-2 py-1 rounded-md bg-black/50 shadow-inner tracking-widest">
                ESC
              </div>
            </div>

            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-white/10">
              {filteredActions.length === 0 ? (
                <div className="py-12 flex flex-col items-center justify-center text-gray-500 gap-3">
                  <Search className="w-8 h-8 opacity-20" />
                  <p className="text-sm">Tidak ada aksi yang ditemukan.</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="px-3 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    Suggestions
                  </div>
                  
                  {filteredActions.map((action, index) => (
                    <button
                      key={action.id}
                      onClick={() => {
                        action.perform();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-200 outline-none",
                        index === selectedIndex
                          ? "bg-white/10 text-white border border-white/5"
                          : "text-gray-400 hover:bg-white/5 hover:text-white border border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "p-1.5 rounded-lg transition-colors",
                          index === selectedIndex ? "bg-white/10 text-white" : "bg-black/20 text-gray-500"
                        )}>
                          {action.icon}
                        </div>
                        <span className={cn("font-medium", index === selectedIndex ? "text-white" : "text-gray-300")}>
                          {action.label}
                        </span>
                      </div>
                      
                      {index === selectedIndex && (
                        <motion.div
                          layoutId="action-arrow"
                          className="text-white/50"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Tech Touch */}
            <div className="px-5 py-3 bg-[#050505] border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500">
              <div className="hidden sm:flex items-center gap-4">
                <span className="flex items-center gap-1.5"><kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded shadow-sm">↑</kbd> <kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded shadow-sm">↓</kbd> Navigasi</span>
                <span className="flex items-center gap-1.5"><kbd className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded shadow-sm">↵</kbd> Pilih</span>
              </div>
              <div className="flex sm:hidden gap-3">
                 <span>Tap untuk memilih</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono tracking-widest uppercase">
                <Laptop className="w-3.5 h-3.5 text-primary" /> IKY<span className="text-primary">.</span>OS v2.0
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}