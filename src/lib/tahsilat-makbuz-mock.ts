export interface MakbuzDetaySatir {
  id: string;
  tahsilatTuru: string;
  cariDonem: string;
  bakiye: number;
  gecikmeZammi: number;
  kdv: number;
}

export interface MakbuzKayit {
  makbuzNo: string;
  tarih: string;
  mustahlikNo: string;
  adSoyad: string;
  adres: string;
  cekNo: string;
  tahsildar: string;
  aciklama: string;
  satirlar: MakbuzDetaySatir[];
}

export type MakbuzAramaDurumu = "idle" | "loading" | "bulundu" | "bulunamadi" | "hata";

export type MakbuzYazdirDurumu = "idle" | "loading" | "basarili" | "hata";

const mockMakbuzlar: Record<string, MakbuzKayit> = {
  "2026001245": {
    makbuzNo: "2026001245",
    tarih: "11.08.2026",
    mustahlikNo: "00124578",
    adSoyad: "Mehmet Demir",
    adres: "Erenköy Mah. Atatürk Cad. No:12, Karpaz",
    cekNo: "—",
    tahsildar: "Ayşe Yılmaz",
    aciklama: "Su ve emlak tahsilatı — vezne gişe 1",
    satirlar: [
      {
        id: "s1",
        tahsilatTuru: "Su Bedeli",
        cariDonem: "2026/1",
        bakiye: 420,
        gecikmeZammi: 0,
        kdv: 0,
      },
      {
        id: "s2",
        tahsilatTuru: "Su Bedeli",
        cariDonem: "2025/4",
        bakiye: 380,
        gecikmeZammi: 38,
        kdv: 0,
      },
      {
        id: "s3",
        tahsilatTuru: "Emlak Vergisi",
        cariDonem: "2026/1",
        bakiye: 1250,
        gecikmeZammi: 0,
        kdv: 0,
      },
    ],
  },
  "2026000891": {
    makbuzNo: "2026000891",
    tarih: "10.08.2026",
    mustahlikNo: "00891234",
    adSoyad: "Zeynep Aksoy",
    adres: "Yeni Mah. Liman Sok. No:5 D:3",
    cekNo: "—",
    tahsildar: "Ayşe Yılmaz",
    aciklama: "",
    satirlar: [
      {
        id: "s4",
        tahsilatTuru: "İşyeri Vergisi",
        cariDonem: "2026/1",
        bakiye: 2100,
        gecikmeZammi: 0,
        kdv: 0,
      },
    ],
  },
  MK458921: {
    makbuzNo: "MK-458921",
    tarih: "11.08.2026",
    mustahlikNo: "00452100",
    adSoyad: "Ali Yılmaz Tic. Ltd. Şti.",
    adres: "Merkez Mah. Belediye Cad. No:28",
    cekNo: "CHK-7721",
    tahsildar: "Mehmet Kaya",
    aciklama: "Ruhsat harcı — çek ile tahsilat",
    satirlar: [
      {
        id: "s5",
        tahsilatTuru: "İşyeri Ruhsat Harcı",
        cariDonem: "2026/1",
        bakiye: 850,
        gecikmeZammi: 42.5,
        kdv: 0,
      },
    ],
  },
};

function normalizeMakbuzNo(value: string) {
  return value.trim().toUpperCase().replace(/\s/g, "");
}

function eslesenAnahtar(query: string): string | undefined {
  const q = normalizeMakbuzNo(query);
  if (!q) return undefined;

  if (mockMakbuzlar[q]) return q;

  const digits = q.replace(/\D/g, "");
  if (mockMakbuzlar[digits]) return digits;

  return Object.keys(mockMakbuzlar).find(
    (k) =>
      normalizeMakbuzNo(k) === q ||
      k.replace(/\D/g, "") === digits ||
      k.toUpperCase().includes(q),
  );
}

export function araMakbuz(query: string): MakbuzKayit | null {
  const key = eslesenAnahtar(query);
  if (!key) return null;
  return mockMakbuzlar[key];
}

export function hesaplaMakbuzToplam(satirlar: MakbuzDetaySatir[]): number {
  return satirlar.reduce((sum, s) => sum + s.bakiye + s.gecikmeZammi + s.kdv, 0);
}
