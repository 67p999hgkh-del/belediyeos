import Link from "next/link";
import {
  Banknote,
  FileBarChart,
  Landmark,
  Plus,
  Printer,
  Search,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { QuickAction } from "@/components/ui/QuickAction";

const operations = [
  {
    title: "Yeni Tahsilat",
    description: "Vezne tahsilat kaydı oluşturun",
    href: "/tahsilat/yeni",
    icon: Plus,
  },
  {
    title: "İşlem Listesi",
    description: "Günlük tahsilat kayıtlarını yönetin",
    href: "/tahsilat/islemler",
    icon: Banknote,
  },
  {
    title: "Makbuz Arama",
    description: "Makbuz numarası veya sicil ile sorgulayın",
    href: "/tahsilat/makbuz-ara",
    icon: Search,
  },
  {
    title: "Makbuz Yeniden Basım",
    description: "Mevcut makbuzları tekrar yazdırın",
    href: "/tahsilat/makbuz-tekrar",
    icon: Printer,
  },
  {
    title: "Banka Aktarımı",
    description: "Banka tahsilatlarını sisteme aktarın",
    href: "/tahsilat/banka-aktar",
    icon: Landmark,
  },
  {
    title: "Tahsilat İptali",
    description: "Hatalı kayıtları iptal edin",
    href: "/tahsilat/iptal",
    icon: XCircle,
  },
];

const reports = [
  { label: "Genel Tahsilat Raporu", href: "/tahsilat/raporlar/genel" },
  { label: "Su Tahsilat Dökümü", href: "/tahsilat/raporlar/su" },
  { label: "Emlak Tahsilat Dökümü", href: "/tahsilat/raporlar/emlak" },
  { label: "İşyeri Tahsilat Dökümü", href: "/tahsilat/raporlar/isyeri" },
  { label: "Vezne Dökümü", href: "/tahsilat/raporlar/vezne" },
  { label: "Tahsilat Listesi", href: "/tahsilat/liste" },
];

export default function TahsilatPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Tahsilat Yönetimi"
        description="Vezne operasyonları, makbuz işlemleri ve tahsilat raporları"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Tahsilat" },
        ]}
        action={
          <Link href="/tahsilat/yeni" className="btn-primary">
            <Plus className="h-4 w-4" />
            Yeni Tahsilat
          </Link>
        }
      />

      <div>
        <h2 className="section-title mb-4">Operasyonlar</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {operations.map((op) => (
            <QuickAction key={op.href} {...op} />
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 border-b border-slate-100 px-5 py-4">
          <FileBarChart className="h-5 w-5 text-[#1e40af]" />
          <h2 className="font-semibold text-slate-900">Raporlar & Dökümler</h2>
        </div>
        <div className="grid gap-1 p-2 sm:grid-cols-2">
          {reports.map((report) => (
            <Link
              key={report.href}
              href={report.href}
              className="rounded-lg px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50 hover:text-[#1e40af]"
            >
              {report.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
