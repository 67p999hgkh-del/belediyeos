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
          { id: "t-vezne", label: "Vezne Dökümü", href: "/tahsilat/raporlar/vezne" },
          { id: "t-iptal", label: "Tahsilat İptali", href: "/tahsilat/iptal" },
          { id: "t-liste", label: "Tahsilat Listesi", href: "/tahsilat/liste" },
        ],
      },
      {
        id: "su",
        label: "Su Hizmetleri",
        href: "/su",
        icon: Droplets,
        children: [
          { id: "s-abone", label: "Abone", href: "/su/abone" },
          { id: "s-fatura", label: "Fatura", href: "/su/fatura" },
          { id: "s-duzeltme", label: "Düzeltme", href: "/su/duzeltme" },
          { id: "s-terminal", label: "El Terminali", href: "/su/el-terminali" },
          { id: "s-genel", label: "Genel Fatura", href: "/su/genel-fatura" },
          { id: "s-kredi", label: "Kredi", href: "/su/kredi" },
          { id: "s-ek", label: "Ek Bakiye", href: "/su/ek-bakiye" },
          { id: "s-ceza", label: "Ceza İndirimi", href: "/su/ceza-indirimi" },
          { id: "s-kanal", label: "Kanalizasyon", href: "/su/kanalizasyon" },
          { id: "s-on-ode", label: "Ön Ödemeli Sayaç", href: "/su/on-odemeli-sayac" },
        ],
      },
      {
        id: "emlak",
        label: "Emlak Vergisi",
        href: "/emlak",
        icon: Home,
        children: [
          { id: "e-beyan", label: "Beyan Listesi", href: "/emlak/beyan-liste" },
          { id: "e-tahakkuk", label: "Tahakkuk Hesaplama", href: "/emlak/tahakkuk-hesap" },
          { id: "e-borc", label: "Borç Listesi", href: "/emlak/borc-liste" },
          { id: "e-bildirim", label: "Bildirim Girişi", href: "/emlak/bildirim-giris" },
          { id: "e-duzeltme", label: "Düzeltme", href: "/emlak/duzeltme" },
        ],
      },
      {
        id: "isyeri",
        label: "İşyeri Vergisi",
        href: "/isyeri",
        icon: Briefcase,
        children: [
          { id: "i-liste", label: "İşyeri Listesi", href: "/isyeri/liste" },
          { id: "i-beyan", label: "Bildirim Hesapla", href: "/isyeri/beyan-hesapla" },
          { id: "i-borc", label: "Borçlu Listesi", href: "/isyeri/borclu-liste" },
          { id: "i-kayit", label: "Yeni Kayıt", href: "/isyeri/kayit" },
          { id: "i-ceza", label: "Ceza İndirimi", href: "/isyeri/ceza-indirimi" },
        ],
      },
      {
        id: "imar",
        label: "İmar & Ruhsat",
        href: "/imar",
        icon: Map,
        children: [
          { id: "m-dosya", label: "Dosya Kayıt", href: "/imar/dosya-kayit" },
          { id: "m-hesap", label: "Ruhsat Hesaplama", href: "/imar/ruhsat-hesaplama" },
          { id: "m-liste", label: "İzin Listesi", href: "/imar/izin-listesi" },
          { id: "m-dilekce", label: "Dilekçe", href: "/imar/dilekce" },
          { id: "m-eski", label: "Eski İzin Girişi", href: "/imar/eski-giris" },
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
          { id: "pm-kart", label: "Memur Kartı", href: "/personel/memur/memur-karti" },
          { id: "pm-maas", label: "Maaş İşlemleri", href: "/personel/memur/grup/hesaplama" },
          { id: "pm-liste", label: "Personel Listeleri", href: "/personel/memur/personel-listeleri" },
          { id: "pm-bordro", label: "Bordro Listesi", href: "/personel/memur/bordro-listeleri" },
          { id: "pm-mesai", label: "Ek Mesai", href: "/personel/memur/ek-mesai" },
        ],
      },
      {
        id: "personel-isci",
        label: "İşçi Kadrosu",
        href: "/personel/isci",
        icon: Users,
        children: [
          { id: "pi-kart", label: "İşçi Kartı", href: "/personel/isci/isci-karti" },
          { id: "pi-maas", label: "Maaş İşlemleri", href: "/personel/isci/grup/hesaplama" },
          { id: "pi-liste", label: "Personel Listeleri", href: "/personel/isci/personel-listeleri" },
          { id: "pi-bordro", label: "Bordro Listesi", href: "/personel/isci/bordro-listeleri" },
          { id: "pi-kidem", label: "Kıdem Tazminatı", href: "/personel/isci/kidem-tazminati" },
        ],
      },
      {
        id: "izin",
        label: "İzin Yönetimi",
        href: "/izin",
        icon: ClipboardList,
        children: [
          { id: "iz-kayit", label: "İzin Kaydı", href: "/izin/izin-kaydi" },
          { id: "iz-liste", label: "İzin Listesi", href: "/izin/izin-listesi" },
          { id: "iz-durum", label: "İzin Durumu", href: "/izin/izin-durum-liste" },
          { id: "iz-mazeret", label: "Mazeret İzni", href: "/izin/mazeret-kaydi" },
          { id: "iz-tanim", label: "İzin Türleri", href: "/izin/grup/tanim" },
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
