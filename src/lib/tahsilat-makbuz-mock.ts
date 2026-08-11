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
  sicilNo: string;
  mustahlikNo: string;
  adSoyad: string;
  adres: string;
  aboneNo: string;
  emlakSicilNo: string;
  cekNo: string;
  tahsildar: string;
  aciklama: string;
  satirlar: MakbuzDetaySatir[];
}

export interface MakbuzAramaKriterleri {
  adSoyad: string;
  baslangicTarihi: string;
  bitisTarihi: string;
  tahsilatTuru: string;
  aboneNo: string;
  emlakSicilNo: string;
}

export interface MakbuzAramaSatir {
  id: string;
  sicilNo: string;
  adSoyad: string;
  makbuzNo: string;
  tarih: string;
  toplamCari: number;
  kayit: MakbuzKayit;
}

export type MakbuzAramaDurumu = "idle" | "loading" | "bulundu" | "bulunamadi" | "hata";

export type MakbuzYazdirDurumu = "idle" | "loading" | "basarili" | "hata";

export type MakbuzIslemDurumu = "idle" | "loading" | "basarili" | "hata";

const mockMakbuzlar: Record<string, MakbuzKayit> = {
  "2026001245": {
    makbuzNo: "2026001245",
    tarih: "11.08.2026",
    sicilNo: "SU-004521",
    mustahlikNo: "00124578",
    adSoyad: "Mehmet Demir",
    adres: "Erenköy Mah. Atatürk Cad. No:12, Karpaz",
    aboneNo: "12-34-56-78",
    emlakSicilNo: "EM-2024-112",
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
    sicilNo: "IS-002198",
    mustahlikNo: "00891234",
    adSoyad: "Zeynep Aksoy",
    adres: "Yeni Mah. Liman Sok. No:5 D:3",
    aboneNo: "87-65-43-21",
    emlakSicilNo: "EM-2019-088",
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
    sicilNo: "IS-009876",
    mustahlikNo: "00452100",
    adSoyad: "Ali Yılmaz Tic. Ltd. Şti.",
    adres: "Merkez Mah. Belediye Cad. No:28",
    aboneNo: "11-22-33-44",
    emlakSicilNo: "EM-2022-045",
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
  "2025003456": {
    makbuzNo: "2025003456",
    tarih: "15.03.2025",
    sicilNo: "SU-004521",
    mustahlikNo: "00124578",
    adSoyad: "Mehmet Demir",
    adres: "Erenköy Mah. Atatürk Cad. No:12, Karpaz",
    aboneNo: "12-34-56-78",
    emlakSicilNo: "EM-2024-112",
    cekNo: "—",
    tahsildar: "Fatma Öztürk",
    aciklama: "Su bedeli tahsilatı",
    satirlar: [
      {
        id: "s6",
        tahsilatTuru: "Su Bedeli",
        cariDonem: "2025/1",
        bakiye: 395,
        gecikmeZammi: 0,
        kdv: 0,
      },
    ],
  },
  "2026000444": {
    makbuzNo: "2026000444",
    tarih: "05.07.2026",
    sicilNo: "IS-002198",
    mustahlikNo: "00891234",
    adSoyad: "Zeynep Aksoy",
    adres: "Yeni Mah. Liman Sok. No:5 D:3",
    aboneNo: "87-65-43-21",
    emlakSicilNo: "EM-2019-088",
    cekNo: "—",
    tahsildar: "Ayşe Yılmaz",
    aciklama: "Emlak vergisi",
    satirlar: [
      {
        id: "s7",
        tahsilatTuru: "Emlak Vergisi",
        cariDonem: "2026/1",
        bakiye: 980,
        gecikmeZammi: 0,
        kdv: 0,
      },
    ],
  },
  "2026002100": {
    makbuzNo: "2026002100",
    tarih: "20.06.2026",
    sicilNo: "IS-009876",
    mustahlikNo: "00452100",
    adSoyad: "Ali Yılmaz Tic. Ltd. Şti.",
    adres: "Merkez Mah. Belediye Cad. No:28",
    aboneNo: "11-22-33-44",
    emlakSicilNo: "EM-2022-045",
    cekNo: "—",
    tahsildar: "Mehmet Kaya",
    aciklama: "İşyeri vergisi",
    satirlar: [
      {
        id: "s8",
        tahsilatTuru: "İşyeri Vergisi",
        cariDonem: "2026/1",
        bakiye: 1850,
        gecikmeZammi: 92.5,
        kdv: 0,
      },
    ],
  },
};

function normalizeMakbuzNo(value: string) {
  return value.trim().toUpperCase().replace(/\s/g, "");
}

function parseTrDate(s: string): Date | null {
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

function parseIsoDate(s: string): Date | null {
  if (!s) return null;
  const d = new Date(s + "T12:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

function normalizeAbone(value: string) {
  return value.replace(/\D/g, "");
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

export function getTahsilatTurleri(): { id: string; label: string }[] {
  const turler = new Set<string>();
  Object.values(mockMakbuzlar).forEach((k) => {
    k.satirlar.forEach((s) => turler.add(s.tahsilatTuru));
  });
  return [
    { id: "tumu", label: "Tümü" },
    ...Array.from(turler)
      .sort((a, b) => a.localeCompare(b, "tr"))
      .map((t) => ({ id: t, label: t })),
  ];
}

function makbuzToSatir(kayit: MakbuzKayit): MakbuzAramaSatir {
  return {
    id: kayit.makbuzNo,
    sicilNo: kayit.sicilNo,
    adSoyad: kayit.adSoyad,
    makbuzNo: kayit.makbuzNo,
    tarih: kayit.tarih,
    toplamCari: hesaplaMakbuzToplam(kayit.satirlar),
    kayit,
  };
}

export function kriterBosMu(kriter: MakbuzAramaKriterleri): boolean {
  return (
    !kriter.adSoyad.trim() &&
    !kriter.baslangicTarihi &&
    !kriter.bitisTarihi &&
    kriter.tahsilatTuru === "tumu" &&
    !normalizeAbone(kriter.aboneNo) &&
    !kriter.emlakSicilNo.trim()
  );
}

export function tarihAraligiGecersiz(baslangic: string, bitis: string): boolean {
  const b = parseIsoDate(baslangic);
  const e = parseIsoDate(bitis);
  if (!b || !e) return false;
  return b > e;
}

export function araMakbuzlar(kriter: MakbuzAramaKriterleri): MakbuzAramaSatir[] {
  const adQ = kriter.adSoyad.trim().toLocaleLowerCase("tr");
  const aboneQ = normalizeAbone(kriter.aboneNo);
  const emlakQ = kriter.emlakSicilNo.trim().toLocaleLowerCase("tr");
  const baslangic = parseIsoDate(kriter.baslangicTarihi);
  const bitis = parseIsoDate(kriter.bitisTarihi);

  return Object.values(mockMakbuzlar)
    .filter((kayit) => {
      if (adQ && !kayit.adSoyad.toLocaleLowerCase("tr").includes(adQ)) return false;

      if (aboneQ && !normalizeAbone(kayit.aboneNo).includes(aboneQ)) return false;

      if (emlakQ && !kayit.emlakSicilNo.toLocaleLowerCase("tr").includes(emlakQ)) {
        return false;
      }

      if (kriter.tahsilatTuru !== "tumu") {
        const eslesenTur = kayit.satirlar.some((s) => s.tahsilatTuru === kriter.tahsilatTuru);
        if (!eslesenTur) return false;
      }

      const makbuzTarih = parseTrDate(kayit.tarih);
      if (makbuzTarih && baslangic && makbuzTarih < baslangic) return false;
      if (makbuzTarih && bitis && makbuzTarih > bitis) return false;

      return true;
    })
    .sort((a, b) => {
      const da = parseTrDate(a.tarih)?.getTime() ?? 0;
      const db = parseTrDate(b.tarih)?.getTime() ?? 0;
      return db - da;
    })
    .map(makbuzToSatir);
}
