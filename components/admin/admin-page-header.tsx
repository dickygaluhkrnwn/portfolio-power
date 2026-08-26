"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { motion } from "framer-motion";

interface AdminPageHeaderProps {
  title?: string;
  description?: string;
  actionButton?: {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    href?: string;
  };
}

export function AdminPageHeader({ title, description, actionButton }: AdminPageHeaderProps) {
  const router = useRouter();

  if (!title && !description && !actionButton) return null;

  return (
    <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div className="space-y-2 max-w-2xl">
        {title && (
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-white tracking-tight">
            {title}
          </h1>
        )}
        {description && (
          <p className="text-gray-400 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {actionButton && (
        <Button
          onClick={() => {
            if (actionButton.onClick) actionButton.onClick();
            else if (actionButton.href) router.push(actionButton.href);
          }}
          className="rounded-xl bg-primary text-white hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 h-12 px-6 w-full md:w-auto"
        >
          {actionButton.icon || <Plus size={18} className="mr-2" />}
          {actionButton.label}
        </Button>
      )}
    </div>
  );
}
