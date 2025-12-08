"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Command, 
  Search, 
  Home, 
  User, 
  Briefcase, 
  Mail, 
  Github, 
  ArrowRight,
  Laptop,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

// Definisi tipe aksi
type Action = {
  id: string;
  label: string;
  icon: React.ReactNode;
  shortcut?: string[];
  perform: () => void;
};

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();

  // --- DAFTAR AKSI (Command List) ---
  const actions: Action[] = [
    {
      id: "home",
      label: "Go to Home",
      icon: <Home className="w-4 h-4" />,
      perform: () => router.push("/"),
    },
    {
      id: "about",
      label: "Go to About",
      icon: <User className="w-4 h-4" />,
      perform: () => router.push("/about"),
    },
    {
      id: "projects",
      label: "Go to Projects",
      icon: <Briefcase className="w-4 h-4" />,
      perform: () => router.push("/projects"),
    },
    {
      id: "contact",
      label: "Go to Contact",
      icon: <Mail className="w-4 h-4" />,
      perform: () => router.push("/contact"),
    },
    {
      id: "source",
      label: "View Source Code",
      icon: <Github className="w-4 h-4" />,
      perform: () => window.open("https://github.com/username/repo", "_blank"),
    },
    {
      id: "resume",
      label: "View Resume",
      icon: <FileTextIcon />,
      perform: () => window.open("/resume.pdf", "_blank"),
    },
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
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] px-4">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center px-4 py-3 border-b border-white/5">
              <Search className="w-5 h-5 text-muted-foreground mr-3" />
              <input
                autoFocus
                type="text"
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground/50 text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="text-xs text-muted-foreground border border-white/10 px-2 py-1 rounded bg-white/5">
                ESC
              </div>
            </div>

            {/* Results List */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              {filteredActions.length === 0 ? (
                <div className="py-8 text-center text-muted-foreground text-sm">
                  No results found.
                </div>
              ) : (
                <div className="space-y-1">
                  {/* Category Label (Optional) */}
                  <div className="px-2 py-1 text-xs font-medium text-muted-foreground/50 uppercase tracking-wider">
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
                        "w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all duration-200",
                        index === selectedIndex
                          ? "bg-primary text-white shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {action.icon}
                        <span className={cn(index === selectedIndex && "font-medium")}>
                          {action.label}
                        </span>
                      </div>
                      
                      {index === selectedIndex && (
                        <motion.div
                          layoutId="action-arrow"
                          className="text-white/80"
                        >
                          <ArrowRight className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-white/5 border-t border-white/5 flex items-center justify-between text-[10px] text-muted-foreground">
              <div className="flex gap-3">
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↑</kbd> <kbd className="bg-white/10 px-1 rounded">↓</kbd> to navigate</span>
                <span className="flex items-center gap-1"><kbd className="bg-white/10 px-1 rounded">↵</kbd> to select</span>
              </div>
              <div className="flex items-center gap-1">
                <Laptop className="w-3 h-3" /> <span>Portfolio OS v1.0</span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function FileTextIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  );
}