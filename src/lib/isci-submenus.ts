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
  getIsciItem,
  isciModuleItems,
  type IsciFrequency,
  type IsciGroupId,
  type IsciModuleItem,
} from "./isci-module";

export interface IsciSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface IsciSection extends IsciModuleItem {
  subMenus: IsciSubMenuItem[];
}

export interface IsciWorkflowGroup {
  id: IsciGroupId;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  itemIds: string[];
}

export const isciFrequencyLabels: Record<
  IsciFrequency,
  { label: string; className: string }
> = {
  daily: { label: "Günlük", className: "bg-emerald-50 text-emerald-700" },
  periodic: { label: "Dönemsel", className: "bg-blue-50 text-blue-700" },
  admin: { label: "Yetkili", className: "bg-amber-50 text-amber-700" },
};

const base = "/personel/isci";

function section(id: string, subMenus: IsciSubMenuItem[]): IsciSection {
  return { ...isciModuleItems.find((m) => m.id === id)!, subMenus };
}

/** Alt menü maddeleri placeholder — BirNet ekran görüntüsüyle güncellenecek */
export const isciSectionsWithSubmenu: IsciSection[] = [
  section("maas-bilgi", [
    { id: "tanim", label: "Maaş Bilgisi Tanımlama", description: "Maaş bileşeni tanımla", href: `${base}/maas-bilgi/tanim`, icon: Plus },
    { id: "yardim", label: "Yardım Tanımlama", description: "Yardım kalemi tanımla", href: `${base}/maas-bilgi/yardim`, icon: Plus },
    { id: "kesinti", label: "Kesinti Tanımlama", description: "Kesinti kalemi tanımla", href: `${base}/maas-bilgi/kesinti`, icon: Pencil },
    { id: "liste", label: "Tanım Listesi", description: "Tüm tanımları listele", href: `${base}/maas-bilgi/liste`, icon: List },
  ]),
  section("maas-hesaplama", [
    { id: "hesapla", label: "Maaş Hesapla", description: "Seçili dönem maaşını hesapla", href: `${base}/maas-hesaplama/hesapla`, icon: Calculator },
    { id: "iptal", label: "Hesaplama İptali", description: "Hesaplanan maaşı iptal et", href: `${base}/maas-hesaplama/iptal`, icon: Pencil },
    { id: "liste", label: "Hesaplama Listesi", description: "Yapılan hesaplamaları listele", href: `${base}/maas-hesaplama/liste`, icon: List },
  ]),
  section("ek-mesai", [
    { id: "giris", label: "Ek Mesai Girişi", description: "Yeni ek mesai kaydı", href: `${base}/ek-mesai/giris`, icon: Plus },
    { id: "liste", label: "Ek Mesai Listesi", description: "Ek mesai kayıtlarını listele", href: `${base}/ek-mesai/liste`, icon: List },
  ]),
  section("maas-13", [
    { id: "hesapla", label: "13. Maaş Hesapla", description: "Yıl sonu ikramiye hesapla", href: `${base}/maas-13/hesapla`, icon: Calculator },
    { id: "liste", label: "13. Maaş Listesi", description: "13. maaş kayıtlarını listele", href: `${base}/maas-13/liste`, icon: List },
  ]),
  section("kidem-tazminati", [
    { id: "hesapla", label: "Kıdem Tazminatı Hesapla", description: "Kıdem tazminatı hesaplama", href: `${base}/kidem-tazminati/hesapla`, icon: Calculator },
    { id: "giris", label: "Kıdem Tazminatı Girişi", description: "Kıdem tazminatı kaydı oluştur", href: `${base}/kidem-tazminati/giris`, icon: Plus },
    { id: "liste", label: "Kıdem Tazminatı Listesi", description: "Kayıtları listele", href: `${base}/kidem-tazminati/liste`, icon: List },
  ]),
  section("cek-islemleri", [
    { id: "giris", label: "Çek Girişi", description: "Yeni çek kaydı", href: `${base}/cek-islemleri/giris`, icon: Plus },
    { id: "liste", label: "Çek Listesi", description: "Çek kayıtlarını listele", href: `${base}/cek-islemleri/liste`, icon: List },
  ]),
  section("personel-listeleri", [
    { id: "genel", label: "Genel Personel Listesi", description: "Tüm işçileri listele", href: `${base}/personel-listeleri/genel`, icon: List },
    { id: "kadro", label: "Kadro Listesi", description: "Kadro bazlı personel listesi", href: `${base}/personel-listeleri/kadro`, icon: List },
    { id: "sorgulama", label: "Personel Sorgulama", description: "İşçi bilgisi sorgula", href: `${base}/personel-listeleri/sorgulama`, icon: Search },
  ]),
  section("bordro-listeleri", [
    { id: "bordro", label: "Maaş Bordrosu", description: "Bordro yazdır ve görüntüle", href: `${base}/bordro-listeleri/bordro`, icon: FileText },
    { id: "liste", label: "Bordro Listesi", description: "Dönem bordrolarını listele", href: `${base}/bordro-listeleri/liste`, icon: List },
  ]),
  section("kesinti-yatirim", [
    { id: "giris", label: "Kesinti/Yatırım Girişi", description: "Yeni kesinti veya yatırım kaydı", href: `${base}/kesinti-yatirim/giris`, icon: Plus },
    { id: "liste", label: "Kesinti/Yatırım Listesi", description: "Kayıtları listele", href: `${base}/kesinti-yatirim/liste`, icon: List },
  ]),
  section("geri-donusum", [
    { id: "islem", label: "Geri Dönüşüm İşlemi", description: "Maaş geri dönüşüm uygula", href: `${base}/geri-donusum/islem`, icon: Calculator },
    { id: "liste", label: "Geri Dönüşüm Listesi", description: "Yapılan geri dönüşümleri listele", href: `${base}/geri-donusum/liste`, icon: List },
  ]),
];

