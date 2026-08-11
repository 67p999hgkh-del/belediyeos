import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { ZabitaModuleSearch } from "@/components/zabita/ZabitaModuleSearch";
import { zabitaDailyActions, zabitaWorkflowGroups } from "@/lib/zabita-submenus";
import { zabitaTotalItemCount } from "@/lib/zabita-module";
import { formatCurrency } from "@/lib/utils";
import { FileText, Gavel, Scale, Shield } from "lucide-react";

export default function ZabitaPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Zabıta"
        description="İhbarname, mahkeme süreci, dava sonuçları ve şahıs kayıtları"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Zabıta" },
        ]}
        action={
          <Link href="/zabita/ihbarname-kayit" className="btn-primary">
            <Plus className="h-4 w-4" />
            İhbarname Kayıt
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bu Ay İhbarname"
          value="34"
          change="↑ 6 geçen aya göre"
          changeType="neutral"
          icon={FileText}
          iconColor="bg-red-50 text-red-600"
        />
        <StatCard
          label="Mahkemede Bekleyen"
          value="12"
          change="3 dosya onay bekliyor"
          changeType="neutral"
          icon={Gavel}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Toplam Borç"
          value={formatCurrency(48500)}
          change="İhbarname borçları"
          changeType="neutral"
          icon={Scale}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Kapatılan Dava"
          value="28"
          change="2026 yılı toplam"
          changeType="positive"
          icon={Shield}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {zabitaDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-red-200 hover:bg-red-50/50"
              >
                <Icon className="h-5 w-5 text-red-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <ZabitaModuleSearch />

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
          <p className="mt-1 text-sm text-slate-500">
            {zabitaTotalItemCount} işlem, 4 grupta — Sicil → İhbarname → Mahkeme → Arşiv
            sırasıyla ilerleyin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {zabitaWorkflowGroups.map((group) => (
            <ModuleCard
              key={group.id}
              title={group.label}
              description={`${group.itemIds.length} işlem — ${group.description}`}
              href={group.href}
              icon={group.icon}
              color="red"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
