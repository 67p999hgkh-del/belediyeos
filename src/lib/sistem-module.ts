import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Droplets,
  Globe,
  KeyRound,
  Landmark,
  Map,
  Merge,
  Printer,
  RotateCcw,
  ScrollText,
  Settings,
  Shield,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

export type SistemGroupId =
  | "kullanici"
  | "vezne"
  | "kodlar"
  | "genel"
  | "modul"
  | "sicil"
  | "platform";

export type SistemFrequency = "daily" | "periodic" | "admin";

export interface SistemModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: SistemGroupId;
  frequency: SistemFrequency;
  hasSubMenu?: boolean;
  disabled?: boolean;
  shortcut?: string;
}

/** BirNet SİSTEM menü sırası — üst + devam bölümü birleşik */
export const sistemModuleItems: SistemModuleItem[] = [
  {
    id: "kullanici-ayarlari",
    label: "Kullanıcı Ayarları",
    description: "Sistem kullanıcı tanımlama ve yetkilendirme",
    href: "/sistem/kullanici-ayarlari",
    icon: Users,
    group: "kullanici",
    frequency: "admin",
  },
  {
    id: "sifre-degistir",
    label: "Şifre Değiştirme",
    description: "Kullanıcı şifre güncelleme",
    href: "/sistem/sifre-degistir",
    icon: KeyRound,
    group: "kullanici",
    frequency: "daily",
  },
  {
    id: "web-servisleri",
    label: "Web Servisleri",
    description: "Web servis entegrasyon ayarları",
    href: "/sistem/web-servisleri",
    icon: Globe,
    group: "kullanici",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "vezne-tanim",
    label: "Vezne Tanımları",
    description: "Vezne tanım ve parametreleri",
    href: "/sistem/vezne-tanim",
    icon: Wallet,
    group: "vezne",
    frequency: "admin",
  },
  {
    id: "banka-vezne",
    label: "Banka Vezneleri",
    description: "Banka vezne tanımları",
    href: "/sistem/banka-vezne",
    icon: Landmark,
    group: "vezne",
    frequency: "admin",
  },
  {
    id: "genel-kod",
    label: "Genel Kod Girişi",
    description: "Sistem genel kod tanımları",
    href: "/sistem/genel-kod",
    icon: Settings,
    group: "kodlar",
    frequency: "admin",
  },
  {
    id: "bolge-kod",
    label: "Bölge Kodları",
    description: "Bölge kodu tanımlama",
    href: "/sistem/bolge-kod",
    icon: Map,
    group: "kodlar",
    frequency: "admin",
  },
  {
    id: "meslek-kod",
    label: "İşyeri Meslek Kodları",
    description: "İşyeri meslek kodu tanımları",
    href: "/sistem/meslek-kod",
    icon: Building2,
    group: "kodlar",
    frequency: "admin",
  },
  {
    id: "yazici-secim",
    label: "Yazıcı Seçimi",
    description: "Varsayılan yazıcı ayarı",
    href: "/sistem/yazici-secim",
    icon: Printer,
    group: "kodlar",
    frequency: "daily",
  },
  {
    id: "vezne-secim",
    label: "Vezne Seçimi",
    description: "Aktif vezne seçimi",
    href: "/sistem/vezne-secim",
    icon: Wallet,
    group: "vezne",
    frequency: "daily",
  },
  {
    id: "sicil-birlestir",
    label: "Sicil Birleştirme",
    description: "Mükerrer sicil birleştirme işlemi",
    href: "/sistem/sicil-birlestir",
    icon: Merge,
    group: "sicil",
    frequency: "admin",
  },
  {
    id: "sicil-birlestir-rapor",
    label: "Sicil Birleştirme Raporu",
    description: "Sicil birleştirme işlem raporu",
    href: "/sistem/sicil-birlestir-rapor",
    icon: Merge,
    group: "sicil",
    frequency: "admin",
  },
  {
    id: "parametre-tanim",
    label: "Parametre Tanımları",
    description: "Genel sistem parametre tanımları",
    href: "/sistem/parametre-tanim",
    icon: Settings,
    group: "genel",
    frequency: "admin",
    hasSubMenu: true,
  },
  {
    id: "doviz-kur",
    label: "Döviz Kur Girişi",
    description: "Günlük döviz kuru girişi",
    href: "/sistem/doviz-kur",
    icon: Globe,
    group: "genel",
    frequency: "periodic",
  },
  {
    id: "tatil-gunleri",
    label: "Tatil Günleri",
    description: "Resmi tatil günleri tanımlama",
    href: "/sistem/tatil-gunleri",
    icon: Settings,
    group: "genel",
    frequency: "admin",
  },
  {
    id: "vezne-duzeltme",
    label: "Vezne Düzeltme",
    description: "Vezne kayıt düzeltme işlemleri",
    href: "/sistem/vezne-duzeltme",
    icon: Wrench,
    group: "vezne",
    frequency: "admin",
  },
  {
    id: "kayip-fis",
    label: "Kayıp Ödeme Fişi",
    description: "Kayıp ödeme fişi işlemleri",
    href: "/sistem/kayip-fis",
    icon: Shield,
    group: "vezne",
    frequency: "admin",
  },
  {
    id: "su-parametre",
    label: "Su Parametre",
    description: "Su modülü parametre ayarları",
    href: "/sistem/su-parametre",
    icon: Droplets,
    group: "modul",
    frequency: "admin",
  },
  {
    id: "emlak-parametre",
    label: "Emlak Parametre",
    description: "Emlak modülü parametre ayarları",
    href: "/sistem/emlak-parametre",
    icon: Building2,
    group: "modul",
    frequency: "admin",
  },
  {
    id: "isyeri-parametre",
    label: "İşyeri Parametre",
    description: "İşyeri modülü parametre ayarları",
    href: "/sistem/isyeri-parametre",
    icon: Building2,
    group: "modul",
    frequency: "admin",
  },
  {
    id: "imar-parametre",
    label: "İmar Parametre",
    description: "İmar modülü parametre ayarları",
    href: "/sistem/imar-parametre",
    icon: Map,
    group: "modul",
    frequency: "admin",
  },
  {
    id: "personel-parametre",
    label: "Personel Parametre",
    description: "Personel modülü parametre ayarları (BirNet'te pasif)",
    href: "/sistem/personel-parametre",
    icon: Users,
    group: "modul",
    frequency: "admin",
    disabled: true,
  },
  {
    id: "lisans-bilgileri",
    label: "Lisans Bilgileri",
    description: "Yazılım lisans ve sürüm bilgileri",
    href: "/sistem/lisans-bilgileri",
    icon: ScrollText,
    group: "platform",
    frequency: "admin",
  },
  {
    id: "reset-menu",
    label: "Reset Menü",
    description: "Menü yerleşimini varsayılana sıfırla",
    href: "/sistem/reset-menu",
    icon: RotateCcw,
    group: "platform",
    frequency: "admin",
    shortcut: "Ctrl+Alt+R",
  },
];

export const sistemHubIcon = Settings;

export function getSistemItem(id: string) {
  return sistemModuleItems.find((m) => m.id === id);
}

export function searchSistemItems(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  return sistemModuleItems.filter(
    (item) =>
      item.label.toLocaleLowerCase("tr").includes(q) ||
      item.description.toLocaleLowerCase("tr").includes(q),
  );
}

export const sistemTotalItemCount = sistemModuleItems.length;
