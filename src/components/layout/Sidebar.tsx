"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, ChevronDown } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { municipalities, navModules } from "@/lib/modules";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { municipality, setMunicipality } = useApp();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-municipal-600 text-white">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">Belediye Panel</p>
            <p className="truncate text-xs text-slate-500">Otomasyon Sistemi</p>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 p-3">
        <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-slate-500">
          Belediye
        </label>
        <div className="relative">
          <select
            value={municipality.id}
            onChange={(e) => {
              const next = municipalities.find((m) => m.id === e.target.value);
              if (next) setMunicipality(next);
            }}
            className="input-field appearance-none pr-8"
          >
            {municipalities.map((m) => (
              <option key={m.id} value={m.id}>
                {m.shortName}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {navModules.map((mod) => {
            const Icon = mod.icon;
            const isActive =
              mod.href === "/"
                ? pathname === "/"
                : pathname === mod.href || pathname.startsWith(`${mod.href}/`);

            return (
              <li key={mod.id}>
                <Link
                  href={mod.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-municipal-50 text-municipal-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive && "text-municipal-600")} />
                  <span className="truncate">{mod.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200 p-4">
        <p className="text-xs text-slate-400">v0.1.0 — Geliştirme aşamasında</p>
      </div>
    </aside>
  );
}
