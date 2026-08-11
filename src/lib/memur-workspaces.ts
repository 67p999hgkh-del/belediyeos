/**
 * Personel (Memur) — bilgi mimarisi ve BirNet fonksiyon eşlemesi.
 * Sidebar: 8 ana workspace. 43 leaf fonksiyon tab/section/action içinde.
 */

export type MemurUxTipi = "WORKSPACE" | "TAB" | "SECTION" | "ACTION" | "DETAIL" | "REPORT" | "MODAL";

export interface MemurBirNetEslesme {
  birnetFonksiyon: string;
  workspace: string;
  uxTipi: MemurUxTipi;
  konum: string;
  durum: "TAMAMLANDI" | "MOCK" | "BACKEND_BEKLIYOR";
}

export interface MemurWorkspaceTab {
  id: string;
  label: string;
}

export interface MemurWorkspaceSection {
  id: string;
  label: string;
  parentTab?: string;
}

export interface MemurWorkspaceAction {
  id: string;
  label: string;
  parentTab?: string;
}

export interface MemurWorkspaceConfig {
  id: string;
  route: string;
  title: string;
  description: string;
  tabs: MemurWorkspaceTab[];
  sections?: MemurWorkspaceSection[];
  actions?: MemurWorkspaceAction[];
}

export const memurWorkspaceIds = [
  "personel-karti",
  "maas-bordro",
  "ek-mesai",
  "emeklilik",
  "kesinti-yatirim",
  "cek-islemleri",
  "listeler",
  "islem-geri-alma",
] as const;

export type MemurWorkspaceId = (typeof memurWorkspaceIds)[number];

export const memurWorkspaces: Record<MemurWorkspaceId, MemurWorkspaceConfig> = {
  "personel-karti": {
    id: "personel-karti",
    route: "/personel/memur/personel-karti",
    title: "Personel Kartı",
    description: "Memur sicil kartı, maaş bilgileri, yardım ve kesinti yönetimi",
    tabs: [
      { id: "genel", label: "Genel" },
      { id: "maas-bilgileri", label: "Maaş Bilgileri" },
      { id: "yardimlar", label: "Yardımlar" },
      { id: "kesintiler", label: "Kesintiler" },
      { id: "iliskili", label: "İlişkili Kayıtlar" },
    ],
    actions: [
      { id: "ek-yardim-giris", label: "Ek Yardım Girişi", parentTab: "yardimlar" },
      { id: "ozel-kesinti-giris", label: "Özel Kesinti Girişi", parentTab: "kesintiler" },
    ],
  },
  "maas-bordro": {
    id: "maas-bordro",
    route: "/personel/memur/maas-bordro",
    title: "Maaş & Bordro",
    description: "Maaş hesaplama, 13. maaş, bordro ve pusula işlemleri",
    tabs: [
      { id: "maas-hesaplama", label: "Maaş Hesaplama" },
      { id: "13-maas", label: "13. Maaş" },
      { id: "bordrolar", label: "Bordrolar" },
      { id: "pusula-listeler", label: "Pusula & Listeler" },
      { id: "hesaplama-gecmisi", label: "Hesaplama Geçmişi" },
    ],
    sections: [
      { id: "bilgi-olustur", label: "Bilgileri Oluştur", parentTab: "13-maas" },
      { id: "hesapla", label: "Hesapla", parentTab: "13-maas" },
      { id: "maas-pusulasi", label: "Maaş Pusulası", parentTab: "pusula-listeler" },
      { id: "net-maas-listesi", label: "Net Maaş Listesi", parentTab: "pusula-listeler" },
    ],
    actions: [
      { id: "toplu-pog", label: "Toplu PÖG Girişi", parentTab: "maas-hesaplama" },
    ],
  },
  "ek-mesai": {
    id: "ek-mesai",
    route: "/personel/memur/ek-mesai",
    title: "Ek Mesai",
    description: "Ek mesai bilgi girişi, hesaplama, bordro ve kesintiler",
    tabs: [
      { id: "bilgi-girisi", label: "Bilgi Girişi" },
      { id: "hesaplama", label: "Hesaplama" },
      { id: "bordro-pusula", label: "Bordro & Pusula" },
      { id: "kesintiler", label: "Kesintiler" },
    ],
  },
  emeklilik: {
    id: "emeklilik",
    route: "/personel/memur/emeklilik",
    title: "Emeklilik",
    description: "Emeklilik bilgi girişi, hesaplama ve emekli maaş listeleri",
    tabs: [
      { id: "bilgi-girisi", label: "Bilgi Girişi" },
      { id: "hesaplama", label: "Hesaplama" },
      { id: "emekli-maas-listesi", label: "Emekli Maaş Listesi" },
      { id: "hesap-dokumu", label: "Hesap Dökümü" },
    ],
  },
  "kesinti-yatirim": {
    id: "kesinti-yatirim",
    route: "/personel/memur/kesinti-yatirim",
    title: "Kesinti & Yatırımlar",
    description: "Kesinti, yatırım, vergi ve bildirim raporları",
    tabs: [
      { id: "kesintiler", label: "Kesintiler" },
      { id: "yatirimlar", label: "Yatırımlar" },
      { id: "vergi-bildirim", label: "Vergi & Bildirim" },
      { id: "raporlar", label: "Raporlar" },
    ],
  },
  "cek-islemleri": {
    id: "cek-islemleri",
    route: "/personel/memur/cek-islemleri",
    title: "Çek İşlemleri",
    description: "Çek hesaplatma ve çek listesi",
    tabs: [
      { id: "hesaplatma", label: "Hesaplatma" },
      { id: "cek-listesi", label: "Çek Listesi" },
    ],
  },
  listeler: {
    id: "listeler",
    route: "/personel/memur/listeler",
    title: "Personel Listeleri",
    description: "Memur, maaş bilgileri, mevki, yardım ve kesinti listeleri",
    tabs: [
      { id: "memurlar", label: "Memurlar" },
      { id: "maas-bilgileri", label: "Maaş Bilgileri" },
      { id: "mevki", label: "Mevki" },
      { id: "ek-yardimlar", label: "Ek Yardımlar" },
      { id: "kesintiler", label: "Kesintiler" },
    ],
  },
  "islem-geri-alma": {
    id: "islem-geri-alma",
    route: "/personel/memur/islem-geri-alma",
    title: "İşlem Geri Alma",
    description: "Geri Dönüşümler — maaş, ek mesai, emeklilik ve çek işlemleri",
    tabs: [{ id: "geri-alma", label: "Geri Alma" }],
  },
};

