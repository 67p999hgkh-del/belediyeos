export type TahsilatAramaSekmesi = "su-isyeri" | "emlak" | "imar" | "kimlik";

export type TahsilatAramaDurumu = "idle" | "loading" | "bulundu" | "bulunamadi" | "hata";

export interface TahsilatSicil {
  adSoyad: string;
  adres: string;
  sicilNo: string;
  tcKimlik: string;
  vergiNo?: string;
  aboneNo: string;
  telefon: string;
  aktif: boolean;
  borcuVar: boolean;
  yapilandirmaVar: boolean;
  gecikmisBorc: boolean;
}

export interface TahsilatBorcRow {
  id: string;
  refNo: string;
  yil: number;
  donem: number;
  gelirKodu: string;
  gelirAdi: string;
  sonOdemeTarihi: string;
  anaPara: number;
  ceza: number;
  kdv: number;
  toplam: number;
}

export interface TahsilatAramaSonuc {
  sicil: TahsilatSicil;
  borclar: TahsilatBorcRow[];
  key: string;
}

export const sicilTipleri = [
  { id: "tumu", label: "Tümü" },
  { id: "su", label: "Su" },
  { id: "isyeri", label: "İşyeri" },
  { id: "emlak", label: "Emlak" },
  { id: "imar", label: "İmar" },
];

export const gelirKodlari = [
  { id: "tumu", label: "Tüm Gelir Kodları" },
  { id: "101", label: "101 — Su Bedeli" },
  { id: "201", label: "201 — Emlak Vergisi" },
  { id: "301", label: "301 — İşyeri Vergisi" },
  { id: "401", label: "401 — Ruhsat Harcı" },
];

const mockKayitlar: Record<string, TahsilatAramaSonuc> = {
  "12345678": {
    key: "12345678",
    sicil: {
      adSoyad: "Mehmet Demir",
      adres: "Erenköy Mah. Atatürk Cad. No:12, Karpaz",
      sicilNo: "SU-004521",
      tcKimlik: "12345678901",
      aboneNo: "12-34-56-78",
      telefon: "0532 111 22 33",
      aktif: true,
      borcuVar: true,
      yapilandirmaVar: false,
      gecikmisBorc: true,
    },
    borclar: [
      {
        id: "b1",
        refNo: "SU-2026-001",
        yil: 2026,
        donem: 1,
        gelirKodu: "101",
        gelirAdi: "Su Bedeli",
        sonOdemeTarihi: "15.03.2026",
        anaPara: 420,
        ceza: 0,
        kdv: 0,
        toplam: 420,
      },
      {
        id: "b2",
        refNo: "SU-2025-012",
        yil: 2025,
        donem: 4,
        gelirKodu: "101",
        gelirAdi: "Su Bedeli",
        sonOdemeTarihi: "15.12.2025",
        anaPara: 380,
        ceza: 38,
        kdv: 0,
        toplam: 418,
      },
      {
        id: "b3",
        refNo: "EM-2026-004",
        yil: 2026,
        donem: 1,
        gelirKodu: "201",
        gelirAdi: "Emlak Vergisi",
        sonOdemeTarihi: "31.05.2026",
        anaPara: 1250,
        ceza: 0,
        kdv: 0,
        toplam: 1250,
      },
    ],
  },
  "87654321": {
    key: "87654321",
    sicil: {
      adSoyad: "Zeynep Aksoy",
      adres: "Yeni Mah. Liman Sok. No:5 D:3",
      sicilNo: "IS-002198",
      tcKimlik: "98765432109",
      aboneNo: "87-65-43-21",
      telefon: "0542 333 44 55",
      aktif: true,
      borcuVar: true,
      yapilandirmaVar: false,
      gecikmisBorc: false,
    },
    borclar: [
      {
        id: "b4",
        refNo: "IS-2026-007",
        yil: 2026,
        donem: 1,
        gelirKodu: "301",
        gelirAdi: "İşyeri Vergisi",
        sonOdemeTarihi: "30.06.2026",
        anaPara: 2100,
        ceza: 0,
        kdv: 0,
        toplam: 2100,
      },
    ],
  },
  "11223344": {
    key: "11223344",
    sicil: {
      adSoyad: "Ali Yılmaz Tic. Ltd. Şti.",
      adres: "Merkez Mah. Belediye Cad. No:28",
      sicilNo: "IS-009876",
      tcKimlik: "",
      vergiNo: "1234567890",
      aboneNo: "11-22-33-44",
      telefon: "0392 444 55 66",
      aktif: true,
      borcuVar: true,
      yapilandirmaVar: true,
      gecikmisBorc: true,
    },
    borclar: [
      {
        id: "b5",
        refNo: "IM-2026-002",
        yil: 2026,
        donem: 1,
        gelirKodu: "401",
        gelirAdi: "İşyeri Ruhsat Harcı",
        sonOdemeTarihi: "20.04.2026",
        anaPara: 850,
        ceza: 42.5,
        kdv: 0,
        toplam: 892.5,
      },
    ],
  },
};

