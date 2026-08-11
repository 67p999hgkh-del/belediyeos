import { suDemoEkBakiyeTurleri } from "@/lib/su/config";
import { suMockStore } from "@/lib/su/mock-store";
import type { SuEkBakiyeKayit } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export type { SuEkBakiyeKayit };
export { suDemoEkBakiyeTurleri as suEkBakiyeTurleri };

export function getSuEkBakiyeListesi(): SuEkBakiyeKayit[] {
  return suMockStore.ekBakiyeler;
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
  suMockStore.ekBakiyeler.unshift(kayit);
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Ek Bakiye Girişi", yeniDeger: String(input.tutar), aciklama: input.aboneNo });
  return kayit;
}

export function duzeltSuEkBakiye(id: string, yeniTutar: number, gerekce: string, kullanici: string): SuEkBakiyeKayit | null {
  const kayit = suMockStore.ekBakiyeler.find((k) => k.id === id);
  if (!kayit) return null;
  const eski = kayit.tutar;
  kayit.tutar = yeniTutar;
  kayit.durum = "duzeltildi";
  kaydetSuAudit({ kullanici, islem: "Ek Bakiye Düzeltme", eskiDeger: String(eski), yeniDeger: String(yeniTutar), gerekce, aciklama: kayit.aboneNo });
  return kayit;
}
