import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  label: string;
  href: string;
  icon: LucideIcon;
  shortcut?: string;
  variant?: "primary" | "default" | "danger";
}

export function ActionCard({
  label,
  href,
  icon: Icon,
  shortcut,
  variant = "default",
}: ActionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl border p-4 transition hover:shadow-md",
        variant === "primary" &&
          "border-municipal-200 bg-municipal-50 hover:border-municipal-300",
        variant === "danger" && "border-red-200 bg-red-50 hover:border-red-300",
        variant === "default" && "border-slate-200 bg-white hover:border-slate-300",
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          variant === "primary" && "bg-municipal-600 text-white",
          variant === "danger" && "bg-red-600 text-white",
          variant === "default" && "bg-slate-100 text-slate-600 group-hover:bg-slate-200",
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "font-medium",
            variant === "primary" && "text-municipal-800",
            variant === "danger" && "text-red-800",
            variant === "default" && "text-slate-800",
          )}
        >
          {label}
        </p>
        {shortcut && <p className="text-xs text-slate-400">{shortcut}</p>}
      </div>
    </Link>
  );
}
