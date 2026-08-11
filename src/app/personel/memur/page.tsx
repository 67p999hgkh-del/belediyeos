import Link from "next/link";
import {
  Calculator,
  Clock,
  FileSpreadsheet,
  Plus,
  RotateCcw,
  Search,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { ModuleCard } from "@/components/ui/ModuleCard";
import { MemurModuleSearch } from "@/components/personel/MemurModuleSearch";
import { getMemurHubKpi } from "@/lib/memur-repository";
import { dogrulaMemurBirNetEslesme, memurWorkspaces } from "@/lib/memur-workspaces";

const hubCards = [
  { id: "personel-karti", icon: UserCircle, color: "purple" as const },
  { id: "maas-bordro", icon: Calculator, color: "purple" as const },
  { id: "ek-mesai", icon: Clock, color: "purple" as const },
  { id: "emeklilik", icon: Users, color: "purple" as const },
  { id: "kesinti-yatirim", icon: Wallet, color: "purple" as const },
  { id: "cek-islemleri", icon: FileSpreadsheet, color: "purple" as const },
  { id: "listeler", icon: Search, color: "purple" as const },
  { id: "islem-geri-alma", icon: RotateCcw, color: "purple" as const },
];

const sikKullanilan = [
  { label: "Memur Ara", href: "/personel/memur/personel-karti", icon: Search, yetki: "VIEW_PERSONNEL" as const },
  { label: "Yeni Memur", href: "/personel/memur/personel-karti", icon: Plus, yetki: "EDIT_PERSONNEL" as const },
  { label: "Maaş Hesapla", href: "/personel/memur/maas-bordro?tab=maas-hesaplama", icon: Calculator, yetki: "CALCULATE_PAYROLL" as const },
  { label: "Ek Mesai", href: "/personel/memur/ek-mesai", icon: Clock, yetki: "RUN_OVERTIME" as const },
  { label: "Bordro Görüntüle", href: "/personel/memur/maas-bordro?tab=bordrolar", icon: FileSpreadsheet, yetki: "PRINT_PAYROLL" as const },
];

export default function PersonelMemurPage() {
  const kpi = getMemurHubKpi();
  const eslesme = dogrulaMemurBirNetEslesme();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Personel (Memur)"
        description="Memur sicil, maaş hesaplama, bordro ve ödeme yönetimi"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Personel (Memur)" },
        ]}
        action={
          <Link href="/personel/memur/personel-karti" className="btn-primary">
            <Plus className="h-4 w-4" />
            Memur Kartı
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Aktif Memur"
          value={String(kpi.aktifMemur)}
          change={kpi.kaynak === "mock" ? "Demo veri" : "Canlı"}
          changeType="neutral"
          icon={Users}
          iconColor="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          label="Bu Ay Bordro"
          value={kpi.buAyBordro != null ? String(kpi.buAyBordro) : "—"}
          change="Backend bekleniyor"
          changeType="neutral"
          icon={Calculator}
          iconColor="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Ek Mesai Bekleyen"
          value={String(kpi.ekMesaiBekleyen)}
          change={kpi.kaynak === "mock" ? "Demo veri" : "Canlı"}
          changeType="neutral"
          icon={Clock}
          iconColor="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Emeklilik İşlemleri"
          value={String(kpi.emeklilikIslemleri)}
          change={kpi.kaynak === "mock" ? "Demo veri" : "Canlı"}
          changeType="neutral"
          icon={Users}
          iconColor="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Bekleyen Kesinti/Yardım"
          value={String(kpi.bekleyenKesintiYardim)}
          change={kpi.kaynak === "mock" ? "Demo veri" : "Canlı"}
          changeType="neutral"
          icon={Wallet}
          iconColor="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="card p-5">
        <h2 className="mb-4 text-sm font-semibold text-slate-900">Sık Kullanılan</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {sikKullanilan.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.href + action.label}
                href={action.href}
                className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-4 text-center transition hover:border-indigo-200 hover:bg-indigo-50/50"
              >
                <Icon className="h-5 w-5 text-indigo-600" />
                <span className="text-xs font-medium text-slate-700 sm:text-sm">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <MemurModuleSearch />

      <div>
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">İş Alanları</h2>
          <p className="mt-1 text-sm text-slate-500">
            {eslesme.toplam} BirNet fonksiyonu, {Object.keys(memurWorkspaces).length} workspace içinde gruplandı.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {hubCards.map(({ id, icon, color }) => {
            const ws = memurWorkspaces[id as keyof typeof memurWorkspaces];
            return (
              <ModuleCard
                key={id}
                title={ws.title}
                description={ws.description}
                href={ws.route}
                icon={icon}
                color={color}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
