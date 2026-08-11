"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function TahsilatYeniHeader() {
  const { user } = useApp();
  const tarih = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Yeni Tahsilat</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Mükellef borç sorgulama ve vezne tahsilat işlemleri
          </p>
        </div>
        <div className="flex flex-wrap gap-3 text-xs text-slate-500">
          <span>{user.name}</span>
          <span className="text-slate-300">|</span>
          <span>Ana Vezne — V001</span>
          <span className="text-slate-300">|</span>
          <span>{tarih}</span>
        </div>
      </div>
    </div>
  );
}
