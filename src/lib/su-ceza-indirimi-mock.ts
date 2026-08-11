import { kaydetSuAudit } from "./su-audit";

export interface SuCezaBasvuru {
  id: string;
  basvuruNo: string;
  aboneNo: string;
  adSoyad: string;
  basvuruTarihi: string;
  durum: "acik" | "onaylandi" | "reddedildi";
  toplamBorc: number;
  cezaTutar: number;
  indirimOrani: number;
  indirimTutar: number;
  yeniBorc: number;
  gerekce: string;
}

export interface SuCezaBorc {
  id: string;
  donem: string;
  gelirKodu: string;
  tutar: number;
  ceza: number;
  secili?: boolean;
}

const basvurular: SuCezaBasvuru[] = [
  {
    id: "cb1",
    basvuruNo: "CI-2026-0012",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    basvuruTarihi: "05.08.2026",
    durum: "acik",
    toplamBorc: 838,
    cezaTutar: 42,
    indirimOrani: 50,
    indirimTutar: 21,
    yeniBorc: 817,
    gerekce: "Maddi zorluk",
  },
];

export function getSuCezaBasvurular(): SuCezaBasvuru[] {
  return basvurular;
}

export function getSuCezaBasvuru(id: string): SuCezaBasvuru | undefined {
  return basvurular.find((b) => b.id === id);
}

export function getSuCezaBorclari(aboneNo: string): SuCezaBorc[] {
  if (aboneNo.includes("12-34")) {
    return [
      { id: "b1", donem: "2026/1", gelirKodu: "101", tutar: 420, ceza: 21 },
      { id: "b2", donem: "2025/4", gelirKodu: "101", tutar: 418, ceza: 21 },
    ];
  }
  return [];
}

export function kaydetSuCezaBasvuru(input: {
  aboneNo: string;
  adSoyad: string;
  indirimOrani: number;
  gerekce: string;
  kullanici: string;
}): SuCezaBasvuru {
  const borclar = getSuCezaBorclari(input.aboneNo);
  const toplamBorc = borclar.reduce((s, b) => s + b.tutar, 0);
  const cezaTutar = borclar.reduce((s, b) => s + b.ceza, 0);
  const indirimTutar = (cezaTutar * input.indirimOrani) / 100;
  const basvuru: SuCezaBasvuru = {
    id: `cb-${Date.now()}`,
    basvuruNo: `CI-2026-${String(basvurular.length + 13).padStart(4, "0")}`,
    aboneNo: input.aboneNo,
    adSoyad: input.adSoyad,
    basvuruTarihi: new Date().toLocaleDateString("tr-TR"),
    durum: "acik",
    toplamBorc,
    cezaTutar,
    indirimOrani: input.indirimOrani,
    indirimTutar,
    yeniBorc: toplamBorc + cezaTutar - indirimTutar,
    gerekce: input.gerekce,
  };
  basvurular.unshift(basvuru);
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: "Ceza İndirimi Başvurusu",
    yeniDeger: `%${input.indirimOrani}`,
    gerekce: input.gerekce,
    aciklama: input.aboneNo,
  });
  return basvuru;
}

export function getSuCezaOdemeEkstre(basvuruId: string) {
  const b = getSuCezaBasvuru(basvuruId);
  if (!b) return null;
  return {
    basvuruNo: b.basvuruNo,
    aboneNo: b.aboneNo,
    satirlar: getSuCezaBorclari(b.aboneNo).map((x) => ({
      donem: x.donem,
      borc: x.tutar,
      ceza: x.ceza,
    })),
    indirim: b.indirimTutar,
    yeniToplam: b.yeniBorc,
  };
}

export function getSuCezaTaahhutname(basvuruId: string) {
  const b = getSuCezaBasvuru(basvuruId);
  if (!b) return null;
  return {
    basvuruNo: b.basvuruNo,
    aboneNo: b.aboneNo,
    adSoyad: b.adSoyad,
    indirimOrani: b.indirimOrani,
    yeniBorc: b.yeniBorc,
    tarih: b.basvuruTarihi,
  };
}
