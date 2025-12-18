"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { 
  LogOut, Plus, Pencil, Trash2, ExternalLink, RefreshCw, 
  Grid, Share2, BookOpen, Briefcase, ShoppingBag, MoreVertical 
} from "lucide-react";
import { getAllProjects } from "@/lib/projects-service";
import { getAllSocials, deleteSocial, SocialLink } from "@/lib/socials-service";
import { getAllPosts, deletePost, BlogPost } from "@/lib/blog-service"; 
import { getAllJourneyItems, deleteJourneyItem, JourneyItem } from "@/lib/journey-service";
import { getAllServices, deleteService } from "@/lib/services-service";
import { ServicePackage } from "@/app/data/services"; 
import { Project } from "@/app/data/projects";
import { deleteDoc, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "socials" | "blog" | "journey" | "services">("projects");
  
  // States
  const [projects, setProjects] = useState<Project[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [journeyItems, setJourneyItems] = useState<JourneyItem[]>([]);
  const [services, setServices] = useState<ServicePackage[]>([]);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    if (activeTab === "projects") {
      const data = await getAllProjects();
      setProjects(data);
    } else if (activeTab === "socials") {
      const data = await getAllSocials();
      setSocials(data);
    } else if (activeTab === "blog") {
      const data = await getAllPosts();
      setPosts(data);
    } else if (activeTab === "journey") {
      const data = await getAllJourneyItems();
      setJourneyItems(data);
    } else if (activeTab === "services") {
      const data = await getAllServices();
      setServices(data);
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    await auth.signOut();
    router.push("/admin/login");
  };

  // Delete Handlers
  const handleDeleteProject = async (id: string) => {
    if (confirm("Delete this project?")) {
      await deleteDoc(doc(db, "projects", id));
      loadData();
    }
  };

  const handleDeleteSocial = async (id: string) => {
    if (confirm("Delete this link?")) {
      await deleteSocial(id);
      loadData();
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm("Delete this article?")) {
      await deletePost(id);
      loadData();
    }
  };

  const handleDeleteJourney = async (id: string) => {
    if (confirm("Delete this journey item?")) {
      await deleteJourneyItem(id);
      loadData();
    }
  };

  const handleDeleteService = async (id: string) => {
    if (confirm("Delete this service package?")) {
      await deleteService(id);
      loadData();
    }
  };

  const handleAdd = () => {
    if (activeTab === "projects") router.push("/admin/projects/new");
    if (activeTab === "socials") router.push("/admin/socials/new");
    if (activeTab === "blog") router.push("/admin/blog/new");
    if (activeTab === "journey") router.push("/admin/journey/new");
    if (activeTab === "services") router.push("/admin/services/new");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground pb-24 md:pb-12">
        
        {/* Header - Mobile & Desktop */}
        <header className="border-b border-white/10 bg-background/80 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center justify-between">
            <h1 className="font-heading text-lg md:text-xl font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Admin Panel
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-xs md:text-sm text-muted-foreground hidden sm:inline">{auth.currentUser?.email}</span>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </header>

        <main className="container-width py-8">
          
          {/* TAB NAVIGATION (Scrollable) */}
          <div className="mb-8 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0">
            <div className="flex gap-2 min-w-max">
              <TabButton 
                active={activeTab === "projects"} 
                onClick={() => setActiveTab("projects")} 
                icon={<Grid size={16} />} 
                label="Projects" 
              />
              <TabButton 
                active={activeTab === "services"} 
                onClick={() => setActiveTab("services")} 
                icon={<ShoppingBag size={16} />} 
                label="Services" 
              />
              <TabButton 
                active={activeTab === "journey"} 
                onClick={() => setActiveTab("journey")} 
                icon={<Briefcase size={16} />} 
                label="Journey" 
              />
              <TabButton 
                active={activeTab === "blog"} 
                onClick={() => setActiveTab("blog")} 
                icon={<BookOpen size={16} />} 
                label="Blog" 
              />
              <TabButton 
                active={activeTab === "socials"} 
                onClick={() => setActiveTab("socials")} 
                icon={<Share2 size={16} />} 
                label="Links" 
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div>
              <h2 className="text-2xl font-heading font-bold capitalize">
                Manage {activeTab}
              </h2>
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading..." : `Total items: ${
                  activeTab === "projects" ? projects.length :
                  activeTab === "services" ? services.length :
                  activeTab === "journey" ? journeyItems.length :
                  activeTab === "blog" ? posts.length : socials.length
                }`}
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" onClick={loadData} title="Refresh" className="px-3">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </Button>
              <Button onClick={handleAdd} className="flex-1 md:flex-none">
                <Plus size={18} className="mr-2" /> Add New
              </Button>
            </div>
          </div>

          {/* CONTENT AREA */}
          <div className="min-h-[300px]">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
                <RefreshCw className="animate-spin w-8 h-8 opacity-50" />
                <p>Syncing data...</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  
                  {/* --- MOBILE VIEW: CARD LIST --- */}
                  <div className="md:hidden space-y-4">
                    
                    {/* Projects Cards */}
                    {activeTab === "projects" && projects.map((p) => (
                      <MobileCard key={p.id} title={p.title} subtitle={p.category} status={`${p.techStack?.length || 0} Techs`}>
                        <ActionButtons 
                          onView={() => window.open(`/projects/${p.id}`, '_blank')}
                          onEdit={() => router.push(`/admin/projects/${p.id}`)}
                          onDelete={() => handleDeleteProject(String(p.id))}
                        />
                      </MobileCard>
                    ))}

                    {/* Services Cards */}
                    {activeTab === "services" && services.map((s) => (
                      <MobileCard key={s.id} title={s.title} subtitle={`${s.price} • ${s.duration}`} status={s.recommended ? "Recommended" : ""}>
                        <ActionButtons 
                          onEdit={() => router.push(`/admin/services/${s.id}`)}
                          onDelete={() => handleDeleteService(s.id)}
                        />
                      </MobileCard>
                    ))}

                    {/* Journey Cards */}
                    {activeTab === "journey" && journeyItems.map((item) => (
                      <MobileCard key={item.id} title={item.role} subtitle={item.year} status={item.type}>
                        <ActionButtons 
                          onEdit={() => router.push(`/admin/journey/${item.id}`)}
                          onDelete={() => handleDeleteJourney(item.id)}
                        />
                      </MobileCard>
                    ))}

                    {/* Blog Cards */}
                    {activeTab === "blog" && posts.map((post) => (
                      <MobileCard key={post.id} title={post.title} subtitle={new Date(post.publishedAt).toLocaleDateString()} status={post.isPublished ? "Published" : "Draft"}>
                        <ActionButtons 
                          onView={() => window.open(`/blog/${post.slug}`, '_blank')}
                          onEdit={() => router.push(`/admin/blog/${post.id}`)}
                          onDelete={() => handleDeletePost(post.id)}
                        />
                      </MobileCard>
                    ))}

                    {/* Socials Cards */}
                    {activeTab === "socials" && socials.map((s) => (
                      <MobileCard key={s.id} title={s.platform} subtitle={s.url} status={s.category}>
                        <ActionButtons 
                          onView={() => window.open(s.url, '_blank')}
                          onEdit={() => router.push(`/admin/socials/${s.id}`)}
                          onDelete={() => handleDeleteSocial(s.id)}
                        />
                      </MobileCard>
                    ))}

                    {/* Empty State */}
                    {/* Logic cek kosong sama seperti di desktop, disederhanakan */}
                  </div>

                  {/* --- DESKTOP VIEW: TABLE --- */}
                  <div className="hidden md:block border border-white/10 rounded-xl overflow-hidden bg-secondary/5">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/20 text-muted-foreground uppercase text-xs">
                          <tr>
                            <th className="px-6 py-4 font-medium">Main Info</th>
                            <th className="px-6 py-4 font-medium">Details</th>
                            <th className="px-6 py-4 font-medium text-center">Status</th>
                            <th className="px-6 py-4 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          
                          {activeTab === "projects" && projects.map((p) => (
                            <tr key={p.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-medium">{p.title}</td>
                              <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                              <td className="px-6 py-4 text-center">
                                <span className="px-2 py-1 rounded-full bg-white/5 text-xs border border-white/10">{p.techStack?.length || 0} Techs</span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <ActionButtons 
                                  onView={() => window.open(`/projects/${p.id}`, '_blank')}
                                  onEdit={() => router.push(`/admin/projects/${p.id}`)}
                                  onDelete={() => handleDeleteProject(String(p.id))}
                                />
                              </td>
                            </tr>
                          ))}

                          {activeTab === "services" && services.map((s) => (
                            <tr key={s.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-medium">{s.title}</td>
                              <td className="px-6 py-4 text-muted-foreground">{s.price} • {s.duration}</td>
                              <td className="px-6 py-4 text-center">
                                {s.recommended && <span className="bg-yellow-500/10 text-yellow-400 px-2 py-1 rounded text-xs font-bold border border-yellow-500/20">Recommended</span>}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <ActionButtons 
                                  onEdit={() => router.push(`/admin/services/${s.id}`)}
                                  onDelete={() => handleDeleteService(s.id)}
                                />
                              </td>
                            </tr>
                          ))}

                          {activeTab === "journey" && journeyItems.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-medium">{item.role}</td>
                              <td className="px-6 py-4 text-muted-foreground">{item.year}</td>
                              <td className="px-6 py-4 text-center capitalize">{item.type}</td>
                              <td className="px-6 py-4 text-right">
                                <ActionButtons 
                                  onEdit={() => router.push(`/admin/journey/${item.id}`)}
                                  onDelete={() => handleDeleteJourney(item.id)}
                                />
                              </td>
                            </tr>
                          ))}

                          {activeTab === "socials" && socials.map((s) => (
                            <tr key={s.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-medium">{s.platform}</td>
                              <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{s.url}</td>
                              <td className="px-6 py-4 text-center capitalize">{s.category}</td>
                              <td className="px-6 py-4 text-right">
                                <ActionButtons 
                                  onView={() => window.open(s.url, '_blank')}
                                  onEdit={() => router.push(`/admin/socials/${s.id}`)}
                                  onDelete={() => handleDeleteSocial(s.id)}
                                />
                              </td>
                            </tr>
                          ))}

                          {activeTab === "blog" && posts.map((post) => (
                            <tr key={post.id} className="hover:bg-white/5 transition-colors">
                              <td className="px-6 py-4 font-medium">{post.title}</td>
                              <td className="px-6 py-4 text-muted-foreground text-xs">
                                {new Date(post.publishedAt).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium border",
                                  post.isPublished 
                                    ? "bg-green-500/10 text-green-400 border-green-500/20" 
                                    : "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                )}>
                                  {post.isPublished ? "Published" : "Draft"}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <ActionButtons 
                                  onView={() => window.open(`/blog/${post.slug}`, '_blank')}
                                  onEdit={() => router.push(`/admin/blog/${post.id}`)}
                                  onDelete={() => handleDeletePost(post.id)}
                                />
                              </td>
                            </tr>
                          ))}

                        </tbody>
                      </table>
                    </div>
                  </div>

                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Sub-components
function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 py-2 px-4 rounded-full text-sm font-medium transition-all whitespace-nowrap border",
        active 
          ? "bg-primary/10 text-primary border-primary/20 shadow-lg shadow-primary/10" 
          : "bg-secondary/10 text-muted-foreground border-transparent hover:bg-secondary/20 hover:text-white"
      )}
    >
      {icon} {label}
    </button>
  );
}

// Mobile Card Component (New)
function MobileCard({ title, subtitle, status, children }: any) {
  return (
    <div className="bg-secondary/10 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="font-bold text-base line-clamp-1">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">{subtitle}</p>
        </div>
        {status && (
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/5 px-2 py-1 rounded border border-white/10 text-muted-foreground shrink-0 ml-2">
            {status}
          </span>
        )}
      </div>
      <div className="pt-3 border-t border-white/5 flex justify-end">
        {children}
      </div>
    </div>
  );
}

function ActionButtons({ onView, onEdit, onDelete }: any) {
  return (
    <div className="flex justify-end gap-1">
      {onView && (
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-500/10 hover:text-blue-400" onClick={onView} title="View">
          <ExternalLink size={16}/>
        </Button>
      )}
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-yellow-500/10 hover:text-yellow-400" onClick={onEdit} title="Edit">
        <Pencil size={16}/>
      </Button>
      <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-500/10 hover:text-red-400" onClick={onDelete} title="Delete">
        <Trash2 size={16}/>
      </Button>
    </div>
  );
}