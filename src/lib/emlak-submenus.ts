import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  CreditCard,
  FileText,
  List,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { emlakModuleItems, type EmlakModuleItem } from "./emlak-module";

export interface EmlakSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface EmlakSection extends EmlakModuleItem {
  subMenus: EmlakSubMenuItem[];
}

const duzeltmeSection: EmlakSection = {
  ...emlakModuleItems.find((m) => m.id === "duzeltme")!,
  subMenus: [
    { id: "beyan", label: "Beyan Düzeltme", description: "Emlak beyanı düzelt", href: "/emlak/duzeltme/beyan", icon: Pencil },
    { id: "tahakkuk", label: "Tahakkuk Düzeltme", description: "Tahakkuk kaydı düzelt", href: "/emlak/duzeltme/tahakkuk", icon: Pencil },
    { id: "bildirim", label: "Bildirim Düzeltme", description: "Bildirim kaydı düzelt", href: "/emlak/duzeltme/bildirim", icon: Pencil },
    { id: "bakiye", label: "Bakiye Düzeltme", description: "Bakiye tutarı düzelt", href: "/emlak/duzeltme/bakiye", icon: Pencil },
  ],
};

const krediSection: EmlakSection = {
  ...emlakModuleItems.find((m) => m.id === "kredi")!,
  subMenus: [
    { id: "yukleme", label: "Kredi Yükleme", description: "Emlak kredi bakiyesi yükle", href: "/emlak/kredi/yukleme", icon: CreditCard },
    { id: "liste", label: "Kredi Listesi", description: "Kredi işlem geçmişi", href: "/emlak/kredi/liste", icon: List },
    { id: "sorgulama", label: "Kredi Sorgulama", description: "Güncel kredi bakiyesi sorgula", href: "/emlak/kredi/sorgulama", icon: Search },
  ],
};

/** BirNet'teki düz liste — alt menüsü olanlar section, diğerleri doğrudan işlem */
export const emlakSectionsWithSubmenu: EmlakSection[] = [duzeltmeSection, krediSection];

export function getEmlakSection(sectionId: string): EmlakSection | undefined {
  return emlakSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getEmlakSubMenuItem(sectionId: string, actionId: string): EmlakSubMenuItem | undefined {
  return getEmlakSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

/** İş akışına göre gruplar — SU modülü ile aynı mantık */
export const emlakWorkflowGroups = [
  {
    id: "beyan",
    label: "1. Beyan & Bildirim",
    description: "Beyanname ve bildirim kayıtları",
    itemIds: ["genel-beyanname", "bildirim-giris", "beyan-liste", "bildirim-liste"],
  },
  {
    id: "tahakkuk",
    label: "2. Tahakkuk & Takdir",
    description: "Vergi hesaplama ve fiş işlemleri",
    itemIds: ["tahakkuk-hesap", "takdir-yazim", "tahakkuk-yazim", "tahakkuk-liste"],
  },
  {
    id: "bakiye",
    label: "3. Bakiye & Borç",
    description: "Bakiye kontrol ve borç listeleri",
    itemIds: ["bakiye-liste", "bakiye-kontrol", "borc-liste"],
  },
  {
    id: "ek",
    label: "4. Ek İşlemler",
    description: "Ek bakiye ve ceza indirimi",
    itemIds: ["ek-bakiye-giris", "ek-bakiye-liste", "ceza-indirimi"],
  },
  {
    id: "sicil",
    label: "5. Sicil (Koçan)",
    description: "Tapu koçan numarası işlemleri",
    itemIds: ["kocan-degistir", "kocan-liste"],
  },
  {
    id: "admin",
    label: "6. Düzeltme & Kredi",
    description: "Yetkili düzeltme ve kredi işlemleri",
    itemIds: ["duzeltme", "kredi"],
  },
];

export const emlakDailyActions = [
  { label: "Beyan Listesi", href: "/emlak/beyan-liste", icon: List },
  { label: "Tahakkuk Hesapla", href: "/emlak/tahakkuk-hesap", icon: Calculator },
  { label: "Borç Listesi", href: "/emlak/borc-liste", icon: FileText },
  { label: "Bildirim Girişi", href: "/emlak/bildirim-giris", icon: Plus },
];

export function getEmlakItem(id: string) {
  return emlakModuleItems.find((m) => m.id === id);
}
