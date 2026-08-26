import React, { useState } from "react";
import { Project } from "@/app/data/projects";
import { SkillItem } from "@/lib/skills-service";
import { TabBtn } from "./tab-btn";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Image as ImageIcon, CheckCircle2,
  ArrowUp, ArrowDown, Sparkles, LayoutPanelTop, MonitorPlay, Code2, X, FileText
} from "lucide-react";

interface FormProps {
  formData: Partial<Project>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Project>>>;
  availableSkills: SkillItem[];
}

export function SoftwareForm({ formData, setFormData, availableSkills }: FormProps) {
  const [activeTab, setActiveTab] = useState<"general" | "content" | "media" | "tech">("general");

  // --- Array Helpers ---
  const addTech = () => {
    setFormData(prev => ({
      ...prev,
      techStack: [...(prev.techStack || []), { name: "", skillId: "", icon: "" }]
    }));
  };

  const removeTech = (index: number) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack?.filter((_, i) => i !== index)
    }));
  };

  const updateTech = (index: number, skillId: string) => {
    const newStack = [...(formData.techStack || [])];
    const selectedSkill = availableSkills.find(s => s.id === skillId);
    
    if (selectedSkill) {
      newStack[index] = { 
        ...newStack[index], 
        skillId: selectedSkill.id,
        name: selectedSkill.name,
        icon: selectedSkill.icon || "",
        color: selectedSkill.color || "#ffffff"
      };
    } else {
       newStack[index] = { ...newStack[index], skillId: "", name: "" };
    }
    setFormData(prev => ({ ...prev, techStack: newStack }));
  };

  const moveTech = (index: number, direction: 'up' | 'down') => {
    const newStack = [...(formData.techStack || [])];
    if (direction === 'up' && index > 0) {
      [newStack[index - 1], newStack[index]] = [newStack[index], newStack[index - 1]];
    } else if (direction === 'down' && index < newStack.length - 1) {
      [newStack[index + 1], newStack[index]] = [newStack[index], newStack[index + 1]];
    }
    setFormData(prev => ({ ...prev, techStack: newStack }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), ""]
    }));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index)
    }));
  };

  const moveFeature = (index: number, direction: 'up' | 'down') => {
    const newFeatures = [...(formData.features || [])];
    if (direction === 'up' && index > 0) {
      [newFeatures[index - 1], newFeatures[index]] = [newFeatures[index], newFeatures[index - 1]];
    } else if (direction === 'down' && index < newFeatures.length - 1) {
      [newFeatures[index + 1], newFeatures[index]] = [newFeatures[index], newFeatures[index + 1]];
    }
    setFormData(prev => ({ ...prev, features: newFeatures }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Tab Navigation */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden shadow-inner sticky top-[88px] z-40 backdrop-blur-xl">
        <TabBtn active={activeTab === "general"} onClick={() => setActiveTab("general")} icon={<LayoutPanelTop size={14} />} label="General Info" />
        <TabBtn active={activeTab === "content"} onClick={() => setActiveTab("content")} icon={<FileText size={14} />} label="Case Study" />
        <TabBtn active={activeTab === "media"} onClick={() => setActiveTab("media")} icon={<ImageIcon size={14} />} label="Media & Links" />
        <TabBtn active={activeTab === "tech"} onClick={() => setActiveTab("tech")} icon={<Code2 size={14} />} label="Tech Stack" />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl min-h-[500px]"
        >
          {/* --- TAB: GENERAL INFO --- */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Judul Project *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white font-bold text-xl placeholder:text-gray-700" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Contoh: Nexa - AI Productivity App" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tipe Project</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white appearance-none cursor-pointer" 
                    value={formData.projectType || "software"} 
                    onChange={e => setFormData({...formData, projectType: e.target.value as any})}
                  >
                    <option value="software" className="bg-[#111]">Software / App</option>
                    <option value="marketing" className="bg-[#111]">Digital Marketing</option>
                    <option value="design" className="bg-[#111]">Design / Creative</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Kategori Utama</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white appearance-none cursor-pointer" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="frontend" className="bg-[#111]">Frontend</option>
                    <option value="backend" className="bg-[#111]">Backend</option>
                    <option value="fullstack" className="bg-[#111]">Full Stack</option>
                    <option value="mobile" className="bg-[#111]">Mobile App</option>
                    <option value="uiux" className="bg-[#111]">UI/UX Design</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Tahun Rilis</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                    value={formData.year} 
                    onChange={e => setFormData({...formData, year: e.target.value})} 
                    placeholder="2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Role Anda</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                    value={formData.role} 
                    onChange={e => setFormData({...formData, role: e.target.value})} 
                    placeholder="Lead Frontend Engineer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Subtitle / Slogan</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                    placeholder="Empowering productivity with AI."
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2 mt-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2">
                    <Sparkles size={14} className="text-primary"/> Tampilkan di Highlight?
                  </label>
                  <div 
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all",
                      formData.featured ? "bg-primary/10 border-primary/30" : "bg-white/5 border-white/10 hover:border-white/20"
                    )}
                    onClick={() => setFormData({...formData, featured: !formData.featured})}
                  >
                    <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors", formData.featured ? "border-primary bg-primary" : "border-gray-500")}>
                      {formData.featured && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div>
                      <div className={cn("text-sm font-bold", formData.featured ? "text-primary" : "text-white")}>Tandai sebagai Featured Project</div>
                      <div className="text-xs text-gray-500">Project akan muncul besar di halaman utama dan disorot dengan badge emas.</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* --- TAB: CASE STUDY (CONTENT) --- */}
          {activeTab === "content" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex justify-between">
                  <span>Deskripsi Utama (Rich Text) *</span>
                </label>
                <TiptapEditor 
                  content={formData.desc || ""} 
                  onChange={(html) => setFormData({...formData, desc: html})} 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-red-400 ml-1 flex items-center gap-2">The Challenge</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-red-500/50 outline-none transition-colors text-gray-300 min-h-[150px] resize-none" 
                    value={formData.challenge} 
                    onChange={e => setFormData({...formData, challenge: e.target.value})} 
                    placeholder="Apa masalah atau tantangan utama yang dihadapi?"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-green-400 ml-1 flex items-center gap-2">The Solution</label>
                  <textarea 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-green-500/50 outline-none transition-colors text-gray-300 min-h-[150px] resize-none" 
                    value={formData.solution} 
                    onChange={e => setFormData({...formData, solution: e.target.value})} 
                    placeholder="Bagaimana Anda menyelesaikannya secara elegan?"
                  />
                </div>
              </div>

              {/* --- ADVANCED FEATURE LIST WITH SORTING --- */}
              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Key Features List</label>
                  <button type="button" onClick={addFeature} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 hover:text-white text-xs flex items-center transition-colors">
                    <Plus size={14} className="mr-1"/> Add Feature
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.features?.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 group">
                      <div className="flex flex-col gap-0.5">
                        <button type="button" onClick={() => moveFeature(idx, 'up')} disabled={idx === 0} className="text-gray-500 hover:text-primary disabled:opacity-20 transition-colors"><ArrowUp size={14}/></button>
                        <button type="button" onClick={() => moveFeature(idx, 'down')} disabled={idx === formData.features!.length - 1} className="text-gray-500 hover:text-primary disabled:opacity-20 transition-colors"><ArrowDown size={14}/></button>
                      </div>
                      <input 
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-sm text-gray-300 flex-1" 
                        value={feature}
                        onChange={e => updateFeature(idx, e.target.value)}
                        placeholder="Contoh: Real-time synchronization dengan WebSocket"
                      />
                      <button type="button" onClick={() => removeFeature(idx)} className="text-red-500/50 hover:text-red-400 p-2.5 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  {(!formData.features || formData.features.length === 0) && (
                    <div className="text-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                      <p className="text-sm text-gray-500">Belum ada fitur ditambahkan.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* --- TAB: MEDIA & LINKS --- */}
          {activeTab === "media" && (
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Cover Image URL</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://i.imgur.com/... atau URL gambar lainnya"
                />
                
                {/* Live Image Preview */}
                {formData.image && (
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0d1117] shadow-xl mt-4 group">
                    <img 
                      src={formData.image} 
                      alt="Cover Preview" 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" 
                      onError={(e) => (e.currentTarget.src = "https://grainy-gradients.vercel.app/noise.svg")}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/10">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2"><MonitorPlay size={14}/> Live Demo URL</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700 text-sm" 
                    value={formData.demoLink || ""} 
                    onChange={e => setFormData({...formData, demoLink: e.target.value})} 
                    placeholder="https://your-project.vercel.app" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-2"><Code2 size={14}/> Repository URL</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700 text-sm" 
                    value={formData.repoLink || ""} 
                    onChange={e => setFormData({...formData, repoLink: e.target.value})} 
                    placeholder="https://github.com/username/repo" 
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: TECH STACK (WITH SORTING) --- */}
          {activeTab === "tech" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">Kelola Tech Stack</h3>
                  <p className="text-xs text-gray-500 mt-1">Susun teknologi utama yang digunakan di proyek ini.</p>
                </div>
                <button type="button" onClick={addTech} className="px-3 py-1.5 rounded-xl shadow-lg shadow-primary/20 bg-white/10 text-white hover:bg-white/20 border border-white/10 flex items-center text-sm">
                  <Plus size={14} className="mr-1"/> Tambah Tech
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {formData.techStack?.map((tech, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10 group hover:border-white/20 transition-colors">
                    {/* Sort Controls */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button type="button" onClick={() => moveTech(idx, 'up')} disabled={idx === 0} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors"><ArrowUp size={12}/></button>
                      <button type="button" onClick={() => moveTech(idx, 'down')} disabled={idx === formData.techStack!.length - 1} className="text-gray-600 hover:text-white disabled:opacity-20 transition-colors"><ArrowDown size={12}/></button>
                    </div>
                    
                    <div className="flex-1">
                      <select 
                        className="w-full bg-transparent border-b border-transparent focus:border-white/20 outline-none text-sm text-white font-medium cursor-pointer py-2" 
                        value={tech.skillId || ""}
                        onChange={e => updateTech(idx, e.target.value)}
                      >
                        <option value="" disabled className="bg-[#111]">Pilih Skill...</option>
                        {availableSkills.map(s => (
                          <option key={s.id} value={s.id} className="bg-[#111]">{s.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Delete */}
                    <button type="button" onClick={() => removeTech(idx)} className="text-gray-500 hover:text-red-400 p-1.5 transition-colors shrink-0">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {(!formData.techStack || formData.techStack.length === 0) && (
                <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                  <Code2 className="w-8 h-8 mx-auto text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500">Belum ada Tech Stack yang ditambahkan.</p>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
