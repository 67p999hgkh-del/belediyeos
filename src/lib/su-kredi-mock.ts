import { suKrediRaporTurleri } from "@/lib/su/config";
import { suMockStore } from "@/lib/su/mock-store";
import type { SuKrediGeriOdeme, SuKrediKayit } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export type { SuKrediGeriOdeme, SuKrediKayit };

export { suKrediRaporTurleri };

export function getSuKrediListesi(): SuKrediKayit[] {
  return suMockStore.krediler;
}

export function getSuKrediGeriOdemeler(): SuKrediGeriOdeme[] {
  return suMockStore.geriOdemeler;
}

export function getSuKrediByAboneNo(aboneNo: string): SuKrediKayit | undefined {
  return suMockStore.krediler.find((k) => k.aboneNo === aboneNo);
}

export function kaydetSuKrediGeriOdeme(input: {
  aboneNo: string;
  tutar: number;
  kullanici: string;
}): SuKrediGeriOdeme {
  const odeme: SuKrediGeriOdeme = {
    id: `go-${Date.now()}`,
    aboneNo: input.aboneNo,
    tutar: input.tutar,
    tarih: new Date().toLocaleDateString("tr-TR"),
    makbuzNo: `2026${String(suMockStore.geriOdemeler.length + 1200).padStart(6, "0")}`,
  };
  suMockStore.geriOdemeler.unshift(odeme);
  const kredi = suMockStore.krediler.find((k) => k.aboneNo === input.aboneNo);
  if (kredi) {
    kredi.sonIslem = odeme.tarih;
  }
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: "Kredi Geri Ödeme",
    yeniDeger: String(input.tutar),
    aciklama: input.aboneNo,
  });
  return odeme;
}

export function getSuKrediRapor(tur: string, yil: number, donem: number) {
  if (tur === "donem") {
    return suMockStore.krediler.map((k) => ({
      aboneNo: k.aboneNo,
      adSoyad: k.adSoyad,
      sonIslem: k.sonIslem,
      donem: `${yil}/${donem}`,
      durum: k.durum,
    }));
  }
  return suMockStore.geriOdemeler.map((g) => ({
    aboneNo: g.aboneNo,
    tutar: g.tutar,
    tarih: g.tarih,
    makbuzNo: g.makbuzNo,
  }));
}
