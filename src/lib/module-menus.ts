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
      { id: "memur-karti", label: "Memur Kartı", href: "/personel/memur/memur-karti" },
      { id: "maas-hesaplama", label: "Maaş Hesaplama", href: "/personel/memur/maas-hesaplama" },
      { id: "personel-listeleri", label: "Personel Listeleri", href: "/personel/memur/personel-listeleri" },
      { id: "bordro-listeleri", label: "Bordro Listesi", href: "/personel/memur/bordro-listeleri" },
      { id: "ek-mesai", label: "Ek Mesai", href: "/personel/memur/ek-mesai" },
      { id: "maas-bilgi", label: "Maaş Tanımları", href: "/personel/memur/maas-bilgi", dividerBefore: true },
    ],
  },
  {
    id: "personel-isci",
    label: "Personel (İşçi)",
    href: "/personel/isci",
    items: [
      { id: "isci-karti", label: "İşçi Kartı", href: "/personel/isci/isci-karti" },
      { id: "maas-islemleri", label: "Maaş İşlemleri", href: "/personel/isci/grup/hesaplama" },
      { id: "personel-listeleri", label: "Personel Listeleri", href: "/personel/isci/personel-listeleri" },
      { id: "bordro-listeleri", label: "Bordro Listesi", href: "/personel/isci/bordro-listeleri" },
      { id: "kidem-tazminati", label: "Kıdem Tazminatı", href: "/personel/isci/kidem-tazminati" },
      { id: "ek-mesai", label: "Ek Mesai", href: "/personel/isci/ek-mesai", dividerBefore: true },
    ],
  },
  {
    id: "izin",
    label: "İzin",
    href: "/izin",
    items: [
      { id: "izin-kaydi", label: "İzin Kaydı", href: "/izin/izin-kaydi" },
      { id: "izin-listesi", label: "İzin Listesi", href: "/izin/izin-listesi" },
      { id: "izin-durum", label: "İzin Durumu", href: "/izin/izin-durum-liste" },
      { id: "mazeret-kaydi", label: "Mazeret İzni", href: "/izin/mazeret-kaydi" },
      { id: "izin-turu", label: "İzin Türleri", href: "/izin/grup/tanim" },
      { id: "devreden", label: "Devreden İzin", href: "/izin/devreden-izin", dividerBefore: true },
    ],
  },
  {
    id: "muhasebe",
    label: "Muhasebe",
    href: "/muhasebe",
    items: [
      { id: "kasa", label: "Kasa", href: "/muhasebe/kasa" },
      { id: "mahsup", label: "Mahsup", href: "/muhasebe/mahsup" },
      { id: "odeme", label: "Ödeme", href: "/muhasebe/odeme" },
      { id: "butce", label: "Bütçe", href: "/muhasebe/butce" },
      { id: "hesap-plani", label: "Hesap Planı", href: "/muhasebe/hesap-plani" },
      { id: "cek-havale", label: "Çek/Havale", href: "/muhasebe/cek-havale", dividerBefore: true },
    ],
  },
  {
    id: "zabita",
    label: "Zabıta",
    href: "/zabita",
    items: [
      { id: "ihbarname-kayit", label: "İhbarname Kayıt", href: "/zabita/ihbarname-kayit" },
      { id: "ihbarname-liste", label: "İhbarname Listesi", href: "/zabita/ihbarname-liste" },
      { id: "sahis-kayit", label: "Şahıs Kayıt", href: "/zabita/sahis-kayit" },
      { id: "mahkeme-onay", label: "Mahkeme Onay", href: "/zabita/mahkeme-onay" },
      { id: "ihbarname-borc", label: "Borç Listesi", href: "/zabita/ihbarname-borc" },
      { id: "dava-sonuc", label: "Dava Sonuç Listesi", href: "/zabita/dava-sonuc-liste", dividerBefore: true },
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
