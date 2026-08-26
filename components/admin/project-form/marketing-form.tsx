import React, { useState } from "react";
import { Project } from "@/app/data/projects";
import { SkillItem } from "@/lib/skills-service";
import { TabBtn } from "./tab-btn";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, CheckCircle2,
  ArrowUp, ArrowDown, Sparkles, LayoutPanelTop, FileText, TrendingUp, Briefcase
} from "lucide-react";

interface FormProps {
  formData: Partial<Project>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<Project>>>;
  availableSkills: SkillItem[];
}

export function MarketingForm({ formData, setFormData, availableSkills }: FormProps) {
  const [activeTab, setActiveTab] = useState<"general" | "campaign" | "metrics" | "tools">("general");

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

  const addMetric = () => {
    setFormData(p => ({
      ...p, 
      metrics: [...(p.metrics || []), {label: "", value: ""}]
    }));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Tab Navigation */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-1.5 flex overflow-x-auto [&::-webkit-scrollbar]:hidden shadow-inner sticky top-[88px] z-40 backdrop-blur-xl">
        <TabBtn active={activeTab === "general"} onClick={() => setActiveTab("general")} icon={<LayoutPanelTop size={14} />} label="General Info" />
        <TabBtn active={activeTab === "campaign"} onClick={() => setActiveTab("campaign")} icon={<FileText size={14} />} label="Campaign Details" />
        <TabBtn active={activeTab === "metrics"} onClick={() => setActiveTab("metrics")} icon={<TrendingUp size={14} />} label="Metrics" />
        <TabBtn active={activeTab === "tools"} onClick={() => setActiveTab("tools")} icon={<Briefcase size={14} />} label="Tools Used" />
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
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Judul Campaign *</label>
                  <input 
                    required 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white font-bold text-xl placeholder:text-gray-700" 
                    value={formData.title} 
                    onChange={e => setFormData({...formData, title: e.target.value})} 
                    placeholder="Contoh: Q3 Meta Ads Scaling" 
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
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Platform Utama</label>
                  <select 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white appearance-none cursor-pointer" 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value as any})}
                  >
                    <option value="marketing" className="bg-[#111]">Marketing</option>
                    <option value="meta-ads" className="bg-[#111]">Meta Ads</option>
                    <option value="google-ads" className="bg-[#111]">Google Ads</option>
                    <option value="tiktok-ads" className="bg-[#111]">TikTok Ads</option>
                    <option value="seo" className="bg-[#111]">SEO</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Klien / Brand</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                    value={formData.client || ""} 
                    onChange={e => setFormData({...formData, client: e.target.value})} 
                    placeholder="Nama Klien"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Subtitle / Goal</label>
                  <input 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                    value={formData.subtitle} 
                    onChange={e => setFormData({...formData, subtitle: e.target.value})} 
                    placeholder="Meningkatkan ROAS 3x lipat dalam 2 bulan."
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
                      <div className={cn("text-sm font-bold", formData.featured ? "text-primary" : "text-white")}>Tandai sebagai Featured Campaign</div>
                      <div className="text-xs text-gray-500">Campaign akan muncul besar di halaman utama.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- TAB: CAMPAIGN DETAILS --- */}
          {activeTab === "campaign" && (
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1 flex justify-between">
                  <span>Strategi Campaign (Rich Text) *</span>
                </label>
                <TiptapEditor 
                  content={formData.desc || ""} 
                  onChange={(html) => setFormData({...formData, desc: html})} 
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Hero Image URL</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-white placeholder:text-gray-700" 
                  value={formData.image} 
                  onChange={e => setFormData({...formData, image: e.target.value})} 
                  placeholder="https://i.imgur.com/... atau URL gambar lainnya"
                />
              </div>
            </div>
          )}

          {/* --- TAB: METRICS --- */}
          {activeTab === "metrics" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2"><Sparkles size={16} className="text-primary" /> Key Performance Indicators</h3>
                  <p className="text-xs text-gray-500 mt-1">Tambahkan angka keberhasilan (ROAS, CPA, Leads).</p>
                </div>
                <button type="button" onClick={addMetric} className="px-3 py-1.5 rounded-xl shadow-lg shadow-primary/20 bg-white/10 text-white hover:bg-white/20 border border-white/10 flex items-center text-sm">
                  <Plus size={14} className="mr-1"/> Add Metric
                </button>
              </div>

              <div className="space-y-3">
                {formData.metrics?.map((metric, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input 
                      className="w-1/3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-sm text-gray-300 font-bold" 
                      value={metric.label}
                      onChange={e => {
                        const m = [...(formData.metrics || [])];
                        m[idx].label = e.target.value;
                        setFormData({...formData, metrics: m});
                      }}
                      placeholder="Label (e.g. ROAS)"
                    />
                    <input 
                      className="w-2/3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-primary outline-none transition-colors text-sm text-white font-black" 
                      value={metric.value}
                      onChange={e => {
                        const m = [...(formData.metrics || [])];
                        m[idx].value = e.target.value;
                        setFormData({...formData, metrics: m});
                      }}
                      placeholder="Value (e.g. 350%)"
                    />
                    <button type="button" onClick={() => {
                      setFormData(p => ({...p, metrics: p.metrics?.filter((_, i) => i !== idx)}))
                    }} className="text-red-500/50 hover:text-red-400 p-3 bg-red-500/5 hover:bg-red-500/10 rounded-xl transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!formData.metrics || formData.metrics.length === 0) && (
                  <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                    <TrendingUp className="w-8 h-8 mx-auto text-gray-600 mb-3" />
                    <p className="text-sm text-gray-500">Belum ada metrik ditambahkan.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* --- TAB: TOOLS --- */}
          {activeTab === "tools" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-white">Kelola Marketing Tools</h3>
                  <p className="text-xs text-gray-500 mt-1">Susun platform atau tools yang digunakan di campaign ini.</p>
                </div>
                <button type="button" onClick={addTech} className="px-3 py-1.5 rounded-xl shadow-lg shadow-primary/20 bg-white/10 text-white hover:bg-white/20 border border-white/10 flex items-center text-sm">
                  <Plus size={14} className="mr-1"/> Tambah Tool
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
                        <option value="" disabled className="bg-[#111]">Pilih Tools...</option>
                        {availableSkills.map(s => (
                          <option key={s.id} value={s.id} className="bg-[#111]">{s.name}</option>
                        ))}
                      </select>
                    </div>
                    
                    {/* Delete */}
                    <button type="button" onClick={() => removeTech(idx)} className="text-gray-500 hover:text-red-400 p-1.5 transition-colors shrink-0">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {(!formData.techStack || formData.techStack.length === 0) && (
                <div className="text-center p-12 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
                  <Briefcase className="w-8 h-8 mx-auto text-gray-600 mb-3" />
                  <p className="text-sm text-gray-500">Belum ada tools ditambahkan.</p>
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
