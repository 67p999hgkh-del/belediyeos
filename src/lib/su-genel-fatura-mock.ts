import { kaydetSuAudit } from "./su-audit";

export interface SuGenelFatura {
  id: string;
  faturaNo: string;
  aboneNo: string;
  adSoyad: string;
  gelirKodu: string;
  aciklama: string;
  tutar: number;
  donem: string;
  sonOdeme: string;
  durum: "kesildi" | "iptal";
}

const faturalar: SuGenelFatura[] = [
  {
    id: "gf1",
    faturaNo: "GF-2026-0042",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    gelirKodu: "199",
    aciklama: "Bağlantı bedeli",
    tutar: 850,
    donem: "2026/1",
    sonOdeme: "30.08.2026",
    durum: "kesildi",
  },
  {
    id: "gf2",
    faturaNo: "GF-2026-0038",
    aboneNo: "11-22-33-44",
    adSoyad: "Erenköy Site Yönetimi",
    gelirKodu: "199",
    aciklama: "Tesis katkı payı",
    tutar: 4200,
    donem: "2026/1",
    sonOdeme: "30.08.2026",
    durum: "kesildi",
  },
];

export function getSuGenelFaturalar(): SuGenelFatura[] {
  return faturalar;
}

export function kaydetSuGenelFatura(input: {
  aboneNo: string;
  adSoyad: string;
  gelirKodu: string;
  aciklama: string;
  tutar: number;
  donem: string;
  kullanici: string;
}): SuGenelFatura {
  const fatura: SuGenelFatura = {
    id: `gf-${Date.now()}`,
    faturaNo: `GF-2026-${String(faturalar.length + 43).padStart(4, "0")}`,
    ...input,
    sonOdeme: "30.08.2026",
    durum: "kesildi",
  };
  faturalar.unshift(fatura);
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: "Genel Fatura Kayıt",
    yeniDeger: fatura.faturaNo,
    aciklama: input.aboneNo,
  });
  return fatura;
}

export function getSuGenelFaturaEkstre(faturaNo: string) {
  const f = faturalar.find((x) => x.faturaNo === faturaNo);
  if (!f) return null;
  return {
    faturaNo: f.faturaNo,
    aboneNo: f.aboneNo,
    adSoyad: f.adSoyad,
    satirlar: [
      { aciklama: f.aciklama, gelirKodu: f.gelirKodu, tutar: f.tutar },
    ],
    toplam: f.tutar,
  };
}
