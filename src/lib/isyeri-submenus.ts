import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Calculator,
  FileText,
  HeartPulse,
  List,
  Plus,
  Scale,
  Search,
  Shield,
  Wallet,
} from "lucide-react";
import {
  getIsyeriItem,
  isyeriModuleItems,
  type IsyeriFrequency,
  type IsyeriGroupId,
  type IsyeriModuleItem,
} from "./isyeri-module";

export interface IsyeriSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface IsyeriSection extends IsyeriModuleItem {
  subMenus: IsyeriSubMenuItem[];
}

export interface IsyeriWorkflowGroup {
  id: IsyeriGroupId;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  itemIds: string[];
}

export interface IsyeriTabGroup {
  id: string;
  label: string;
  tabs: { itemId: string; tabLabel: string }[];
}

export const isyeriFrequencyLabels: Record<
  IsyeriFrequency,
  { label: string; className: string }
> = {
  daily: { label: "Günlük", className: "bg-emerald-50 text-emerald-700" },
  periodic: { label: "Dönemsel", className: "bg-blue-50 text-blue-700" },
  admin: { label: "Yetkili", className: "bg-amber-50 text-amber-700" },
};

const cezaSection: IsyeriSection = {
  ...isyeriModuleItems.find((m) => m.id === "ceza-indirimi")!,
  subMenus: [
    {
      id: "tanim",
      label: "Ceza İndirimi Tanımlama",
      description: "Yeni ceza indirimi uygula",
      href: "/isyeri/ceza-indirimi/tanim",
      icon: Plus,
    },
    {
      id: "liste",
      label: "Ceza İndirimi Listesi",
      description: "Uygulanan indirimleri listele",
      href: "/isyeri/ceza-indirimi/liste",
      icon: List,
    },
    {
      id: "sorgulama",
      label: "Ceza İndirimi Sorgulama",
      description: "İşyeri ceza indirimi sorgula",
      href: "/isyeri/ceza-indirimi/sorgulama",
      icon: Search,
    },
  ],
};

export const isyeriSectionsWithSubmenu: IsyeriSection[] = [cezaSection];

export const isyeriTabGroups: IsyeriTabGroup[] = [
  {
    id: "saglik-karnesi",
    label: "İşyeri Sağlık Karnesi",
    tabs: [
      { itemId: "saglik-giris", tabLabel: "Giriş" },
      { itemId: "saglik-liste", tabLabel: "Liste" },
    ],
  },
  {
    id: "hesap-duzeltme",
    label: "İşyeri Hesap Düzeltme",
    tabs: [
      { itemId: "hesap-duzeltme", tabLabel: "Yeni Düzeltme" },
      { itemId: "duzeltme-liste", tabLabel: "Düzeltme Listesi" },
    ],
  },
];

export const isyeriWorkflowGroups: IsyeriWorkflowGroup[] = [
  {
    id: "sicil",
    label: "Sicil & Kayıt",
    description: "İşyeri kayıt, liste ve numara işlemleri",
    href: "/isyeri/grup/sicil",
    icon: Briefcase,
    itemIds: ["kayit", "liste", "no-degistir"],
  },
  {
    id: "beyan",
    label: "Bildirim & Tahakkuk",
    description: "Bildirim hesaplama ve döküm işlemleri",
    href: "/isyeri/grup/beyan",
    icon: Calculator,
    itemIds: ["beyan-bilgi", "beyan-hesapla", "beyan-iptal", "beyan-dokum"],
  },
  {
    id: "bakiye",
    label: "Bakiye & Borç",
    description: "Hesap, bakiye kontrol ve borç listeleri",
    href: "/isyeri/grup/bakiye",
    icon: Wallet,
    itemIds: [
      "hesap-bilgi",
      "bakiye-kontrol",
      "borc-bildirim",
      "borclu-liste",
      "tarih-borc",
    ],
  },
  {
    id: "ruhsat",
    label: "İzin & Sağlık",
    description: "İzin belgesi, askı ve sağlık karnesi",
    href: "/isyeri/grup/ruhsat",
    icon: HeartPulse,
    itemIds: ["ruhsat-liste", "vergi-aski", "saglik-giris", "saglik-liste"],
  },
  {
    id: "rapor",
    label: "Rapor & Uyarı",
    description: "Uyarı listesi ve vergi dökümleri",
    href: "/isyeri/grup/rapor",
    icon: FileText,
    itemIds: ["ihtar-liste", "vergi-dokum"],
  },
  {
    id: "duzeltme",
    label: "Düzeltme & Ceza",
    description: "Hesap düzeltme ve ceza indirimi — yetkili kullanıcı",
    href: "/isyeri/grup/duzeltme",
    icon: Shield,
    itemIds: ["hesap-duzeltme", "duzeltme-liste", "ceza-indirimi"],
  },
];

export const isyeriDailyActions = [
  { label: "İşyeri Listesi", href: "/isyeri/liste", icon: List },
  { label: "Bildirim Hesapla", href: "/isyeri/beyan-hesapla", icon: Calculator },
  { label: "Borçlu Listesi", href: "/isyeri/borclu-liste", icon: List },
  { label: "Yeni Kayıt", href: "/isyeri/kayit", icon: Plus },
];

export function getIsyeriSection(sectionId: string): IsyeriSection | undefined {
  return isyeriSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getIsyeriSubMenuItem(
  sectionId: string,
  actionId: string,
): IsyeriSubMenuItem | undefined {
  return getIsyeriSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

export function getIsyeriGroup(groupId: string): IsyeriWorkflowGroup | undefined {
  return isyeriWorkflowGroups.find((g) => g.id === groupId);
}

export function getIsyeriTabGroup(itemId: string): IsyeriTabGroup | undefined {
  const item = getIsyeriItem(itemId);
  if (!item?.tabGroup) return undefined;
  return isyeriTabGroups.find((g) => g.id === item.tabGroup);
}

export function getIsyeriGroupItems(groupId: IsyeriGroupId) {
  const group = getIsyeriGroup(groupId);
  if (!group) return [];
  return group.itemIds.map((id) => getIsyeriItem(id)).filter(Boolean) as IsyeriModuleItem[];
}

/** Hub arama sonuçları için grup etiketi */
export function getIsyeriGroupLabelForItem(item: IsyeriModuleItem) {
  return isyeriWorkflowGroups.find((g) => g.id === item.group)?.label ?? item.group;
}

/** Tüm 21 madde — arama ve doğrulama için */
export const isyeriTotalItemCount = isyeriModuleItems.length;
