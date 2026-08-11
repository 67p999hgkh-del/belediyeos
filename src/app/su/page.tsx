import Link from "next/link";
import { ArrowRight, Plus, Search, Upload } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { suSections } from "@/lib/su-submenus";
import { formatCurrency } from "@/lib/utils";
import { Droplets, FileText, Gauge, UserPlus } from "lucide-react";

/** Günlük en sık kullanılan işlemler — tek tıkla erişim */
const dailyActions = [
  { label: "Abone Sorgula", href: "/su/abone/sorgulama", icon: Search },
  { label: "Fatura Kes", href: "/su/fatura/kesme", icon: FileText },
  { label: "Okuma Aktar", href: "/su/el-terminali/aktarim", icon: Upload },
  { label: "Yeni Abone", href: "/su/abone/kayit", icon: Plus },
];

/**
 * İş akışı sırası — belediye personeli tipik günlük akış:
 * 1 Abonelik → 2 Faturalandırma → 3 Saha → 4 Bakiye/Finans → 5 Altyapı → 6 Düzeltme
 */
const workflowGroups = [
  {
    id: "abonelik",
    label: "1. Abonelik",
    description: "Abone kayıt, sorgulama ve sayaç işlemleri",
    sectionIds: ["abone"],
  },
  {
    id: "fatura",
    label: "2. Faturalandırma",
    description: "Fatura kesme, tahakkuk ve genel fatura",
    sectionIds: ["fatura", "genel-fatura"],
  },
  {
    id: "saha",
    label: "3. Saha & Sayaç",
    description: "El terminali ve ön ödemeli sayaçlar",
    sectionIds: ["el-terminali", "on-odemeli-sayac"],
  },
  {
    id: "finans",
    label: "4. Bakiye & İndirim",
    description: "Kredi, ek bakiye ve ceza indirimi",
    sectionIds: ["kredi", "ek-bakiye", "ceza-indirimi"],
  },
  {
    id: "altyapi",
    label: "5. Altyapı",
    description: "Kanalizasyon bedeli işlemleri",
    sectionIds: ["kanalizasyon"],
  },
  {
    id: "duzeltme",
    label: "6. Düzeltme",
    description: "Hatalı kayıt düzeltme — yetkili kullanıcı",
    sectionIds: ["duzeltme"],
  },
];

export default function SuPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Su Hizmetleri"
        description="Abonelik, faturalandırma ve sayaç yönetimi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Su Hizmetleri" },
        ]}
        action={
          <Link href="/su/abone/kayit" className="btn-primary">
            <Plus className="h-4 w-4" />
            Yeni Abone
          </Link>
        }
      />

      {/* Özet metrikler */}
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
          label="Okuma Bekleyen"
          value="12"
          change="186 ön ödemeli sayaç"
          changeType="neutral"
          icon={Gauge}
          iconColor="bg-violet-50 text-violet-600"
        />
      </div>

      {/* Günlük işlemler — en üstte, tek satır */}
      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {dailyActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-cyan-200 hover:bg-cyan-50/50"
              >
                <Icon className="h-5 w-5 text-cyan-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">
                  {action.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Tek navigasyon: iş akışına göre gruplu liste — tekrar yok */}
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Modüller</h2>
          <p className="mt-1 text-sm text-slate-500">
            İş akışı sırasına göre düzenlenmiştir. Modüle tıklayın, alt işlemler açılır.
          </p>
        </div>

        {workflowGroups.map((group) => {
          const sections = suSections.filter((s) => group.sectionIds.includes(s.id));
          if (sections.length === 0) return null;

          return (
            <section key={group.id} className="card overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3">
                <p className="font-semibold text-slate-900">{group.label}</p>
                <p className="text-xs text-slate-500">{group.description}</p>
              </div>
              <ul className="divide-y divide-slate-100">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <li key={section.id}>
                      <Link
                        href={section.href}
                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-50 text-cyan-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">{section.label}</p>
                          <p className="text-xs text-slate-500">
                            {section.subMenus.length} işlem
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