export const isciWorkflowGroups: IsciWorkflowGroup[] = [
  {
    id: "sicil",
    label: "Sicil & Kart",
    description: "İşçi sicil kartı işlemleri",
    href: `${base}/grup/sicil`,
    icon: getIsciItem("isci-karti")!.icon,
    itemIds: ["isci-karti"],
  },
  {
    id: "tanim",
    label: "Maaş Tanımları",
    description: "Maaş bilgisi, yardım ve kesinti tanımları",
    href: `${base}/grup/tanim`,
    icon: getIsciItem("maas-bilgi")!.icon,
    itemIds: ["maas-bilgi"],
  },
  {
    id: "hesaplama",
    label: "Maaş İşlemleri",
    description: "Maaş hesaplama, ek mesai ve 13. maaş",
    href: `${base}/grup/hesaplama`,
    icon: getIsciItem("maas-hesaplama")!.icon,
    itemIds: ["maas-hesaplama", "ek-mesai", "maas-13"],
  },
  {
    id: "odeme",
    label: "Tazminat & Ödeme",
    description: "Kıdem tazminatı ve çek işlemleri",
    href: `${base}/grup/odeme`,
    icon: getIsciItem("kidem-tazminati")!.icon,
    itemIds: ["kidem-tazminati", "cek-islemleri"],
  },
  {
    id: "liste",
    label: "Liste & Bordro",
    description: "Personel listeleri ve bordro dökümleri",
    href: `${base}/grup/liste`,
    icon: getIsciItem("personel-listeleri")!.icon,
    itemIds: ["personel-listeleri", "bordro-listeleri"],
  },
  {
    id: "duzeltme",
    label: "Kesinti & Düzeltme",
    description: "Kesinti/yatırım ve geri dönüşüm — yetkili",
    href: `${base}/grup/duzeltme`,
    icon: getIsciItem("geri-donusum")!.icon,
    itemIds: ["kesinti-yatirim", "geri-donusum"],
  },
];

export const isciDailyActions = [
  { label: "İşçi Kartı", href: `${base}/isci-karti`, icon: getIsciItem("isci-karti")!.icon },
  { label: "Maaş İşlemleri", href: `${base}/grup/hesaplama`, icon: getIsciItem("maas-hesaplama")!.icon },
  { label: "Personel Listeleri", href: `${base}/personel-listeleri`, icon: List },
  { label: "Bordro Listesi", href: `${base}/bordro-listeleri`, icon: FileText },
];

export function getIsciSection(sectionId: string): IsciSection | undefined {
  return isciSectionsWithSubmenu.find((s) => s.id === sectionId);
}

export function getIsciSubMenuItem(
  sectionId: string,
  actionId: string,
): IsciSubMenuItem | undefined {
  return getIsciSection(sectionId)?.subMenus.find((s) => s.id === actionId);
}

export function getIsciGroup(groupId: string): IsciWorkflowGroup | undefined {
  return isciWorkflowGroups.find((g) => g.id === groupId);
}

export function getIsciGroupLabelForItem(item: IsciModuleItem) {
  return isciWorkflowGroups.find((g) => g.id === item.group)?.label ?? item.group;
}
