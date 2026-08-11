import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Briefcase,
  Building2,
  ClipboardList,
  Droplets,
  FileText,
  Home,
  Landmark,
  List,
  Map,
  Pencil,
  Plus,
  Printer,
  Receipt,
  Search,
  Wallet,
  XCircle,
} from "lucide-react";

export interface TahsilatModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: "vezne" | "finans" | "modul" | "rapor";
  shortcut?: string;
  variant?: "primary" | "danger";
}

export const tahsilatModuleItems: TahsilatModuleItem[] = [
  {
    id: "yeni",
    label: "Tahsilat (Yeni)",
    description: "Vezne tahsilat kaydı oluştur",
    href: "/tahsilat/yeni",
    icon: Plus,
    group: "vezne",
    shortcut: "Ctrl+1",
    variant: "primary",
  },
  {
    id: "islemler",
    label: "Tahsilat İşlemleri",
    description: "Günlük tahsilat kayıtlarını yönet",
    href: "/tahsilat/islemler",
    icon: Banknote,
    group: "vezne",
    shortcut: "Ctrl+2",
  },
  {
    id: "makbuz-ara",
    label: "Tahsilat Makbuzu Arama",
    description: "Makbuz veya sicil numarası ile ara",
    href: "/tahsilat/makbuz-ara",
    icon: Search,
    group: "vezne",
  },
  {
    id: "makbuz-tekrar",
    label: "Makbuz Tekrar Yazımı",
    description: "Mevcut makbuzu yeniden yazdır",
    href: "/tahsilat/makbuz-tekrar",
    icon: Printer,
    group: "vezne",
  },
  {
    id: "banka-aktar",
    label: "Banka Tahsilatı Aktarma",
    description: "Bankadan gelen tahsilatları sisteme aktar",
    href: "/tahsilat/banka-aktar",
    icon: Landmark,
    group: "finans",
  },
  {
    id: "iptal",
    label: "Tahsilat İptali",
    description: "Hatalı tahsilat kaydını iptal et",
    href: "/tahsilat/iptal",
    icon: XCircle,
    group: "finans",
    variant: "danger",
  },
  {
    id: "duzeltme",
    label: "Tahsilat Düzeltme",
    description: "Kayıtlı tahsilat bilgisini düzelt",
    href: "/tahsilat/duzeltme",
    icon: Pencil,
    group: "finans",
  },
  {
    id: "rapor-su",
    label: "Su Tahsilat Dökümü",
    description: "Su modülü tahsilat raporu",
    href: "/tahsilat/raporlar/su",
    icon: Droplets,
    group: "modul",
  },
  {
    id: "rapor-emlak",
    label: "Emlak Tahsilat Dökümü",
    description: "Emlak modülü tahsilat raporu",
    href: "/tahsilat/raporlar/emlak",
    icon: Home,
    group: "modul",
  },
  {
    id: "rapor-isyeri",
    label: "İşyeri Tahsilat Dökümü",
    description: "İşyeri modülü tahsilat raporu",
    href: "/tahsilat/raporlar/isyeri",
    icon: Briefcase,
    group: "modul",
  },
  {
    id: "rapor-imar",
    label: "İmar Tahsilat Dökümü",
    description: "İmar modülü tahsilat raporu",
    href: "/tahsilat/raporlar/imar",
    icon: Map,
    group: "modul",
  },
  {
    id: "rapor-depozit",
    label: "Depozit Tahsilat Dökümü",
    description: "Depozit tahsilat raporu",
    href: "/tahsilat/raporlar/depozit",
    icon: Wallet,
    group: "modul",
  },
  {
    id: "rapor-fatura",
    label: "Fatura Tahsilat Dökümü",
    description: "Fatura tahsilat raporu",
    href: "/tahsilat/raporlar/fatura",
    icon: Receipt,
    group: "modul",
  },
  {
    id: "rapor-taksitli",
    label: "Taksitli Tahsilat Dökümü",
    description: "Taksitli tahsilat raporu",
    href: "/tahsilat/raporlar/taksitli",
    icon: ClipboardList,
    group: "modul",
  },
  {
    id: "rapor-genel",
    label: "Genel Tahsilat Raporu",
    description: "Tüm modüller genel özet raporu",
    href: "/tahsilat/raporlar/genel",
    icon: FileText,
    group: "rapor",
  },
  {
    id: "vezne-dokum",
    label: "Vezne Dökümü",
    description: "Günlük vezne kasa dökümü",
    href: "/tahsilat/raporlar/vezne",
    icon: Building2,
    group: "rapor",
  },
  {
    id: "liste",
    label: "Tahsilat Listesi",
    description: "Tüm tahsilat kayıtları listesi",
    href: "/tahsilat/liste",
    icon: List,
    group: "rapor",
  },
];

export const tahsilatWorkflowGroups = [
  {
    id: "vezne",
    label: "1. Vezne İşlemleri",
    description: "Günlük tahsilat ve makbuz operasyonları",
    itemIds: ["yeni", "islemler", "makbuz-ara", "makbuz-tekrar"],
  },
  {
    id: "finans",
    label: "2. Finansal İşlemler",
    description: "Banka aktarım, iptal ve düzeltme",
    itemIds: ["banka-aktar", "iptal", "duzeltme"],
  },
  {
    id: "modul",
    label: "3. Modül Dökümleri",
    description: "Modül bazlı tahsilat raporları",
    itemIds: [
      "rapor-su",
      "rapor-emlak",
      "rapor-isyeri",
      "rapor-imar",
      "rapor-depozit",
      "rapor-fatura",
      "rapor-taksitli",
    ],
  },
  {
    id: "rapor",
    label: "4. Genel Raporlar",
    description: "Vezne ve genel tahsilat listeleri",
    itemIds: ["rapor-genel", "vezne-dokum", "liste"],
  },
];

export const tahsilatDailyActions = [
  { label: "Yeni Tahsilat", href: "/tahsilat/yeni", icon: Plus },
  { label: "Makbuz Ara", href: "/tahsilat/makbuz-ara", icon: Search },
  { label: "İşlem Listesi", href: "/tahsilat/islemler", icon: Banknote },
  { label: "Vezne Dökümü", href: "/tahsilat/raporlar/vezne", icon: Building2 },
];

export function getTahsilatItem(id: string) {
  return tahsilatModuleItems.find((m) => m.id === id);
}
