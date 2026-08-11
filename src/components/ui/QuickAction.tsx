import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

interface QuickActionProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export function QuickAction({ title, description, href, icon: Icon }: QuickActionProps) {
  return (
    <Link
      href={href}
      className="group card flex items-start gap-4 p-4 transition hover:border-[#1e40af]/30 hover:shadow-md"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1e40af]/10 text-[#1e40af] transition group-hover:bg-[#1e40af] group-hover:text-white">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-slate-900">{title}</h3>
          <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:text-[#1e40af]" />
        </div>
        <p className="mt-0.5 text-sm text-slate-500">{description}</p>
      </div>
    </Link>
  );
}
