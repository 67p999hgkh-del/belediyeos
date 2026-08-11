import type { LucideIcon } from "lucide-react";
import { Globe, List, Plus, Search, Settings } from "lucide-react";
import {
  getSistemItem,
  sistemModuleItems,
  type SistemFrequency,
  type SistemGroupId,
  type SistemModuleItem,
} from "./sistem-module";

export interface SistemSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface SistemSection extends SistemModuleItem {
  subMenus: SistemSubMenuItem[];
}

export interface SistemWorkflowGroup {
  id: SistemGroupId;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  itemIds: string[];
}

export const sistemFrequencyLabels: Record<
  SistemFrequency,
  { label: string; className: string }
> = {
  daily: { label: "Günlük", className: "bg-emerald-50 text-emerald-700" },
  periodic: { label: "Dönemsel", className: "bg-blue-50 text-blue-700" },
  admin: { label: "Yetkili", className: "bg-amber-50 text-amber-700" },
};

const base = "/sistem";

function section(id: string, subMenus: SistemSubMenuItem[]): SistemSection {
  return { ...sistemModuleItems.find((m) => m.id === id)!, subMenus };
}

export const sistemSectionsWithSubmenu: SistemSection[] = [
  section("web-servisleri", [
    { id: "tanim", label: "Web Servis Tanımlama", description: "Yeni web servis tanımla", href: `${base}/web-servisleri/tanim`, icon: Plus },
    { id: "liste", label: "Web Servis Listesi", description: "Tanımlı servisleri listele", href: `${base}/web-servisleri/liste`, icon: List },
    { id: "test", label: "Bağlantı Testi", description: "Servis bağlantısını test et", href: `${base}/web-servisleri/test`, icon: Globe },
  ]),
  section("parametre-tanim", [
    { id: "genel", label: "Genel Parametreler", description: "Genel sistem parametreleri", href: `${base}/parametre-tanim/genel`, icon: Settings },
    { id: "belediye", label: "Belediye Parametreleri", description: "Belediye bilgi parametreleri", href: `${base}/parametre-tanim/belediye`, icon: Settings },
    { id: "liste", label: "Parametre Listesi", description: "Tüm parametreleri listele", href: `${base}/parametre-tanim/liste`, icon: List },
    { id: "sorgulama", label: "Parametre Sorgulama", description: "Parametre değeri sorgula", href: `${base}/parametre-tanim/sorgulama`, icon: Search },
  ]),
];

export const sistemWorkflowGroups: SistemWorkflowGroup[] = [
  {
    id: "kullanici",
    label: "Kullanıcı & Güvenlik",
    description: "Kullanıcı, şifre ve web servis ayarları",
    href: `${base}/grup/kullanici`,
    icon: getSistemItem("kullanici-ayarlari")!.icon,
    itemIds: ["kullanici-ayarlari", "sifre-degistir", "web-servisleri"],
  },
  {
    id: "vezne",
    label: "Vezne Yönetimi",
    description: "Vezne tanım, seçim ve düzeltme",
    href: `${base}/grup/vezne`,
    icon: getSistemItem("vezne-tanim")!.icon,
    itemIds: ["vezne-tanim", "banka-vezne", "vezne-secim", "vezne-duzeltme", "kayip-fis"],
  },
  {
    id: "kodlar",
    label: "Kod & Referans",
    description: "Genel kod, bölge ve meslek kodları",
    href: `${base}/grup/kodlar`,
    icon: getSistemItem("genel-kod")!.icon,
    itemIds: ["genel-kod", "bolge-kod", "meslek-kod"],
  },
  {
    id: "genel",
    label: "Genel Ayarlar",
    description: "Parametre, döviz, tatil ve yazıcı",
    href: `${base}/grup/genel`,
    icon: getSistemItem("parametre-tanim")!.icon,
    itemIds: ["parametre-tanim", "doviz-kur", "tatil-gunleri", "yazici-secim"],
  },
  {
    id: "modul",
    label: "Modül Parametreleri",
    description: "Su, emlak, işyeri ve imar modül ayarları",
    href: `${base}/grup/modul`,
    icon: getSistemItem("su-parametre")!.icon,
    itemIds: ["su-parametre", "emlak-parametre", "isyeri-parametre", "imar-parametre"],
  },
  {
    id: "sicil",
    label: "Sicil İşlemleri",
    description: "Sicil birleştirme ve rapor",
    href: `${base}/grup/sicil`,
    icon: getSistemItem("sicil-birlestir")!.icon,
    itemIds: ["sicil-birlestir", "sicil-birlestir-rapor"],
  },
];

export const sistemDailyActions = [
  { label: "Kullanıcı Ayarları", href: `${base}/kullanici-ayarlari`, icon: getSistemItem("kullanici-ayarlari")!.icon },
  { label: "Vezne Seçimi", href: `${base}/vezne-secim`, icon: getSistemItem("vezne-secim")!.icon },
  { label: "Şifre Değiştir", href: `${base}/sifre-degistir`, icon: getSistemItem("sifre-degistir")!.icon },
  { label: "Parametreler", href: `${base}/parametre-tanim`, icon: Settings },
];

export function getSistemSection(sectionId: string): SistemSection | undefined {
  return sistemSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getSistemSubMenuItem(
  sectionId: string,
  actionId: string,
): SistemSubMenuItem | undefined {
  return getSistemSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

export function getSistemGroup(groupId: string): SistemWorkflowGroup | undefined {
  return sistemWorkflowGroups.find((g) => g.id === groupId);
}

export function getSistemGroupLabelForItem(item: SistemModuleItem) {
  return sistemWorkflowGroups.find((g) => g.id === item.group)?.label ?? item.group;
}

export function getSistemGroupForItem(itemId: string) {
  const item = getSistemItem(itemId);
  if (!item) return undefined;
  return getSistemGroup(item.group);
}
