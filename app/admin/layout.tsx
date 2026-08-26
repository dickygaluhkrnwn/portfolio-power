"use client";

import React, { useState } from "react";
import { ProtectedRoute } from "@/lib/auth-context";
import { auth } from "@/lib/firebase";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LogOut, ShieldAlert, LayoutDashboard, Grid, 
  ShoppingBag, BookOpen, Briefcase, Share2, Box, Menu, X,
  User, ChevronDown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const SIDEBAR_ITEMS = [
  { path: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
  { path: "/admin/projects", icon: Grid, label: "Projects" },
  { path: "/admin/services", icon: ShoppingBag, label: "Services" },
  { path: "/admin/blog", icon: BookOpen, label: "Blog" },
  { 
    label: "About Profile",
    icon: User,
    subItems: [
      { path: "/admin/journey", label: "Journey Timeline", icon: Briefcase },
      { path: "/admin/skills", label: "Skills & Tech", icon: Box },
    ]
  },
  { path: "/admin/socials", icon: Share2, label: "Socials" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(true);

  // Exclude Login Page
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Hide sidebar on editor pages (e.g. /admin/skills/new or /admin/skills/123)
  const pathParts = pathname.split("/").filter(Boolean);
  const isEditorPage = pathParts.length > 2 && pathParts[1] !== "dashboard";

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/admin/login");
  };

  const ContentWrapper = (
    <div className="flex h-screen bg-[#050505] text-foreground overflow-hidden selection:bg-primary/30 selection:text-white">
      
      {/* --- DESKTOP COLLAPSIBLE SIDEBAR --- */}
      {!isEditorPage && (
        <aside className="group/sidebar hidden md:flex w-[88px] hover:w-[260px] transition-all duration-300 ease-in-out border-r border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl shrink-0 flex-col relative z-20 overflow-x-hidden">
          
          {/* Header */}
          <div className="h-20 border-b border-white/10 flex items-center px-7 w-[260px] shrink-0">
             <div className="relative w-8 h-8 rounded-xl overflow-hidden shadow-lg shadow-primary/20 bg-white/5 border border-white/10 flex items-center justify-center p-1 shrink-0">
               <img src="/icon-192.png" alt="IKY Logo" className="w-full h-full object-contain" />
             </div>
             <span className="font-heading font-bold text-lg text-white opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
               System<span className="text-primary font-light">Admin</span>
             </span>
          </div>
          
          <nav className="flex-1 py-4 w-[260px] space-y-1.5 overflow-y-auto overflow-x-hidden custom-scrollbar">
            {SIDEBAR_ITEMS.map((item, idx) => {
              if (item.subItems) {
                const isSubActive = item.subItems.some(sub => pathname === sub.path || pathname.startsWith(`${sub.path}/`));
                return (
                  <div key={idx} className="px-4">
                    <div 
                      onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                      className={cn(
                        "flex items-center px-4 py-3 rounded-xl transition-all duration-300 cursor-pointer",
                        isSubActive ? "text-primary" : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon size={20} className="shrink-0" />
                      <span className="text-sm font-bold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4 flex-1">
                        {item.label}
                      </span>
                      <ChevronDown size={16} className={cn(
                        "opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 shrink-0",
                        aboutDropdownOpen && "rotate-180"
                      )} />
                    </div>

                    {/* Dropdown Content */}
                    {aboutDropdownOpen && (
                      <div className="mt-1 space-y-1 overflow-hidden">
                        {item.subItems.map(sub => {
                          const isActive = pathname === sub.path || pathname.startsWith(`${sub.path}/`);
                          return (
                            <Link key={sub.path} href={sub.path}>
                              <div className={cn(
                                "flex items-center py-2.5 px-4 rounded-xl transition-all duration-300 cursor-pointer",
                                isActive ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-white hover:bg-white/5"
                              )}>
                                <sub.icon size={16} className="shrink-0 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 ml-[36px]" />
                                <span className="text-xs font-bold opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-3">
                                  {sub.label}
                                </span>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              // Normal Menu
              const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
              const Icon = item.icon;
              return (
                <div key={item.path} className="px-4">
                  <Link href={item.path!}>
                    <div className={cn(
                      "flex items-center px-4 py-3 rounded-xl transition-all duration-300 relative group cursor-pointer",
                      isActive ? "bg-primary/10 text-primary" : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}>
                      {isActive && (
                        <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20" />
                      )}
                      <Icon size={20} className="shrink-0 relative z-10" />
                      <span className="text-sm font-bold relative z-10 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
                        {item.label}
                      </span>
                    </div>
                  </Link>
                </div>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-white/10 w-[260px] shrink-0">
            <button onClick={handleLogout} className="flex items-center px-4 py-3 w-[calc(100%-32px)] ml-4 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold group">
              <LogOut size={20} className="shrink-0 group-hover:-translate-x-1 transition-transform" /> 
              <span className="opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300 whitespace-nowrap ml-4">
                Sign Out
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* --- MOBILE SIDEBAR --- */}
      {!isEditorPage && (
        <>
          <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-xl z-30 flex items-center justify-between px-4">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl shadow-lg shadow-primary/20 bg-white/5 border border-white/10 flex items-center justify-center p-1">
                 <img src="/icon-192.png" alt="Logo" className="w-full h-full object-contain" />
               </div>
               <span className="font-heading font-bold text-white">System<span className="text-primary font-light">Admin</span></span>
             </div>
             <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-gray-400 hover:text-white">
               {mobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
             </button>
          </div>
          
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div 
                initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="md:hidden fixed inset-0 z-40 bg-[#0a0a0a] border-r border-white/10 flex flex-col pt-16"
              >
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                  {SIDEBAR_ITEMS.map((item, idx) => {
                    if (item.subItems) {
                      return (
                        <div key={idx} className="space-y-1">
                           <div className="flex items-center gap-3 px-4 py-4 rounded-xl text-gray-400 border-b border-white/5">
                             <item.icon size={18} />
                             <span className="text-base font-bold flex-1">{item.label}</span>
                           </div>
                           <div className="pl-6 space-y-1 mt-2">
                             {item.subItems.map(sub => {
                               const isActive = pathname === sub.path || pathname.startsWith(`${sub.path}/`);
                               return (
                                 <Link key={sub.path} href={sub.path} onClick={() => setMobileMenuOpen(false)}>
                                   <div className={cn(
                                     "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                     isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-400"
                                   )}>
                                     <sub.icon size={16} />
                                     <span className="text-sm font-bold">{sub.label}</span>
                                   </div>
                                 </Link>
                               )
                             })}
                           </div>
                        </div>
                      )
                    }

                    const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                    const Icon = item.icon;
                    return (
                      <Link key={item.path!} href={item.path!} onClick={() => setMobileMenuOpen(false)}>
                        <div className={cn(
                          "flex items-center gap-3 px-4 py-4 rounded-xl transition-all duration-300 relative",
                          isActive ? "bg-primary/10 text-primary border border-primary/20" : "text-gray-400"
                        )}>
                          <Icon size={18} />
                          <span className="text-base font-bold">{item.label}</span>
                        </div>
                      </Link>
                    )
                  })}
                </nav>
                <div className="p-6 border-t border-white/10 pb-8">
                  <button onClick={handleLogout} className="flex items-center justify-center gap-3 px-4 py-4 w-full rounded-xl bg-red-500/10 text-red-400 font-bold">
                    <LogOut size={18} /> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* --- MAIN CONTENT AREA --- */}
      <main className={cn(
        "flex-1 relative overflow-y-auto custom-scrollbar",
        !isEditorPage ? "mt-16 md:mt-0 p-4 md:p-8 lg:p-12" : ""
      )}>
        {/* Background Ambient */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        
        <div className="relative z-10 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );

  return (
    <ProtectedRoute>
      {ContentWrapper}
    </ProtectedRoute>
  );
}
