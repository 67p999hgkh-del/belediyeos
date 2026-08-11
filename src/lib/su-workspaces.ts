/**
 * Su Hizmetleri — bilgi mimarisi ve BirNet fonksiyon eşlemesi.
 * Sidebar: 10 ana başlık. Her biri tek workspace route.
 */

export type SuUxTipi = "WORKSPACE" | "TAB" | "SECTION" | "ACTION" | "DETAIL" | "REPORT" | "CONFIG" | "ASKIDA";

export interface SuBirNetEslesme {
  birnetFonksiyon: string;
  workspace: string;
  uxTipi: SuUxTipi;
  konum: string;
  durum: "PLANLI" | "TAMAMLANDI" | "ASKIDA" | "MOCK";
}

export interface SuWorkspaceTab {
  id: string;
  label: string;
}

export interface SuWorkspaceSection {
  id: string;
  label: string;
  parentTab?: string;
}

export interface SuWorkspaceAction {
  id: string;
  label: string;
  parentTab?: string;
}

export interface SuWorkspaceConfig {
  id: string;
  route: string;
  title: string;
  description: string;
  tabs: SuWorkspaceTab[];
  sections?: SuWorkspaceSection[];
  actions?: SuWorkspaceAction[];
}

export const suWorkspaceIds = [
  "abone",
  "fatura",
  "duzeltme",
  "el-terminali",
  "genel-fatura",
  "kredi",
  "ek-bakiye",
  "ceza-indirimi",
  "kanalizasyon",
  "on-odemeli-sayac",
] as const;

export type SuWorkspaceId = (typeof suWorkspaceIds)[number];

