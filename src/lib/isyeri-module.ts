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

export interface IsyeriModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: "sicil" | "beyan" | "bakiye" | "ruhsat" | "rapor" | "duzeltme" | "ceza";
  hasSubMenu?: boolean;
}

export const isyeriModuleItems: IsyeriModuleItem[] = [
  {
    id: "kayit",
    label: "İşyeri Kaydı",
    description: "Yeni işyeri sicil kaydı oluştur",
    href: "/isyeri/kayit",
    icon: Briefcase,
    group: "sicil",
  },
  {
    id: "liste",
    label: "İşyeri Listesi",
    description: "Tüm işyerlerini listele ve sorgula",
    href: "/isyeri/liste",
    icon: List,
    group: "sicil",
  },
  {
    id: "no-degistir",
    label: "İşyeri No Değiştirme",
    description: "İşyeri sicil numarası güncelle",
    href: "/isyeri/no-degistir",
    icon: Pencil,
    group: "sicil",
  },
  {
    id: "beyan-bilgi",
    label: "Beyan Bilgileri",
    description: "İşyeri beyan kayıt ve bilgileri",
    href: "/isyeri/beyan-bilgi",
    icon: FileText,
    group: "beyan",
  },
  {
    id: "beyan-hesapla",
    label: "Beyan Hesapla",
    description: "İşyeri vergisi beyanı hesapla",
    href: "/isyeri/beyan-hesapla",
    icon: Calculator,
    group: "beyan",
  },
  {
    id: "beyan-iptal",
    label: "Beyan Hesaplama İptal",
    description: "Hesaplanan beyanı iptal et",
    href: "/isyeri/beyan-iptal",
    icon: ClipboardList,
    group: "beyan",
  },
  {
    id: "beyan-dokum",
    label: "Beyan Dökümü",
    description: "Beyan listesi ve döküm raporu",
    href: "/isyeri/beyan-dokum",
    icon: FileText,
    group: "beyan",
  },
  {
    id: "hesap-bilgi",
    label: "İşyeri Hesap Bilgileri",
    description: "İşyeri cari hesap bilgileri",
    href: "/isyeri/hesap-bilgi",
    icon: Wallet,
    group: "bakiye",
  },
  {
    id: "bakiye-kontrol",
    label: "İşyeri Bakiye Kontrol",
    description: "Bakiye tutarlılık kontrolü",
    href: "/isyeri/bakiye-kontrol",
    icon: Scale,
    group: "bakiye",
  },
  {
    id: "borc-bildirim",
    label: "İşyeri Borç Bildirimi",
    description: "Borç bildirimi oluştur ve yazdır",
    href: "/isyeri/borc-bildirim",
    icon: AlertTriangle,
    group: "bakiye",
  },
  {
    id: "borclu-liste",
    label: "İşyeri Borçlu Listesi",
    description: "Borçlu işyerleri listesi",
    href: "/isyeri/borclu-liste",
    icon: List,
    group: "bakiye",
  },
  {
    id: "tarih-borc",
    label: "Tarihe Göre Borç Listesi",
    description: "Dönem bazlı borç dökümü",
    href: "/isyeri/tarih-borc",
    icon: List,
    group: "bakiye",
  },
  {
    id: "ruhsat-liste",
    label: "İşyeri Ruhsat Belgesi Listesi",
    description: "Ruhsat belgesi kayıtları",
    href: "/isyeri/ruhsat-liste",
    icon: Briefcase,
    group: "ruhsat",
  },
  {
    id: "vergi-aski",
    label: "İşyeri Vergileri Askı Listesi",
    description: "Askıya alınan vergi kayıtları",
    href: "/isyeri/vergi-aski",
    icon: ClipboardList,
    group: "ruhsat",
  },
  {
    id: "saglik-giris",
    label: "İşyeri Sağlık Cüzdanı Girişi",
    description: "Sağlık cüzdanı kaydı oluştur",
    href: "/isyeri/saglik-giris",
    icon: HeartPulse,
    group: "ruhsat",
  },
  {
    id: "saglik-liste",
    label: "İşyeri Sağlık Cüzdanı Listesi",
    description: "Sağlık cüzdanı kayıtlarını listele",
    href: "/isyeri/saglik-liste",
    icon: HeartPulse,
    group: "ruhsat",
  },
  {
    id: "ihtar-liste",
    label: "İhtar Listesi",
    description: "İhtar yazısı gönderilen işyerleri",
    href: "/isyeri/ihtar-liste",
    icon: AlertTriangle,
    group: "rapor",
  },
  {
    id: "vergi-dokum",
    label: "İşyeri Vergi Dökümü",
    description: "Vergi tahakkuk ve tahsilat dökümü",
    href: "/isyeri/vergi-dokum",
    icon: FileText,
    group: "rapor",
  },
  {
    id: "hesap-duzeltme",
    label: "Hesap Düzeltme",
    description: "İşyeri hesap kaydı düzeltme",
    href: "/isyeri/hesap-duzeltme",
    icon: Pencil,
    group: "duzeltme",
  },
  {
    id: "duzeltme-liste",
    label: "Hesap Düzeltme Listesi",
    description: "Yapılan düzeltme işlemleri listesi",
    href: "/isyeri/duzeltme-liste",
    icon: List,
    group: "duzeltme",
  },
  {
    id: "ceza-indirimi",
    label: "Ceza İndirimi",
    description: "Gecikme cezası indirim işlemleri",
    href: "/isyeri/ceza-indirimi",
    icon: Percent,
    group: "ceza",
    hasSubMenu: true,
  },
];

export const isyeriHubIcon = Briefcase;

export function getIsyeriItem(id: string) {
  return isyeriModuleItems.find((m) => m.id === id);
}
