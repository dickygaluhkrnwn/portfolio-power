"use client";

import React, { useEffect, useState } from "react";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { LogOut, Plus, Pencil, Trash2, ExternalLink, RefreshCw, Grid, Share2, BookOpen, FileText } from "lucide-react";
import { getAllProjects } from "@/lib/projects-service";
import { getAllSocials, deleteSocial, SocialLink } from "@/lib/socials-service";
import { getAllPosts, deletePost, BlogPost } from "@/lib/blog-service"; // Import Blog Service
import { Project } from "@/app/data/projects";
import { deleteDoc, doc } from "firebase/firestore";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"projects" | "socials" | "blog">("projects");
  
  // States
  const [projects, setProjects] = useState<Project[]>([]);
  const [socials, setSocials] = useState<SocialLink[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]); // Blog State
  
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

  // Helper untuk redirect ke form add
  const handleAdd = () => {
    if (activeTab === "projects") router.push("/admin/projects/new");
    if (activeTab === "socials") router.push("/admin/socials/new");
    if (activeTab === "blog") router.push("/admin/blog/new");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-white/10 bg-secondary/5 backdrop-blur sticky top-0 z-50">
          <div className="container-width py-4 flex items-center justify-between">
            <h1 className="font-heading text-xl font-bold">Admin Dashboard</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">{auth.currentUser?.email}</span>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut size={16} className="mr-2" /> Logout
              </Button>
            </div>
          </div>
        </header>

        <main className="container-width py-12">
          
          {/* TAB NAVIGATION */}
          <div className="flex gap-6 mb-8 border-b border-white/10 pb-1 overflow-x-auto">
            <TabButton 
              active={activeTab === "projects"} 
              onClick={() => setActiveTab("projects")} 
              icon={<Grid size={18} />} 
              label="Projects" 
            />
            <TabButton 
              active={activeTab === "socials"} 
              onClick={() => setActiveTab("socials")} 
              icon={<Share2 size={18} />} 
              label="Social Links" 
            />
            <TabButton 
              active={activeTab === "blog"} 
              onClick={() => setActiveTab("blog")} 
              icon={<BookOpen size={18} />} 
              label="Blog Posts" 
            />
          </div>

          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-heading font-bold capitalize">
              Manage {activeTab.replace("socials", "Social Links")}
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={loadData} title="Refresh">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              </Button>
              <Button onClick={handleAdd}>
                <Plus size={18} className="mr-2" /> Add Item
              </Button>
            </div>
          </div>

          {/* TABLE CONTENT */}
          <div className="border border-white/10 rounded-xl overflow-hidden bg-secondary/5">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading data...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/20 text-muted-foreground uppercase text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium">Main Info</th>
                      <th className="px-6 py-4 font-medium">Details</th>
                      <th className="px-6 py-4 font-medium text-center">Status/Tag</th>
                      <th className="px-6 py-4 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    
                    {/* PROJECT ROWS */}
                    {activeTab === "projects" && projects.map((p) => (
                      <tr key={p.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 font-medium">{p.title}</td>
                        <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                        <td className="px-6 py-4 text-center">{p.techStack?.length || 0} Techs</td>
                        <td className="px-6 py-4 text-right">
                          <ActionButtons 
                            onView={() => window.open(`/projects/${p.id}`, '_blank')}
                            onEdit={() => router.push(`/admin/projects/${p.id}`)}
                            onDelete={() => handleDeleteProject(String(p.id))}
                          />
                        </td>
                      </tr>
                    ))}

                    {/* SOCIAL ROWS */}
                    {activeTab === "socials" && socials.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 font-medium">{s.platform}</td>
                        <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{s.url}</td>
                        <td className="px-6 py-4 text-center"><span className="badge bg-blue-500/10 text-blue-400">{s.category}</span></td>
                        <td className="px-6 py-4 text-right">
                          <ActionButtons 
                            onView={() => window.open(s.url, '_blank')}
                            onEdit={() => router.push(`/admin/socials/${s.id}`)}
                            onDelete={() => handleDeleteSocial(s.id)}
                          />
                        </td>
                      </tr>
                    ))}

                    {/* BLOG ROWS */}
                    {activeTab === "blog" && posts.map((post) => (
                      <tr key={post.id} className="hover:bg-white/5">
                        <td className="px-6 py-4 font-medium">
                          <div className="flex flex-col">
                            <span>{post.title}</span>
                            <span className="text-xs text-muted-foreground">/{post.slug}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {new Date(post.publishedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={cn("px-2 py-1 rounded text-xs font-bold", post.isPublished ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400")}>
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

                    {/* Empty State */}
                    {((activeTab === "projects" && projects.length === 0) || 
                      (activeTab === "socials" && socials.length === 0) ||
                      (activeTab === "blog" && posts.length === 0)) && (
                       <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No data found.</td></tr>
                    )}

                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Sub-components untuk kerapihan
function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 pb-3 px-2 font-medium transition-all text-sm relative whitespace-nowrap",
        active ? "text-primary" : "text-muted-foreground hover:text-white"
      )}
    >
      {icon} {label}
      {active && <motion.div layoutId="underline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
    </button>
  );
}

function ActionButtons({ onView, onEdit, onDelete }: any) {
  return (
    <div className="flex justify-end gap-2">
      <Button variant="ghost" size="sm" onClick={onView} title="View"><ExternalLink size={16}/></Button>
      <Button variant="ghost" size="sm" onClick={onEdit} title="Edit"><Pencil size={16} className="text-blue-400"/></Button>
      <Button variant="ghost" size="sm" onClick={onDelete} title="Delete"><Trash2 size={16} className="text-red-400"/></Button>
    </div>
  );
}