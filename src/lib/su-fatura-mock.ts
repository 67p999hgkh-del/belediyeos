/** Su fatura — mock repository (production: backend adapter) */

export type {
  SuEkHizmetBorc,
  SuFaturaKayit,
  SuSayacOkuma,
  SuTahakkukKayit,
  SuTankerKayit,
} from "@/lib/su/types";

import {
  formatDonem,
  suDonemConfig,
  suGelirKodlari,
  suKrediRaporTurleri,
  suRaporTurleri,
} from "@/lib/su/config";
import { SU_DEMO_BIRIM_FIYAT, suMockStore } from "@/lib/su/mock-store";
import type { SuFaturaKayit, SuSayacOkuma, SuTahakkukKayit } from "@/lib/su/types";
import { getSuAboneByAboneNo } from "./su-abone-mock";
import { kaydetSuAudit } from "./su-audit";

export { formatDonem, suDonemConfig, suGelirKodlari, suRaporTurleri };
export { suKrediRaporTurleri };

export function getSuTahakkuklar(yil: number, donem: number): SuTahakkukKayit[] {
  return suMockStore.tahakkuklar.filter((t) => t.yil === yil && t.donem === donem);
}

export function olusturSuTahakkuk(yil: number, donem: number, kullanici: string): SuTahakkukKayit {
  const mevcut = getSuTahakkuklar(yil, donem);
  if (mevcut.some((t) => t.durum === "acik")) {
    return mevcut.find((t) => t.durum === "acik")!;
  }
  const kayit: SuTahakkukKayit = {
    id: `t-${Date.now()}`,
    yil,
    donem,
    aboneSayisi: suMockStore.aboneler.filter((a) => a.durum === "aktif").length,
    tahakkukTutar: suMockStore.okumalar.reduce((s, o) => s + o.tuketim * SU_DEMO_BIRIM_FIYAT, 0),
    durum: "acik",
    olusturmaTarihi: new Date().toLocaleDateString("tr-TR"),
  };
  suMockStore.tahakkuklar.unshift(kayit);
  kaydetSuAudit({ kullanici, islem: "Tahakkuk Oluştur", aciklama: formatDonem(yil, donem) });
  return kayit;
}

export function kontrolSuTahakkuk(yil: number, donem: number): { ok: boolean; mesaj: string; kayit?: SuTahakkukKayit } {
  const liste = getSuTahakkuklar(yil, donem);
  if (liste.length === 0) return { ok: false, mesaj: "Bu dönem için tahakkuk kaydı bulunamadı." };
  const acik = liste.find((t) => t.durum === "acik");
  if (!acik) return { ok: false, mesaj: "Açık tahakkuk bulunamadı." };
  return { ok: true, mesaj: `${acik.aboneSayisi} abone, ${acik.tahakkukTutar.toLocaleString("tr-TR")} ₺`, kayit: acik };
}

export function getSuSayacOkumalar(yil: number, donem: number): SuSayacOkuma[] {
  const d = formatDonem(yil, donem);
  return suMockStore.okumalar.filter((o) => o.okumaTarihi.includes(String(yil)) || d.startsWith(String(yil)));
}

export function kaydetSuSayacOkuma(input: {
  aboneNo: string;
  oncekiOkuma: number;
  yeniOkuma: number;
  kullanici: string;
}): SuSayacOkuma {
  const abone = getSuAboneByAboneNo(input.aboneNo);
  const tuketim = Math.max(0, input.yeniOkuma - input.oncekiOkuma);
  const okuma: SuSayacOkuma = {
    id: `o-${Date.now()}`,
    aboneNo: input.aboneNo,
    adSoyad: abone?.adSoyad ?? "—",
    sayacNo: abone?.sayacNo ?? "—",
    oncekiOkuma: input.oncekiOkuma,
    yeniOkuma: input.yeniOkuma,
    tuketim,
    okumaTarihi: new Date().toLocaleDateString("tr-TR"),
    durum: "girildi",
  };
  suMockStore.okumalar.unshift(okuma);
  if (abone) {
    abone.sonOkuma = String(input.yeniOkuma);
    abone.sonOkumaTarihi = okuma.okumaTarihi;
  }
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Sayaç Okuma Girişi", yeniDeger: String(input.yeniOkuma), aciklama: input.aboneNo });
  return okuma;
}

export function degistirSuSayac(aboneNo: string, yeniSayacNo: string, kullanici: string): boolean {
  const abone = getSuAboneByAboneNo(aboneNo);
  if (!abone) return false;
  const eski = abone.sayacNo;
  abone.sayacNo = yeniSayacNo;
  kaydetSuAudit({ kullanici, islem: "Sayaç Değiştirme", eskiDeger: eski, yeniDeger: yeniSayacNo, aciklama: aboneNo });
  return true;
}

export function getSuFaturaListesi(yil: number, donem: number): SuFaturaKayit[] {
  const d = formatDonem(yil, donem);
  return suMockStore.faturalar.filter((f) => f.donem === d);
}