/** Eski BirNet/placeholder route → yeni workspace redirect */
const legacySectionRedirects: Record<string, string> = {
  "memur-karti": "/personel/memur/personel-karti",
  "maas-bilgi": "/personel/memur/personel-karti?tab=maas-bilgileri",
  "maas-hesaplama": "/personel/memur/maas-bordro?tab=maas-hesaplama",
  "ek-mesai": "/personel/memur/ek-mesai",
  "maas-13": "/personel/memur/maas-bordro?tab=13-maas",
  emeklilik: "/personel/memur/emeklilik",
  "cek-islemleri": "/personel/memur/cek-islemleri",
  "personel-listeleri": "/personel/memur/listeler",
  "bordro-listeleri": "/personel/memur/maas-bordro?tab=bordrolar",
  "kesinti-yatirim": "/personel/memur/kesinti-yatirim",
  "geri-donusum": "/personel/memur/islem-geri-alma",
};

const leafRedirects: Record<string, Record<string, string>> = {
  "maas-bilgi": {
    tanim: "/personel/memur/personel-karti?tab=maas-bilgileri",
    yardim: "/personel/memur/personel-karti?tab=yardimlar",
    kesinti: "/personel/memur/personel-karti?tab=kesintiler",
    liste: "/personel/memur/listeler?tab=maas-bilgileri",
  },
  "maas-hesaplama": {
    hesapla: "/personel/memur/maas-bordro?tab=maas-hesaplama",
    iptal: "/personel/memur/islem-geri-alma?tur=maas",
    liste: "/personel/memur/maas-bordro?tab=hesaplama-gecmisi",
    "normal-maas": "/personel/memur/maas-bordro?tab=maas-hesaplama&tur=normal-maas",
    "fark-maasi": "/personel/memur/maas-bordro?tab=maas-hesaplama&tur=fark-maasi",
    "kararname-kesintisi-2022": "/personel/memur/maas-bordro?tab=maas-hesaplama&tur=kararname-kesintisi-2022",
  },
  "ek-mesai": {
    giris: "/personel/memur/ek-mesai?tab=bilgi-girisi",
    liste: "/personel/memur/ek-mesai?tab=bilgi-girisi",
    hesaplama: "/personel/memur/ek-mesai?tab=hesaplama",
    pusula: "/personel/memur/ek-mesai?tab=bordro-pusula",
    bordro: "/personel/memur/ek-mesai?tab=bordro-pusula",
    kesintiler: "/personel/memur/ek-mesai?tab=kesintiler",
  },
  "maas-13": {
    hesapla: "/personel/memur/maas-bordro?tab=13-maas",
    liste: "/personel/memur/maas-bordro?tab=13-maas",
    "bilgi-olustur": "/personel/memur/maas-bordro?tab=13-maas&section=bilgi-olustur",
  },
  emeklilik: {
    giris: "/personel/memur/emeklilik?tab=bilgi-girisi",
    liste: "/personel/memur/emeklilik?tab=emekli-maas-listesi",
    hesaplama: "/personel/memur/emeklilik?tab=hesaplama",
    dokum: "/personel/memur/emeklilik?tab=hesap-dokumu",
  },
  "cek-islemleri": {
    giris: "/personel/memur/cek-islemleri?tab=hesaplatma",
    liste: "/personel/memur/cek-islemleri?tab=cek-listesi",
    hesaplatma: "/personel/memur/cek-islemleri?tab=hesaplatma",
  },
  "personel-listeleri": {
    genel: "/personel/memur/listeler?tab=memurlar",
    kadro: "/personel/memur/listeler?tab=mevki",
    sorgulama: "/personel/memur/personel-karti",
    "memur-listesi": "/personel/memur/listeler?tab=memurlar",
    "maas-bilgileri": "/personel/memur/listeler?tab=maas-bilgileri",
    mevki: "/personel/memur/listeler?tab=mevki",
    "ek-yardimlar": "/personel/memur/listeler?tab=ek-yardimlar",
    kesintiler: "/personel/memur/listeler?tab=kesintiler",
  },
  "bordro-listeleri": {
    bordro: "/personel/memur/maas-bordro?tab=bordrolar",
    liste: "/personel/memur/maas-bordro?tab=bordrolar",
    pusula: "/personel/memur/maas-bordro?tab=pusula-listeler&section=maas-pusulasi",
    "net-maas": "/personel/memur/maas-bordro?tab=pusula-listeler&section=net-maas-listesi",
    sgy: "/personel/memur/maas-bordro?tab=bordrolar&tur=memur-sgy",
    kamu: "/personel/memur/maas-bordro?tab=bordrolar&tur=kamu",
    yillik: "/personel/memur/maas-bordro?tab=bordrolar&tur=yillik",
  },
  "kesinti-yatirim": {
    giris: "/personel/memur/kesinti-yatirim",
    liste: "/personel/memur/kesinti-yatirim?tab=raporlar",
    "ozel-kesintiler": "/personel/memur/kesinti-yatirim?tab=kesintiler&rapor=ozel-kesintiler",
    "ihtiyat-sandigi": "/personel/memur/kesinti-yatirim?tab=yatirimlar&rapor=ihtiyat-sandigi",
    "sosyal-sigortalar": "/personel/memur/kesinti-yatirim?tab=yatirimlar&rapor=sosyal-sigortalar",
    vergi: "/personel/memur/kesinti-yatirim?tab=vergi-bildirim&rapor=vergi-kesintileri",
  },
  "geri-donusum": {
    islem: "/personel/memur/islem-geri-alma",
    liste: "/personel/memur/islem-geri-alma",
    maas: "/personel/memur/islem-geri-alma?tur=maas",
    "ek-mesai": "/personel/memur/islem-geri-alma?tur=ek-mesai",
    emeklilik: "/personel/memur/islem-geri-alma?tur=emeklilik-kidem",
    cek: "/personel/memur/islem-geri-alma?tur=cek-hesaplama",
  },
};

