export type SuAboneDurum = "aktif" | "kapali" | "beklemede";

export interface SuAboneKayit {
  id: string;
  aboneNo: string;
  sicilNo: string;
  adSoyad: string;
  kimlikNo: string;
  vergiNo?: string;
  adres: string;
  telefon: string;
  eposta?: string;
  abonelikTuru: string;
  tarifeGrubu: string;
  durum: SuAboneDurum;
  sayacNo: string;
  sayacMarka?: string;
  sonOkuma: string;
  sonOkumaTarihi: string;
  guncelBorc: number;
  bakiye: number;
  aciklama?: string;
}

export interface SuAboneFatura {
  id: string;
  donem: string;
  faturaNo: string;
  tutar: number;
  sonOdeme: string;
  durum: "odenmedi" | "odendi" | "iptal";
}

export interface SuAboneHareket {
  id: string;
  tarih: string;
  islem: string;
  tutar: number;
  aciklama: string;
}

export interface SuAboneBelge {
  id: string;
  tur: string;
  tarih: string;
  aciklama: string;
}

const mockAboneler: SuAboneKayit[] = [
  {
    id: "a1",
    aboneNo: "12-34-56-78",
    sicilNo: "SU-004521",
    adSoyad: "Mehmet Demir",
    kimlikNo: "12345678901",
    adres: "Erenköy Mah. Atatürk Cad. No:12, Karpaz",
    telefon: "0532 111 22 33",
    abonelikTuru: "Konut",
    tarifeGrubu: "1. Grup",
    durum: "aktif",
    sayacNo: "SN-884521",
    sayacMarka: "Baylan",
    sonOkuma: "1245",
    sonOkumaTarihi: "01.07.2026",
    guncelBorc: 838,
    bakiye: 0,
  },
  {
    id: "a2",
    aboneNo: "87-65-43-21",
    sicilNo: "SU-002198",
    adSoyad: "Zeynep Aksoy",
    kimlikNo: "98765432109",
    adres: "Yeni Mah. Liman Sok. No:5 D:3",
    telefon: "0542 333 44 55",
    abonelikTuru: "Konut",
    tarifeGrubu: "2. Grup",
    durum: "aktif",
    sayacNo: "SN-772198",
    sonOkuma: "892",
    sonOkumaTarihi: "01.07.2026",
    guncelBorc: 420,
    bakiye: 50,
  },
  {
    id: "a3",
    aboneNo: "11-22-33-44",
    sicilNo: "SU-009876",
    adSoyad: "Ali Yılmaz Tic. Ltd. Şti.",
    kimlikNo: "",
    vergiNo: "1234567890",
    adres: "Merkez Mah. Belediye Cad. No:28",
    telefon: "0392 444 55 66",
    abonelikTuru: "Ticari",
    tarifeGrubu: "Ticari A",
    durum: "aktif",
    sayacNo: "SN-559876",
    sonOkuma: "4521",
    sonOkumaTarihi: "01.07.2026",
    guncelBorc: 2100,
    bakiye: 0,
  },
];

const mockFaturalar: Record<string, SuAboneFatura[]> = {
  a1: [
    { id: "f1", donem: "2026/1", faturaNo: "SU-2026-00142", tutar: 420, sonOdeme: "15.08.2026", durum: "odenmedi" },
    { id: "f2", donem: "2025/4", faturaNo: "SU-2025-00418", tutar: 418, sonOdeme: "15.12.2025", durum: "odenmedi" },
  ],
  a2: [
    { id: "f3", donem: "2026/1", faturaNo: "SU-2026-00089", tutar: 380, sonOdeme: "15.08.2026", durum: "odenmedi" },
  ],
  a3: [
    { id: "f4", donem: "2026/1", faturaNo: "SU-2026-00210", tutar: 2100, sonOdeme: "30.08.2026", durum: "odenmedi" },
  ],
};

const mockHareketler: Record<string, SuAboneHareket[]> = {
  a1: [
    { id: "h1", tarih: "11.08.2026", islem: "Tahsilat", tutar: -420, aciklama: "Vezne — Makbuz 2026001245" },
    { id: "h2", tarih: "01.07.2026", islem: "Fatura", tutar: 420, aciklama: "2026/1 dönem su bedeli" },
  ],
};

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

  return mockAboneler.filter((a) => {
    if (aboneQ && !normalizeAboneNo(a.aboneNo).includes(aboneQ)) return false;
    if (query.sicilNo && !a.sicilNo.toLocaleLowerCase("tr").includes(query.sicilNo.toLocaleLowerCase("tr"))) {
      return false;
    }
    if (adQ && !a.adSoyad.toLocaleLowerCase("tr").includes(adQ)) return false;
    if (query.kimlikNo && !a.kimlikNo.includes(query.kimlikNo) && !(a.vergiNo?.includes(query.kimlikNo) ?? false)) {
      return false;
    }
    if (query.sayacNo && !a.sayacNo.toLocaleLowerCase("tr").includes(query.sayacNo.toLocaleLowerCase("tr"))) {
      return false;
    }
    if (query.adres && !a.adres.toLocaleLowerCase("tr").includes(query.adres.toLocaleLowerCase("tr"))) {
      return false;
    }
    return true;
  });
}

export function getSuAboneById(id: string): SuAboneKayit | undefined {
  return mockAboneler.find((a) => a.id === id);
}

export function getSuAboneByAboneNo(aboneNo: string): SuAboneKayit | undefined {
  const q = normalizeAboneNo(aboneNo);
  return mockAboneler.find((a) => normalizeAboneNo(a.aboneNo) === q);
}

export function getSuAboneFaturalar(aboneId: string): SuAboneFatura[] {
  return mockFaturalar[aboneId] ?? [];
}

export function getSuAboneHareketler(aboneId: string): SuAboneHareket[] {
  return mockHareketler[aboneId] ?? [];
}

export function getSuAboneBelgeler(aboneId: string): SuAboneBelge[] {
  if (aboneId === "a1") {
    return [{ id: "b1", tur: "Taahhütname", tarih: "12.01.2024", aciklama: "Abonelik taahhütnamesi" }];
  }
  return [];
}

export const suAbonelikTurleri = ["Konut", "Ticari", "Kamu", "Tarimsal"];
export const suTarifeGruplari = ["1. Grup", "2. Grup", "Ticari A", "Ticari B"];
