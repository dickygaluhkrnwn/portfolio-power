"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, ShieldAlert, User, ChevronDown, Globe, 
  LayoutDashboard, Grid, ShoppingBag, BookOpen, Briefcase, Share2 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  actionButton?: React.ReactNode;
}

const navItems = [
  { path: "/admin/dashboard", icon: <LayoutDashboard size={14} />, label: "Overview" },
  { path: "/admin/projects", icon: <Grid size={14} />, label: "Projects" },
  { path: "/admin/services", icon: <ShoppingBag size={14} />, label: "Services" },
  { path: "/admin/blog", icon: <BookOpen size={14} />, label: "Blog" },
  { path: "/admin/journey", icon: <Briefcase size={14} />, label: "Journey" },
  { path: "/admin/socials", icon: <Share2 size={14} />, label: "Socials" },
];

export function AdminLayout({ children, title, description, actionButton }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    setIsMenuOpen(false);
    await auth.signOut();
    router.push("/admin/login");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-foreground relative overflow-hidden pb-24 md:pb-12">
        {/* Background FX */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
          <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        {/* HEADER COMMAND CENTER */}
        <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50 pt-2">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between h-16 gap-4 mb-2">
              {/* Logo */}
              <div className="flex items-center gap-3 lg:w-[25%] shrink-0 justify-start">
                <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-xl overflow-hidden shadow-lg shadow-primary/20 bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0">
                  <img src="/icon-192.png" alt="IKY Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="font-heading text-lg font-bold text-white tracking-wide">
                  System<span className="text-primary font-light">Admin</span>
                </h1>
              </div>

              {/* Desktop Tabs */}
              <nav className="hidden lg:flex items-center justify-center h-full gap-1 flex-1">
                {navItems.map((item) => (
                  <TabButton key={item.path} item={item} currentPath={pathname} layoutIdPrefix="desktop" />
                ))}
              </nav>
              
              {/* User Profile */}
              <div className="flex items-center lg:w-[25%] justify-end shrink-0 relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={cn(
                    "flex items-center gap-2 md:gap-3 p-1.5 md:pr-4 rounded-full transition-all outline-none border",
                    isMenuOpen ? "bg-white/10 border-white/20" : "bg-white/5 border-white/10 hover:bg-white/10"
                  )}
                >
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-sm overflow-hidden shrink-0">
                    <User size={14} />
                  </div>
                  <div className="hidden md:flex flex-col items-start text-left max-w-[120px]">
                    <span className="text-xs font-bold text-white truncate w-full">Administrator</span>
                  </div>
                  <ChevronDown size={14} className={cn("text-gray-400 hidden md:block transition-transform duration-200", isMenuOpen && "rotate-180")} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsMenuOpen(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-14 right-0 w-64 rounded-2xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl shadow-2xl py-2 z-50 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-white/5 mb-1 flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shrink-0">
                            <User size={16} />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <p className="text-sm font-bold text-white truncate">{auth.currentUser?.email || "Admin User"}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                              </span>
                              <p className="text-[10px] text-emerald-400 uppercase tracking-wider font-bold">Online</p>
                            </div>
                          </div>
                        </div>
                        <Link href="/" onClick={() => setIsMenuOpen(false)}>
                          <div className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-white/5 transition-colors font-medium text-gray-300 hover:text-white">
                            <Globe className="h-4 w-4 mr-3 text-blue-400" /><span>Lihat Web Publik</span>
                          </div>
                        </Link>
                        <div className="h-px bg-white/5 my-1" />
                        <button onClick={handleLogout} className="w-full flex items-center px-4 py-2.5 text-sm hover:bg-red-500/10 transition-colors text-red-400 font-bold hover:text-red-300 outline-none">
                          <LogOut className="h-4 w-4 mr-3" /><span>Keluar Akun</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Tabs */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-0 [&::-webkit-scrollbar]:hidden">
              {navItems.map((item) => (
                <TabButton key={item.path} item={item} currentPath={pathname} layoutIdPrefix="mobile" />
              ))}
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-10 relative z-10">
          {(title || description || actionButton) && (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-8">
              <div>
                {title && <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2">{title}</h2>}
                {description && <p className="text-gray-400 text-sm md:text-base">{description}</p>}
              </div>
              {actionButton}
            </div>
          )}
          
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </ProtectedRoute>
  );
}

function TabButton({ item, currentPath, layoutIdPrefix }: any) {
  // Pengecekan route aktif (khusus dashboard exact match, yang lain startsWith biar sub-halamannya tetap menyala)
  const active = item.path === "/admin/dashboard" ? currentPath === item.path : currentPath.startsWith(item.path);
  
  return (
    <Link
      href={item.path}
      className={cn(
        "relative flex items-center justify-center gap-2 px-4 py-4 text-sm font-medium transition-colors whitespace-nowrap outline-none",
        active ? "text-white font-bold" : "text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]"
      )}
    >
      <span className="opacity-70">{item.icon}</span>
      {item.label}
      {active && (
        <motion.div
          layoutId={`admin-header-tab-${layoutIdPrefix}`}
          className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}