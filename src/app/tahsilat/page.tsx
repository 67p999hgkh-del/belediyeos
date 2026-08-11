import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  getTahsilatItem,
  tahsilatDailyActions,
  tahsilatWorkflowGroups,
} from "@/lib/tahsilat-module";
import { formatCurrency } from "@/lib/utils";
import { Banknote, Building2, Receipt, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TahsilatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tahsilat Yönetimi"
        description="Vezne operasyonları, makbuz işlemleri ve tahsilat raporları"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Tahsilat" },
        ]}
        action={
          <Link href="/tahsilat/yeni" className="btn-primary">
            <Plus className="h-4 w-4" />
            Yeni Tahsilat
          </Link>
        }
      />

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
          label="İşlem Adedi"
          value="87"
          change="Bugün 14:00'e kadar"
          changeType="neutral"
          icon={Receipt}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Vezne Kasası"
          value={formatCurrency(45230)}
          change="Nakit + kart toplamı"
          changeType="neutral"
          icon={Building2}
          iconColor="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Bekleyen İptal"
          value="2"
          change="Onay bekliyor"
          changeType="neutral"
          icon={XCircle}
          iconColor="bg-red-50 text-red-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tahsilatDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <Icon className="h-5 w-5 text-[#1e40af]" />
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
            Vezne → Finans → Modül raporları → Genel raporlar sırasıyla ilerleyin.
          </p>
        </div>

        {tahsilatWorkflowGroups.map((group) => {
          const items = group.itemIds.map((id) => getTahsilatItem(id)).filter(Boolean);

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
                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50",
                          item.variant === "danger" && "hover:bg-red-50/50",
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                            item.variant === "primary" && "bg-emerald-50 text-emerald-600",
                            item.variant === "danger" && "bg-red-50 text-red-600",
                            !item.variant && "bg-blue-50 text-[#1e40af]",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={cn(
                              "font-medium",
                              item.variant === "danger" ? "text-red-800" : "text-slate-900",
                            )}
                          >
                            {item.label}
                          </p>
                          <p className="text-xs text-slate-500">{item.description}</p>
                        </div>
                        {item.shortcut && (
                          <span className="hidden text-xs text-slate-400 sm:inline">
                            {item.shortcut}
                          </span>
                        )}
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
