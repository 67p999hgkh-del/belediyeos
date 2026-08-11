import { kaydetSuAudit } from "./su-audit";

export type SuDuzeltmeTur =
  | "fatura-duzeltme"
  | "abone-duzeltme"
  | "sayac-okuma-duzeltme"
  | "tahakkuk-duzeltme";

export interface SuDuzeltmeTurConfig {
  id: SuDuzeltmeTur;
  label: string;
  alanlar: { key: string; label: string }[];
}

export const suDuzeltmeTurleri: SuDuzeltmeTurConfig[] = [
  {
    id: "fatura-duzeltme",
    label: "Fatura Düzeltme",
    alanlar: [
      { key: "faturaNo", label: "Fatura No" },
      { key: "tutar", label: "Tutar" },
      { key: "sonOdeme", label: "Son Ödeme Tarihi" },
    ],
  },
  {
    id: "abone-duzeltme",
    label: "Abone Düzeltme",
    alanlar: [
      { key: "adSoyad", label: "Adı Soyadı" },
      { key: "adres", label: "Adres" },
      { key: "tarife", label: "Tarife Grubu" },
    ],
  },
  {
    id: "sayac-okuma-duzeltme",
    label: "Sayaç Okuma Düzeltme",
    alanlar: [
      { key: "sayacNo", label: "Sayaç No" },
      { key: "okuma", label: "Okuma Değeri" },
      { key: "donem", label: "Dönem" },
    ],
  },
  {
    id: "tahakkuk-duzeltme",
    label: "Tahakkuk Düzeltme",
    alanlar: [
      { key: "donem", label: "Dönem" },
      { key: "tahakkukTutar", label: "Tahakkuk Tutarı" },
      { key: "aboneSayisi", label: "Abone Sayısı" },
    ],
  },
];

export interface SuDuzeltmeKayit {
  id: string;
  tur: SuDuzeltmeTur;
  aboneNo: string;
  referans: string;
  eskiDeger: string;
  yeniDeger: string;
  gerekce: string;
  kullanici: string;
  tarih: string;
}

const kayitlar: SuDuzeltmeKayit[] = [
  {
    id: "d1",
    tur: "sayac-okuma-duzeltme",
    aboneNo: "12-34-56-78",
    referans: "2026/1 Okuma",
    eskiDeger: "1258",
    yeniDeger: "1256",
    gerekce: "Okuma giriş hatası",
    kullanici: "Ayşe Yılmaz",
    tarih: "10.08.2026 14:22",
  },
];

export function getSuDuzeltmeKayitlari(): SuDuzeltmeKayit[] {
  return kayitlar;
}

export function kaydetSuDuzeltme(input: {
  tur: SuDuzeltmeTur;
  aboneNo: string;
  referans: string;
  eskiDeger: string;
  yeniDeger: string;
  gerekce: string;
  kullanici: string;
}): SuDuzeltmeKayit {
  const turLabel = suDuzeltmeTurleri.find((t) => t.id === input.tur)?.label ?? input.tur;
  const kayit: SuDuzeltmeKayit = {
    id: `d-${Date.now()}`,
    ...input,
    tarih: new Date().toLocaleString("tr-TR"),
  };
  kayitlar.unshift(kayit);
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: turLabel,
    eskiDeger: input.eskiDeger,
    yeniDeger: input.yeniDeger,
    gerekce: input.gerekce,
    aciklama: `${input.aboneNo} — ${input.referans}`,
  });
  return kayit;
}

export function bulSuDuzeltmeReferans(tur: SuDuzeltmeTur, arama: string) {
  if (!arama.trim()) return null;
  const ornekler: Record<SuDuzeltmeTur, { referans: string; eski: Record<string, string> }> = {
    "fatura-duzeltme": {
      referans: "SU-2026-00142",
      eski: { faturaNo: "SU-2026-00142", tutar: "420,00", sonOdeme: "15.08.2026" },
    },
    "abone-duzeltme": {
      referans: arama,
      eski: { adSoyad: "Mehmet Demir", adres: "Erenköy Mah.", tarife: "1. Grup" },
    },
    "sayac-okuma-duzeltme": {
      referans: "2026/1",
      eski: { sayacNo: "SC-88421", okuma: "1258", donem: "2026/1" },
    },
    "tahakkuk-duzeltme": {
      referans: "2026/1",
      eski: { donem: "2026/1", tahakkukTutar: "842.000,00", aboneSayisi: "2184" },
    },
  };
  return ornekler[tur];
}
