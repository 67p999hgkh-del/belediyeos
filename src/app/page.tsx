"use client";

import Link from "next/link";
import { Banknote, Receipt } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const { municipality, user } = useApp();

  return (
    <div className="mx-auto max-w-4xl">
      <div className="card p-6 text-center sm:p-10">
        <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
          Hoş geldiniz, {user.name}
        </h2>
        <p className="mt-2 text-slate-500">{municipality.name}</p>
        <p className="mt-4 text-sm text-slate-400">
          İşlem yapmak için üst menüden bir modüle tıklayın
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-slate-50 p-4 text-left">
            <p className="text-sm text-slate-500">Bugünkü Tahsilat</p>
            <p className="mt-1 flex items-center gap-2 text-xl font-bold text-slate-900">
              <Banknote className="h-5 w-5 text-municipal-600" />
              {formatCurrency(45230.5)}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 text-left">
            <p className="text-sm text-slate-500">Bekleyen Borç</p>
            <p className="mt-1 text-xl font-bold text-slate-900">
              {formatCurrency(1284500)}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/tahsilat/yeni" className="btn-primary">
            <Receipt className="h-4 w-4" />
            Yeni Tahsilat
            <span className="rounded bg-municipal-500 px-1.5 py-0.5 text-xs">Ctrl+1</span>
          </Link>
          <Link href="/tahsilat/islemler" className="btn-secondary">
            Tahsilat İşlemleri
          </Link>
        </div>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Modül menüsü: TAHSİLAT, SU, EMLAK, İŞYERİ, İMAR, PERSONEL, MUHASEBE, ZABITA...
      </p>
    </div>
  );
}
