import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { IzinModuleSearch } from "@/components/izin/IzinModuleSearch";
import { izinDailyActions, izinWorkflowGroups } from "@/lib/izin-submenus";
import { izinTotalItemCount } from "@/lib/izin-module";
import { CalendarCheck, Palmtree, Users, Clock } from "lucide-react";

export default function IzinPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="İzin Yönetimi"
        description="Personel izin tanımı, kayıt, takip ve durum listeleri"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "İzin Yönetimi" },
        ]}
        action={
          <Link href="/izin/izin-kaydi" className="btn-primary">
            <Plus className="h-4 w-4" />
            İzin Kaydı
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Aktif Personel"
          value="210"
          change="Memur + işçi toplam"
          changeType="neutral"
          icon={Users}
          iconColor="bg-sky-50 text-sky-600"
        />
        <StatCard
          label="Bu Ay İzin"
          value="18"
          change="6 onay bekliyor"
          changeType="neutral"
          icon={CalendarCheck}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="İzinde Olan"
          value="7"
          change="Bugün itibarıyla"
          changeType="neutral"
          icon={Palmtree}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Bekleyen Onay"
          value="6"
          change="2 mazeret izni"
          changeType="neutral"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {izinDailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-sky-200 hover:bg-sky-50/50"
              >
                <Icon className="h-5 w-5 text-sky-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <IzinModuleSearch />

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
          <p className="mt-1 text-sm text-slate-500">
            {izinTotalItemCount} işlem, 4 grupta — Tanım → Personel → Kayıt → Liste
            sırasıyla ilerleyin.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {izinWorkflowGroups.map((group) => (
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
