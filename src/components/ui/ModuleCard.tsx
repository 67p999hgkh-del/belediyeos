import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "purple" | "red";
}

const colorMap = {
  blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
  green: "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
  orange: "bg-orange-50 text-orange-600 group-hover:bg-orange-100",
  purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-100",
  red: "bg-red-50 text-red-600 group-hover:bg-red-100",
};

export function ModuleCard({
  title,
  description,
  href,
  icon: Icon,
  color = "blue",
}: ModuleCardProps) {
  return (
    <Link
      href={href}
      className="group card flex items-start gap-4 p-5 transition hover:border-municipal-300 hover:shadow-md"
    >
      <div
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition",
          colorMap[color],
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-slate-900 group-hover:text-municipal-700">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:text-municipal-600" />
    </Link>
  );
}
