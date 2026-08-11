"use client";

import Link from "next/link";
import {
  Banknote,
  Briefcase,
  Droplets,
  Home,
  Map,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { navModules } from "@/lib/modules";
import { formatCurrency } from "@/lib/utils";
import { ModuleCard } from "@/components/ui/ModuleCard";

const stats = [
  { label: "Bugünkü Tahsilat", value: formatCurrency(45230.5), icon: Banknote, trend: "+12%" },
  { label: "Bekleyen Borç", value: formatCurrency(1284500), icon: Receipt, trend: "-3%" },
  { label: "Aktif Sicil", value: "3.842", icon: Users, trend: "+28" },
  { label: "Bu Ay Tahakkuk", value: formatCurrency(892000), icon: TrendingUp, trend: "+5%" },
];

const quickModules = navModules.filter((m) => m.id !== "dashboard" && m.id !== "sistem");

const colorCycle = ["blue", "green", "orange", "purple", "red", "blue"] as const;

export default function DashboardPage() {
  const { municipality, user } = useApp();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">
          Hoş geldiniz, {user.name}
        </h2>
        <p className="mt-1 text-slate-500">
          {municipality.name} — günlük işlem özeti
        </p>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-1 text-xs text-emerald-600">{stat.trend}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-municipal-50 text-municipal-600">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link href="/tahsilat/yeni" className="btn-primary">
          <Receipt className="h-4 w-4" />
          Yeni Tahsilat
          <span className="rounded bg-municipal-500 px-1.5 py-0.5 text-xs">Ctrl+1</span>
        </Link>
        <Link href="/tahsilat/makbuz-ara" className="btn-secondary">
          Makbuz Ara
        </Link>
        <Link href="/tahsilat/islemler" className="btn-secondary">
          Tahsilat İşlemleri
          <span className="text-xs text-slate-400">Ctrl+2</span>
        </Link>
      </div>

      <h3 className="mb-4 text-lg font-semibold text-slate-900">Modüller</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickModules.map((mod, i) => (
          <ModuleCard
            key={mod.id}
            title={mod.label}
            description={mod.description}
            href={mod.href}
            icon={mod.icon}
            color={colorCycle[i % colorCycle.length]}
          />
        ))}
      </div>

      <div className="mt-8 card p-5">
        <h3 className="mb-4 font-semibold text-slate-900">Modül Bazlı Tahsilat (Bugün)</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Su", amount: 12450, icon: Droplets },
            { label: "Emlak", amount: 18200, icon: Home },
            { label: "İşyeri", amount: 8900, icon: Briefcase },
            { label: "İmar", amount: 5680.5, icon: Map },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"
              >
                <Icon className="h-5 w-5 text-municipal-600" />
                <div>
                  <p className="text-sm text-slate-500">{item.label}</p>
                  <p className="font-semibold text-slate-900">{formatCurrency(item.amount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
