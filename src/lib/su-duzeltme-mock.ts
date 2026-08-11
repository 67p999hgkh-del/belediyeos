import { suMockStore } from "@/lib/su/mock-store";
import type { SuDuzeltmeTur } from "@/lib/su/types";
import { getSuAboneByAboneNo } from "./su-abone-mock";
import { kaydetSuAudit } from "./su-audit";

export type { SuDuzeltmeTur };

export interface SuDuzeltmeTurConfig {
  id: SuDuzeltmeTur;
  label: string;
  alanlar: { key: string; label: string }[];
}

export const suDuzeltmeTurleri: SuDuzeltmeTurConfig[] = [
  { id: "fatura-duzeltme", label: "Fatura Düzeltme", alanlar: [{ key: "faturaNo", label: "Fatura No" }, { key: "tutar", label: "Tutar" }, { key: "sonOdeme", label: "Son Ödeme Tarihi" }] },
  { id: "abone-duzeltme", label: "Abone Düzeltme", alanlar: [{ key: "adSoyad", label: "Adı Soyadı" }, { key: "adres", label: "Adres" }, { key: "tarife", label: "Tarife Grubu" }] },
  { id: "sayac-okuma-duzeltme", label: "Sayaç Okuma Düzeltme", alanlar: [{ key: "sayacNo", label: "Sayaç No" }, { key: "okuma", label: "Okuma Değeri" }, { key: "donem", label: "Dönem" }] },
  { id: "tahakkuk-duzeltme", label: "Tahakkuk Düzeltme", alanlar: [{ key: "donem", label: "Dönem" }, { key: "tahakkukTutar", label: "Tahakkuk Tutarı" }, { key: "aboneSayisi", label: "Abone Sayısı" }] },
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

export function getSuDuzeltmeKayitlari(): SuDuzeltmeKayit[] {
  return suMockStore.duzeltmeKayitlari;
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
  const kayit: SuDuzeltmeKayit = { id: `d-${Date.now()}`, ...input, tarih: new Date().toLocaleString("tr-TR") };
  suMockStore.duzeltmeKayitlari.unshift(kayit);
  kaydetSuAudit({ kullanici: input.kullanici, islem: turLabel, eskiDeger: input.eskiDeger, yeniDeger: input.yeniDeger, gerekce: input.gerekce, aciklama: `${input.aboneNo} — ${input.referans}` });
  return kayit;
}

export function bulSuDuzeltmeReferans(tur: SuDuzeltmeTur, arama: string): { referans: string; eski: Record<string, string> } | null {
  if (!arama.trim()) return null;
  const abone = getSuAboneByAboneNo(arama) ?? suMockStore.aboneler.find((a) => a.sicilNo.includes(arama) || a.aboneNo.includes(arama));
  if (tur === "fatura-duzeltme") {
    const f = suMockStore.faturalar.find((x) => x.faturaNo.includes(arama) || x.aboneNo.includes(arama));
    if (!f) return null;
    return { referans: f.faturaNo, eski: { faturaNo: f.faturaNo, tutar: String(f.tutar), sonOdeme: f.sonOdeme } };
  }
  if (tur === "abone-duzeltme" && abone) {
    return { referans: abone.aboneNo, eski: { adSoyad: abone.adSoyad, adres: abone.adres, tarife: abone.tarifeGrubu } };
  }
  if (tur === "sayac-okuma-duzeltme") {
    const o = suMockStore.okumalar.find((x) => x.aboneNo.includes(arama) || x.sayacNo.includes(arama));
    if (!o) return null;
    return { referans: "2026/1", eski: { sayacNo: o.sayacNo, okuma: String(o.yeniOkuma), donem: "2026/1" } };
  }
  if (tur === "tahakkuk-duzeltme") {
    const t = suMockStore.tahakkuklar[0];
    if (!t) return null;
    return { referans: `${t.yil}/${t.donem}`, eski: { donem: `${t.yil}/${t.donem}`, tahakkukTutar: String(t.tahakkukTutar), aboneSayisi: String(t.aboneSayisi) } };
  }
  return null;
}
