import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { MuhasebeModuleSearch } from "@/components/muhasebe/MuhasebeModuleSearch";
import {
  muhasebeDailyActions,
  muhasebeWorkflowGroups,
} from "@/lib/muhasebe-submenus";
import { muhasebeTotalItemCount } from "@/lib/muhasebe-module";
import { formatCurrency } from "@/lib/utils";
import { Calculator, Landmark, TrendingUp, Wallet } from "lucide-react";

export default function MuhasebePage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Muhasebe"
        description="Hesap planı, kasa, mahsup, ödeme ve bütçe yönetimi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Muhasebe" },
        ]}
        action={
          <Link href="/muhasebe/mahsup" className="btn-primary">
            <Plus className="h-4 w-4" />
            Mahsup Fişi
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Kasa Bakiyesi"
          value={formatCurrency(245000)}
          change="Güncel kasa durumu"
          changeType="neutral"
          icon={Wallet}
          iconColor="bg-slate-100 text-slate-700"
        />
        <StatCard
          label="Bu Ay Ödeme"
          value={formatCurrency(890000)}
          change="42 ödeme emri"
          changeType="neutral"
          icon={Calculator}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Bütçe Kullanımı"
          value="%62"
          change="2026 yılı gerçekleşme"
          changeType="neutral"
          icon={TrendingUp}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Bekleyen Fiş"
          value="8"
          change="3 mahsup onay bekliyor"
          changeType="neutral"
          icon={Landmark}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {muhasebeDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-slate-300 hover:bg-slate-100/80"
              >
                <Icon className="h-5 w-5 text-slate-700" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <MuhasebeModuleSearch />

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
          <p className="mt-1 text-sm text-slate-500">
            {muhasebeTotalItemCount} işlem, 4 grupta — Plan → Kasa → Kayıt → Ödeme
            sırasıyla ilerleyin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {muhasebeWorkflowGroups.map((group) => (
            <ModuleCard
              key={group.id}
              title={group.label}
              description={`${group.itemIds.length} işlem — ${group.description}`}
              href={group.href}
              icon={group.icon}
              color="blue"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