export function getMemurWorkspace(id: string): MemurWorkspaceConfig | undefined {
  return memurWorkspaces[id as MemurWorkspaceId];
}

export function getMemurLegacySectionRedirect(sectionId: string): string | undefined {
  return legacySectionRedirects[sectionId];
}

export function getMemurLeafRedirect(section: string, actionPath: string): string | undefined {
  const sectionMap = leafRedirects[section];
  if (!sectionMap) return legacySectionRedirects[section];
  const actionId = actionPath.split("/").pop() ?? actionPath;
  return sectionMap[actionId] ?? sectionMap[actionPath] ?? legacySectionRedirects[section];
}

/** BirNet 43 leaf fonksiyon eşleştirme tablosu */
export const memurBirNetEslesmeleri: MemurBirNetEslesme[] = [
  // Personel Kartı workspace
  { birnetFonksiyon: "Memur Kartı", workspace: "personel-karti", uxTipi: "TAB", konum: "Genel", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Memur Maaş Bilgileri", workspace: "personel-karti", uxTipi: "TAB", konum: "Maaş Bilgileri", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Ek Yardım Girişi", workspace: "personel-karti", uxTipi: "ACTION", konum: "Yardımlar", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Özel Kesinti Girişi", workspace: "personel-karti", uxTipi: "ACTION", konum: "Kesintiler", durum: "TAMAMLANDI" },
  // Maaş & Bordro workspace
  { birnetFonksiyon: "Toplu PÖG Girişi", workspace: "maas-bordro", uxTipi: "ACTION", konum: "Maaş Hesaplama → Toplu PÖG", durum: "MOCK" },
  { birnetFonksiyon: "Normal Maaş", workspace: "maas-bordro", uxTipi: "TAB", konum: "Maaş Hesaplama", durum: "MOCK" },
  { birnetFonksiyon: "Fark Maaşı", workspace: "maas-bordro", uxTipi: "TAB", konum: "Maaş Hesaplama", durum: "MOCK" },
  { birnetFonksiyon: "Kararname Kesintisi 2022", workspace: "maas-bordro", uxTipi: "TAB", konum: "Maaş Hesaplama", durum: "MOCK" },
  { birnetFonksiyon: "13. Maaş Bilgileri Oluşturma", workspace: "maas-bordro", uxTipi: "SECTION", konum: "13. Maaş → Bilgileri Oluştur", durum: "MOCK" },
  { birnetFonksiyon: "13. Maaş Hesaplama", workspace: "maas-bordro", uxTipi: "SECTION", konum: "13. Maaş → Hesapla", durum: "MOCK" },
  { birnetFonksiyon: "Maaş Bordroları", workspace: "maas-bordro", uxTipi: "TAB", konum: "Bordrolar", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Maaş Bordrosu – Memur SGY", workspace: "maas-bordro", uxTipi: "TAB", konum: "Bordrolar → SGY", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Maaş Bordrosu – Kamu", workspace: "maas-bordro", uxTipi: "TAB", konum: "Bordrolar → Kamu", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Yıllık Maaş Bordrosu", workspace: "maas-bordro", uxTipi: "TAB", konum: "Bordrolar → Yıllık", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Maaş Pusulası", workspace: "maas-bordro", uxTipi: "SECTION", konum: "Pusula & Listeler", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Net Maaş Listesi", workspace: "maas-bordro", uxTipi: "SECTION", konum: "Pusula & Listeler", durum: "TAMAMLANDI" },
  // Ek Mesai workspace
  { birnetFonksiyon: "Bilgi Girişi", workspace: "ek-mesai", uxTipi: "TAB", konum: "Bilgi Girişi", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Hesaplama", workspace: "ek-mesai", uxTipi: "TAB", konum: "Hesaplama", durum: "MOCK" },
  { birnetFonksiyon: "Pusula", workspace: "ek-mesai", uxTipi: "TAB", konum: "Bordro & Pusula", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Bordro", workspace: "ek-mesai", uxTipi: "TAB", konum: "Bordro & Pusula", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Ek Mesai-Kesintiler", workspace: "ek-mesai", uxTipi: "TAB", konum: "Kesintiler", durum: "TAMAMLANDI" },
  // Emeklilik workspace
  { birnetFonksiyon: "Emeklilik Bilgi Girişi", workspace: "emeklilik", uxTipi: "TAB", konum: "Bilgi Girişi", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Emeklilik Hesaplama", workspace: "emeklilik", uxTipi: "TAB", konum: "Hesaplama", durum: "MOCK" },
  { birnetFonksiyon: "Emekli Maaş Listesi", workspace: "emeklilik", uxTipi: "TAB", konum: "Emekli Maaş Listesi", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Emekli Maaş Hesap. Dökümü", workspace: "emeklilik", uxTipi: "TAB", konum: "Hesap Dökümü", durum: "TAMAMLANDI" },
  // Kesinti & Yatırım workspace
  { birnetFonksiyon: "Özel Kesintiler Raporu", workspace: "kesinti-yatirim", uxTipi: "TAB", konum: "Kesintiler", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "İhtiyat Sandığı", workspace: "kesinti-yatirim", uxTipi: "TAB", konum: "Yatırımlar", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Sosyal Sigortalar", workspace: "kesinti-yatirim", uxTipi: "TAB", konum: "Yatırımlar", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Vergi Kesintileri", workspace: "kesinti-yatirim", uxTipi: "TAB", konum: "Vergi & Bildirim", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Genel Vergi Kesintileri", workspace: "kesinti-yatirim", uxTipi: "TAB", konum: "Vergi & Bildirim", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Maaş Bildirim Formu", workspace: "kesinti-yatirim", uxTipi: "TAB", konum: "Vergi & Bildirim", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Belediye Meslek Vergisi", workspace: "kesinti-yatirim", uxTipi: "TAB", konum: "Vergi & Bildirim", durum: "TAMAMLANDI" },
  // Çek İşlemleri workspace
  { birnetFonksiyon: "Çek Hesaplatma", workspace: "cek-islemleri", uxTipi: "TAB", konum: "Hesaplatma", durum: "MOCK" },
  { birnetFonksiyon: "Çek Listesi", workspace: "cek-islemleri", uxTipi: "TAB", konum: "Çek Listesi", durum: "TAMAMLANDI" },
  // Personel Listeleri workspace
  { birnetFonksiyon: "Memur Listesi", workspace: "listeler", uxTipi: "TAB", konum: "Memurlar", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Memur Maaş Bilgileri Listesi", workspace: "listeler", uxTipi: "TAB", konum: "Maaş Bilgileri", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Memur Mevki Listesi", workspace: "listeler", uxTipi: "TAB", konum: "Mevki", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Ek Yardımlar Listesi", workspace: "listeler", uxTipi: "TAB", konum: "Ek Yardımlar", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Kesintiler Listesi", workspace: "listeler", uxTipi: "TAB", konum: "Kesintiler", durum: "TAMAMLANDI" },
  // İşlem Geri Alma workspace
  { birnetFonksiyon: "Geri Dönüşüm — Maaş", workspace: "islem-geri-alma", uxTipi: "ACTION", konum: "Geri Alma → Maaş", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Geri Dönüşüm — Ek Mesai", workspace: "islem-geri-alma", uxTipi: "ACTION", konum: "Geri Alma → Ek Mesai", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Geri Dönüşüm — Emeklilik / Kıdem Tazminatı", workspace: "islem-geri-alma", uxTipi: "ACTION", konum: "Geri Alma → Emeklilik", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Geri Dönüşüm — Çek Hesaplama", workspace: "islem-geri-alma", uxTipi: "ACTION", konum: "Geri Alma → Çek", durum: "TAMAMLANDI" },
];

/** Fonksiyon kaybı kontrolü — 43 eşleme beklenir */
export function dogrulaMemurBirNetEslesme(): {
  toplam: number;
  beklenen: number;
  eksik: boolean;
} {
  const beklenen = 43;
  const toplam = memurBirNetEslesmeleri.length;
  return { toplam, beklenen, eksik: toplam < beklenen };
}

export function getMemurWorkspaceByRoute(route: string): MemurWorkspaceConfig | undefined {
  return Object.values(memurWorkspaces).find((w) => w.route === route);
}
