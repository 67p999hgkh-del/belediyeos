import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { IsyeriModuleSearch } from "@/components/isyeri/IsyeriModuleSearch";
import {
  isyeriDailyActions,
  isyeriTotalItemCount,
  isyeriWorkflowGroups,
} from "@/lib/isyeri-submenus";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Briefcase, Calculator, Scale } from "lucide-react";

export default function IsyeriPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="İşyeri Vergisi"
        description="İşyeri sicil, bildirim, borç ve izin yönetimi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "İşyeri Vergisi" },
        ]}
        action={
          <Link href="/isyeri/kayit" className="btn-primary">
            <Plus className="h-4 w-4" />
            Yeni İşyeri
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Kayıtlı İşyeri"
          value="1.842"
          change="↑ 18 bu ay"
          changeType="positive"
          icon={Briefcase}
          iconColor="bg-orange-50 text-orange-600"
        />
        <StatCard
          label="Bu Yıl Bildirim"
          value="1.654"
          change="%89.8 tamamlandı"
          changeType="neutral"
          icon={Calculator}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Toplam Borç"
          value={formatCurrency(680000)}
          change="412 borçlu işyeri"
          changeType="neutral"
          icon={Scale}
          iconColor="bg-red-50 text-red-600"
        />
        <Link href="/tahsilat/raporlar/isyeri">
          <StatCard
            label="Tahsil Edilen"
            value={formatCurrency(420000)}
            change="↑ 6.2% — tahsilat raporuna git"
            changeType="positive"
            icon={AlertTriangle}
            iconColor="bg-emerald-50 text-emerald-600"
          />
        </Link>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {isyeriDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-orange-200 hover:bg-orange-50/50"
              >
                <Icon className="h-5 w-5 text-orange-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <IsyeriModuleSearch />

      <div>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
            <p className="mt-1 text-sm text-slate-500">
              {isyeriTotalItemCount} işlem, 6 grupta — Sicil → Bildirim → Borç → İzin sırasıyla
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {isyeriWorkflowGroups.map((group) => (
            <ModuleCard
              key={group.id}
              title={group.label}
              description={`${group.itemIds.length} işlem — ${group.description}`}
              href={group.href}
              icon={group.icon}
              color="orange"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
