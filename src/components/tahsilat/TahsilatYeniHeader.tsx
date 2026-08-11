"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronRight, Search } from "lucide-react";

interface TahsilatYeniHeaderProps {
  hizliArama?: string;
  onHizliAramaChange?: (v: string) => void;
  onHizliAramaSubmit?: () => void;
}

export function TahsilatYeniHeader({
  hizliArama = "",
  onHizliAramaChange,
  onHizliAramaSubmit,
}: TahsilatYeniHeaderProps) {
  const [acik, setAcik] = useState(false);

  return (
    <div className="mb-3">
      <nav className="mb-2 flex flex-wrap items-center gap-1 text-sm text-slate-400">
        <Link href="/" className="transition hover:text-[#1e40af]">
          Kontrol Paneli
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/tahsilat" className="transition hover:text-[#1e40af]">
          Tahsilat
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-slate-600">Yeni Tahsilat</span>
      </nav>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Yeni Tahsilat</h1>
          <p className="mt-0.5 text-sm text-slate-500">Vezne tahsilat işlemleri</p>
        </div>
        {onHizliAramaSubmit && (
          <div className="min-w-[220px]">
            {!acik ? (
              <button
                type="button"
                onClick={() => setAcik(true)}
                className="text-xs font-medium text-slate-500 transition hover:text-[#1e40af]"
              >
                + Hızlı Sicil Ara
              </button>
            ) : (
              <div className="flex overflow-hidden rounded-md border border-slate-200 text-sm shadow-sm">
                <input
                  type="search"
                  value={hizliArama}
                  onChange={(e) => onHizliAramaChange?.(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onHizliAramaSubmit()}
                  placeholder="Sicil / ad / TC..."
                  className="w-40 border-0 px-2 py-1.5 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={onHizliAramaSubmit}
                  className="border-l border-slate-200 px-2 text-[#1e40af] hover:bg-blue-50"
                  title="Hızlı Sicil Ara"
                >
                  <Search className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
