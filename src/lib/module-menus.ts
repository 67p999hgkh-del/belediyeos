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
      { id: "personel-karti", label: "Personel Kartı", href: "/personel/memur/personel-karti" },
      { id: "maas-bordro", label: "Maaş & Bordro", href: "/personel/memur/maas-bordro" },
      { id: "listeler", label: "Personel Listeleri", href: "/personel/memur/listeler" },
      { id: "ek-mesai", label: "Ek Mesai", href: "/personel/memur/ek-mesai" },
      { id: "emeklilik", label: "Emeklilik", href: "/personel/memur/emeklilik", dividerBefore: true },
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
      { id: "kullanici-ayarlari", label: "Kullanıcı Ayarları", href: "/sistem/kullanici-ayarlari" },
      { id: "sifre-degistir", label: "Şifre Değiştirme", href: "/sistem/sifre-degistir" },
      { id: "web-servisleri", label: "Web Servisleri", href: "/sistem/web-servisleri" },
      { id: "vezne-tanim", label: "Vezne Tanımları", href: "/sistem/vezne-tanim" },
      { id: "banka-vezne", label: "Banka Vezneleri", href: "/sistem/banka-vezne" },
      { id: "genel-kod", label: "Genel Kod Girişi", href: "/sistem/genel-kod" },
      { id: "bolge-kod", label: "Bölge Kodları", href: "/sistem/bolge-kod" },
      { id: "meslek-kod", label: "İşyeri Meslek Kodları", href: "/sistem/meslek-kod" },
      { id: "yazici-secim", label: "Yazıcı Seçimi", href: "/sistem/yazici-secim" },
      { id: "vezne-secim", label: "Vezne Seçimi", href: "/sistem/vezne-secim" },
      { id: "sicil-birlestir", label: "Sicil Birleştirme", href: "/sistem/sicil-birlestir" },
      { id: "sicil-birlestir-rapor", label: "Sicil Birleştirme Raporu", href: "/sistem/sicil-birlestir-rapor" },
      { id: "parametre-tanim", label: "Parametre Tanımları", href: "/sistem/parametre-tanim" },
      { id: "doviz-kur", label: "Döviz Kur Girişi", href: "/sistem/doviz-kur", dividerBefore: true },
      { id: "tatil-gunleri", label: "Tatil Günleri", href: "/sistem/tatil-gunleri" },
      { id: "vezne-duzeltme", label: "Vezne Düzeltme", href: "/sistem/vezne-duzeltme", dividerBefore: true },
      { id: "kayip-fis", label: "Kayıp Ödeme Fişi", href: "/sistem/kayip-fis" },
      { id: "su-parametre", label: "Su Parametre", href: "/sistem/su-parametre", dividerBefore: true },
      { id: "emlak-parametre", label: "Emlak Parametre", href: "/sistem/emlak-parametre" },
      { id: "isyeri-parametre", label: "İşyeri Parametre", href: "/sistem/isyeri-parametre" },
      { id: "imar-parametre", label: "İmar Parametre", href: "/sistem/imar-parametre" },
      { id: "personel-parametre", label: "Personel Parametre", href: "/sistem/personel-parametre" },
      { id: "lisans-bilgileri", label: "Lisans Bilgileri", href: "/sistem/lisans-bilgileri", dividerBefore: true },
      { id: "reset-menu", label: "Reset Menü", href: "/sistem/reset-menu", shortcut: "Ctrl+Alt+R" },
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
