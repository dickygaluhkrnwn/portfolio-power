"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, BookOpen, Briefcase, Download, Sparkles } from "lucide-react"; 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Projects", path: "/projects" },
  { name: "Services", path: "/services" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

export function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (isMobileMenuOpen) return;

      if (currentScrollY > lastScrollY) {
        // Scrolling Down
        if (currentScrollY > 150) {
          setIsVisible(false);
        }
      } else {
        // Scrolling Up
        setIsVisible(true);
      }

      // Anchor concept: Only update lastScrollY if we moved significantly
      // This prevents slow scrolling from being ignored.
      if (Math.abs(currentScrollY - lastScrollY) > 5) {
        lastScrollY = currentScrollY;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Lock body scroll saat mobile menu terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] flex justify-center px-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          isScrolled ? "py-4" : "py-6",
          isVisible ? "translate-y-0 opacity-100" : "-translate-y-[120%] opacity-0"
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between px-5 md:px-6 py-3 rounded-full transition-all duration-500 w-full max-w-6xl relative overflow-hidden",
            isScrolled
              ? "bg-[#0a0a0a]/80 border border-white/10 shadow-[0_4_30px_rgba(0,0,0,0.5)] backdrop-blur-xl"
              : "bg-transparent border border-transparent"
          )}
        >
          {/* Subtle Glow inside the navbar when scrolled */}
          {isScrolled && (
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-indigo-500/10 pointer-events-none mix-blend-screen opacity-50" />
          )}

          {/* --- LOGO --- */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0 relative z-10">
            <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden group-hover:rotate-6 group-hover:scale-105 transition-all duration-300 shadow-lg shadow-primary/20 bg-white/5 border border-white/10 flex items-center justify-center p-1">
              <img src="/icon-192.png" alt="IKY Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center">
              IKY<span className="text-primary">.</span>DEV
            </span>
          </Link>

          {/* --- DESKTOP MENU --- */}
          <nav className="hidden md:flex relative z-10 items-center gap-1 bg-white/[0.03] backdrop-blur-md px-1.5 py-1.5 rounded-full border border-white/5 shadow-inner">
            {navItems.map((item) => {
              const isActive = item.path === "/" 
                ? pathname === "/" 
                : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={cn(
                    "relative px-4 lg:px-5 py-2 text-sm font-medium transition-colors rounded-full",
                    isActive ? "text-white" : "text-gray-400 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 bg-white/10 rounded-full border border-white/5"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.name === "Blog" && <BookOpen size={14} className={cn("transition-opacity", isActive ? "opacity-100 text-primary" : "opacity-50")} />}
                    {item.name === "Services" && <Briefcase size={14} className={cn("transition-opacity", isActive ? "opacity-100 text-primary" : "opacity-50")} />}
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* --- RIGHT ACTION --- */}
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            {showInstallBtn && (
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="hidden md:flex rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all animate-in fade-in zoom-in"
              >
                <Download size={14} className="mr-2" /> Install App
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex rounded-full border-white/10 bg-white/[0.02] text-gray-300 hover:bg-white hover:text-black hover:border-white transition-all h-9 px-5"
              onClick={() => window.open("/resume.pdf", "_blank")} 
            >
              Resume <Sparkles size={14} className="ml-2 text-accent" />
            </Button>

            {/* Mobile Toggle */}
            <button
              className="md:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-colors active:scale-95"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* --- MOBILE MENU OVERLAY --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#050505]/98 overflow-y-auto"
          >
            {/* Background Glow */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <button
              className="absolute top-6 right-6 text-gray-400 p-2 hover:bg-white/10 hover:text-white rounded-full transition-colors z-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={28} />
            </button>

            {/* Diubah jadi min-h-screen agar tidak bug di mobile browser */}
            <div className="flex flex-col items-center justify-center min-h-screen py-24 px-6 relative z-10 w-full">
              {navItems.map((item, idx) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className="w-full text-center py-3"
                >
                  <Link
                    href={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "inline-block font-heading text-4xl sm:text-5xl font-bold tracking-tight transition-all duration-300",
                      pathname === item.path
                        ? "text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent scale-110"
                        : "text-gray-400 hover:text-white hover:scale-105"
                    )}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-10 flex flex-col gap-4 w-full max-w-xs"
              >
                <Button
                  variant="outline"
                  onClick={() => {
                    window.open("/resume.pdf", "_blank");
                    setIsMobileMenuOpen(false);
                  }}
                  className="rounded-full bg-white/5 border-white/10 text-white hover:bg-white hover:text-black transition-all text-base py-6 h-auto"
                >
                  Download Resume <Sparkles size={16} className="ml-2" />
                </Button>

                {showInstallBtn && (
                  <Button
                    onClick={() => {
                      handleInstallClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className="rounded-full bg-primary/20 text-primary hover:bg-primary hover:text-white border border-primary/20 transition-all text-base py-6 h-auto"
                  >
                    <Download size={18} className="mr-2" /> Install App
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}