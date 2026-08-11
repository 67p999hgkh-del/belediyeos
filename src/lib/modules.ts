import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Briefcase,
  Building2,
  ClipboardList,
  Droplets,
  Home,
  Landmark,
  LayoutDashboard,
  Map,
  Receipt,
  Settings,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

export interface Municipality {
  id: string;
  name: string;
  shortName: string;
}

export interface NavModule {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

export interface TahsilatAction {
  id: string;
  label: string;
  href: string;
  shortcut?: string;
  icon: LucideIcon;
  variant?: "primary" | "default" | "danger";
  group: "islem" | "rapor" | "diger";
}

export const municipalities: Municipality[] = [
  { id: "erenkoy", name: "Erenköy Karpaz Belediyesi", shortName: "Erenköy Karpaz" },
  { id: "girne", name: "Girne Belediyesi", shortName: "Girne" },
  { id: "lefkosa", name: "Lefkoşa Belediyesi", shortName: "Lefkoşa" },
];

export const navModules: NavModule[] = [
  {
    id: "dashboard",
    label: "Ana Sayfa",
    href: "/",
    icon: LayoutDashboard,
    description: "Genel özet ve hızlı erişim",
  },
  {
    id: "tahsilat",
    label: "Tahsilat",
    href: "/tahsilat",
    icon: Banknote,
    description: "Vezne ve tahsilat işlemleri",
  },
  {
    id: "su",
    label: "Su",
    href: "/su",
    icon: Droplets,
    description: "Su abonelik ve faturalandırma",
  },
  {
    id: "emlak",
    label: "Emlak",
    href: "/emlak",
    icon: Home,
    description: "Emlak vergisi işlemleri",
  },
  {
    id: "isyeri",
    label: "İşyeri",
    href: "/isyeri",
    icon: Briefcase,
    description: "İşyeri vergisi işlemleri",
  },
  {
    id: "imar",
    label: "İmar",
    href: "/imar",
    icon: Map,
    description: "İmar ve ruhsat işlemleri",
  },
  {
    id: "personel-memur",
    label: "Personel (Memur)",
    href: "/personel/memur",
    icon: Users,
    description: "Memur kadrosu ve bordro",
  },
  {
    id: "personel-isci",
    label: "Personel (İşçi)",
    href: "/personel/isci",
    icon: Users,
    description: "İşçi kadrosu ve bordro",
  },
  {
    id: "izin",
    label: "İzin",
    href: "/izin",
    icon: ClipboardList,
    description: "İzin takibi",
  },
  {
    id: "muhasebe",
    label: "Muhasebe",
    href: "/muhasebe",
    icon: Wallet,
    description: "Muhasebe ve bütçe",
  },
  {
    id: "zabita",
    label: "Zabıta",
    href: "/zabita",
    icon: Shield,
    description: "Zabıta işlemleri",
  },
  {
    id: "sistem",
    label: "Sistem",
    href: "/sistem",
    icon: Settings,
    description: "Ayarlar ve yönetim",
  },
];

export const tahsilatActions: TahsilatAction[] = [
  {
    id: "yeni",
    label: "Tahsilat (Yeni)",
    href: "/tahsilat/yeni",
    shortcut: "Ctrl+1",
    icon: Receipt,
    variant: "primary",
    group: "islem",
  },
  {
    id: "islemler",
    label: "Tahsilat İşlemleri",
    href: "/tahsilat/islemler",
    shortcut: "Ctrl+2",
    icon: Banknote,
    group: "islem",
  },
  {
    id: "makbuz-tekrar",
    label: "Makbuz Tekrar Yazımı",
    href: "/tahsilat/makbuz-tekrar",
    icon: Receipt,
    group: "islem",
  },
  {
    id: "iptal",
    label: "Tahsilat İptali",
    href: "/tahsilat/iptal",
    icon: Receipt,
    variant: "danger",
    group: "islem",
  },
  {
    id: "banka-aktar",
    label: "Banka Tahsilatı Aktarma",
    href: "/tahsilat/banka-aktar",
    icon: Landmark,
    group: "islem",
  },
  {
    id: "rapor-genel",
    label: "Genel Tahsilat Raporu",
    href: "/tahsilat/raporlar/genel",
    icon: Receipt,
    group: "rapor",
  },
  {
    id: "rapor-su",
    label: "Su Tahsilat Dökümü",
    href: "/tahsilat/raporlar/su",
    icon: Droplets,
    group: "rapor",
  },
  {
    id: "rapor-emlak",
    label: "Emlak Tahsilat Dökümü",
    href: "/tahsilat/raporlar/emlak",
    icon: Home,
    group: "rapor",
  },
  {
    id: "rapor-isyeri",
    label: "İşyeri Tahsilat Dökümü",
    href: "/tahsilat/raporlar/isyeri",
    icon: Briefcase,
    group: "rapor",
  },
  {
    id: "rapor-imar",
    label: "İmar Tahsilat Dökümü",
    href: "/tahsilat/raporlar/imar",
    icon: Map,
    group: "rapor",
  },
  {
    id: "rapor-depozit",
    label: "Depozit Tahsilat Dökümü",
    href: "/tahsilat/raporlar/depozit",
    icon: Wallet,
    group: "rapor",
  },
  {
    id: "rapor-fatura",
    label: "Fatura Tahsilat Dökümü",
    href: "/tahsilat/raporlar/fatura",
    icon: Receipt,
    group: "rapor",
  },
  {
    id: "rapor-taksitli",
    label: "Taksitli Tahsilat Dökümü",
    href: "/tahsilat/raporlar/taksitli",
    icon: Receipt,
    group: "rapor",
  },
  {
    id: "vezne-dokum",
    label: "Vezne Dökümü",
    href: "/tahsilat/raporlar/vezne",
    icon: Building2,
    group: "rapor",
  },
  {
    id: "liste",
    label: "Tahsilat Listesi",
    href: "/tahsilat/liste",
    icon: ClipboardList,
    group: "diger",
  },
  {
    id: "makbuz-ara",
    label: "Tahsilat Makbuzu Arama",
    href: "/tahsilat/makbuz-ara",
    icon: Receipt,
    group: "diger",
  },
  {
    id: "duzeltme",
    label: "Tahsilat Düzeltme",
    href: "/tahsilat/duzeltme",
    icon: Receipt,
    group: "diger",
  },
];

export const tahsilatReportModules = [
  { id: "su", label: "Su", href: "/tahsilat/raporlar/su" },
  { id: "emlak", label: "Emlak", href: "/tahsilat/raporlar/emlak" },
  { id: "isyeri", label: "İşyeri", href: "/tahsilat/raporlar/isyeri" },
  { id: "imar", label: "İmar", href: "/tahsilat/raporlar/imar" },
  { id: "depozit", label: "Depozit", href: "/tahsilat/raporlar/depozit" },
  { id: "fatura", label: "Fatura", href: "/tahsilat/raporlar/fatura" },
  { id: "taksitli", label: "Taksitli", href: "/tahsilat/raporlar/taksitli" },
];
