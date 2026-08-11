import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  getIsyeriSection,
  isyeriDailyActions,
  isyeriWorkflowGroups,
} from "@/lib/isyeri-submenus";
import { getIsyeriItem } from "@/lib/isyeri-module";
import { formatCurrency } from "@/lib/utils";
import { AlertTriangle, Briefcase, Calculator, Scale } from "lucide-react";

export default function IsyeriPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="İşyeri Vergisi"
        description="İşyeri sicil, beyan, borç ve ruhsat yönetimi"
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
          label="Bu Yıl Beyan"
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

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Modüller</h2>
          <p className="mt-1 text-sm text-slate-500">
            Sicil → Beyan → Borç → Ruhsat sırasıyla ilerleyin.
          </p>
        </div>

        {isyeriWorkflowGroups.map((group) => {
          const items = group.itemIds.map((id) => getIsyeriItem(id)).filter(Boolean);

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
                  const section = getIsyeriSection(item.id);
                  const subCount = section?.subMenus.length;

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">
                            {subCount ? `${subCount} alt işlem` : item.description}
                          </p>
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
