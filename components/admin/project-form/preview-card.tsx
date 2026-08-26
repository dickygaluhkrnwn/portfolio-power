import React from "react";
import { Project } from "@/app/data/projects";
import { MonitorPlay, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function PreviewCard({ formData }: { formData: Partial<Project> }) {
  return (
    <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 shadow-xl">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
        <h3 className="font-bold text-sm text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <MonitorPlay size={16} className="text-primary"/> Live Card Preview
        </h3>
      </div>

      <div className="pointer-events-none select-none scale-[0.9] origin-top">
        <div className={cn(
          "group relative bg-[#0a0a0a] rounded-3xl border overflow-hidden flex flex-col h-full transition-all duration-500",
          formData.featured ? "border-primary/50 shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)]" : "border-white/10"
        )}>
          <div className="h-40 bg-[#0d1117] relative overflow-hidden border-b border-white/5 shrink-0">
            {formData.image ? (
                <img src={formData.image} alt="Cover" className="w-full h-full object-cover" />
            ) : (
                <div className="absolute inset-0 bg-white/5 flex items-center justify-center">
                  <ImageIcon size={32} className="text-white/10" />
                </div>
            )}
            {formData.featured && (
              <div className="absolute top-3 left-3 z-20 px-2 py-1 bg-primary/90 text-white text-[9px] font-bold rounded-md uppercase tracking-widest shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Sorotan
              </div>
            )}
          </div>

          <div className="p-5 flex flex-col flex-grow relative z-20 bg-[#0a0a0a]">
            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-1.5 block">
              {formData.category || "Kategori"}
            </span>
            <h3 className="font-heading text-lg font-bold text-white line-clamp-1 mb-2">
              {formData.title || "Judul Project"}
            </h3>
            <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
              {formData.subtitle || "Tuliskan deskripsi singkat atau subtitle project..."}
            </p>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {formData.techStack?.slice(0, 3).map((tech, i) => (
                <span key={i} className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 flex items-center gap-1">
                  {tech.color && <span className="w-1.5 h-1.5 rounded-full shadow-sm" style={{ backgroundColor: tech.color }}/>}
                  {tech.name || "Tech"}
                </span>
              ))}
              {(formData.techStack?.length || 0) > 3 && (
                  <span className="text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded-md bg-white/[0.02] text-gray-500 border border-white/5">
                    +{(formData.techStack?.length || 0) - 3}
                  </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Status</p>
          <p className={cn("text-xs font-mono font-medium", formData.featured ? "text-emerald-400" : "text-gray-300")}>
            {formData.featured ? "Featured" : "Standard"}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">Kelengkapan</p>
          <p className="text-xs font-mono font-medium text-gray-300">
            {formData.title && formData.desc ? "100%" : "Incomplete"}
          </p>
        </div>
      </div>
    </div>
  );
}
