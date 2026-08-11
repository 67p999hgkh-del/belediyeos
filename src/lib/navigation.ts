import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Briefcase,
  Building2,
  ClipboardList,
  Droplets,
  Home,
  LayoutDashboard,
  Map,
  Receipt,
  Settings,
  Shield,
  Users,
  Wallet,
} from "lucide-react";

export interface NavLink {
  id: string;
  label: string;
  href: string;
  shortcut?: string;
}

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  children?: NavLink[];
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}

export const navigation: NavGroup[] = [
  {
    id: "overview",
    label: "Genel",
    items: [
      {
        id: "dashboard",
        label: "Kontrol Paneli",
        href: "/",
        icon: LayoutDashboard,
        description: "Özet metrikler ve günlük durum",
      },
    ],
  },
  {
    id: "revenue",
    label: "Gelir Yönetimi",
    items: [
      {
        id: "tahsilat",
        label: "Tahsilat",
        href: "/tahsilat",
        icon: Banknote,
        description: "Vezne ve tahsilat operasyonları",
        children: [
          { id: "t-yeni", label: "Yeni Tahsilat", href: "/tahsilat/yeni", shortcut: "Ctrl+1" },
          { id: "t-islem", label: "İşlem Listesi", href: "/tahsilat/islemler", shortcut: "Ctrl+2" },
          { id: "t-makbuz", label: "Makbuz Arama", href: "/tahsilat/makbuz-ara" },
          { id: "t-liste", label: "Tahsilat Listesi", href: "/tahsilat/liste" },
          { id: "t-rapor", label: "Raporlar", href: "/tahsilat/raporlar/genel" },
        ],
      },
      {
        id: "su",
        label: "Su Hizmetleri",
        href: "/su",
        icon: Droplets,
        children: [
          { id: "s-sicil", label: "Abonelik Sicili", href: "/su/sicil" },
          { id: "s-tahakkuk", label: "Tahakkuk", href: "/su/tahakkuk" },
          { id: "s-fatura", label: "Fatura", href: "/su/fatura" },
          { id: "s-rapor", label: "Raporlar", href: "/su/raporlar" },
        ],
      },
      {
        id: "emlak",
        label: "Emlak Vergisi",
        href: "/emlak",
        icon: Home,
        children: [
          { id: "e-sicil", label: "Sicil Kayıt", href: "/emlak/sicil" },
          { id: "e-tahakkuk", label: "Tahakkuk", href: "/emlak/tahakkuk" },
          { id: "e-rapor", label: "Raporlar", href: "/emlak/raporlar" },
        ],
      },
      {
        id: "isyeri",
        label: "İşyeri Vergisi",
        href: "/isyeri",
        icon: Briefcase,
        children: [
          { id: "i-sicil", label: "Sicil Kayıt", href: "/isyeri/sicil" },
          { id: "i-ruhsat", label: "Ruhsat", href: "/isyeri/ruhsat" },
          { id: "i-rapor", label: "Raporlar", href: "/isyeri/raporlar" },
        ],
      },
      {
        id: "imar",
        label: "İmar & Ruhsat",
        href: "/imar",
        icon: Map,
        children: [
          { id: "m-basvuru", label: "Başvurular", href: "/imar/basvuru" },
          { id: "m-ruhsat", label: "Yapı Ruhsatı", href: "/imar/ruhsat" },
          { id: "m-rapor", label: "Raporlar", href: "/imar/raporlar" },
        ],
      },
    ],
  },
  {
    id: "hr",
    label: "İnsan Kaynakları",
    items: [
      {
        id: "personel-memur",
        label: "Memur Kadrosu",
        href: "/personel/memur",
        icon: Users,
        children: [
          { id: "pm-bilgi", label: "Personel Bilgileri", href: "/personel/memur/bilgi" },
          { id: "pm-bordro", label: "Bordro", href: "/personel/memur/bordro" },
          { id: "pm-sgk", label: "SGK İşlemleri", href: "/personel/memur/sgk" },
        ],
      },
      {
        id: "personel-isci",
        label: "İşçi Kadrosu",
        href: "/personel/isci",
        icon: Users,
        children: [
          { id: "pi-bilgi", label: "Personel Bilgileri", href: "/personel/isci/bilgi" },
          { id: "pi-bordro", label: "Bordro", href: "/personel/isci/bordro" },
        ],
      },
      {
        id: "izin",
        label: "İzin Yönetimi",
        href: "/izin",
        icon: ClipboardList,
        children: [
          { id: "iz-kayit", label: "İzin Kayıt", href: "/izin/kayit" },
          { id: "iz-liste", label: "İzin Listesi", href: "/izin/liste" },
        ],
      },
    ],
  },
  {
    id: "finance",
    label: "Finans",
    items: [
      {
        id: "muhasebe",
        label: "Muhasebe",
        href: "/muhasebe",
        icon: Wallet,
        children: [
          { id: "mu-fis", label: "Muhasebe Fişi", href: "/muhasebe/fis" },
          { id: "mu-butce", label: "Bütçe", href: "/muhasebe/butce" },
          { id: "mu-mizan", label: "Mizan", href: "/muhasebe/mizan" },
        ],
      },
    ],
  },
  {
    id: "ops",
    label: "Operasyon",
    items: [
      {
        id: "zabita",
        label: "Zabıta",
        href: "/zabita",
        icon: Shield,
        children: [
          { id: "z-kayit", label: "Kayıt", href: "/zabita/kayit" },
          { id: "z-liste", label: "Liste", href: "/zabita/liste" },
        ],
      },
    ],
  },
  {
    id: "admin",
    label: "Yönetim",
    items: [
      {
        id: "sistem",
        label: "Sistem Ayarları",
        href: "/sistem",
        icon: Settings,
        children: [
          { id: "sy-kullanici", label: "Kullanıcılar", href: "/sistem/kullanici" },
          { id: "sy-yedek", label: "Yedekleme", href: "/sistem/yedek" },
          { id: "sy-ayar", label: "Genel Ayarlar", href: "/sistem/ayarlar" },
        ],
      },
    ],
  },
];

export const platformBrand = {
  name: "BelediyeOS",
  tagline: "Kamu Yönetim Platformu",
  icon: Building2,
};

export function findNavItemByPath(pathname: string): NavItem | undefined {
  for (const group of navigation) {
    for (const item of group.items) {
      if (pathname === item.href || pathname.startsWith(`${item.href}/`)) {
        return item;
      }
    }
  }
  return undefined;
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
