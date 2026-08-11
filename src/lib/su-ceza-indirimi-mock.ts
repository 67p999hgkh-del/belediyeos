import { suMockStore } from "@/lib/su/mock-store";
import type { SuCezaBasvuru, SuCezaBorc } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export type { SuCezaBasvuru, SuCezaBorc };

export function getSuCezaBasvurular(): SuCezaBasvuru[] {
  return suMockStore.cezaBasvurular;
}

export function getSuCezaBasvuru(id: string): SuCezaBasvuru | undefined {
  return suMockStore.cezaBasvurular.find((b) => b.id === id);
}

export function getSuCezaBorclari(aboneNo: string): SuCezaBorc[] {
  const normalized = aboneNo.replace(/\s/g, "");
  return suMockStore.cezaBorclari[normalized] ?? suMockStore.cezaBorclari[aboneNo] ?? [];
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
    basvuruNo: `CI-2026-${String(suMockStore.cezaBasvurular.length + 13).padStart(4, "0")}`,
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
  suMockStore.cezaBasvurular.unshift(basvuru);
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Ceza İndirimi Başvurusu", yeniDeger: `%${input.indirimOrani}`, gerekce: input.gerekce, aciklama: input.aboneNo });
  return basvuru;
}

export function getSuCezaOdemeEkstre(basvuruId: string) {
  const b = getSuCezaBasvuru(basvuruId);
  if (!b) return null;
  return {
    basvuruNo: b.basvuruNo,
    aboneNo: b.aboneNo,
    satirlar: getSuCezaBorclari(b.aboneNo).map((x) => ({ donem: x.donem, borc: x.tutar, ceza: x.ceza })),
    indirim: b.indirimTutar,
    yeniToplam: b.yeniBorc,
  };
}

export function getSuCezaTaahhutname(basvuruId: string) {
  const b = getSuCezaBasvuru(basvuruId);
  if (!b) return null;
  return { basvuruNo: b.basvuruNo, aboneNo: b.aboneNo, adSoyad: b.adSoyad, indirimOrani: b.indirimOrani, yeniBorc: b.yeniBorc, tarih: b.basvuruTarihi };
}
