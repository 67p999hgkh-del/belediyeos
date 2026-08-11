import type { LucideIcon } from "lucide-react";
import { Calculator, FolderOpen, List, ScrollText } from "lucide-react";
import { getImarItem, type ImarGroupId } from "./imar-module";

export interface ImarWorkflowGroup {
  id: ImarGroupId;
  label: string;
  description: string;
  itemIds: string[];
}

export const imarWorkflowGroups: ImarWorkflowGroup[] = [
  {
    id: "islem",
    label: "1. İnşaat İzin İşlemleri",
    description: "Dosya kayıt, ruhsat hesaplama ve dilekçe",
    itemIds: ["dosya-kayit", "ruhsat-hesaplama", "dilekce"],
  },
  {
    id: "liste",
    label: "2. Liste & Arşiv",
    description: "İzin listesi ve eski kayıt girişi",
    itemIds: ["izin-listesi", "eski-giris"],
  },
];

export const imarDailyActions: {
  label: string;
  href: string;
  icon: LucideIcon;
}[] = [
  { label: "Dosya Kayıt", href: "/imar/dosya-kayit", icon: FolderOpen },
  { label: "Ruhsat Hesaplama", href: "/imar/ruhsat-hesaplama", icon: Calculator },
  { label: "İzin Listesi", href: "/imar/izin-listesi", icon: List },
  { label: "Dilekçe", href: "/imar/dilekce", icon: ScrollText },
];

export function getImarGroupLabel(groupId: ImarGroupId) {
  return imarWorkflowGroups.find((g) => g.id === groupId)?.label ?? groupId;
}

export function getImarGroupForItem(itemId: string) {
  const item = getImarItem(itemId);
  if (!item) return undefined;
  return imarWorkflowGroups.find((g) => g.id === item.group);
}
