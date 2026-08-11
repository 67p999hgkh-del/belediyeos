import type { LucideIcon } from "lucide-react";
import { FileText, List, Pencil, Plus } from "lucide-react";
import {
  getZabitaItem,
  zabitaModuleItems,
  type ZabitaFrequency,
  type ZabitaGroupId,
  type ZabitaModuleItem,
} from "./zabita-module";

export interface ZabitaSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface ZabitaSection extends ZabitaModuleItem {
  subMenus: ZabitaSubMenuItem[];
}

export interface ZabitaWorkflowGroup {
  id: ZabitaGroupId;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  itemIds: string[];
}

export const zabitaFrequencyLabels: Record<
  ZabitaFrequency,
  { label: string; className: string }
> = {
  daily: { label: "Günlük", className: "bg-emerald-50 text-emerald-700" },
  periodic: { label: "Dönemsel", className: "bg-blue-50 text-blue-700" },
  admin: { label: "Yetkili", className: "bg-amber-50 text-amber-700" },
};

const base = "/zabita";

function section(id: string, subMenus: ZabitaSubMenuItem[]): ZabitaSection {
  return { ...zabitaModuleItems.find((m) => m.id === id)!, subMenus };
}

/** Tanımlar alt menüsü placeholder — BirNet ekran görüntüsüyle güncellenecek */
export const zabitaSectionsWithSubmenu: ZabitaSection[] = [
  section("tanimlar", [
    { id: "ihbar-turu", label: "İhbarname Türü Tanımlama", description: "İhbarname türleri tanımla", href: `${base}/tanimlar/ihbar-turu`, icon: Plus },
    { id: "ceza-turu", label: "Ceza Türü Tanımlama", description: "Ceza türleri tanımla", href: `${base}/tanimlar/ceza-turu`, icon: Plus },
    { id: "mahkeme", label: "Mahkeme Tanımlama", description: "Mahkeme bilgileri tanımla", href: `${base}/tanimlar/mahkeme`, icon: Pencil },
    { id: "liste", label: "Tanım Listesi", description: "Tüm tanımları listele", href: `${base}/tanimlar/liste`, icon: List },
  ]),
];

export const zabitaWorkflowGroups: ZabitaWorkflowGroup[] = [
  {
    id: "sicil",
    label: "Sicil & Tanım",
    description: "Şahıs kayıt ve modül tanımları",
    href: `${base}/grup/sicil`,
    icon: getZabitaItem("sahis-kayit")!.icon,
    itemIds: ["sahis-kayit", "tanimlar"],
  },
  {
    id: "ihbarname",
    label: "İhbarname",
    description: "İhbarname kayıt, liste, form ve borç",
    href: `${base}/grup/ihbarname`,
    icon: getZabitaItem("ihbarname-kayit")!.icon,
    itemIds: ["ihbarname-kayit", "ihbarname-liste", "cinai-form", "ihbarname-borc"],
  },
  {
    id: "mahkeme",
    label: "Mahkeme & Dava",
    description: "Mahkeme süreci ve dava sonuçları",
    href: `${base}/grup/mahkeme`,
    icon: getZabitaItem("mahkeme-onay")!.icon,
    itemIds: ["mah-olacaklar", "mahkeme-onay", "dava-sonuc-kayit", "dava-sonuc-liste"],
  },
  {
    id: "arsiv",
    label: "Arşiv & Makbuz",
    description: "Eski makbuz işleme",
    href: `${base}/grup/arsiv`,
    icon: getZabitaItem("eski-makbuz")!.icon,
    itemIds: ["eski-makbuz"],
  },
];

export const zabitaDailyActions = [
  { label: "İhbarname Kayıt", href: `${base}/ihbarname-kayit`, icon: getZabitaItem("ihbarname-kayit")!.icon },
  { label: "İhbarname Listesi", href: `${base}/ihbarname-liste`, icon: List },
  { label: "Şahıs Kayıt", href: `${base}/sahis-kayit`, icon: getZabitaItem("sahis-kayit")!.icon },
  { label: "Dava Sonuç Listesi", href: `${base}/dava-sonuc-liste`, icon: List },
];

export function getZabitaSection(sectionId: string): ZabitaSection | undefined {
  return zabitaSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getZabitaSubMenuItem(
  sectionId: string,
  actionId: string,
): ZabitaSubMenuItem | undefined {
  return getZabitaSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

export function getZabitaGroup(groupId: string): ZabitaWorkflowGroup | undefined {
  return zabitaWorkflowGroups.find((g) => g.id === groupId);
}

export function getZabitaGroupLabelForItem(item: ZabitaModuleItem) {
  return zabitaWorkflowGroups.find((g) => g.id === item.group)?.label ?? item.group;
}

export function getZabitaGroupForItem(itemId: string) {
  const item = getZabitaItem(itemId);
  if (!item) return undefined;
  return getZabitaGroup(item.group);
}
