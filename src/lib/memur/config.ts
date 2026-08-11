/**
 * Personel (Memur) modülü — production config katmanı.
 * Doğrulanmamış oran/formül burada tanımlanmaz; backend/parametre bekler.
 */

export interface MemurDonemConfig {
  yillar: number[];
  aylar: number[];
  aktifYil: number;
  aktifAy: number;
}

export const memurDonemConfig: MemurDonemConfig = {
  yillar: [2024, 2025, 2026],
  aylar: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
  aktifYil: 2026,
  aktifAy: 2,
};

/** BirNet'ten doğrulanmış hesaplama türleri — formül backend'de */
export const memurHesaplamaTurleri = [
  { id: "normal-maas", label: "Normal Maaş" },
  { id: "fark-maasi", label: "Fark Maaşı" },
  { id: "kararname-kesintisi-2022", label: "Kararname Kesintisi 2022" },
] as const;

/** BirNet bordro türleri — SGY/Kamu terminolojisi korunur */
export const memurBordroTurleri = [
  { id: "maas-bordrolari", label: "Maaş Bordroları" },
  { id: "memur-sgy", label: "Maaş Bordrosu – Memur SGY" },
  { id: "kamu", label: "Maaş Bordrosu – Kamu" },
  { id: "yillik", label: "Yıllık Maaş Bordrosu" },
] as const;

/** Personel listeleri türleri — BirNet karşılıkları */
export const memurListeTurleri = [
  { id: "memurlar", label: "Memurlar" },
  { id: "maas-bilgileri", label: "Maaş Bilgileri" },
  { id: "mevki", label: "Mevki" },
  { id: "ek-yardimlar", label: "Ek Yardımlar" },
  { id: "kesintiler", label: "Kesintiler" },
] as const;

/** Kesinti & Yatırım segmentleri */
export const memurKesintiSegmentleri = [
  { id: "kesintiler", label: "Kesintiler" },
  { id: "yatirimlar", label: "Yatırımlar" },
  { id: "vergi-bildirim", label: "Vergi & Bildirim" },
  { id: "raporlar", label: "Raporlar" },
] as const;

/** Kesinti & Yatırım rapor türleri — BirNet fonksiyon adları */
export const memurKesintiRaporTurleri = [
  { id: "ozel-kesintiler", label: "Özel Kesintiler Raporu", segment: "kesintiler" },
  { id: "ihtiyat-sandigi", label: "İhtiyat Sandığı", segment: "yatirimlar" },
  { id: "sosyal-sigortalar", label: "Sosyal Sigortalar", segment: "yatirimlar" },
  { id: "vergi-kesintileri", label: "Vergi Kesintileri", segment: "vergi-bildirim" },
  { id: "genel-vergi-kesintileri", label: "Genel Vergi Kesintileri", segment: "vergi-bildirim" },
  { id: "maas-bildirim-formu", label: "Maaş Bildirim Formu", segment: "vergi-bildirim" },
  { id: "belediye-meslek-vergisi", label: "Belediye Meslek Vergisi", segment: "vergi-bildirim" },
] as const;

/** Geri alma (Geri Dönüşümler) işlem türleri */
export const memurGeriAlmaTurleri = [
  { id: "maas", label: "Maaş" },
  { id: "ek-mesai", label: "Ek Mesai" },
  { id: "emeklilik-kidem", label: "Emeklilik / Kıdem Tazminatı" },
  { id: "cek-hesaplama", label: "Çek Hesaplama" },
] as const;

/** Yardım/kesinti türleri — backend parametre bekliyor */
export const memurYardimTurleri: string[] = [];
export const memurKesintiTurleri: string[] = [];
export const memurKadroTurleri: string[] = [];
export const memurMevkiTurleri: string[] = [];

/** Demo fixture override — production UI default'u değil */
export const memurDemoYardimTurleri = ["Aile Yardımı", "Yemek Yardımı", "Diğer"];
export const memurDemoKesintiTurleri = ["Sendika", "BES", "Diğer"];

export function formatMemurDonem(yil: number, ay: number): string {
  return `${yil}/${ay}`;
}