export const suWorkspaces: Record<SuWorkspaceId, SuWorkspaceConfig> = {
  abone: {
    id: "abone",
    route: "/su/abone",
    title: "Abone İşlemleri",
    description: "Su abonelik kayıt, sorgulama ve abone detay işlemleri",
    tabs: [
      { id: "kayit", label: "Kayıt" },
      { id: "sorgulama", label: "Sorgulama" },
      { id: "detay", label: "Abone Detayı" },
    ],
    sections: [
      { id: "genel", label: "Genel", parentTab: "detay" },
      { id: "sayac", label: "Sayaç", parentTab: "detay" },
      { id: "borc-bakiye", label: "Borç & Bakiye", parentTab: "detay" },
      { id: "abonelik-durumu", label: "Abonelik Durumu", parentTab: "detay" },
      { id: "devir-nakil", label: "Devir / Nakil", parentTab: "detay" },
      { id: "faturalar", label: "Faturalar", parentTab: "detay" },
      { id: "hareketler", label: "Hareketler", parentTab: "detay" },
      { id: "belgeler", label: "Belgeler", parentTab: "detay" },
    ],
    actions: [
      { id: "kapama", label: "Abone Kapama / Açma" },
      { id: "devir", label: "Abone Devir / Nakil" },
      { id: "no-degistir", label: "Abone No Değiştirme" },
      { id: "sayac-bagla", label: "Sayaç Bağlama / Değiştirme" },
      { id: "hesap-dokum", label: "Hesap Dökümü" },
      { id: "borc-dokum", label: "Borç Dökümü" },
      { id: "genel-borc-ozet", label: "Genel Borç Özeti" },
    ],
  },
  fatura: {
    id: "fatura",
    route: "/su/fatura",
    title: "Su Faturalandırma",
    description: "Dönem, sayaç okuma, tahakkuk ve faturalandırma",
    tabs: [
      { id: "donem-tahakkuk", label: "Dönem & Tahakkuk" },
      { id: "sayac-okuma", label: "Sayaç Okuma" },
      { id: "faturalandirma", label: "Faturalandırma" },
      { id: "toplu", label: "Toplu İşlemler" },
      { id: "raporlar", label: "Raporlar" },
    ],
    sections: [
      { id: "okuma-liste", label: "Okuma Listeleri", parentTab: "sayac-okuma" },
      { id: "okuma-giris", label: "Okuma Girişi", parentTab: "sayac-okuma" },
      { id: "sayac-degistir", label: "Sayaç Değiştirme", parentTab: "sayac-okuma" },
      { id: "toplu-hesap", label: "Toplu Hesaplama", parentTab: "toplu" },
      { id: "toplu-kes", label: "Toplu Kesme", parentTab: "toplu" },
      { id: "ek-hizmet", label: "Ek Hizmet Borç", parentTab: "toplu" },
      { id: "tanker", label: "Tanker Taşıma", parentTab: "toplu" },
    ],
  },
  duzeltme: {
    id: "duzeltme",
    route: "/su/duzeltme",
    title: "Su Düzeltme İşlemleri",
    description: "Kayıt bul, düzelt, gerekçe ve audit",
    tabs: [{ id: "duzeltme", label: "Düzeltme" }],
  },
  "el-terminali": {
    id: "el-terminali",
    route: "/su/el-terminali",
    title: "El Terminali & Saha Okuma",
    description: "Veri hazırla, veri al, aktarım geçmişi",
    tabs: [
      { id: "veri-hazirla", label: "Veri Hazırla" },
      { id: "veri-al", label: "Veri Al" },
      { id: "gecmis", label: "Aktarım Geçmişi" },
    ],
  },
  "genel-fatura": {
    id: "genel-fatura",
    route: "/su/genel-fatura",
    title: "Genel Fatura",
    description: "Genel fatura kayıt, liste, yazdır ve ekstre",
    tabs: [
      { id: "kayit", label: "Kayıt" },
      { id: "liste", label: "Fatura Listesi" },
    ],
  },
  kredi: {
    id: "kredi",
    route: "/su/kredi",
    title: "Su Kredi İşlemleri",
    description: "Kredi geri ödeme, liste ve raporlar",
    tabs: [
      { id: "liste", label: "Kredi Listesi" },
      { id: "geri-odeme", label: "Geri Ödeme" },
      { id: "raporlar", label: "Raporlar" },
    ],
  },
  "ek-bakiye": {
    id: "ek-bakiye",
    route: "/su/ek-bakiye",
    title: "Ek Bakiye",
    description: "Bakiye bilgileri girişi ve listesi",
    tabs: [
      { id: "giris", label: "Bakiye Bilgileri Girişi" },
      { id: "liste", label: "Bakiye Bilgileri Listesi" },
    ],
  },
  "ceza-indirimi": {
    id: "ceza-indirimi",
    route: "/su/ceza-indirimi",
    title: "Su Ceza İndirimi",
    description: "Başvuru, borç, ekstre ve taahhütname",
    tabs: [
      { id: "basvuru", label: "Başvuru / Kayıt" },
      { id: "basvuru-liste", label: "Başvuru Listesi" },
    ],
    sections: [
      { id: "borclar", label: "Borçlar", parentTab: "basvuru-liste" },
      { id: "odeme-ekstre", label: "Ödeme Ekstresi", parentTab: "basvuru-liste" },
      { id: "taahhutname", label: "Taahhütname", parentTab: "basvuru-liste" },
    ],
  },
  kanalizasyon: {
    id: "kanalizasyon",
    route: "/su/kanalizasyon",
    title: "Kanalizasyon",
    description: "Kanalizasyon bağlama ve kanal bağlama listesi",
    tabs: [
      { id: "liste", label: "Bağlantı Listesi" },
      { id: "yeni", label: "Yeni Kanalizasyon Bağlantısı" },
    ],
  },
  "on-odemeli-sayac": {
    id: "on-odemeli-sayac",
    route: "/su/on-odemeli-sayac",
    title: "Ön Ödemeli Sayaç",
    description: "Baylan / Cem kart okuma ve satış işlemleri",
    tabs: [
      { id: "kart-okuma", label: "Kart Okuma" },
      { id: "kart-islemleri", label: "Kart İşlemleri" },
      { id: "fatura-hesap", label: "Ön Ödemeli Fatura Hesaplama" },
      { id: "satis-liste", label: "Satış Listesi" },
    ],
  },
};

/** Eski leaf route → workspace query redirect */
const leafRedirects: Record<string, Record<string, string>> = {
  abone: {
    kayit: "/su/abone?tab=kayit",
    liste: "/su/abone?tab=sorgulama",
    sorgulama: "/su/abone?tab=sorgulama",
    kapama: "/su/abone?tab=detay&action=kapama",
    devir: "/su/abone?tab=detay&action=devir",
    sayac: "/su/abone?tab=detay&section=sayac",
  },
  fatura: {
    tahakkuk: "/su/fatura?tab=donem-tahakkuk",
    kesme: "/su/fatura?tab=faturalandirma",
    liste: "/su/fatura?tab=faturalandirma",
    yazdir: "/su/fatura?tab=faturalandirma",
    toplu: "/su/fatura?tab=toplu",
    iptal: "/su/fatura?tab=faturalandirma",
  },
  duzeltme: {
    fatura: "/su/duzeltme?tur=fatura-duzeltme",
    abone: "/su/duzeltme?tur=abone-duzeltme",
    sayac: "/su/duzeltme?tur=sayac-okuma-duzeltme",
    tahakkuk: "/su/duzeltme?tur=tahakkuk-duzeltme",
  },
  "el-terminali": {
    aktarim: "/su/el-terminali?tab=veri-al",
    liste: "/su/el-terminali?tab=gecmis",
    tanim: "/su/el-terminali?tab=veri-hazirla",
    rapor: "/su/el-terminali?tab=gecmis",
  },
  "genel-fatura": {
    kesme: "/su/genel-fatura?tab=kayit",
    liste: "/su/genel-fatura?tab=liste",
    tahakkuk: "/su/genel-fatura?tab=kayit",
  },
  kredi: {
    yukleme: "/su/kredi?tab=geri-odeme",
    liste: "/su/kredi?tab=liste",
    sorgulama: "/su/kredi?tab=liste",
  },
  "ek-bakiye": {
    tanim: "/su/ek-bakiye?tab=giris",
    liste: "/su/ek-bakiye?tab=liste",
    duzeltme: "/su/ek-bakiye?tab=liste",
  },
  "ceza-indirimi": {},
  kanalizasyon: {
    tahakkuk: "/su/kanalizasyon",
    abone: "/su/kanalizasyon",
    rapor: "/su/kanalizasyon",
  },
  "on-odemeli-sayac": {
    tanim: "/su/on-odemeli-sayac?tab=kart-islemleri",
    yukleme: "/su/on-odemeli-sayac?tab=kart-islemleri",
    liste: "/su/on-odemeli-sayac?tab=satis-liste",
    rapor: "/su/on-odemeli-sayac?tab=satis-liste",
  },
};

