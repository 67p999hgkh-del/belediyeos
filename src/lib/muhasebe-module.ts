import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  Banknote,
  BookOpen,
  Calculator,
  FileSpreadsheet,
  Landmark,
  Receipt,
  Wallet,
} from "lucide-react";

export type MuhasebeGroupId = "plan" | "kasa" | "kayit" | "odeme";

export type MuhasebeFrequency = "daily" | "periodic" | "admin";

export interface MuhasebeModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: MuhasebeGroupId;
  frequency: MuhasebeFrequency;
  hasSubMenu?: boolean;
}

export const muhasebeModuleItems: MuhasebeModuleItem[] = [
  {
    id: "hesap-plani",
    label: "Hesap Planı Girişi",
    description: "Muhasebe hesap planı tanımlama ve güncelleme",
    href: "/muhasebe/hesap-plani",
    icon: BookOpen,
    group: "plan",
    frequency: "admin",
  },
  {
    id: "butce",
    label: "Bütçe",
    description: "Belediye bütçe planlama ve takip işlemleri",
    href: "/muhasebe/butce",
    icon: Calculator,
    group: "plan",
    frequency: "periodic",
    hasSubMenu: true,
  },
  {
    id: "kasa",
    label: "Kasa",
    description: "Kasa tahsilat, ödeme ve kasa defteri işlemleri",
    href: "/muhasebe/kasa",
    icon: Wallet,
    group: "kasa",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "mahsup",
    label: "Mahsup",
    description: "Mahsup fişi ve muhasebe kayıt işlemleri",
    href: "/muhasebe/mahsup",
    icon: FileSpreadsheet,
    group: "kayit",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "muhasebe-fatura",
    label: "Muhasebe-Fatura",
    description: "Fatura muhasebeleştirme ve entegrasyon",
    href: "/muhasebe/muhasebe-fatura",
    icon: Receipt,
    group: "kayit",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "odeme",
    label: "Ödeme",
    description: "Ödeme emri ve ödeme kayıt işlemleri",
    href: "/muhasebe/odeme",
    icon: Banknote,
    group: "odeme",
    frequency: "daily",
    hasSubMenu: true,
  },
  {
    id: "cek-havale",
    label: "Çek / Havale",
    description: "Çek ve havale ödeme işlemleri",
    href: "/muhasebe/cek-havale",
    icon: ArrowLeftRight,
    group: "odeme",
    frequency: "daily",
    hasSubMenu: true,
  },
];

export const muhasebeHubIcon = Landmark;

export function getMuhasebeItem(id: string) {
  return muhasebeModuleItems.find((m) => m.id === id);
}

export function searchMuhasebeItems(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  return muhasebeModuleItems.filter(
    (item) =>
      item.label.toLocaleLowerCase("tr").includes(q) ||
      item.description.toLocaleLowerCase("tr").includes(q),
  );
}

export const muhasebeTotalItemCount = muhasebeModuleItems.length;
