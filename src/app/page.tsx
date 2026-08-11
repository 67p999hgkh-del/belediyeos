"use client";

import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  Banknote,
  Clock,
  FileText,
  Plus,
  Receipt,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatCurrency } from "@/lib/utils";
import { StatCard } from "@/components/ui/StatCard";
import { QuickAction } from "@/components/ui/QuickAction";

const recentTransactions = [
  { id: "MK-48291", citizen: "Mehmet Kaya", module: "Su", amount: 1250, time: "14:32" },
  { id: "MK-48290", citizen: "Fatma Demir", module: "Emlak", amount: 4800, time: "14:18" },
  { id: "MK-48289", citizen: "Ali Yıldız", module: "İşyeri", amount: 2100, time: "13:55" },
  { id: "MK-48288", citizen: "Zeynep Arslan", module: "Su", amount: 890, time: "13:41" },
  { id: "MK-48287", citizen: "Hasan Çelik", module: "Emlak", amount: 6200, time: "13:22" },
];

export default function DashboardPage() {
  const { municipality, user, period } = useApp();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-title">Kontrol Paneli</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Merhaba, {user.name.split(" ")[0]}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {municipality.name} · {period} dönemi özeti
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/tahsilat/yeni" className="btn-primary">
            <Plus className="h-4 w-4" />
            Yeni Tahsilat
          </Link>
          <Link href="/tahsilat/makbuz-ara" className="btn-secondary">
            <Search className="h-4 w-4" />
            Makbuz Ara
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bugünkü Tahsilat"
          value={formatCurrency(128450)}
          change="↑ 12.4% dün ile karşılaştırıldığında"
          changeType="positive"
          icon={Banknote}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Aylık Hedef"
          value="%78"
          change="₺892.000 / ₺1.140.000"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Aktif Sicil"
          value="3.842"
          change="↑ 28 bu ay"
          changeType="positive"
          icon={Users}
          iconColor="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Bekleyen Borç"
          value={formatCurrency(2450000)}
          change="↓ 3.2% geçen aya göre"
          changeType="positive"
          icon={FileText}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h2 className="font-semibold text-slate-900">Son Tahsilatlar</h2>
            <Link href="/tahsilat/islemler" className="text-sm font-medium text-[#1e40af] hover:underline">
              Tümünü gör
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs font-medium uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-3">Makbuz</th>
                  <th className="px-5 py-3">Vatandaş</th>
                  <th className="px-5 py-3">Modül</th>
                  <th className="px-5 py-3">Tutar</th>
                  <th className="px-5 py-3">Saat</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-slate-50 transition hover:bg-slate-50/80">
                    <td className="px-5 py-3.5 font-medium text-[#1e40af]">{tx.id}</td>
                    <td className="px-5 py-3.5 text-slate-700">{tx.citizen}</td>
                    <td className="px-5 py-3.5">
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        {tx.module}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {tx.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="font-semibold text-slate-900">Hızlı İşlemler</h2>
          <QuickAction
            title="Yeni Tahsilat"
            description="Vezne tahsilat kaydı oluştur"
            href="/tahsilat/yeni"
            icon={Receipt}
          />
          <QuickAction
            title="Tahsilat Listesi"
            description="Günlük işlem kayıtları"
            href="/tahsilat/islemler"
            icon={Banknote}
          />
          <QuickAction
            title="Makbuz Arama"
            description="Makbuz veya sicil ile sorgula"
            href="/tahsilat/makbuz-ara"
            icon={Search}
          />
        </div>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 font-semibold text-slate-900">Modül Bazlı Tahsilat (Bugün)</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Su", amount: 32450, trend: 8.2 },
            { label: "Emlak", amount: 48200, trend: 12.1 },
            { label: "İşyeri", amount: 28900, trend: -2.4 },
            { label: "İmar", amount: 18900, trend: 5.6 },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-slate-100 bg-slate-50/50 p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{item.label}</p>
                {item.trend >= 0 ? (
                  <ArrowUpRight className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-red-500" />
                )}
              </div>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {formatCurrency(item.amount)}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${item.trend >= 0 ? "text-emerald-600" : "text-red-600"}`}
              >
                {item.trend >= 0 ? "+" : ""}
                {item.trend}% dün
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
