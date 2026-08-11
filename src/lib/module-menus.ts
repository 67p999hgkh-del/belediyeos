export interface ModuleMenuItem {
  id: string;
  label: string;
  href: string;
  shortcut?: string;
  variant?: "primary" | "danger";
  dividerBefore?: boolean;
}

export interface AppModule {
  id: string;
  label: string;
  href: string;
  items: ModuleMenuItem[];
  action?: "logout";
}

export const appModules: AppModule[] = [
  {
    id: "tahsilat",
    label: "Tahsilat",
    href: "/tahsilat",
    items: [
      { id: "yeni", label: "Tahsilat (Yeni)", href: "/tahsilat/yeni", shortcut: "Ctrl+1", variant: "primary" },
      { id: "islemler", label: "Tahsilat İşlemleri", href: "/tahsilat/islemler", shortcut: "Ctrl+2" },
      { id: "makbuz-tekrar", label: "Makbuz Tekrar Yazımı", href: "/tahsilat/makbuz-tekrar" },
      { id: "iptal", label: "Tahsilat İptali", href: "/tahsilat/iptal", variant: "danger" },
      { id: "banka-aktar", label: "Banka Tahsilatı Aktarma", href: "/tahsilat/banka-aktar" },
      { id: "rapor-genel", label: "Genel Tahsilat Raporu", href: "/tahsilat/raporlar/genel", dividerBefore: true },
      { id: "rapor-su", label: "Su Tahsilat Dökümü", href: "/tahsilat/raporlar/su" },
      { id: "rapor-emlak", label: "Emlak Tahsilat Dökümü", href: "/tahsilat/raporlar/emlak" },
      { id: "rapor-isyeri", label: "İşyeri Tahsilat Dökümü", href: "/tahsilat/raporlar/isyeri" },
      { id: "rapor-imar", label: "İmar Tahsilat Dökümü", href: "/tahsilat/raporlar/imar" },
      { id: "rapor-depozit", label: "Depozit Tahsilat Dökümü", href: "/tahsilat/raporlar/depozit" },
      { id: "rapor-fatura", label: "Fatura Tahsilat Dökümü", href: "/tahsilat/raporlar/fatura" },
      { id: "rapor-taksitli", label: "Taksitli Tahsilat Dökümü", href: "/tahsilat/raporlar/taksitli" },
      { id: "vezne", label: "Vezne Dökümü", href: "/tahsilat/raporlar/vezne" },
      { id: "liste", label: "Tahsilat Listesi", href: "/tahsilat/liste", dividerBefore: true },
      { id: "makbuz-ara", label: "Tahsilat Makbuzu Arama", href: "/tahsilat/makbuz-ara" },
      { id: "duzeltme", label: "Tahsilat Düzeltme", href: "/tahsilat/duzeltme" },
    ],
  },
  {
    id: "su",
    label: "Su",
    href: "/su",
    items: [
      { id: "sicil", label: "Su Sicil Kayıt", href: "/su/sicil" },
      { id: "sicil-liste", label: "Su Sicil Listesi", href: "/su/sicil-liste" },
      { id: "tahakkuk", label: "Su Tahakkuk", href: "/su/tahakkuk" },
      { id: "fatura", label: "Su Fatura", href: "/su/fatura" },
      { id: "sayac", label: "Sayaç Okuma", href: "/su/sayac" },
      { id: "rapor", label: "Su Raporları", href: "/su/raporlar", dividerBefore: true },
    ],
  },
  {
    id: "emlak",
    label: "Emlak",
    href: "/emlak",
    items: [
      { id: "sicil", label: "Emlak Sicil Kayıt", href: "/emlak/sicil" },
      { id: "sicil-liste", label: "Emlak Sicil Listesi", href: "/emlak/sicil-liste" },
      { id: "tahakkuk", label: "Emlak Tahakkuk", href: "/emlak/tahakkuk" },
      { id: "beyan", label: "Emlak Beyan", href: "/emlak/beyan" },
      { id: "rapor", label: "Emlak Raporları", href: "/emlak/raporlar", dividerBefore: true },
    ],
  },
  {
    id: "isyeri",
    label: "İşyeri",
    href: "/isyeri",
    items: [
      { id: "sicil", label: "İşyeri Sicil Kayıt", href: "/isyeri/sicil" },
      { id: "sicil-liste", label: "İşyeri Sicil Listesi", href: "/isyeri/sicil-liste" },
      { id: "tahakkuk", label: "İşyeri Tahakkuk", href: "/isyeri/tahakkuk" },
      { id: "ruhsat", label: "İşyeri Ruhsat", href: "/isyeri/ruhsat" },
      { id: "rapor", label: "İşyeri Raporları", href: "/isyeri/raporlar", dividerBefore: true },
    ],
  },
  {
    id: "imar",
    label: "İmar",
    href: "/imar",
    items: [
      { id: "dosya-kayit", label: "Dosya Kayıt", href: "/imar/dosya-kayit" },
      { id: "ruhsat-hesaplama", label: "Ruhsat Hesaplama", href: "/imar/ruhsat-hesaplama" },
      { id: "izin-listesi", label: "İzin Listesi", href: "/imar/izin-listesi" },
      { id: "dilekce", label: "Dilekçe", href: "/imar/dilekce" },
      { id: "eski-giris", label: "Eski İzin Girişi", href: "/imar/eski-giris" },
    ],
  },
  {
    id: "personel-memur",
    label: "Personel (Memur)",
    href: "/personel/memur",
    items: [
      { id: "bilgi", label: "Personel Bilgileri", href: "/personel/memur/bilgi" },
      { id: "kadro", label: "Kadro Tanımları", href: "/personel/memur/kadro" },
      { id: "puantaj", label: "Puantaj", href: "/personel/memur/puantaj" },
      { id: "bordro", label: "Bordro", href: "/personel/memur/bordro" },
      { id: "sgk", label: "SGK İşlemleri", href: "/personel/memur/sgk", dividerBefore: true },
      { id: "rapor", label: "Personel Raporları", href: "/personel/memur/raporlar" },
    ],
  },
  {
    id: "personel-isci",
    label: "Personel (İşçi)",
    href: "/personel/isci",
    items: [
      { id: "bilgi", label: "Personel Bilgileri", href: "/personel/isci/bilgi" },
      { id: "puantaj", label: "Puantaj", href: "/personel/isci/puantaj" },
      { id: "bordro", label: "Bordro", href: "/personel/isci/bordro" },
      { id: "rapor", label: "Personel Raporları", href: "/personel/isci/raporlar", dividerBefore: true },
    ],
  },
  {
    id: "izin",
    label: "İzin",
    href: "/izin",
    items: [
      { id: "kayit", label: "İzin Kayıt", href: "/izin/kayit" },
      { id: "liste", label: "İzin Listesi", href: "/izin/liste" },
      { id: "rapor", label: "İzin Raporları", href: "/izin/raporlar", dividerBefore: true },
    ],
  },
  {
    id: "muhasebe",
    label: "Muhasebe",
    href: "/muhasebe",
    items: [
      { id: "fis", label: "Muhasebe Fişi", href: "/muhasebe/fis" },
      { id: "butce", label: "Bütçe", href: "/muhasebe/butce" },
      { id: "mizan", label: "Mizan", href: "/muhasebe/mizan" },
      { id: "rapor", label: "Muhasebe Raporları", href: "/muhasebe/raporlar", dividerBefore: true },
    ],
  },
  {
    id: "zabita",
    label: "Zabıta",
    href: "/zabita",
    items: [
      { id: "kayit", label: "Zabıta Kayıt", href: "/zabita/kayit" },
      { id: "liste", label: "Zabıta Listesi", href: "/zabita/liste" },
      { id: "rapor", label: "Zabıta Raporları", href: "/zabita/raporlar", dividerBefore: true },
    ],
  },
  {
    id: "sistem",
    label: "Sistem",
    href: "/sistem",
    items: [
      { id: "belediye", label: "Belediye Seçimi", href: "/sistem/belediye" },
      { id: "kullanici", label: "Kullanıcı İşlemleri", href: "/sistem/kullanici" },
      { id: "donem", label: "Dönem Seçimi", href: "/sistem/donem" },
      { id: "sifre", label: "Şifre İşlemleri", href: "/sistem/sifre" },
      { id: "yedek", label: "Yedek Alma", href: "/sistem/yedek", dividerBefore: true },
      { id: "geri-yukle", label: "Yedekten Geri Yükleme", href: "/sistem/geri-yukle" },
      { id: "ayarlar", label: "Ayarlar", href: "/sistem/ayarlar" },
    ],
  },
  {
    id: "cikis",
    label: "Çıkış",
    href: "/",
    items: [],
    action: "logout",
  },
];

export function getModuleByPath(pathname: string): AppModule | undefined {
  return appModules.find((mod) => {
    if (mod.action) return false;
    return pathname === mod.href || pathname.startsWith(`${mod.href}/`);
  });
}
