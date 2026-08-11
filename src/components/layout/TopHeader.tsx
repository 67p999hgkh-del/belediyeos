"use client";

import {
  Bell,
  Calendar,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { municipalities } from "@/lib/modules";
import { findNavItemByPath } from "@/lib/navigation";
import { usePathname } from "next/navigation";

export function TopHeader() {
  const pathname = usePathname();
  const {
    municipality,
    setMunicipality,
    user,
    period,
    setPeriod,
    setSidebarOpen,
  } = useApp();

  const currentModule = findNavItemByPath(pathname);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
          aria-label="Menüyü aç"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden min-w-0 sm:block">
          <p className="truncate text-sm font-semibold text-slate-900">
            {currentModule?.label ?? "Kontrol Paneli"}
          </p>
          <p className="truncate text-xs text-slate-500">{municipality.name}</p>
        </div>

        <div className="mx-auto hidden max-w-lg flex-1 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Sicil no, vatandaş adı, makbuz no..."
              className="input-field pl-10"
            />
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 sm:flex">
            <select
              value={municipality.id}
              onChange={(e) => {
                const next = municipalities.find((m) => m.id === e.target.value);
                if (next) setMunicipality(next);
              }}
              className="max-w-[140px] truncate border-none bg-transparent text-xs font-medium text-slate-700 outline-none"
            >
              {municipalities.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.shortName}
                </option>
              ))}
            </select>
            <span className="text-slate-300">|</span>
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border-none bg-transparent text-xs font-medium text-slate-700 outline-none"
            >
              <option value="2024">2024</option>
              <option value="2025">2025</option>
              <option value="2026">2026</option>
            </select>
          </div>

          <button
            type="button"
            className="relative rounded-lg p-2 text-slate-500 transition hover:bg-slate-100"
            aria-label="Bildirimler"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <button
            type="button"
            className="hidden rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 sm:block"
            aria-label="Ayarlar"
          >
            <Settings className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1 pl-1 pr-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#1e40af]/10 text-[#1e40af]">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden text-left lg:block">
              <p className="text-xs font-semibold text-slate-900">{user.name}</p>
              <p className="text-[10px] text-slate-500">{user.role}</p>
            </div>
            <ChevronDown className="hidden h-3.5 w-3.5 text-slate-400 lg:block" />
          </div>

          <button
            type="button"
            className="hidden rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600 sm:block"
            aria-label="Çıkış"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
