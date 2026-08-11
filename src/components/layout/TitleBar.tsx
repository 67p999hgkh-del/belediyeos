"use client";

import { Building2, Calendar, ChevronDown } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { municipalities } from "@/lib/modules";

export function TitleBar() {
  const { municipality, user, period, setPeriod, setMunicipality } = useApp();

  return (
    <div className="border-b border-slate-300 bg-gradient-to-r from-slate-200 to-slate-100">
      <div className="flex items-center justify-between gap-3 px-3 py-2 sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-red-600 text-sm font-bold text-white">
            B
          </div>
          <p className="truncate text-xs font-semibold text-slate-800 sm:text-sm">
            <span className="text-municipal-700">[{user.name}]</span>{" "}
            {municipality.name.toUpperCase()} OTOMASYON PROGRAMI
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-1 sm:flex">
            <Building2 className="h-3.5 w-3.5 text-slate-500" />
            <div className="relative">
              <select
                value={municipality.id}
                onChange={(e) => {
                  const next = municipalities.find((m) => m.id === e.target.value);
                  if (next) setMunicipality(next);
                }}
                className="appearance-none rounded border border-slate-300 bg-white py-1 pl-2 pr-6 text-xs"
              >
                {municipalities.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.shortName}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-1 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded border border-slate-300 bg-white py-1 text-xs"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