function normalizeKey(value: string) {
  return value.replace(/\D/g, "");
}

function parseTrDate(s: string): Date | null {
  const m = s.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]));
}

export function borcGecikmisMi(sonOdemeTarihi: string, refDate = new Date()): boolean {
  const d = parseTrDate(sonOdemeTarihi);
  if (!d) return false;
  return d < refDate;
}

function eslesenAnahtar(arama: string): string | undefined {
  const key = normalizeKey(arama);
  const q = arama.trim().toLocaleLowerCase("tr");
  if (!q && !key) return undefined;

  if (mockKayitlar[key]) return key;

  const byKey = Object.keys(mockKayitlar).find(
    (k) => k.startsWith(key) || key.startsWith(k),
  );
  if (byKey) return byKey;

  return Object.entries(mockKayitlar).find(([, v]) => {
    const s = v.sicil;
    return (
      s.adSoyad.toLocaleLowerCase("tr").includes(q) ||
      s.sicilNo.toLocaleLowerCase("tr").includes(q) ||
      s.tcKimlik.includes(key) ||
      (s.vergiNo?.includes(key) ?? false) ||
      s.aboneNo.replace(/-/g, "").includes(key) ||
      s.telefon.replace(/\D/g, "").includes(key)
    );
  })?.[0];
}

export function aramaSicil(arama: string): TahsilatAramaSonuc | null {
  const matchedKey = eslesenAnahtar(arama);
  if (!matchedKey) return null;
  return mockKayitlar[matchedKey];
}

export function globalArama(query: string): TahsilatAramaSonuc | null {
  return aramaSicil(query);
}

export function filtreleBorclar(
  borclar: TahsilatBorcRow[],
  opts: {
    sicilTipi: string;
    yil: string;
    donem: string;
    veOncesi: boolean;
    gelirKodu: string;
    refNo: string;
  },
): TahsilatBorcRow[] {
  return borclar.filter((b) => {
    if (
      opts.refNo &&
      !b.refNo.toLocaleLowerCase("tr").includes(opts.refNo.toLocaleLowerCase("tr"))
    ) {
      return false;
    }
    if (opts.gelirKodu !== "tumu" && b.gelirKodu !== opts.gelirKodu) return false;
    if (opts.yil !== "tumu" && b.yil !== Number(opts.yil)) {
      if (!opts.veOncesi || b.yil > Number(opts.yil)) return false;
    }
    if (opts.donem !== "tumu" && b.donem !== Number(opts.donem)) {
      if (!opts.veOncesi || b.donem > Number(opts.donem)) return false;
    }
    if (opts.sicilTipi === "su" && !b.gelirKodu.startsWith("1")) return false;
    if (opts.sicilTipi === "emlak" && !b.gelirKodu.startsWith("2")) return false;
    if (opts.sicilTipi === "isyeri" && !b.gelirKodu.startsWith("3")) return false;
    if (opts.sicilTipi === "imar" && !b.gelirKodu.startsWith("4")) return false;
    return true;
  });
}

export function parseOdemeTutari(value: string, fallback: number): number {
  const tutar = parseFloat(value.replace(",", "."));
  return Number.isFinite(tutar) ? tutar : fallback;
}
