/**
 * Su modülü — production config katmanı.
 * Doğrulanmamış değerler boş/default bırakılır; backend bağlanınca buradan okunur.
 */

export interface SuGelirKodu {
  kod: string;
  ad: string;
  /** Backend/parametre tablosundan gelene kadar demo fixture'da kullanılabilir */
  kaynak: "legacy-dogrulandi" | "config-placeholder" | "backend";
}

export interface SuDonemConfig {
  yillar: number[];
  donemSayisi: number;
  aktifYil: number;
  aktifDonem: number;
}

/** Dönem ayarları — workspace mimarisinde kullanılıyor; backend'den gelecek */
export const suDonemConfig: SuDonemConfig = {
  yillar: [2024, 2025, 2026],
  donemSayisi: 4,
  aktifYil: 2026,
  aktifDonem: 1,
};

/**
 * Gelir kodları — BirNet'te su bedeli/kanalizasyon doğrulandı.
 * "199 Ek Hizmet" genel fatura default'u olarak kullanılmaz (henüz doğrulanmadı).
 */
export const suGelirKodlari: SuGelirKodu[] = [
  { kod: "101", ad: "Su Bedeli", kaynak: "legacy-dogrulandi" },
  { kod: "102", ad: "Kanalizasyon Bedeli", kaynak: "legacy-dogrulandi" },
  { kod: "103", ad: "Atık Su Bedeli", kaynak: "config-placeholder" },
];

/** Genel Fatura gelir kodları — backend/parametre bekliyor */
export const suGenelFaturaGelirKodlari: SuGelirKodu[] = [];

/** Abonelik/tarife — backend parametre bekliyor; demo'da fixture kullanılır */
export const suAbonelikTurleri: string[] = [];
export const suTarifeGruplari: string[] = [];

/** Ek bakiye türleri — backend parametre bekliyor */
export const suEkBakiyeTurleri: string[] = [];

/**
 * Ön ödemeli sayaç sistem seçimi.
 * Workspace mimarisinde Baylan/Cem onaylandı; legacy ekran detayı henüz doğrulanmadı.
 * Sistem listesi backend/config'den gelene kadar boş kalabilir.
 */
export const suOnOdemeliSistemConfig = {
  legacyDogrulandi: false,
  /** Backend'den yüklenecek; demo fixture'da override edilir */
  sistemler: [] as string[],
  varsayilanSistem: "" as string,
};

/** Ceza indirimi — varsayılan oran yok; kullanıcı/config girmeli */
export const suCezaIndirimiConfig = {
  varsayilanIndirimOrani: null as number | null,
  minOran: 1,
  maxOran: 100,
};

/** El terminali tanımları — legacy ekranda doğrulanmadı; demo fixture ayrı tutulur */
export const suElTerminaliConfig = {
  terminalTanimlariLegacyDogrulandi: false,
};

export const suRaporTurleri = [
  { id: "sayac-fatura", label: "Sayaç Okuma Bilgileri / Fatura Raporu" },
  { id: "donem-ozet", label: "Dönem Fatura Özeti" },
  { id: "tonaj-liste", label: "Kullanım Tonaj Listesi" },
] as const;

export const suKrediRaporTurleri = [
  { id: "donem", label: "Dönem Kredi Kullanım Raporu" },
  { id: "tarih", label: "Tarih Aralığında Kredi Kullanım Raporu" },
] as const;

export function formatDonem(yil: number, donem: number): string {
  return `${yil}/${donem}`;
}

/** Demo gelir kodları — yalnızca fixture/test; production UI default'u değil */
export const suDemoGelirKodlari: SuGelirKodu[] = [
  { kod: "199", ad: "Ek Hizmet", kaynak: "config-placeholder" },
];

/** Demo abonelik/tarife — fixture için */
export const suDemoAbonelikTurleri = ["Konut", "Ticari", "Kamu", "Tarimsal"];
export const suDemoTarifeGruplari = ["1. Grup", "2. Grup", "Ticari A", "Ticari B"];
export const suDemoEkBakiyeTurleri = ["Ek Tüketim", "Bağlantı Farkı", "Diğer"];
export const suDemoOnOdemeliSistemler = ["Baylan", "Cem"] as const;
