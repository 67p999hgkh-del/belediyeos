import type { LucideIcon } from "lucide-react";
import {
  Award,
  BadgeDollarSign,
  Banknote,
  Calculator,
  Clock,
  FileSpreadsheet,
  HardHat,
  List,
  RotateCcw,
  Users,
  Wallet,
} from "lucide-react";

export type IsciGroupId =
  | "sicil"
  | "tanim"
  | "hesaplama"
  | "odeme"
  | "liste"
  | "duzeltme";

export type IsciFrequency = "daily" | "periodic" | "admin";

export interface IsciModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: IsciGroupId;
  frequency: IsciFrequency;
  hasSubMenu?: boolean;
}

export const isciModuleItems: IsciModuleItem[] = [
  {
    id: "isci-karti",
    label: "İşçi Kartı",
    description: "İşçi sicil kartı kayıt ve güncelleme",
    href: "/personel/isci/isci-karti",
    icon: HardHat,
    group: "sicil",
    frequency: "daily",
  },
  {
    id: "maas-bilgi",
    label: "Maaş Bilgisi/Yardım/Kesinti",
    description: "Maaş bileşenleri, yardım ve kesinti tanımları",
    href: "/personel/isci/maas-bilgi",
    icon: Wallet,
    group: "tanim",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "maas-hesaplama",
    label: "Maaş Hesaplama",
    description: "Aylık işçi maaşı hesaplama işlemleri",
    href: "/personel/isci/maas-hesaplama",
    icon: Calculator,
    group: "hesaplama",
    frequency: "periodic",
    hasSubMenu: true,
  },
  {
    id: "ek-mesai",
    label: "Ek Mesai",
    description: "Ek mesai kayıt ve hesaplama",
    href: "/personel/isci/ek-mesai",
    icon: Clock,
    group: "hesaplama",
    frequency: "periodic",
    hasSubMenu: true,
  },
  {
    id: "maas-13",
    label: "13. Maaş",
    description: "Yıl sonu ikramiye (13. maaş) işlemleri",
    href: "/personel/isci/maas-13",
    icon: BadgeDollarSign,
    group: "hesaplama",
    frequency: "periodic",
    hasSubMenu: true,
  },
  {
    id: "kidem-tazminati",
    label: "Kıdem Tazminatı",
    description: "Kıdem tazminatı hesaplama ve kayıt işlemleri",
    href: "/personel/isci/kidem-tazminati",
    icon: Award,
    group: "odeme",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "cek-islemleri",
    label: "Çek İşlemleri",
    description: "İşçi maaş çek işlemleri",
    href: "/personel/isci/cek-islemleri",
    icon: Banknote,
    group: "odeme",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "personel-listeleri",
    label: "Personel (İşçi) Listeleri",
    description: "İşçi personel listeleri ve dökümler",
    href: "/personel/isci/personel-listeleri",
    icon: List,
    group: "liste",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "bordro-listeleri",
    label: "Maaş Bordroları/Listeleri",
    description: "Bordro yazdırma ve maaş listeleri",
    href: "/personel/isci/bordro-listeleri",
    icon: FileSpreadsheet,
    group: "liste",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "kesinti-yatirim",
    label: "Maaş Kesintileri/Yatırımlar",
    description: "Kesinti ve yatırım kayıtları",
    href: "/personel/isci/kesinti-yatirim",
    icon: Wallet,
    group: "duzeltme",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "geri-donusum",
    label: "Geri Dönüşümler",
    description: "Maaş geri dönüşüm ve düzeltme işlemleri",
    href: "/personel/isci/geri-donusum",
    icon: RotateCcw,
    group: "duzeltme",
    frequency: "admin",
    hasSubMenu: true,
  },
];

export const isciHubIcon = Users;

export function getIsciItem(id: string) {
  return isciModuleItems.find((m) => m.id === id);
}

export function searchIsciItems(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  return isciModuleItems.filter(
    (item) =>
      item.label.toLocaleLowerCase("tr").includes(q) ||
      item.description.toLocaleLowerCase("tr").includes(q),
  );
}

export const isciTotalItemCount = isciModuleItems.length;
