import { suMockStore } from "@/lib/su/mock-store";
import type { SuGenelFatura } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export type { SuGenelFatura };

export function getSuGenelFaturalar(): SuGenelFatura[] {
  return suMockStore.genelFaturalar;
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
    faturaNo: `GF-2026-${String(suMockStore.genelFaturalar.length + 43).padStart(4, "0")}`,
    ...input,
    sonOdeme: "30.08.2026",
    durum: "kesildi",
  };
  suMockStore.genelFaturalar.unshift(fatura);
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Genel Fatura Kayıt", yeniDeger: fatura.faturaNo, aciklama: input.aboneNo });
  return fatura;
}

export function getSuGenelFaturaEkstre(faturaNo: string) {
  const f = suMockStore.genelFaturalar.find((x) => x.faturaNo === faturaNo);
  if (!f) return null;
  return {
    faturaNo: f.faturaNo,
    aboneNo: f.aboneNo,
    adSoyad: f.adSoyad,
    satirlar: [{ aciklama: f.aciklama, gelirKodu: f.gelirKodu, tutar: f.tutar }],
    toplam: f.tutar,
  };
}
