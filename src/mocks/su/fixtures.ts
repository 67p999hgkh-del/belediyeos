/**
 * Su modülü demo fixture verileri — production state DEĞİLDİR.
 * Development/test ortamında mock repository tarafından yüklenir.
 */

import type { SuAboneBelge, SuAboneFatura, SuAboneHareket, SuAboneKayit } from "@/lib/su/types";

export const FIXTURE_ABONELER: SuAboneKayit[] = [
  {
    id: "a1",
    aboneNo: "12-34-56-78",
    sicilNo: "SU-004521",
    adSoyad: "Demo Abone 1",
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
    adSoyad: "Demo Abone 2",
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
    adSoyad: "Demo Ticari Abone",
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

export const FIXTURE_ABONE_FATURALAR: Record<string, SuAboneFatura[]> = {
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

export const FIXTURE_ABONE_HAREKETLER: Record<string, SuAboneHareket[]> = {
  a1: [
    { id: "h1", tarih: "11.08.2026", islem: "Tahsilat", tutar: -420, aciklama: "Vezne — Makbuz 2026001245" },
    { id: "h2", tarih: "01.07.2026", islem: "Fatura", tutar: 420, aciklama: "2026/1 dönem su bedeli" },
  ],
};

export const FIXTURE_ABONE_BELGELER: Record<string, SuAboneBelge[]> = {
  a1: [{ id: "b1", tur: "Taahhütname", tarih: "12.01.2024", aciklama: "Abonelik taahhütnamesi" }],
};
