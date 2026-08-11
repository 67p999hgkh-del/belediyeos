import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  emlakDailyActions,
  emlakWorkflowGroups,
  getEmlakItem,
} from "@/lib/emlak-submenus";
import { formatCurrency } from "@/lib/utils";
import { FileText, Home, Scale, Wallet } from "lucide-react";

export default function EmlakPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Emlak Vergisi"
        description="Beyan, tahakkuk, bakiye ve borç yönetimi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Emlak Vergisi" },
        ]}
        action={
          <Link href="/emlak/bildirim-giris" className="btn-primary">
            <Plus className="h-4 w-4" />
            Bildirim Girişi
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Kayıtlı Beyan"
          value="4.128"
          change="↑ 32 bu ay"
          changeType="positive"
          icon={Home}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Bu Yıl Tahakkuk"
          value={formatCurrency(1840000)}
          change="2026 dönemi"
          changeType="neutral"
          icon={FileText}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Toplam Borç"
          value={formatCurrency(920000)}
          change="↓ 4.1% geçen yıla göre"
          changeType="positive"
          icon={Scale}
          iconColor="bg-red-50 text-red-600"
        />
        <StatCard
          label="Tahsil Oranı"
          value="%68"
          change="₺1.252.000 tahsil edildi"
          changeType="neutral"
          icon={Wallet}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {emlakDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-amber-200 hover:bg-amber-50/50"
              >
                <Icon className="h-5 w-5 text-amber-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Modüller</h2>
          <p className="mt-1 text-sm text-slate-500">
            Beyan → Tahakkuk → Bakiye sırasıyla ilerleyin. Alt menülü modüller ok ile işaretli.
          </p>
        </div>

        {emlakWorkflowGroups.map((group) => {
          const items = group.itemIds
            .map((id) => getEmlakItem(id))
            .filter(Boolean);

          return (
            <section key={group.id} className="card overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                <p className="font-semibold text-slate-900">{group.label}</p>
                <p className="text-xs text-slate-500">{group.description}</p>
              </div>
              <ul className="divide-y divide-slate-100">
                {items.map((item) => {
                  if (!item) return null;
                  const Icon = item.icon;
                  const href = item.hasSubMenu ? item.href : item.href;
                  return (
                    <li key={item.id}>
                      <Link
                        href={href}
                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-slate-300" />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
