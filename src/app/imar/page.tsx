import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { imarDailyActions, imarWorkflowGroups } from "@/lib/imar-submenus";
import { getImarItem, imarTotalItemCount } from "@/lib/imar-module";
import { formatCurrency } from "@/lib/utils";
import { Building2, FileText, FolderOpen, Wallet } from "lucide-react";

export default function ImarPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="İmar & Ruhsat"
        description="İnşaat izin dosyası, ruhsat hesaplama ve izin listesi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "İmar & Ruhsat" },
        ]}
        action={
          <Link href="/imar/dosya-kayit" className="btn-primary">
            <Plus className="h-4 w-4" />
            Dosya Kayıt
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Bekleyen Dosya"
          value="24"
          change="8 ruhsat hesabı bekliyor"
          changeType="neutral"
          icon={FolderOpen}
          iconColor="bg-violet-50 text-violet-600"
        />
        <StatCard
          label="Bu Ay Ruhsat"
          value="12"
          change="↑ 3 geçen aya göre"
          changeType="positive"
          icon={Building2}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Toplam İzin"
          value="486"
          change="Aktif kayıtlar"
          changeType="neutral"
          icon={FileText}
          iconColor="bg-slate-100 text-slate-600"
        />
        <Link href="/tahsilat/raporlar/imar">
          <StatCard
            label="Tahsil Edilen"
            value={formatCurrency(185000)}
            change="↑ 4.8% — tahsilat raporuna git"
            changeType="positive"
            icon={Wallet}
            iconColor="bg-emerald-50 text-emerald-600"
          />
        </Link>
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {imarDailyActions.map((action) => {
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

      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Modüller</h2>
          <p className="mt-1 text-sm text-slate-500">
            {imarTotalItemCount} işlem, 2 grupta — Dosya Kayıt → Ruhsat Hesaplama → Dilekçe
            sırasıyla ilerleyin.
          </p>
        </div>

        {imarWorkflowGroups.map((group) => {
          const items = group.itemIds.map((id) => getImarItem(id)).filter(Boolean);

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

                  return (
                    <li key={item.id}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900">{item.label}</p>
                          <p className="text-xs text-slate-500">{item.description}</p>
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
