import type { LucideIcon } from "lucide-react";
import { List, Plus, Search } from "lucide-react";
import { isyeriModuleItems, type IsyeriModuleItem } from "./isyeri-module";

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

const cezaSection: IsyeriSection = {
  ...isyeriModuleItems.find((m) => m.id === "ceza-indirimi")!,
  subMenus: [
    { id: "tanim", label: "Ceza İndirimi Tanımlama", description: "Yeni ceza indirimi uygula", href: "/isyeri/ceza-indirimi/tanim", icon: Plus },
    { id: "liste", label: "Ceza İndirimi Listesi", description: "Uygulanan indirimleri listele", href: "/isyeri/ceza-indirimi/liste", icon: List },
    { id: "sorgulama", label: "Ceza İndirimi Sorgulama", description: "İşyeri ceza indirimi sorgula", href: "/isyeri/ceza-indirimi/sorgulama", icon: Search },
  ],
};

export const isyeriSectionsWithSubmenu: IsyeriSection[] = [cezaSection];

export function getIsyeriSection(sectionId: string): IsyeriSection | undefined {
  return isyeriSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getIsyeriSubMenuItem(sectionId: string, actionId: string): IsyeriSubMenuItem | undefined {
  return getIsyeriSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

export const isyeriWorkflowGroups = [
  {
    id: "sicil",
    label: "1. Sicil & Kayıt",
    description: "İşyeri kayıt, liste ve numara işlemleri",
    itemIds: ["kayit", "liste", "no-degistir"],
  },
  {
    id: "beyan",
    label: "2. Beyan & Tahakkuk",
    description: "Beyan hesaplama ve döküm işlemleri",
    itemIds: ["beyan-bilgi", "beyan-hesapla", "beyan-iptal", "beyan-dokum"],
  },
  {
    id: "bakiye",
    label: "3. Bakiye & Borç",
    description: "Hesap, bakiye kontrol ve borç listeleri",
    itemIds: ["hesap-bilgi", "bakiye-kontrol", "borc-bildirim", "borclu-liste", "tarih-borc"],
  },
  {
    id: "ruhsat",
    label: "4. Ruhsat & Sağlık",
    description: "Ruhsat belgesi, askı ve sağlık cüzdanı",
    itemIds: ["ruhsat-liste", "vergi-aski", "saglik-giris", "saglik-liste"],
  },
  {
    id: "rapor",
    label: "5. Rapor & İhtar",
    description: "İhtar listesi ve vergi dökümleri",
    itemIds: ["ihtar-liste", "vergi-dokum"],
  },
  {
    id: "admin",
    label: "6. Düzeltme & Ceza",
    description: "Hesap düzeltme ve ceza indirimi",
    itemIds: ["hesap-duzeltme", "duzeltme-liste", "ceza-indirimi"],
  },
];

export const isyeriDailyActions = [
  { label: "İşyeri Listesi", href: "/isyeri/liste", icon: List },
  { label: "Beyan Hesapla", href: "/isyeri/beyan-hesapla", icon: Calculator },
  { label: "Borçlu Listesi", href: "/isyeri/borclu-liste", icon: List },
  { label: "Yeni Kayıt", href: "/isyeri/kayit", icon: Plus },
];
