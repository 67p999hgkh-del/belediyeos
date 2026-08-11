"use client";

import { cn } from "@/lib/utils";

interface WorkspaceTabBarProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
  className?: string;
}

export function WorkspaceTabBar({ tabs, active, onChange, className }: WorkspaceTabBarProps) {
  return (
    <div className={cn("flex flex-wrap border-b border-slate-200 bg-slate-50/50", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "border-b-2 px-4 py-2 text-sm font-medium transition",
            active === tab.id
              ? "border-[#1e40af] bg-white text-[#1e40af]"
              : "border-transparent text-slate-600 hover:bg-white/80 hover:text-slate-900",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

interface SectionTabBarProps {
  sections: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function SectionTabBar({ sections, active, onChange }: SectionTabBarProps) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-slate-100 px-4 py-2">
      {sections.map((s) => (
        <button
          key={s.id}
          type="button"
          onClick={() => onChange(s.id)}
          className={cn(
            "rounded-md px-3 py-1.5 text-xs font-medium transition",
            active === s.id
              ? "bg-[#1e40af] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
