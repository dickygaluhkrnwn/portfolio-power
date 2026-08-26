"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Grid, ShoppingBag, BookOpen, Share2, Activity, ArrowRight, 
  Zap, Briefcase, Clock, Server, ShieldCheck, Cpu, Database, Network, Target, LayoutDashboard
} from "lucide-react";
import { getAllProjects } from "@/lib/projects-service";
import { getAllSocials } from "@/lib/socials-service";
import { getAllPosts } from "@/lib/blog-service"; 
import { getAllServices } from "@/lib/services-service";
import { cn } from "@/lib/utils";
import { motion, Variants } from "framer-motion";

export default function DashboardOverview() {
  const router = useRouter();
  const [stats, setStats] = useState({ projects: 0, services: 0, blog: 0, socials: 0 });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Live Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadStats() {
      try {
        const [proj, soc, blog, serv] = await Promise.all([
          getAllProjects(), getAllSocials(), getAllPosts(), getAllServices()
        ]);
        setStats({ projects: proj.length, services: serv.length, blog: blog.length, socials: soc.length });
        
        // Sort for newest first (assuming publishedAt or createdAt exists)
        const sortedBlog = blog.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        setRecentPosts(sortedBlog.slice(0, 3)); 

        const sortedProj = proj.sort((a: any, b: any) => (b.order || 0) - (a.order || 0)); // Or by date
        setRecentProjects(sortedProj.slice(0, 3));
      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <div className="pb-10">
      {/* --- GREETING & SYSTEM STATUS BANNER --- */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-2xl mt-4"
      >
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none translate-y-1/2 -translate-x-1/3" />
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Operational
            </div>
            <h2 className="text-3xl md:text-4xl font-bold font-heading text-white mb-2 flex items-center gap-3">
              <LayoutDashboard className="text-primary" size={32} />
              Welcome back, Admin.
            </h2>
            <p className="text-gray-400 text-sm md:text-base max-w-xl">
              Semua modul berjalan optimal. Anda memiliki kendali penuh atas manajemen portofolio, artikel blog, dan layanan.
            </p>
          </div>
          
          {/* Live Digital Clock */}
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-inner">
            <div className="p-3 bg-white/5 rounded-xl text-primary border border-white/5">
              <Clock size={24} className="animate-[spin_60s_linear_infinite]" />
            </div>
            <div>
              <div className="text-2xl font-mono font-bold text-white tracking-tight">
                {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </div>
              <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                {currentTime.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="w-full"
        >
          {/* --- METRIC CARDS GRID --- */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <motion.div variants={itemVariants}>
              <StatCard icon={<Grid size={20} />} label="Total Projects" value={stats.projects} color="blue" onClick={() => router.push("/admin/projects")} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard icon={<ShoppingBag size={20} />} label="Total Services" value={stats.services} color="purple" onClick={() => router.push("/admin/services")} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard icon={<BookOpen size={20} />} label="Blog Articles" value={stats.blog} color="emerald" onClick={() => router.push("/admin/blog")} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <StatCard icon={<Share2 size={20} />} label="Social Links" value={stats.socials} color="rose" onClick={() => router.push("/admin/socials")} />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
            
            {/* --- LEFT COLUMN (Col 8) --- */}
            <div className="lg:col-span-8 flex flex-col gap-6 md:gap-8">
              
              {/* Quick Actions Bento */}
              <motion.div variants={itemVariants} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400 fill-yellow-400/20" /> Aksi Cepat
                  </h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <QuickActionButton icon={<Grid />} label="New Project" onClick={() => router.push("/admin/projects/new")} color="bg-blue-500" />
                  <QuickActionButton icon={<BookOpen />} label="Write Post" onClick={() => router.push("/admin/blog/new")} color="bg-emerald-500" />
                  <QuickActionButton icon={<ShoppingBag />} label="Add Service" onClick={() => router.push("/admin/services/new")} color="bg-purple-500" />
                  <QuickActionButton icon={<Briefcase />} label="Add Journey" onClick={() => router.push("/admin/journey/new")} color="bg-orange-500" />
                </div>
              </motion.div>

              {/* Two Column Layout for Recent Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {/* Recent Activity (Blog) */}
                <motion.div variants={itemVariants} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                      <Activity size={18} className="text-primary" /> Artikel Terbaru
                    </h3>
                    <button onClick={() => router.push("/admin/blog")} className="text-[10px] font-mono uppercase tracking-widest text-primary hover:text-primary/80 flex items-center transition-colors">
                      Lihat Semua <ArrowRight size={12} className="ml-1" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3 flex-grow">
                    {recentPosts.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-4 my-auto">Belum ada artikel.</p>
                    ) : (
                      recentPosts.map((post) => (
                        <div key={post.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group cursor-pointer" onClick={() => router.push(`/admin/blog/${post.id}`)}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#0d1117] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                               {post.coverImage ? <img src={post.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <BookOpen size={14} className="text-gray-500" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-white truncate group-hover:text-primary transition-colors">{post.title}</h4>
                              <p className="text-[9px] text-gray-500 font-mono uppercase tracking-wider mt-1">{new Date(post.publishedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>

                {/* Recent Projects */}
                <motion.div variants={itemVariants} className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-xl flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                    <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
                      <Target size={18} className="text-blue-400" /> Proyek Terbaru
                    </h3>
                    <button onClick={() => router.push("/admin/projects")} className="text-[10px] font-mono uppercase tracking-widest text-blue-400 hover:text-blue-300 flex items-center transition-colors">
                      Lihat Semua <ArrowRight size={12} className="ml-1" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col gap-3 flex-grow">
                    {recentProjects.length === 0 ? (
                      <p className="text-sm text-gray-500 italic text-center py-4 my-auto">Belum ada proyek.</p>
                    ) : (
                      recentProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group cursor-pointer" onClick={() => router.push(`/admin/projects/${project.id}`)}>
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-[#0d1117] border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                               {project.thumbnail ? <img src={project.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : <Grid size={14} className="text-gray-500" />}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-xs text-white truncate group-hover:text-blue-400 transition-colors">{project.title}</h4>
                              <div className="flex items-center gap-1.5 mt-1 overflow-hidden">
                                {project.techStack?.slice(0, 2).map((tech: any, i: number) => (
                                  <span key={i} className="text-[8px] px-1.5 py-0.5 rounded bg-white/10 text-gray-400 font-mono uppercase whitespace-nowrap">{typeof tech === 'string' ? tech : tech?.name || 'TECH'}</span>
                                ))}
                                {project.techStack?.length > 2 && <span className="text-[8px] text-gray-500">+{project.techStack.length - 2}</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              </div>

            </div>

            {/* --- RIGHT COLUMN (Col 4) : SYSTEM HEALTH & INFO --- */}
            <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col gap-6 md:gap-8">
              
              {/* System Health */}
              <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none" />
                
                <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2 mb-6 pb-4 border-b border-white/5 relative z-10">
                  <Server size={20} className="text-gray-400" /> System Health
                </h3>

                <div className="space-y-6 relative z-10">
                  {/* Status Item */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300 flex items-center gap-2"><Database size={14} className="text-blue-400"/> Database (Firestore)</span>
                      <span className="text-xs font-mono text-emerald-400">Connected</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[100%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300 flex items-center gap-2"><Network size={14} className="text-purple-400"/> API Latency</span>
                      <span className="text-xs font-mono text-emerald-400">~24ms</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[15%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-300 flex items-center gap-2"><Cpu size={14} className="text-orange-400"/> System Load</span>
                      <span className="text-xs font-mono text-emerald-400">Optimal</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[24%] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/5 relative z-10">
                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-emerald-500/10 flex items-start gap-3">
                    <ShieldCheck size={20} className="text-emerald-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Keamanan Aktif</p>
                      <p className="text-xs text-gray-500 leading-relaxed">Sistem autentikasi Firebase beroperasi normal. Akses dilindungi.</p>
                    </div>
                  </div>
                </div>
              </div>

            </motion.div>

          </div>
        </motion.div>
      )}
    </div>
  );
}

// --- LOCAL UI COMPONENTS ---

function QuickActionButton({ icon, label, onClick, color }: any) {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all outline-none group text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 group-hover:scale-110 shadow-lg relative z-10",
        color, "shadow-current/20 group-hover:shadow-current/40"
      )}>
        {icon}
      </div>
      <span className="font-bold text-xs text-gray-400 group-hover:text-white transition-colors relative z-10">{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value, onClick, color }: any) {
  const colorMap: Record<string, { text: string, bg: string, border: string, shadow: string }> = {
    blue: { text: "text-blue-400", bg: "bg-blue-500/10", border: "group-hover:border-blue-500/30", shadow: "group-hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.2)]" },
    purple: { text: "text-purple-400", bg: "bg-purple-500/10", border: "group-hover:border-purple-500/30", shadow: "group-hover:shadow-[0_0_20px_-5px_rgba(168,85,247,0.2)]" },
    emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "group-hover:border-emerald-500/30", shadow: "group-hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)]" },
    rose: { text: "text-rose-400", bg: "bg-rose-500/10", border: "group-hover:border-rose-500/30", shadow: "group-hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]" },
  };

  const theme = colorMap[color] || colorMap.blue;

  return (
    <div 
      onClick={onClick} 
      className={cn(
        "bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 md:p-6 transition-all duration-300 cursor-pointer relative overflow-hidden group hover:-translate-y-1",
        theme.border, theme.shadow
      )}
    >
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-current" style={{ color: "var(--color-primary)" }} />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={cn("p-3 rounded-2xl border border-white/5 transition-transform duration-300 group-hover:scale-110", theme.bg, theme.text)}>
          {icon}
        </div>
        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-2 group-hover:translate-x-0">
          <ArrowRight size={14} className="text-gray-400" />
        </div>
      </div>
      
      <div className="relative z-10">
        <h4 className="text-3xl md:text-4xl font-bold text-white font-heading tracking-tight mb-1">{value}</h4>
        <p className="text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
      </div>
    </div>
  );
}