export function getSuWorkspace(id: string): SuWorkspaceConfig | undefined {
  return suWorkspaces[id as SuWorkspaceId];
}

export function getLeafRedirect(section: string, actionPath: string): string | undefined {
  const sectionMap = leafRedirects[section];
  if (!sectionMap) return undefined;
  const actionId = actionPath.split("/").pop() ?? actionPath;
  return sectionMap[actionId] ?? sectionMap[actionPath];
}

/** BirNet fonksiyon eşleştirme tablosu — fonksiyon kaybı kontrolü */
export const suBirNetEslesmeleri: SuBirNetEslesme[] = [
  // Abone
  { birnetFonksiyon: "Su Abone Kaydı", workspace: "abone", uxTipi: "TAB", konum: "Kayıt", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Su Abone Listesi", workspace: "abone", uxTipi: "TAB", konum: "Sorgulama", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Abone Sorgulama", workspace: "abone", uxTipi: "TAB", konum: "Sorgulama", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Abone Kapama / Açma", workspace: "abone", uxTipi: "ACTION", konum: "İşlemler → Kapama", durum: "MOCK" },
  { birnetFonksiyon: "Abone Devir / Nakil", workspace: "abone", uxTipi: "ACTION", konum: "İşlemler → Devir", durum: "MOCK" },
  { birnetFonksiyon: "Abone No Değiştirme", workspace: "abone", uxTipi: "ACTION", konum: "İşlemler → No Değiştir", durum: "MOCK" },
  { birnetFonksiyon: "Sayaç Bağlama / Tesis Katkı Payı", workspace: "abone", uxTipi: "ACTION", konum: "İşlemler → Sayaç Bağlama", durum: "MOCK" },
  { birnetFonksiyon: "Abone Hesap Dökümü", workspace: "abone", uxTipi: "REPORT", konum: "İşlemler → Hesap Dökümü", durum: "MOCK" },
  { birnetFonksiyon: "Abone Borç Dökümü", workspace: "abone", uxTipi: "REPORT", konum: "İşlemler → Borç Dökümü", durum: "MOCK" },
  { birnetFonksiyon: "Abone Genel Borç Özeti", workspace: "abone", uxTipi: "REPORT", konum: "Detay → Borç & Bakiye", durum: "MOCK" },
  { birnetFonksiyon: "Abone Hesap Düzeltme", workspace: "duzeltme", uxTipi: "TAB", konum: "Düzeltme türü", durum: "PLANLI" },
  { birnetFonksiyon: "Hesap Düzeltme Listesi", workspace: "duzeltme", uxTipi: "DETAIL", konum: "Kayıt geçmişi", durum: "PLANLI" },
  { birnetFonksiyon: "Borç Listesi", workspace: "abone", uxTipi: "DETAIL", konum: "Detay → Borç & Bakiye", durum: "MOCK" },
  { birnetFonksiyon: "Bakiye Listesi", workspace: "abone", uxTipi: "DETAIL", konum: "Detay → Borç & Bakiye", durum: "MOCK" },
  { birnetFonksiyon: "Bakiye Kontrol", workspace: "abone", uxTipi: "DETAIL", konum: "Detay → Borç & Bakiye", durum: "MOCK" },
  { birnetFonksiyon: "Özet Borç Listesi", workspace: "abone", uxTipi: "DETAIL", konum: "Detay → Borç & Bakiye", durum: "MOCK" },
  { birnetFonksiyon: "Faturaya Tanker Kullanımı Ekle", workspace: "fatura", uxTipi: "SECTION", konum: "Toplu İşlemler → Tanker", durum: "MOCK" },
  { birnetFonksiyon: "Abone No Değiştirme Listesi", workspace: "abone", uxTipi: "DETAIL", konum: "Detay → Hareketler", durum: "PLANLI" },
  // Fatura
  { birnetFonksiyon: "Fatura Tahakkuk", workspace: "fatura", uxTipi: "TAB", konum: "Dönem & Tahakkuk", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Sayaç Okuma Listeleri", workspace: "fatura", uxTipi: "SECTION", konum: "Sayaç Okuma → Okuma Listeleri", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Sayaç Okuma Bilgileri Girişi", workspace: "fatura", uxTipi: "SECTION", konum: "Sayaç Okuma → Okuma Girişi", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Sayaç Değiştirme", workspace: "fatura", uxTipi: "SECTION", konum: "Sayaç Okuma → Sayaç Değiştirme", durum: "MOCK" },
  { birnetFonksiyon: "Tekil Fatura Hesaplama", workspace: "fatura", uxTipi: "TAB", konum: "Faturalandırma", durum: "MOCK" },
  { birnetFonksiyon: "Fatura Kesme", workspace: "fatura", uxTipi: "TAB", konum: "Faturalandırma", durum: "MOCK" },
  { birnetFonksiyon: "Fatura Listesi", workspace: "fatura", uxTipi: "TAB", konum: "Faturalandırma", durum: "TAMAMLANDI" },
  { birnetFonksiyon: "Fatura Yazdırma", workspace: "fatura", uxTipi: "ACTION", konum: "Faturalandırma → Yazdır", durum: "MOCK" },
  { birnetFonksiyon: "Fatura İptali", workspace: "fatura", uxTipi: "ACTION", konum: "Faturalandırma → İptal", durum: "MOCK" },
  { birnetFonksiyon: "Toplu Fatura Hesaplama", workspace: "fatura", uxTipi: "SECTION", konum: "Toplu İşlemler → Toplu Hesaplama", durum: "MOCK" },
  { birnetFonksiyon: "Toplu Fatura Kesme", workspace: "fatura", uxTipi: "SECTION", konum: "Toplu İşlemler → Toplu Kesme", durum: "MOCK" },
  { birnetFonksiyon: "Ek Hizmet Borç Girişi", workspace: "fatura", uxTipi: "SECTION", konum: "Toplu İşlemler → Ek Hizmet", durum: "MOCK" },
  { birnetFonksiyon: "Ek Hizmet Borç Listesi", workspace: "fatura", uxTipi: "SECTION", konum: "Toplu İşlemler → Ek Hizmet", durum: "MOCK" },
  { birnetFonksiyon: "Tankerle Su Taşıma", workspace: "fatura", uxTipi: "SECTION", konum: "Toplu İşlemler → Tanker", durum: "MOCK" },
  { birnetFonksiyon: "Sayaç Okuma / Fatura Raporu", workspace: "fatura", uxTipi: "REPORT", konum: "Raporlar", durum: "MOCK" },
  { birnetFonksiyon: "Dönem Fatura Özeti", workspace: "fatura", uxTipi: "REPORT", konum: "Raporlar", durum: "MOCK" },
  { birnetFonksiyon: "Kullanım Tonaj Listesi", workspace: "fatura", uxTipi: "REPORT", konum: "Raporlar", durum: "MOCK" },
  // Kredi — doğrulanmış
  { birnetFonksiyon: "Kredi Geri Ödeme", workspace: "kredi", uxTipi: "TAB", konum: "Geri Ödeme", durum: "PLANLI" },
  { birnetFonksiyon: "Kredi Listesi", workspace: "kredi", uxTipi: "TAB", konum: "Kredi Listesi", durum: "PLANLI" },
  { birnetFonksiyon: "Kredi Yükleme", workspace: "kredi", uxTipi: "ASKIDA", konum: "—", durum: "ASKIDA" },
  // Kanalizasyon
  { birnetFonksiyon: "Kanalizasyon Bağlama", workspace: "kanalizasyon", uxTipi: "TAB", konum: "Yeni Bağlantı", durum: "PLANLI" },
  { birnetFonksiyon: "Kanal Bağlama Listesi", workspace: "kanalizasyon", uxTipi: "TAB", konum: "Bağlantı Listesi", durum: "PLANLI" },
  { birnetFonksiyon: "Kanalizasyon Tahakkuk", workspace: "kanalizasyon", uxTipi: "ASKIDA", konum: "—", durum: "ASKIDA" },
];
