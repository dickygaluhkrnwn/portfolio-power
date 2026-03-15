"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TechBadgeProps {
  name: string;
  icon?: React.ReactNode;
  className?: string;
  color?: string; // Hex color for glow effect
}

export function TechBadge({ name, icon, className, color }: TechBadgeProps) {
  // Generate subtle background and border colors based on the provided hex
  // If no color provided, fallback to standard neutral styling
  const customStyles = color ? {
    backgroundColor: `${color}10`, // 10% opacity
    borderColor: `${color}30`, // 30% opacity
    color: color
  } : {};

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        "relative flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-xl border cursor-default overflow-hidden group select-none touch-manipulation backdrop-blur-sm transition-all",
        !color && "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white",
        className
      )}
      style={customStyles}
    >
      {/* Icon - Responsif size */}
      {icon && (
        <span className="relative z-10 scale-90 md:scale-100 opacity-80 group-hover:opacity-100 transition-opacity">
          {icon}
        </span>
      )}
      
      {/* Text - Responsif size */}
      <span 
        className={cn(
          "relative z-10 text-xs md:text-sm font-semibold tracking-wide transition-colors",
          !color && "group-hover:text-white"
        )}
      >
        {name}
      </span>
    </motion.div>
  );
}