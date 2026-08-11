"use client";

import { Bell, Calendar, LogOut, Search, User } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function Header() {
  const { municipality, user, period, setPeriod } = useApp();

  return (
    <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between gap-4 px-6">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-900">{municipality.name}</h1>
          <p className="text-sm text-slate-500">Otomasyon Programı</p>
        </div>

        <div className="hidden max-w-md flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Sicil no, isim veya makbuz ara..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <Calendar className="h-4 w-4 text-slate-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
            aria-label="Bildirimler"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-municipal-100 text-municipal-700">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
            aria-label="Çıkış"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
