import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { SistemModuleSearch } from "@/components/sistem/SistemModuleSearch";
import { sistemDailyActions, sistemWorkflowGroups } from "@/lib/sistem-submenus";
import { sistemTotalItemCount } from "@/lib/sistem-module";
import { Globe, Shield, Users, Wallet } from "lucide-react";

export default function SistemPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Sistem Yönetimi"
        description="Kullanıcı, vezne, parametre ve modül ayarları"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Sistem Yönetimi" },
        ]}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Aktif Kullanıcı"
          value="24"
          change="3 yönetici yetkili"
          changeType="neutral"
          icon={Users}
          iconColor="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Tanımlı Vezne"
          value="6"
          change="2 banka vezneleri"
          changeType="neutral"
          icon={Wallet}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Modül Parametre"
          value="5"
          change="Su · Emlak · İşyeri · İmar · Personel"
          changeType="neutral"
          icon={Globe}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Sistem Durumu"
          value="Aktif"
          change="Tüm servisler çalışıyor"
          changeType="positive"
          icon={Shield}
          iconColor="bg-slate-100 text-slate-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {sistemDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-violet-200 hover:bg-violet-50/50"
              >
                <Icon className="h-5 w-5 text-violet-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <SistemModuleSearch />

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
          <p className="mt-1 text-sm text-slate-500">
            {sistemTotalItemCount} işlem, 7 grupta — BirNet SİSTEM menüsüyle bire bir
            eşleştirilmiştir.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sistemWorkflowGroups.map((group) => (
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
