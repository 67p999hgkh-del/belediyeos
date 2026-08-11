import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  FileText,
  List,
  Pencil,
  Plus,
  Wallet,
} from "lucide-react";
import {
  getMuhasebeItem,
  muhasebeModuleItems,
  type MuhasebeFrequency,
  type MuhasebeGroupId,
  type MuhasebeModuleItem,
} from "./muhasebe-module";

export interface MuhasebeSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface MuhasebeSection extends MuhasebeModuleItem {
  subMenus: MuhasebeSubMenuItem[];
}

export interface MuhasebeWorkflowGroup {
  id: MuhasebeGroupId;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  itemIds: string[];
}

export const muhasebeFrequencyLabels: Record<
  MuhasebeFrequency,
  { label: string; className: string }
> = {
  daily: { label: "Günlük", className: "bg-emerald-50 text-emerald-700" },
  periodic: { label: "Dönemsel", className: "bg-blue-50 text-blue-700" },
  admin: { label: "Yetkili", className: "bg-amber-50 text-amber-700" },
};

const base = "/muhasebe";

function section(id: string, subMenus: MuhasebeSubMenuItem[]): MuhasebeSection {
  return { ...muhasebeModuleItems.find((m) => m.id === id)!, subMenus };
}

/** Alt menü placeholder — BirNet ekran görüntüsüyle güncellenecek */
export const muhasebeSectionsWithSubmenu: MuhasebeSection[] = [
  section("butce", [
    { id: "giris", label: "Bütçe Girişi", description: "Yıllık bütçe tanımla", href: `${base}/butce/giris`, icon: Plus },
    { id: "liste", label: "Bütçe Listesi", description: "Bütçe kalemlerini listele", href: `${base}/butce/liste`, icon: List },
    { id: "rapor", label: "Bütçe Raporu", description: "Bütçe gerçekleşme raporu", href: `${base}/butce/rapor`, icon: FileText },
  ]),
  section("kasa", [
    { id: "tahsilat", label: "Kasa Tahsilat", description: "Kasa tahsilat kaydı", href: `${base}/kasa/tahsilat`, icon: Wallet },
    { id: "odeme", label: "Kasa Ödeme", description: "Kasa ödeme kaydı", href: `${base}/kasa/odeme`, icon: Wallet },
    { id: "defter", label: "Kasa Defteri", description: "Kasa defteri dökümü", href: `${base}/kasa/defter`, icon: List },
  ]),
  section("mahsup", [
    { id: "giris", label: "Mahsup Fişi Girişi", description: "Yeni mahsup fişi oluştur", href: `${base}/mahsup/giris`, icon: Plus },
    { id: "liste", label: "Mahsup Listesi", description: "Mahsup fişlerini listele", href: `${base}/mahsup/liste`, icon: List },
    { id: "iptal", label: "Mahsup İptali", description: "Mahsup fişi iptal et", href: `${base}/mahsup/iptal`, icon: Pencil },
  ]),
  section("muhasebe-fatura", [
    { id: "giris", label: "Fatura Girişi", description: "Fatura muhasebe kaydı", href: `${base}/muhasebe-fatura/giris`, icon: Plus },
    { id: "liste", label: "Fatura Listesi", description: "Muhasebe faturalarını listele", href: `${base}/muhasebe-fatura/liste`, icon: List },
    { id: "entegrasyon", label: "Fatura Entegrasyonu", description: "Modül faturalarını aktar", href: `${base}/muhasebe-fatura/entegrasyon`, icon: FileText },
  ]),
  section("odeme", [
    { id: "emir", label: "Ödeme Emri", description: "Ödeme emri oluştur", href: `${base}/odeme/emir`, icon: Plus },
    { id: "liste", label: "Ödeme Listesi", description: "Ödemeleri listele", href: `${base}/odeme/liste`, icon: List },
  ]),
  section("cek-havale", [
    { id: "cek-giris", label: "Çek Girişi", description: "Çek kaydı oluştur", href: `${base}/cek-havale/cek-giris`, icon: Plus },
    { id: "havale", label: "Havale İşlemi", description: "Havale kaydı oluştur", href: `${base}/cek-havale/havale`, icon: FileText },
    { id: "liste", label: "Çek/Havale Listesi", description: "Kayıtları listele", href: `${base}/cek-havale/liste`, icon: List },
  ]),
];

export const muhasebeWorkflowGroups: MuhasebeWorkflowGroup[] = [
  {
    id: "plan",
    label: "Hesap Planı & Bütçe",
    description: "Hesap planı ve bütçe tanımları",
    href: `${base}/grup/plan`,
    icon: getMuhasebeItem("hesap-plani")!.icon,
    itemIds: ["hesap-plani", "butce"],
  },
  {
    id: "kasa",
    label: "Kasa",
    description: "Kasa tahsilat, ödeme ve defter",
    href: `${base}/grup/kasa`,
    icon: getMuhasebeItem("kasa")!.icon,
    itemIds: ["kasa"],
  },
  {
    id: "kayit",
    label: "Kayıt & Fiş",
    description: "Mahsup fişi ve fatura muhasebeleştirme",
    href: `${base}/grup/kayit`,
    icon: getMuhasebeItem("mahsup")!.icon,
    itemIds: ["mahsup", "muhasebe-fatura"],
  },
  {
    id: "odeme",
    label: "Ödeme & Transfer",
    description: "Ödeme emri, çek ve havale işlemleri",
    href: `${base}/grup/odeme`,
    icon: getMuhasebeItem("odeme")!.icon,
    itemIds: ["odeme", "cek-havale"],
  },
];

export const muhasebeDailyActions = [
  { label: "Kasa", href: `${base}/kasa`, icon: getMuhasebeItem("kasa")!.icon },
  { label: "Mahsup", href: `${base}/mahsup`, icon: getMuhasebeItem("mahsup")!.icon },
  { label: "Ödeme", href: `${base}/odeme`, icon: getMuhasebeItem("odeme")!.icon },
  { label: "Hesap Planı", href: `${base}/hesap-plani`, icon: getMuhasebeItem("hesap-plani")!.icon },
];

export function getMuhasebeSection(sectionId: string): MuhasebeSection | undefined {
  return muhasebeSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getMuhasebeSubMenuItem(
  sectionId: string,
  actionId: string,
): MuhasebeSubMenuItem | undefined {
  return getMuhasebeSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

export function getMuhasebeGroup(groupId: string): MuhasebeWorkflowGroup | undefined {
  return muhasebeWorkflowGroups.find((g) => g.id === groupId);
}

export function getMuhasebeGroupLabelForItem(item: MuhasebeModuleItem) {
  return muhasebeWorkflowGroups.find((g) => g.id === item.group)?.label ?? item.group;
}

export function getMuhasebeGroupForItem(itemId: string) {
  const item = getMuhasebeItem(itemId);
  if (!item) return undefined;
  return getMuhasebeGroup(item.group);
}
