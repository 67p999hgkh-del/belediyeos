import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Briefcase,
  Calculator,
  ClipboardList,
  FileText,
  HeartPulse,
  List,
  Pencil,
  Percent,
  Scale,
  Wallet,
} from "lucide-react";

export type IsyeriGroupId =
  | "sicil"
  | "beyan"
  | "bakiye"
  | "ruhsat"
  | "rapor"
  | "duzeltme";

export type IsyeriFrequency = "daily" | "periodic" | "admin";

export interface IsyeriModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: IsyeriGroupId;
  frequency: IsyeriFrequency;
  hasSubMenu?: boolean;
  /** Sekmeli ekran grubu — Giriş/Liste birleşik görünüm */
  tabGroup?: string;
}

export const isyeriModuleItems: IsyeriModuleItem[] = [
  {
    id: "kayit",
    label: "İşyeri Kaydı",
    description: "Yeni işyeri sicil kaydı oluştur",
    href: "/isyeri/kayit",
    icon: Briefcase,
    group: "sicil",
    frequency: "daily",
  },
  {
    id: "liste",
    label: "İşyeri Listesi",
    description: "Tüm işyerlerini listele ve sorgula",
    href: "/isyeri/liste",
    icon: List,
    group: "sicil",
    frequency: "daily",
  },
  {
    id: "no-degistir",
    label: "İşyeri No Değiştirme",
    description: "İşyeri sicil numarası güncelle",
    href: "/isyeri/no-degistir",
    icon: Pencil,
    group: "sicil",
    frequency: "admin",
  },
  {
    id: "beyan-bilgi",
    label: "İşyeri Bildirim Bilgileri",
    description: "İşyeri bildirim kayıt ve bilgileri",
    href: "/isyeri/beyan-bilgi",
    icon: FileText,
    group: "beyan",
    frequency: "daily",
  },
  {
    id: "beyan-hesapla",
    label: "Bildirim Hesapla",
    description: "İşyeri vergisi bildirimi hesapla",
    href: "/isyeri/beyan-hesapla",
    icon: Calculator,
    group: "beyan",
    frequency: "periodic",
  },
  {
    id: "beyan-iptal",
    label: "Bildirim Hesaplama İptali",
    description: "Hesaplanan bildirimi iptal et",
    href: "/isyeri/beyan-iptal",
    icon: ClipboardList,
    group: "beyan",
    frequency: "admin",
  },
  {
    id: "beyan-dokum",
    label: "Bildirim Dökümü",
    description: "Bildirim listesi ve döküm raporu",
    href: "/isyeri/beyan-dokum",
    icon: FileText,
    group: "beyan",
    frequency: "periodic",
  },
  {
    id: "hesap-bilgi",
    label: "İşyeri Hesap Bilgileri",
    description: "İşyeri cari hesap bilgileri",
    href: "/isyeri/hesap-bilgi",
    icon: Wallet,
    group: "bakiye",
    frequency: "daily",
  },
  {
    id: "bakiye-kontrol",
    label: "İşyeri Bakiye Kontrol",
    description: "Bakiye tutarlılık kontrolü",
    href: "/isyeri/bakiye-kontrol",
    icon: Scale,
    group: "bakiye",
    frequency: "periodic",
  },
  {
    id: "borc-bildirim",
    label: "İşyeri Borç Bildirimi",
    description: "Borç bildirimi oluştur ve yazdır",
    href: "/isyeri/borc-bildirim",
    icon: AlertTriangle,
    group: "bakiye",
    frequency: "periodic",
  },
  {
    id: "borclu-liste",
    label: "İşyeri Borçlular Listesi",
    description: "Borçlu işyerleri listesi",
    href: "/isyeri/borclu-liste",
    icon: List,
    group: "bakiye",
    frequency: "daily",
  },
  {
    id: "tarih-borc",
    label: "Tarih Bazında İşyeri Borçları Listesi",
    description: "Dönem bazlı borç dökümü",
    href: "/isyeri/tarih-borc",
    icon: List,
    group: "bakiye",
    frequency: "periodic",
  },
  {
    id: "ruhsat-liste",
    label: "İşyeri İzin Belgesi Listesi",
    description: "İşyeri izin belgesi kayıtları",
    href: "/isyeri/ruhsat-liste",
    icon: Briefcase,
    group: "ruhsat",
    frequency: "periodic",
  },
  {
    id: "vergi-aski",
    label: "İşyeri Vergileri Askı Listesi",
    description: "Askıya alınan vergi kayıtları",
    href: "/isyeri/vergi-aski",
    icon: ClipboardList,
    group: "ruhsat",
    frequency: "periodic",
  },
  {
    id: "saglik-giris",
    label: "İşyeri Sağlık Karnesi Giriş",
    description: "Sağlık karnesi kaydı oluştur",
    href: "/isyeri/saglik-giris",
    icon: HeartPulse,
    group: "ruhsat",
    frequency: "daily",
    tabGroup: "saglik-karnesi",
  },
  {
    id: "saglik-liste",
    label: "İşyeri Sağlık Karnesi Listesi",
    description: "Sağlık karnesi kayıtlarını listele",
    href: "/isyeri/saglik-liste",
    icon: HeartPulse,
    group: "ruhsat",
    frequency: "daily",
    tabGroup: "saglik-karnesi",
  },
  {
    id: "ihtar-liste",
    label: "Uyarı Listesi",
    description: "Uyarı yazısı gönderilen işyerleri",
    href: "/isyeri/ihtar-liste",
    icon: AlertTriangle,
    group: "rapor",
    frequency: "periodic",
  },
  {
    id: "vergi-dokum",
    label: "İşyerleri Vergi Dökümü",
    description: "Vergi tahakkuk ve tahsilat dökümü",
    href: "/isyeri/vergi-dokum",
    icon: FileText,
    group: "rapor",
    frequency: "periodic",
  },
  {
    id: "hesap-duzeltme",
    label: "İşyeri Hesap Düzeltme",
    description: "İşyeri hesap kaydı düzeltme",
    href: "/isyeri/hesap-duzeltme",
    icon: Pencil,
    group: "duzeltme",
    frequency: "admin",
    tabGroup: "hesap-duzeltme",
  },
  {
    id: "duzeltme-liste",
    label: "İşyeri Hesap Düzeltme Listesi",
    description: "Yapılan düzeltme işlemleri listesi",
    href: "/isyeri/duzeltme-liste",
    icon: List,
    group: "duzeltme",
    frequency: "admin",
    tabGroup: "hesap-duzeltme",
  },
  {
    id: "ceza-indirimi",
    label: "Ceza İndirimi",
    description: "Gecikme cezası indirim işlemleri",
    href: "/isyeri/ceza-indirimi",
    icon: Percent,
    group: "duzeltme",
    frequency: "admin",
    hasSubMenu: true,
  },
];

export const isyeriHubIcon = Briefcase;

export function getIsyeriItem(id: string) {
  return isyeriModuleItems.find((m) => m.id === id);
}

export function searchIsyeriItems(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  return isyeriModuleItems.filter(
    (item) =>
      item.label.toLocaleLowerCase("tr").includes(q) ||
      item.description.toLocaleLowerCase("tr").includes(q),
  );
}
