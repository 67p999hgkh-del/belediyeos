import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { IsciModuleSearch } from "@/components/personel/IsciModuleSearch";
import { isciDailyActions, isciWorkflowGroups } from "@/lib/isci-submenus";
import { isciTotalItemCount } from "@/lib/isci-module";
import { formatCurrency } from "@/lib/utils";
import { Calculator, FileSpreadsheet, HardHat, Wallet } from "lucide-react";

export default function PersonelIsciPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Personel (İşçi)"
        description="İşçi sicil, maaş hesaplama, bordro ve tazminat yönetimi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Personel (İşçi)" },
        ]}
        action={
          <Link href="/personel/isci/isci-karti" className="btn-primary">
            <Plus className="h-4 w-4" />
            İşçi Kartı
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Toplam İşçi"
          value="126"
          change="5 yeni kayıt bu yıl"
          changeType="neutral"
          icon={HardHat}
          iconColor="bg-teal-50 text-teal-600"
        />
        <StatCard
          label="Bu Ay Bordro"
          value={formatCurrency(312000)}
          change="Şubat 2026 dönemi"
          changeType="neutral"
          icon={Calculator}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Bekleyen İşlem"
          value="4"
          change="1 kıdem tazminatı bekliyor"
          changeType="neutral"
          icon={FileSpreadsheet}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Toplam Ödeme"
          value={formatCurrency(3740000)}
          change="2026 yılı kümülatif"
          changeType="positive"
          icon={Wallet}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {isciDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-teal-200 hover:bg-teal-50/50"
              >
                <Icon className="h-5 w-5 text-teal-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <IsciModuleSearch />

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isciTotalItemCount} ana işlem, 6 grupta — Sicil → Tanım → Hesaplama → Tazminat
            sırasıyla ilerleyin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isciWorkflowGroups.map((group) => (
            <ModuleCard
              key={group.id}
              title={group.label}
              description={`${group.itemIds.length} işlem — ${group.description}`}
              href={group.href}
              icon={group.icon}
              color="green"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
