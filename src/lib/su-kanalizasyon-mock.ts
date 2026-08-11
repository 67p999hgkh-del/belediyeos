import { suMockStore } from "@/lib/su/mock-store";
import type { SuKanalBaglanti } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export type { SuKanalBaglanti };

export function getSuKanalBaglantilar(): SuKanalBaglanti[] {
  return suMockStore.kanalBaglantilar;
}

export function kaydetSuKanalBaglanti(input: {
  aboneNo: string;
  adSoyad: string;
  adres: string;
  kanalNo: string;
  aciklama?: string;
  kullanici: string;
}): SuKanalBaglanti {
  const kayit: SuKanalBaglanti = {
    id: `kn-${Date.now()}`,
    ...input,
    baglantiTarihi: new Date().toLocaleDateString("tr-TR"),
    durum: "aktif",
  };
  suMockStore.kanalBaglantilar.unshift(kayit);
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Kanalizasyon Bağlama", yeniDeger: input.kanalNo, aciklama: input.aboneNo });
  return kayit;
}
