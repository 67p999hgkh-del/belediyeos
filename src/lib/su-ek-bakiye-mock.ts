import { kaydetSuAudit } from "./su-audit";

export interface SuEkBakiyeKayit {
  id: string;
  aboneNo: string;
  adSoyad: string;
  bakiyeTuru: string;
  tutar: number;
  donem: string;
  aciklama: string;
  durum: "aktif" | "duzeltildi";
}

const kayitlar: SuEkBakiyeKayit[] = [
  {
    id: "eb1",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    bakiyeTuru: "Ek Tüketim",
    tutar: 75,
    donem: "2026/1",
    aciklama: "Ek okuma farkı",
    durum: "aktif",
  },
  {
    id: "eb2",
    aboneNo: "11-22-33-44",
    adSoyad: "Erenköy Site Yönetimi",
    bakiyeTuru: "Bağlantı Farkı",
    tutar: 200,
    donem: "2026/1",
    aciklama: "Site ortak alan",
    durum: "aktif",
  },
];

export const suEkBakiyeTurleri = ["Ek Tüketim", "Bağlantı Farkı", "Diğer"];

export function getSuEkBakiyeListesi(): SuEkBakiyeKayit[] {
  return kayitlar;
}

export function kaydetSuEkBakiye(input: {
  aboneNo: string;
  adSoyad: string;
  bakiyeTuru: string;
  tutar: number;
  donem: string;
  aciklama: string;
  kullanici: string;
}): SuEkBakiyeKayit {
  const kayit: SuEkBakiyeKayit = {
    id: `eb-${Date.now()}`,
    ...input,
    durum: "aktif",
  };
  kayitlar.unshift(kayit);
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: "Ek Bakiye Girişi",
    yeniDeger: String(input.tutar),
    aciklama: input.aboneNo,
  });
  return kayit;
}

export function duzeltSuEkBakiye(
  id: string,
  yeniTutar: number,
  gerekce: string,
  kullanici: string,
): SuEkBakiyeKayit | null {
  const kayit = kayitlar.find((k) => k.id === id);
  if (!kayit) return null;
  const eski = kayit.tutar;
  kayit.tutar = yeniTutar;
  kayit.durum = "duzeltildi";
  kaydetSuAudit({
    kullanici,
    islem: "Ek Bakiye Düzeltme",
    eskiDeger: String(eski),
    yeniDeger: String(yeniTutar),
    gerekce,
    aciklama: kayit.aboneNo,
  });
  return kayit;
}
