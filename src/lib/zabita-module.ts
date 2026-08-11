import type { LucideIcon } from "lucide-react";
import {
  Archive,
  ClipboardCheck,
  FileText,
  Gavel,
  List,
  Scale,
  Settings,
  Shield,
  UserPlus,
  Wallet,
} from "lucide-react";

export type ZabitaGroupId = "sicil" | "ihbarname" | "mahkeme" | "arsiv";

export type ZabitaFrequency = "daily" | "periodic" | "admin";

export interface ZabitaModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: ZabitaGroupId;
  frequency: ZabitaFrequency;
  hasSubMenu?: boolean;
}

export const zabitaModuleItems: ZabitaModuleItem[] = [
  {
    id: "sahis-kayit",
    label: "Şahıs Bilgileri Kayıt",
    description: "Zabıta şahıs sicil kaydı oluştur ve güncelle",
    href: "/zabita/sahis-kayit",
    icon: UserPlus,
    group: "sicil",
    frequency: "daily",
  },
  {
    id: "tanimlar",
    label: "Tanımlar",
    description: "Zabıta modülü tanım ve parametreler",
    href: "/zabita/tanimlar",
    icon: Settings,
    group: "sicil",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "ihbarname-kayit",
    label: "İhbarname Kayıt",
    description: "Yeni ihbarname kaydı oluştur",
    href: "/zabita/ihbarname-kayit",
    icon: FileText,
    group: "ihbarname",
    frequency: "daily",
  },
  {
    id: "ihbarname-liste",
    label: "İhbarname Listesi",
    description: "Tüm ihbarname kayıtlarını listele",
    href: "/zabita/ihbarname-liste",
    icon: List,
    group: "ihbarname",
    frequency: "daily",
  },
  {
    id: "cinai-form",
    label: "Cinai Form",
    description: "Ceza ihbar formu yazdır ve işle",
    href: "/zabita/cinai-form",
    icon: ClipboardCheck,
    group: "ihbarname",
    frequency: "daily",
  },
  {
    id: "ihbarname-borc",
    label: "İhbarname Borç Listesi",
    description: "İhbarname borçlu kayıtları listele",
    href: "/zabita/ihbarname-borc",
    icon: Wallet,
    group: "ihbarname",
    frequency: "periodic",
  },
  {
    id: "mah-olacaklar",
    label: "Tarihe Göre Mah.Olacaklar",
    description: "Mahkemeye gidecek dosyaların tarih listesi",
    href: "/zabita/mah-olacaklar",
    icon: Scale,
    group: "mahkeme",
    frequency: "periodic",
  },
  {
    id: "mahkeme-onay",
    label: "Mahkeme Dosya Onaylama",
    description: "Mahkeme dosyası onay işlemleri",
    href: "/zabita/mahkeme-onay",
    icon: Gavel,
    group: "mahkeme",
    frequency: "daily",
  },
  {
    id: "dava-sonuc-kayit",
    label: "Dava Sonuç Kayıt",
    description: "Dava sonucu kayıt girişi",
    href: "/zabita/dava-sonuc-kayit",
    icon: FileText,
    group: "mahkeme",
    frequency: "daily",
  },
  {
    id: "dava-sonuc-liste",
    label: "Dava Sonuç Listesi",
    description: "Dava sonuç kayıtlarını listele",
    href: "/zabita/dava-sonuc-liste",
    icon: List,
    group: "mahkeme",
    frequency: "daily",
  },
  {
    id: "eski-makbuz",
    label: "Eski Makbuz İşleme",
    description: "Eski dönem makbuz kayıt işlemleri",
    href: "/zabita/eski-makbuz",
    icon: Archive,
    group: "arsiv",
    frequency: "admin",
  },
];

export const zabitaHubIcon = Shield;

export function getZabitaItem(id: string) {
  return zabitaModuleItems.find((m) => m.id === id);
}

export function searchZabitaItems(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  return zabitaModuleItems.filter(
    (item) =>
      item.label.toLocaleLowerCase("tr").includes(q) ||
      item.description.toLocaleLowerCase("tr").includes(q),
  );
}

export const zabitaTotalItemCount = zabitaModuleItems.length;
