/** Su fatura workspace — fixture veri katmanı */

export interface SuDonemConfig {
  yillar: number[];
  donemSayisi: number;
  aktifYil: number;
  aktifDonem: number;
}

export interface SuTahakkukKayit {
  id: string;
  yil: number;
  donem: number;
  aboneSayisi: number;
  tahakkukTutar: number;
  durum: "acik" | "kapali" | "taslak";
  olusturmaTarihi: string;
}

export interface SuSayacOkuma {
  id: string;
  aboneNo: string;
  adSoyad: string;
  sayacNo: string;
  oncekiOkuma: number;
  yeniOkuma: number;
  tuketim: number;
  okumaTarihi: string;
  durum: "girildi" | "aktarildi" | "faturalandi";
}

export interface SuFaturaKayit {
  id: string;
  faturaNo: string;
  aboneNo: string;
  adSoyad: string;
  donem: string;
  tuketim: number;
  tutar: number;
  sonOdeme: string;
  durum: "taslak" | "kesildi" | "odendi" | "iptal";
}

export interface SuEkHizmetBorc {
  id: string;
  aboneNo: string;
  adSoyad: string;
  gelirKodu: string;
  aciklama: string;
  tutar: number;
  donem: string;
}

export interface SuTankerKayit {
  id: string;
  aboneNo: string;
  adSoyad: string;
  tonaj: number;
  birimFiyat: number;
  tutar: number;
  tarih: string;
}

export const suDonemConfig: SuDonemConfig = {
  yillar: [2024, 2025, 2026],
  donemSayisi: 4,
  aktifYil: 2026,
  aktifDonem: 1,
};

export const suGelirKodlari = [
  { kod: "101", ad: "Su Bedeli" },
  { kod: "102", ad: "Kanalizasyon Bedeli" },
  { kod: "103", ad: "Atık Su Bedeli" },
  { kod: "199", ad: "Ek Hizmet" },
];

export const suRaporTurleri = [
  { id: "sayac-fatura", label: "Sayaç Okuma Bilgileri / Fatura Raporu" },
  { id: "donem-ozet", label: "Dönem Fatura Özeti" },
  { id: "tonaj-liste", label: "Kullanım Tonaj Listesi" },
];

const mockTahakkuklar: SuTahakkukKayit[] = [
  {
    id: "t1",
    yil: 2026,
    donem: 1,
    aboneSayisi: 2184,
    tahakkukTutar: 842000,
    durum: "acik",
    olusturmaTarihi: "01.07.2026",
  },
  {
    id: "t2",
    yil: 2025,
    donem: 4,
    aboneSayisi: 2170,
    tahakkukTutar: 798500,
    durum: "kapali",
    olusturmaTarihi: "01.04.2026",
  },
];

const mockOkumalar: SuSayacOkuma[] = [
  {
    id: "o1",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    sayacNo: "SC-88421",
    oncekiOkuma: 1240,
    yeniOkuma: 1258,
    tuketim: 18,
    okumaTarihi: "05.07.2026",
    durum: "girildi",
  },
  {
    id: "o2",
    aboneNo: "87-65-43-21",
    adSoyad: "Ayşe Kaya",
    sayacNo: "SC-44102",
    oncekiOkuma: 890,
    yeniOkuma: 905,
    tuketim: 15,
    okumaTarihi: "05.07.2026",
    durum: "aktarildi",
  },
  {
    id: "o3",
    aboneNo: "11-22-33-44",
    adSoyad: "Erenköy Site Yönetimi",
    sayacNo: "SC-99001",
    oncekiOkuma: 5420,
    yeniOkuma: 5510,
    tuketim: 90,
    okumaTarihi: "06.07.2026",
    durum: "faturalandi",
  },
];

const mockFaturalar: SuFaturaKayit[] = [
  {
    id: "f1",
    faturaNo: "SU-2026-00142",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    donem: "2026/1",
    tuketim: 18,
    tutar: 420,
    sonOdeme: "15.08.2026",
    durum: "kesildi",
  },
  {
    id: "f2",
    faturaNo: "SU-2026-00089",
    aboneNo: "87-65-43-21",
    adSoyad: "Ayşe Kaya",
    donem: "2026/1",
    tuketim: 15,
    tutar: 380,
    sonOdeme: "15.08.2026",
    durum: "kesildi",
  },
  {
    id: "f3",
    faturaNo: "SU-2026-00210",
    aboneNo: "11-22-33-44",
    adSoyad: "Erenköy Site Yönetimi",
    donem: "2026/1",
    tuketim: 90,
    tutar: 2100,
    sonOdeme: "30.08.2026",
    durum: "kesildi",
  },
  {
    id: "f4",
    faturaNo: "SU-2026-00155",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    donem: "2026/1",
    tuketim: 18,
    tutar: 420,
    sonOdeme: "15.08.2026",
    durum: "taslak",
  },
];

const mockEkHizmet: SuEkHizmetBorc[] = [
  {
    id: "e1",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    gelirKodu: "199",
    aciklama: "Sayaç söküm-takım",
    tutar: 150,
    donem: "2026/1",
  },
];

const mockTanker: SuTankerKayit[] = [
  {
    id: "tk1",
    aboneNo: "11-22-33-44",
    adSoyad: "Erenköy Site Yönetimi",
    tonaj: 12,
    birimFiyat: 85,
    tutar: 1020,
    tarih: "08.07.2026",
  },
];

export function formatDonem(yil: number, donem: number): string {
  return `${yil}/${donem}`;
}

export function getSuTahakkuklar(yil: number, donem: number): SuTahakkukKayit[] {
  return mockTahakkuklar.filter((t) => t.yil === yil && t.donem === donem);
}

export function getSuSayacOkumalar(yil: number, donem: number): SuSayacOkuma[] {
  const d = formatDonem(yil, donem);
  return mockOkumalar.filter((o) => o.okumaTarihi.includes(String(yil)) || d.startsWith(String(yil)));
}

export function getSuFaturaListesi(yil: number, donem: number): SuFaturaKayit[] {
  const d = formatDonem(yil, donem);
  return mockFaturalar.filter((f) => f.donem === d);
}

export function getSuEkHizmetBorclari(yil: number, donem: number): SuEkHizmetBorc[] {
  const d = formatDonem(yil, donem);
  return mockEkHizmet.filter((e) => e.donem === d);
}

export function getSuTankerKayitlari(): SuTankerKayit[] {
  return mockTanker;
}

export function getSuRaporSonuc(tur: string, yil: number, donem: number) {
  const d = formatDonem(yil, donem);
  if (tur === "sayac-fatura") {
    return mockOkumalar.map((o) => ({
      aboneNo: o.aboneNo,
      adSoyad: o.adSoyad,
      tuketim: o.tuketim,
      tutar: o.tuketim * 23.5,
      donem: d,
    }));
  }
  if (tur === "donem-ozet") {
    const faturalar = getSuFaturaListesi(yil, donem);
    return [
      {
        donem: d,
        faturaSayisi: faturalar.length,
        toplamTutar: faturalar.reduce((s, f) => s + f.tutar, 0),
        toplamTuketim: faturalar.reduce((s, f) => s + f.tuketim, 0),
      },
    ];
  }
  return mockOkumalar.map((o) => ({
    aboneNo: o.aboneNo,
    adSoyad: o.adSoyad,
    tonaj: o.tuketim,
    donem: d,
  }));
}
