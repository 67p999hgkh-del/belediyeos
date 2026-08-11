import type { LucideIcon } from "lucide-react";
import {
  BadgeDollarSign,
  Banknote,
  Calculator,
  Clock,
  FileSpreadsheet,
  List,
  RotateCcw,
  UserCircle,
  Users,
  Wallet,
} from "lucide-react";

export type MemurGroupId =
  | "sicil"
  | "tanim"
  | "hesaplama"
  | "odeme"
  | "liste"
  | "duzeltme";

export type MemurFrequency = "daily" | "periodic" | "admin";

export interface MemurModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: MemurGroupId;
  frequency: MemurFrequency;
  hasSubMenu?: boolean;
}

export const memurModuleItems: MemurModuleItem[] = [
  {
    id: "memur-karti",
    label: "Memur Kartı",
    description: "Memur sicil kartı kayıt ve güncelleme",
    href: "/personel/memur/memur-karti",
    icon: UserCircle,
    group: "sicil",
    frequency: "daily",
  },
  {
    id: "maas-bilgi",
    label: "Maaş Bilgisi/Yardım/Kesinti",
    description: "Maaş bileşenleri, yardım ve kesinti tanımları",
    href: "/personel/memur/maas-bilgi",
    icon: Wallet,
    group: "tanim",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "maas-hesaplama",
    label: "Maaş Hesaplama",
    description: "Aylık memur maaşı hesaplama işlemleri",
    href: "/personel/memur/maas-hesaplama",
    icon: Calculator,
    group: "hesaplama",
    frequency: "periodic",
    hasSubMenu: true,
  },
  {
    id: "ek-mesai",
    label: "Ek Mesai",
    description: "Ek mesai kayıt ve hesaplama",
    href: "/personel/memur/ek-mesai",
    icon: Clock,
    group: "hesaplama",
    frequency: "periodic",
    hasSubMenu: true,
  },
  {
    id: "maas-13",
    label: "13. Maaş",
    description: "Yıl sonu ikramiye (13. maaş) işlemleri",
    href: "/personel/memur/maas-13",
    icon: BadgeDollarSign,
    group: "hesaplama",
    frequency: "periodic",
    hasSubMenu: true,
  },
  {
    id: "emeklilik",
    label: "Emeklilik İşlemleri",
    description: "Emeklilik başvuru ve kayıt işlemleri",
    href: "/personel/memur/emeklilik",
    icon: Users,
    group: "odeme",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "cek-islemleri",
    label: "Çek İşlemleri",
    description: "Memur maaş çek işlemleri",
    href: "/personel/memur/cek-islemleri",
    icon: Banknote,
    group: "odeme",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "personel-listeleri",
    label: "Personel (Memur) Listeleri",
    description: "Memur personel listeleri ve dökümler",
    href: "/personel/memur/personel-listeleri",
    icon: List,
    group: "liste",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "bordro-listeleri",
    label: "Maaş Bordroları/Listeleri",
    description: "Bordro yazdırma ve maaş listeleri",
    href: "/personel/memur/bordro-listeleri",
    icon: FileSpreadsheet,
    group: "liste",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "kesinti-yatirim",
    label: "Maaş Kesintileri/Yatırımlar",
    description: "Kesinti ve yatırım kayıtları",
    href: "/personel/memur/kesinti-yatirim",
    icon: Wallet,
    group: "duzeltme",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "geri-donusum",
    label: "Geri Dönüşümler",
    description: "Maaş geri dönüşüm ve düzeltme işlemleri",
    href: "/personel/memur/geri-donusum",
    icon: RotateCcw,
    group: "duzeltme",
    frequency: "admin",
    hasSubMenu: true,
  },
];

export const memurHubIcon = Users;

export function getMemurItem(id: string) {
  return memurModuleItems.find((m) => m.id === id);
}

export function searchMemurItems(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  return memurModuleItems.filter(
    (item) =>
      item.label.toLocaleLowerCase("tr").includes(q) ||
      item.description.toLocaleLowerCase("tr").includes(q),
  );
}

export const memurTotalItemCount = memurModuleItems.length;