export function hesaplaSuTekilFatura(aboneNo: string, yil: number, donem: number, kullanici: string): SuFaturaKayit | null {
  const abone = getSuAboneByAboneNo(aboneNo);
  const okuma = suMockStore.okumalar.find((o) => o.aboneNo === aboneNo);
  if (!abone || !okuma) return null;
  const d = formatDonem(yil, donem);
  const mevcut = suMockStore.faturalar.find((f) => f.aboneNo === aboneNo && f.donem === d && f.durum === "taslak");
  if (mevcut) return mevcut;
  const fatura: SuFaturaKayit = {
    id: `f-${Date.now()}`,
    faturaNo: `SU-${yil}-${String(suMockStore.faturalar.length + 200).padStart(5, "0")}`,
    aboneNo,
    adSoyad: abone.adSoyad,
    donem: d,
    tuketim: okuma.tuketim,
    tutar: okuma.tuketim * SU_DEMO_BIRIM_FIYAT,
    sonOdeme: "15.08.2026",
    durum: "taslak",
  };
  suMockStore.faturalar.unshift(fatura);
  kaydetSuAudit({ kullanici, islem: "Tekil Fatura Hesaplama", yeniDeger: fatura.faturaNo, aciklama: aboneNo });
  return fatura;
}

export function kesSuFatura(faturaId: string, kullanici: string): SuFaturaKayit | null {
  const f = suMockStore.faturalar.find((x) => x.id === faturaId);
  if (!f || f.durum === "iptal") return null;
  f.durum = "kesildi";
  kaydetSuAudit({ kullanici, islem: "Fatura Kesme", yeniDeger: f.faturaNo, aciklama: f.aboneNo });
  return f;
}

export function iptalSuFatura(faturaId: string, kullanici: string): SuFaturaKayit | null {
  const f = suMockStore.faturalar.find((x) => x.id === faturaId);
  if (!f) return null;
  f.durum = "iptal";
  kaydetSuAudit({ kullanici, islem: "Fatura İptali", eskiDeger: f.faturaNo, aciklama: f.aboneNo });
  return f;
}

export function topluHesaplaSuFatura(yil: number, donem: number, kullanici: string): number {
  let say = 0;
  for (const o of getSuSayacOkumalar(yil, donem)) {
    if (hesaplaSuTekilFatura(o.aboneNo, yil, donem, kullanici)) say++;
  }
  kaydetSuAudit({ kullanici, islem: "Toplu Fatura Hesaplama", yeniDeger: String(say), aciklama: formatDonem(yil, donem) });
  return say;
}

export function topluKesSuFatura(yil: number, donem: number, kullanici: string): number {
  const d = formatDonem(yil, donem);
  let say = 0;
  for (const f of suMockStore.faturalar.filter((x) => x.donem === d && x.durum === "taslak")) {
    if (kesSuFatura(f.id, kullanici)) say++;
  }
  kaydetSuAudit({ kullanici, islem: "Toplu Fatura Kesme", yeniDeger: String(say), aciklama: d });
  return say;
}

export function getSuEkHizmetBorclari(yil: number, donem: number) {
  const d = formatDonem(yil, donem);
  return suMockStore.ekHizmetler.filter((e) => e.donem === d);
}

export function kaydetSuEkHizmetBorc(input: {
  aboneNo: string;
  gelirKodu: string;
  aciklama: string;
  tutar: number;
  donem: string;
  kullanici: string;
}) {
  const abone = getSuAboneByAboneNo(input.aboneNo);
  const kayit = {
    id: `e-${Date.now()}`,
    aboneNo: input.aboneNo,
    adSoyad: abone?.adSoyad ?? "—",
    gelirKodu: input.gelirKodu,
    aciklama: input.aciklama,
    tutar: input.tutar,
    donem: input.donem,
  };
  suMockStore.ekHizmetler.unshift(kayit);
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Ek Hizmet Borç Girişi", yeniDeger: String(input.tutar), aciklama: input.aboneNo });
  return kayit;
}

export function getSuTankerKayitlari() {
  return suMockStore.tankerKayitlari;
}

export function kaydetSuTankerKayit(input: {
  aboneNo: string;
  tonaj: number;
  birimFiyat: number;
  kullanici: string;
}) {
  const abone = getSuAboneByAboneNo(input.aboneNo);
  const kayit = {
    id: `tk-${Date.now()}`,
    aboneNo: input.aboneNo,
    adSoyad: abone?.adSoyad ?? "—",
    tonaj: input.tonaj,
    birimFiyat: input.birimFiyat,
    tutar: input.tonaj * input.birimFiyat,
    tarih: new Date().toLocaleDateString("tr-TR"),
  };
  suMockStore.tankerKayitlari.unshift(kayit);
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Tanker Taşıma", yeniDeger: String(kayit.tutar), aciklama: input.aboneNo });
  return kayit;
}

export function getSuRaporSonuc(tur: string, yil: number, donem: number) {
  const d = formatDonem(yil, donem);
  if (tur === "sayac-fatura") {
    return suMockStore.okumalar.map((o) => ({
      aboneNo: o.aboneNo,
      adSoyad: o.adSoyad,
      tuketim: o.tuketim,
      tutar: o.tuketim * SU_DEMO_BIRIM_FIYAT,
      donem: d,
    }));
  }
  if (tur === "donem-ozet") {
    const faturalar = getSuFaturaListesi(yil, donem);
    return [{
      donem: d,
      faturaSayisi: faturalar.length,
      toplamTutar: faturalar.reduce((s, f) => s + f.tutar, 0),
      toplamTuketim: faturalar.reduce((s, f) => s + f.tuketim, 0),
    }];
  }
  return suMockStore.okumalar.map((o) => ({
    aboneNo: o.aboneNo,
    adSoyad: o.adSoyad,
    tonaj: o.tuketim,
    donem: d,
  }));
}
