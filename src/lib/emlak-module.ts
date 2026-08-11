import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  ClipboardList,
  CreditCard,
  FileCheck,
  FileText,
  Home,
  List,
  Pencil,
  Percent,
  Printer,
  Scale,
  Wallet,
} from "lucide-react";

export interface EmlakModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: "beyan" | "tahakkuk" | "bakiye" | "ek" | "sicil" | "duzeltme" | "kredi";
  hasSubMenu?: boolean;
}

export const emlakModuleItems: EmlakModuleItem[] = [
  {
    id: "genel-beyanname",
    label: "Genel Beyanname",
    description: "Genel emlak beyannamesi işlemleri",
    href: "/emlak/genel-beyanname",
    icon: FileText,
    group: "beyan",
  },
  {
    id: "bildirim-giris",
    label: "Bildirim Girişi",
    description: "Yeni emlak bildirimi kaydet",
    href: "/emlak/bildirim-giris",
    icon: ClipboardList,
    group: "beyan",
  },
  {
    id: "beyan-liste",
    label: "Beyan Listesi",
    description: "Tüm beyanları listele ve sorgula",
    href: "/emlak/beyan-liste",
    icon: List,
    group: "beyan",
  },
  {
    id: "bildirim-liste",
    label: "Bildirim Listesi",
    description: "Bildirim kayıtlarını görüntüle",
    href: "/emlak/bildirim-liste",
    icon: List,
    group: "beyan",
  },
  {
    id: "tahakkuk-hesap",
    label: "Tahakkuk Fişi Hesaplama",
    description: "Emlak vergisi tahakkuku hesapla",
    href: "/emlak/tahakkuk-hesap",
    icon: Calculator,
    group: "tahakkuk",
  },
  {
    id: "takdir-yazim",
    label: "Takdir Fişi Yazımı",
    description: "Takdir fişi oluştur ve yazdır",
    href: "/emlak/takdir-yazim",
    icon: Printer,
    group: "tahakkuk",
  },
  {
    id: "tahakkuk-yazim",
    label: "Tahakkuk Fişi Yazımı",
    description: "Tahakkuk fişi yazdır",
    href: "/emlak/tahakkuk-yazim",
    icon: Printer,
    group: "tahakkuk",
  },
  {
    id: "tahakkuk-liste",
    label: "Tahakkuk Listeleri",
    description: "Tahakkuk kayıtlarını listele",
    href: "/emlak/tahakkuk-liste",
    icon: List,
    group: "tahakkuk",
  },
  {
    id: "bakiye-liste",
    label: "Emlak Bakiye Listesi",
    description: "Abone bakiye dökümü",
    href: "/emlak/bakiye-liste",
    icon: Wallet,
    group: "bakiye",
  },
  {
    id: "bakiye-kontrol",
    label: "Emlak Bakiye Kontrol",
    description: "Bakiye tutarlılık kontrolü",
    href: "/emlak/bakiye-kontrol",
    icon: FileCheck,
    group: "bakiye",
  },
  {
    id: "borc-liste",
    label: "Emlak Borç Listesi",
    description: "Borçlu sicilleri listele",
    href: "/emlak/borc-liste",
    icon: Scale,
    group: "bakiye",
  },
  {
    id: "duzeltme",
    label: "Düzeltme",
    description: "Beyan ve tahakkuk düzeltme işlemleri",
    href: "/emlak/duzeltme",
    icon: Pencil,
    group: "duzeltme",
    hasSubMenu: true,
  },
  {
    id: "ek-bakiye-giris",
    label: "Ek Bakiye Girişi",
    description: "Ek bakiye kaydı oluştur",
    href: "/emlak/ek-bakiye-giris",
    icon: Wallet,
    group: "ek",
  },
  {
    id: "ek-bakiye-liste",
    label: "Ek Bakiye Listesi",
    description: "Ek bakiye kayıtlarını listele",
    href: "/emlak/ek-bakiye-liste",
    icon: List,
    group: "ek",
  },
  {
    id: "ceza-indirimi",
    label: "Ceza İndirimi",
    description: "Gecikme cezası indirimi uygula",
    href: "/emlak/ceza-indirimi",
    icon: Percent,
    group: "ek",
  },
  {
    id: "kocan-degistir",
    label: "Koçan No Değiştirme",
    description: "Tapu koçan numarası güncelle",
    href: "/emlak/kocan-degistir",
    icon: Home,
    group: "sicil",
  },
  {
    id: "kocan-liste",
    label: "Koçan No Değiş. Liste",
    description: "Koçan değişiklik geçmişi",
    href: "/emlak/kocan-liste",
    icon: List,
    group: "sicil",
  },
  {
    id: "kredi",
    label: "Kredi",
    description: "Emlak kredi bakiye işlemleri",
    href: "/emlak/kredi",
    icon: CreditCard,
    group: "kredi",
    hasSubMenu: true,
  },
];

export const emlakHubIcon = Home;
