import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { QuickAction } from "@/components/ui/QuickAction";
import {
  suHubIcon,
  suModuleGroups,
  suModuleItems,
} from "@/lib/su-module";
import { formatCurrency } from "@/lib/utils";
import { Droplets, FileText, Gauge, UserPlus } from "lucide-react";

const HubIcon = suHubIcon;

export default function SuPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Su Hizmetleri"
        description="Abonelik, faturalandırma, sayaç okuma ve su altyapı işlemleri"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Su Hizmetleri" },
        ]}
        action={
          <Link href="/su/abone" className="btn-primary">
            <Plus className="h-4 w-4" />
            Yeni Abone
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Aktif Abone"
          value="2.184"
          change="↑ 14 bu ay"
          changeType="positive"
          icon={UserPlus}
          iconColor="bg-cyan-50 text-cyan-600"
        />
        <StatCard
          label="Bu Ay Fatura"
          value="1.956"
          change="₺842.000 tahakkuk"
          changeType="neutral"
          icon={FileText}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Tahsil Edilen"
          value={formatCurrency(624500)}
          change="↑ 8.2% geçen aya göre"
          changeType="positive"
          icon={Droplets}
          iconColor="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          label="Ön Ödemeli Sayaç"
          value="186"
          change="12 okuma bekliyor"
          changeType="neutral"
          icon={Gauge}
          iconColor="bg-violet-50 text-violet-600"
        />
      </div>

      {suModuleGroups.map((group) => {
        const items = suModuleItems.filter((item) => item.group === group.id);
        if (items.length === 0) return null;

        return (
          <section key={group.id}>
            <h2 className="section-title mb-4">{group.label}</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <QuickAction
                  key={item.id}
                  title={item.label}
                  description={item.description}
                  href={item.href}
                  icon={item.icon}
                />
              ))}
            </div>
          </section>
        );
      })}

      <div className="card">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <HubIcon className="h-5 w-5 text-[#1e40af]" />
          <h2 className="font-semibold text-slate-900">Tüm Su Modülleri</h2>
        </div>
        <ul className="divide-y divide-slate-100">
          {suModuleItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{item.label}</p>
                    <p className="text-sm text-slate-500">{item.description}</p>
                  </div>
                  {item.hasSubMenu && (
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
