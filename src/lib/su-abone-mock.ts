/** @deprecated Import from @/lib/su/types */
export type {
  SuAboneBelge,
  SuAboneDurum,
  SuAboneFatura,
  SuAboneHareket,
  SuAboneKayit,
} from "@/lib/su/types";

import { suDemoAbonelikTurleri, suDemoTarifeGruplari } from "@/lib/su/config";
import { suMockStore } from "@/lib/su/mock-store";
import type { SuAboneBelge, SuAboneFatura, SuAboneHareket, SuAboneKayit } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export { suDemoAbonelikTurleri as suAbonelikTurleri, suDemoTarifeGruplari as suTarifeGruplari };

function normalizeAboneNo(value: string) {
  return value.replace(/\D/g, "");
}

export function formatAboneNo(parts: string[]): string {
  return parts.filter(Boolean).join("-") || "";
}

export function parseAboneNo(value: string): string[] {
  const digits = normalizeAboneNo(value);
  if (!digits) return ["", "", "", ""];
  const p: string[] = digits.match(/.{1,2}/g) ?? [];
  while (p.length < 4) p.push("");
  return p.slice(0, 4);
}

export function araSuAbone(query: {
  aboneNo?: string;
  sicilNo?: string;
  adSoyad?: string;
  kimlikNo?: string;
  sayacNo?: string;
  adres?: string;
}): SuAboneKayit[] {
  const aboneQ = normalizeAboneNo(query.aboneNo ?? "");
  const adQ = (query.adSoyad ?? "").trim().toLocaleLowerCase("tr");

  return suMockStore.aboneler.filter((a) => {
    if (aboneQ && !normalizeAboneNo(a.aboneNo).includes(aboneQ)) return false;
    if (query.sicilNo && !a.sicilNo.toLocaleLowerCase("tr").includes(query.sicilNo.toLocaleLowerCase("tr"))) return false;
    if (adQ && !a.adSoyad.toLocaleLowerCase("tr").includes(adQ)) return false;
    if (query.kimlikNo && !a.kimlikNo.includes(query.kimlikNo) && !(a.vergiNo?.includes(query.kimlikNo) ?? false)) return false;
    if (query.sayacNo && !a.sayacNo.toLocaleLowerCase("tr").includes(query.sayacNo.toLocaleLowerCase("tr"))) return false;
    if (query.adres && !a.adres.toLocaleLowerCase("tr").includes(query.adres.toLocaleLowerCase("tr"))) return false;
    return true;
  });
}

export function getSuAboneById(id: string): SuAboneKayit | undefined {
  return suMockStore.aboneler.find((a) => a.id === id);
}

export function getSuAboneByAboneNo(aboneNo: string): SuAboneKayit | undefined {
  const q = normalizeAboneNo(aboneNo);
  return suMockStore.aboneler.find((a) => normalizeAboneNo(a.aboneNo) === q);
}

export function getSuAboneFaturalar(aboneId: string): SuAboneFatura[] {
  return suMockStore.aboneFaturalar[aboneId] ?? [];
}

export function getSuAboneHareketler(aboneId: string): SuAboneHareket[] {
  return suMockStore.aboneHareketler[aboneId] ?? [];
}

export function getSuAboneBelgeler(aboneId: string): SuAboneBelge[] {
  return suMockStore.aboneBelgeler[aboneId] ?? [];
}

export function kaydetSuAbone(input: {
  aboneNo: string;
  adSoyad: string;
  kimlikNo: string;
  adres: string;
  telefon: string;
  abonelikTuru: string;
  tarifeGrubu: string;
  sayacNo: string;
  aciklama?: string;
}): SuAboneKayit {
  const kayit: SuAboneKayit = {
    id: `a-${Date.now()}`,
    aboneNo: input.aboneNo,
    sicilNo: `S-${input.aboneNo.replace(/-/g, "")}`,
    adSoyad: input.adSoyad,
    kimlikNo: input.kimlikNo,
    adres: input.adres,
    telefon: input.telefon,
    abonelikTuru: input.abonelikTuru,
    tarifeGrubu: input.tarifeGrubu,
    durum: "aktif",
    sayacNo: input.sayacNo,
    sonOkuma: "0",
    sonOkumaTarihi: new Date().toLocaleDateString("tr-TR"),
    guncelBorc: 0,
    bakiye: 0,
    aciklama: input.aciklama,
  };
  suMockStore.aboneler.push(kayit);
  return kayit;
}

export function guncelleSuAboneDurum(
  aboneNo: string,
  yeniDurum: SuAboneKayit["durum"],
  gerekce: string,
  kullanici: string,
): SuAboneKayit | null {
  const abone = getSuAboneByAboneNo(aboneNo);
  if (!abone) return null;
  const eski = abone.durum;
  abone.durum = yeniDurum;
  kaydetSuAudit({
    kullanici,
    islem: yeniDurum === "kapali" ? "Abone Kapama" : "Abone Açma",
    eskiDeger: eski,
    yeniDeger: yeniDurum,
    gerekce,
    aciklama: aboneNo,
  });
  return abone;
}

export function devirSuAbone(
  aboneNo: string,
  yeniAdSoyad: string,
  yeniAdres: string,
  gerekce: string,
  kullanici: string,
): SuAboneKayit | null {
  const abone = getSuAboneByAboneNo(aboneNo);
  if (!abone) return null;
  const eski = `${abone.adSoyad} / ${abone.adres}`;
  abone.adSoyad = yeniAdSoyad;
  abone.adres = yeniAdres;
  kaydetSuAudit({
    kullanici,
    islem: "Abone Devir / Nakil",
    eskiDeger: eski,
    yeniDeger: `${yeniAdSoyad} / ${yeniAdres}`,
    gerekce,
    aciklama: aboneNo,
  });
  return abone;
}

export function guncelleSuAboneSayac(
  aboneNo: string,
  yeniSayacNo: string,
  kullanici: string,
): SuAboneKayit | null {
  const abone = getSuAboneByAboneNo(aboneNo);
  if (!abone) return null;
  const eski = abone.sayacNo;
  abone.sayacNo = yeniSayacNo;
  kaydetSuAudit({ kullanici, islem: "Sayaç Bağlama / Değiştirme", eskiDeger: eski, yeniDeger: yeniSayacNo, aciklama: aboneNo });
  return abone;
}

export function degistirSuAboneNo(
  eskiAboneNo: string,
  yeniAboneNo: string,
  kullanici: string,
): SuAboneKayit | null {
  const abone = getSuAboneByAboneNo(eskiAboneNo);
  if (!abone) return null;
  abone.aboneNo = yeniAboneNo;
  kaydetSuAudit({ kullanici, islem: "Abone No Değiştirme", eskiDeger: eskiAboneNo, yeniDeger: yeniAboneNo, aciklama: eskiAboneNo });
  return abone;
}
