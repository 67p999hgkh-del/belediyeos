import type { LucideIcon } from "lucide-react";
import {
  Calculator,
  FileText,
  List,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import {
  getMemurItem,
  memurModuleItems,
  type MemurFrequency,
  type MemurGroupId,
  type MemurModuleItem,
} from "./memur-module";

export interface MemurSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface MemurSection extends MemurModuleItem {
  subMenus: MemurSubMenuItem[];
}

export interface MemurWorkflowGroup {
  id: MemurGroupId;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  itemIds: string[];
}

export const memurFrequencyLabels: Record<
  MemurFrequency,
  { label: string; className: string }
> = {
  daily: { label: "Günlük", className: "bg-emerald-50 text-emerald-700" },
  periodic: { label: "Dönemsel", className: "bg-blue-50 text-blue-700" },
  admin: { label: "Yetkili", className: "bg-amber-50 text-amber-700" },
};

function section(id: string, subMenus: MemurSubMenuItem[]): MemurSection {
  return { ...memurModuleItems.find((m) => m.id === id)!, subMenus };
}

/** Alt menü maddeleri placeholder — BirNet ekran görüntüsüyle güncellenecek */
export const memurSectionsWithSubmenu: MemurSection[] = [
  section("maas-bilgi", [
    { id: "tanim", label: "Maaş Bilgisi Tanımlama", description: "Maaş bileşeni tanımla", href: "/personel/memur/maas-bilgi/tanim", icon: Plus },
    { id: "yardim", label: "Yardım Tanımlama", description: "Yardım kalemi tanımla", href: "/personel/memur/maas-bilgi/yardim", icon: Plus },
    { id: "kesinti", label: "Kesinti Tanımlama", description: "Kesinti kalemi tanımla", href: "/personel/memur/maas-bilgi/kesinti", icon: Pencil },
    { id: "liste", label: "Tanım Listesi", description: "Tüm tanımları listele", href: "/personel/memur/maas-bilgi/liste", icon: List },
  ]),
  section("maas-hesaplama", [
    { id: "hesapla", label: "Maaş Hesapla", description: "Seçili dönem maaşını hesapla", href: "/personel/memur/maas-hesaplama/hesapla", icon: Calculator },
    { id: "iptal", label: "Hesaplama İptali", description: "Hesaplanan maaşı iptal et", href: "/personel/memur/maas-hesaplama/iptal", icon: Pencil },
    { id: "liste", label: "Hesaplama Listesi", description: "Yapılan hesaplamaları listele", href: "/personel/memur/maas-hesaplama/liste", icon: List },
  ]),
  section("ek-mesai", [
    { id: "giris", label: "Ek Mesai Girişi", description: "Yeni ek mesai kaydı", href: "/personel/memur/ek-mesai/giris", icon: Plus },
    { id: "liste", label: "Ek Mesai Listesi", description: "Ek mesai kayıtlarını listele", href: "/personel/memur/ek-mesai/liste", icon: List },
  ]),
  section("maas-13", [
    { id: "hesapla", label: "13. Maaş Hesapla", description: "Yıl sonu ikramiye hesapla", href: "/personel/memur/maas-13/hesapla", icon: Calculator },
    { id: "liste", label: "13. Maaş Listesi", description: "13. maaş kayıtlarını listele", href: "/personel/memur/maas-13/liste", icon: List },
  ]),
  section("emeklilik", [
    { id: "giris", label: "Emeklilik Girişi", description: "Emeklilik kaydı oluştur", href: "/personel/memur/emeklilik/giris", icon: Plus },
    { id: "liste", label: "Emeklilik Listesi", description: "Emeklilik kayıtlarını listele", href: "/personel/memur/emeklilik/liste", icon: List },
  ]),
  section("cek-islemleri", [
    { id: "giris", label: "Çek Girişi", description: "Yeni çek kaydı", href: "/personel/memur/cek-islemleri/giris", icon: Plus },
    { id: "liste", label: "Çek Listesi", description: "Çek kayıtlarını listele", href: "/personel/memur/cek-islemleri/liste", icon: List },
  ]),
  section("personel-listeleri", [
    { id: "genel", label: "Genel Personel Listesi", description: "Tüm memurları listele", href: "/personel/memur/personel-listeleri/genel", icon: List },
    { id: "kadro", label: "Kadro Listesi", description: "Kadro bazlı personel listesi", href: "/personel/memur/personel-listeleri/kadro", icon: List },
    { id: "sorgulama", label: "Personel Sorgulama", description: "Memur bilgisi sorgula", href: "/personel/memur/personel-listeleri/sorgulama", icon: Search },
  ]),
  section("bordro-listeleri", [
    { id: "bordro", label: "Maaş Bordrosu", description: "Bordro yazdır ve görüntüle", href: "/personel/memur/bordro-listeleri/bordro", icon: FileText },
    { id: "liste", label: "Bordro Listesi", description: "Dönem bordrolarını listele", href: "/personel/memur/bordro-listeleri/liste", icon: List },
  ]),
  section("kesinti-yatirim", [
    { id: "giris", label: "Kesinti/Yatırım Girişi", description: "Yeni kesinti veya yatırım kaydı", href: "/personel/memur/kesinti-yatirim/giris", icon: Plus },
    { id: "liste", label: "Kesinti/Yatırım Listesi", description: "Kayıtları listele", href: "/personel/memur/kesinti-yatirim/liste", icon: List },
  ]),
  section("geri-donusum", [
    { id: "islem", label: "Geri Dönüşüm İşlemi", description: "Maaş geri dönüşüm uygula", href: "/personel/memur/geri-donusum/islem", icon: Calculator },
    { id: "liste", label: "Geri Dönüşüm Listesi", description: "Yapılan geri dönüşümleri listele", href: "/personel/memur/geri-donusum/liste", icon: List },
  ]),
];

export const memurWorkflowGroups: MemurWorkflowGroup[] = [
  {
    id: "sicil",
    label: "Sicil & Kart",
    description: "Memur sicil kartı işlemleri",
    href: "/personel/memur/grup/sicil",
    icon: getMemurItem("memur-karti")!.icon,
    itemIds: ["memur-karti"],
  },
  {
    id: "tanim",
    label: "Maaş Tanımları",
    description: "Maaş bilgisi, yardım ve kesinti tanımları",
    href: "/personel/memur/grup/tanim",
    icon: getMemurItem("maas-bilgi")!.icon,
    itemIds: ["maas-bilgi"],
  },
  {
    id: "hesaplama",
    label: "Maaş Hesaplama",
    description: "Maaş, ek mesai ve 13. maaş hesaplama",
    href: "/personel/memur/grup/hesaplama",
    icon: getMemurItem("maas-hesaplama")!.icon,
    itemIds: ["maas-hesaplama", "ek-mesai", "maas-13"],
  },
  {
    id: "odeme",
    label: "Emeklilik & Ödeme",
    description: "Emeklilik ve çek işlemleri",
    href: "/personel/memur/grup/odeme",
    icon: getMemurItem("emeklilik")!.icon,
    itemIds: ["emeklilik", "cek-islemleri"],
  },
  {
    id: "liste",
    label: "Liste & Bordro",
    description: "Personel listeleri ve bordro dökümleri",
    href: "/personel/memur/grup/liste",
    icon: getMemurItem("personel-listeleri")!.icon,
    itemIds: ["personel-listeleri", "bordro-listeleri"],
  },
  {
    id: "duzeltme",
    label: "Kesinti & Düzeltme",
    description: "Kesinti/yatırım ve geri dönüşüm — yetkili",
    href: "/personel/memur/grup/duzeltme",
    icon: getMemurItem("geri-donusum")!.icon,
    itemIds: ["kesinti-yatirim", "geri-donusum"],
  },
];

export const memurDailyActions = [
  { label: "Memur Kartı", href: "/personel/memur/memur-karti", icon: getMemurItem("memur-karti")!.icon },
  { label: "Maaş Hesaplama", href: "/personel/memur/maas-hesaplama", icon: getMemurItem("maas-hesaplama")!.icon },
  { label: "Personel Listeleri", href: "/personel/memur/personel-listeleri", icon: List },
  { label: "Bordro Listesi", href: "/personel/memur/bordro-listeleri", icon: FileText },
];

export function getMemurSection(sectionId: string): MemurSection | undefined {
  return memurSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getMemurSubMenuItem(
  sectionId: string,
  actionId: string,
): MemurSubMenuItem | undefined {
  return getMemurSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

export function getMemurGroup(groupId: string): MemurWorkflowGroup | undefined {
  return memurWorkflowGroups.find((g) => g.id === groupId);
}

export function getMemurGroupLabelForItem(item: MemurModuleItem) {
  return memurWorkflowGroups.find((g) => g.id === item.group)?.label ?? item.group;
}

export function getMemurGroupItems(groupId: MemurGroupId) {
  const group = getMemurGroup(groupId);
  if (!group) return [];
  return group.itemIds.map((id) => getMemurItem(id)).filter(Boolean) as MemurModuleItem[];
}
