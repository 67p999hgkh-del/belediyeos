import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { MemurModuleSearch } from "@/components/personel/MemurModuleSearch";
import {
  memurDailyActions,
  memurWorkflowGroups,
} from "@/lib/memur-submenus";
import { memurTotalItemCount } from "@/lib/memur-module";
import { formatCurrency } from "@/lib/utils";
import { Calculator, FileSpreadsheet, Users, Wallet } from "lucide-react";

export default function PersonelMemurPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Personel (Memur)"
        description="Memur sicil, maaş hesaplama, bordro ve ödeme yönetimi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Personel (Memur)" },
        ]}
        action={
          <Link href="/personel/memur/memur-karti" className="btn-primary">
            <Plus className="h-4 w-4" />
            Memur Kartı
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam Memur"
          value="84"
          change="3 yeni kayıt bu yıl"
          changeType="neutral"
          icon={Users}
          iconColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Bu Ay Bordro"
          value={formatCurrency(428000)}
          change="Şubat 2026 dönemi"
          changeType="neutral"
          icon={Calculator}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Bekleyen İşlem"
          value="6"
          change="2 maaş hesabı bekliyor"
          changeType="neutral"
          icon={FileSpreadsheet}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Toplam Ödeme"
          value={formatCurrency(5120000)}
          change="2026 yılı kümülatif"
          changeType="positive"
          icon={Wallet}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {memurDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <Icon className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <MemurModuleSearch />

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
          <p className="mt-1 text-sm text-slate-500">
            {memurTotalItemCount} ana işlem, 6 grupta — Sicil → Tanım → Hesaplama → Ödeme
            sırasıyla ilerleyin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {memurWorkflowGroups.map((group) => (
            <ModuleCard
              key={group.id}
              title={group.label}
              description={`${group.itemIds.length} işlem — ${group.description}`}
              href={group.href}
              icon={group.icon}
              color="purple"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
