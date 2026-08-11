import type { LucideIcon } from "lucide-react";
import { CalendarCheck, List, Palmtree, Settings } from "lucide-react";
import {
  getIzinItem,
  type IzinFrequency,
  type IzinGroupId,
  type IzinModuleItem,
} from "./izin-module";

export interface IzinWorkflowGroup {
  id: IzinGroupId;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  itemIds: string[];
}

export const izinFrequencyLabels: Record<
  IzinFrequency,
  { label: string; className: string }
> = {
  daily: { label: "Günlük", className: "bg-emerald-50 text-emerald-700" },
  periodic: { label: "Dönemsel", className: "bg-blue-50 text-blue-700" },
  admin: { label: "Yetkili", className: "bg-amber-50 text-amber-700" },
};

export const izinWorkflowGroups: IzinWorkflowGroup[] = [
  {
    id: "tanim",
    label: "Tanım & Takvim",
    description: "İzin türü, mazeret ve tatil günü tanımları",
    href: "/izin/grup/tanim",
    icon: Settings,
    itemIds: ["izin-turu-tanim", "mazeret-tanim", "tatil-gun-giris"],
  },
  {
    id: "personel",
    label: "Personel & Bakiye",
    description: "Personele izin türü atama ve devreden izin",
    href: "/izin/grup/personel",
    icon: getIzinItem("personel-izin-turu")!.icon,
    itemIds: ["personel-izin-turu", "devreden-izin"],
  },
  {
    id: "kayit",
    label: "İzin Kayıtları",
    description: "Yıllık ve mazeret izin kayıt işlemleri",
    href: "/izin/grup/kayit",
    icon: CalendarCheck,
    itemIds: ["izin-kaydi", "mazeret-kaydi"],
  },
  {
    id: "liste",
    label: "Listeler & Durum",
    description: "İzin listesi ve personel izin durumu",
    href: "/izin/grup/liste",
    icon: List,
    itemIds: ["izin-listesi", "izin-durum-liste"],
  },
];

export const izinDailyActions = [
  { label: "İzin Kaydı", href: "/izin/izin-kaydi", icon: CalendarCheck },
  { label: "İzin Listesi", href: "/izin/izin-listesi", icon: List },
  { label: "İzin Durumu", href: "/izin/izin-durum-liste", icon: Palmtree },
  { label: "İzin Türü", href: "/izin/izin-turu-tanim", icon: Settings },
];

export function getIzinGroup(groupId: string): IzinWorkflowGroup | undefined {
  return izinWorkflowGroups.find((g) => g.id === groupId);
}

export function getIzinGroupLabelForItem(item: IzinModuleItem) {
  return izinWorkflowGroups.find((g) => g.id === item.group)?.label ?? item.group;
}

export function getIzinGroupForItem(itemId: string) {
  const item = getIzinItem(itemId);
  if (!item) return undefined;
  return getIzinGroup(item.group);
}
