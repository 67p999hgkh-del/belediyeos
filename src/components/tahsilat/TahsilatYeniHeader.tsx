"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function TahsilatYeniHeader() {
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
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Yeni Tahsilat</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Mükellef borç sorgulama ve vezne tahsilat işlemleri
        </p>
      </div>
    </div>
  );
}
