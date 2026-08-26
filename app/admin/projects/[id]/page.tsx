"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ProtectedRoute } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Save, Loader2
} from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { Project } from "@/app/data/projects";
import { getAllSkills, SkillItem } from "@/lib/skills-service";
import { cn } from "@/lib/utils";

import { SoftwareForm } from "@/components/admin/project-form/software-form";
import { MarketingForm } from "@/components/admin/project-form/marketing-form";
import { DesignForm } from "@/components/admin/project-form/design-form";
import { PreviewCard } from "@/components/admin/project-form/preview-card";

// Initial empty state
const initialProject: Partial<Project> = {
  title: "",
  subtitle: "",
  desc: "",
  projectType: "software",
  category: "frontend",
  techStack: [],
  image: "",
  demoLink: "",
  repoLink: "",
  featured: false,
  challenge: "",
  solution: "",
  features: [],
  year: new Date().getFullYear().toString(),
  role: "",
  client: "",
};

export default function ProjectFormPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;
  const isNew = projectId === "new";

  const [formData, setFormData] = useState<Partial<Project>>(initialProject);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableSkills, setAvailableSkills] = useState<SkillItem[]>([]);

  // Load data if editing and fetch skills
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load skills
        const skills = await getAllSkills();
        setAvailableSkills(skills);
        
        // Load project if editing
        if (!isNew && projectId) {
          const docRef = doc(db, "projects", projectId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data() as Project;
            setFormData({ ...initialProject, ...data, id: docSnap.id });
          } else {
            setError("Project tidak ditemukan.");
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setError("Gagal memuat data. Periksa koneksi internet Anda.");
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [projectId, isNew]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!formData.title || !formData.desc) {
        throw new Error("Judul dan Deskripsi Utama wajib diisi.");
      }

      if (isNew) {
        const newDocRef = doc(collection(db, "projects"));
        await setDoc(newDocRef, { ...formData, id: newDocRef.id });
      } else {
        await setDoc(doc(db, "projects", projectId), formData, { merge: true });
      }
      
      router.push("/admin/projects");
    } catch (err: any) {
      console.error("Error saving project:", err);
      setError(err.message || "Gagal menyimpan project.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#050505]"><Loader2 className="animate-spin text-primary w-10 h-10" /></div>;
  }

  if (error && !formData.title && !isNew) {
     return (
        <ProtectedRoute>
          <div className="min-h-screen bg-[#050505] text-foreground flex flex-col items-center justify-center p-4">
            <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl text-center max-w-md shadow-2xl">
              <h3 className="text-2xl font-bold text-red-400 mb-2">Terjadi Kesalahan</h3>
              <p className="text-gray-400 mb-8">{error}</p>
              <Button onClick={() => router.push("/admin/projects")} className="rounded-full bg-red-500 hover:bg-red-600 text-white">
                Kembali ke Daftar Projects
              </Button>
            </div>
          </div>
        </ProtectedRoute>
     );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#050505] text-foreground pb-24 relative selection:bg-primary/30 selection:text-white">
        
        {/* Background FX */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-clip fixed">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen" />
        </div>

        {/* --- STICKY HEADER --- */}
        <header className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-xl sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => router.push("/admin/projects")} className="rounded-xl border-white/10 bg-white/5 hover:bg-white/10 hover:text-white text-gray-400">
                <ArrowLeft size={18} />
              </Button>
              <div>
                <h1 className="font-heading text-lg md:text-xl font-bold text-white truncate max-w-[200px] md:max-w-md">
                  {isNew ? "Project Baru" : formData.title}
                </h1>
                <p className="text-xs text-gray-500 font-mono tracking-widest uppercase mt-0.5">
                  {isNew ? "Drafting Mode" : "Editing Mode"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className="hidden md:flex text-xs font-mono text-gray-500 mr-2 items-center gap-1.5">
                <div className={cn("w-2 h-2 rounded-full", formData.title ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]")} />
                {formData.title ? "Ready to Save" : "Pending Title"}
              </span>
              <Button onClick={() => handleSubmit()} disabled={saving} className="w-full sm:w-auto rounded-xl shadow-lg shadow-primary/20 bg-primary text-white hover:bg-primary/90 font-bold tracking-wide">
                {saving ? <Loader2 className="animate-spin mr-2 h-4 w-4"/> : <Save className="mr-2 h-4 w-4"/>}
                {isNew ? "Publish Project" : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative z-10">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400 text-sm mb-8 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* ======================================================== */}
            {/* KOLOM KIRI: FORM BUILDER (Col 8) */}
            {/* ======================================================== */}
            <div className="lg:col-span-8">
              {formData.projectType === "software" && (
                <SoftwareForm formData={formData} setFormData={setFormData} availableSkills={availableSkills} />
              )}
              {formData.projectType === "marketing" && (
                <MarketingForm formData={formData} setFormData={setFormData} availableSkills={availableSkills} />
              )}
              {formData.projectType === "design" && (
                <DesignForm formData={formData} setFormData={setFormData} availableSkills={availableSkills} />
              )}
            </div>

            {/* ======================================================== */}
            {/* KOLOM KANAN: LIVE PREVIEW CARD (Col 4) */}
            {/* ======================================================== */}
            <div className="lg:col-span-4 relative">
              <div className="lg:sticky lg:top-[112px] flex flex-col gap-6">
                <PreviewCard formData={formData} />
              </div>
            </div>

          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}