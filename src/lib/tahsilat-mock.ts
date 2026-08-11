export type TahsilatAramaSekmesi = "su-isyeri" | "emlak" | "imar" | "kimlik";

export interface TahsilatSicil {
  adSoyad: string;
  adres: string;
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

export const tahsildarlar = [
  { id: "ayse", label: "Ayşe Yılmaz" },
  { id: "mehmet", label: "Mehmet Kaya" },
  { id: "fatma", label: "Fatma Öztürk" },
];

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

const mockSiciller: Record<string, TahsilatSicil> = {
  "12345678": {
    adSoyad: "Mehmet Demir",
    adres: "Erenköy Mah. Atatürk Cad. No:12, Karpaz",
  },
  "87654321": {
    adSoyad: "Zeynep Aksoy",
    adres: "Yeni Mah. Liman Sok. No:5 D:3",
  },
  "11223344": {
    adSoyad: "Ali Yılmaz Tic. Ltd. Şti.",
    adres: "Merkez Mah. Belediye Cad. No:28",
  },
};

const mockBorclar: Record<string, TahsilatBorcRow[]> = {
  "12345678": [
    {
      id: "b1",
      refNo: "SU-2026-001",
      yil: 2026,
      donem: 1,
      gelirKodu: "101",
      gelirAdi: "Su Bedeli",
      sonOdemeTarihi: "15.03.2026",
      anaPara: 420.0,
      ceza: 0,
      kdv: 0,
      toplam: 420.0,
    },
    {
      id: "b2",
      refNo: "SU-2025-012",
      yil: 2025,
      donem: 4,
      gelirKodu: "101",
      gelirAdi: "Su Bedeli",
      sonOdemeTarihi: "15.12.2025",
      anaPara: 380.0,
      ceza: 38.0,
      kdv: 0,
      toplam: 418.0,
    },
    {
      id: "b3",
      refNo: "EM-2026-004",
      yil: 2026,
      donem: 1,
      gelirKodu: "201",
      gelirAdi: "Emlak Vergisi",
      sonOdemeTarihi: "31.05.2026",
      anaPara: 1250.0,
      ceza: 0,
      kdv: 0,
      toplam: 1250.0,
    },
  ],
  "87654321": [
    {
      id: "b4",
      refNo: "IS-2026-007",
      yil: 2026,
      donem: 1,
      gelirKodu: "301",
      gelirAdi: "İşyeri Vergisi",
      sonOdemeTarihi: "30.06.2026",
      anaPara: 2100.0,
      ceza: 0,
      kdv: 0,
      toplam: 2100.0,
    },
  ],
  "11223344": [
    {
      id: "b5",
      refNo: "IM-2026-002",
      yil: 2026,
      donem: 1,
      gelirKodu: "401",
      gelirAdi: "Ruhsat Harcı",
      sonOdemeTarihi: "20.04.2026",
      anaPara: 850.0,
      ceza: 42.5,
      kdv: 0,
      toplam: 892.5,
    },
  ],
};

function normalizeKey(value: string) {
  return value.replace(/\D/g, "");
}

export function aramaSicil(
  arama: string,
  _sekme: TahsilatAramaSekmesi,
): { sicil: TahsilatSicil; borclar: TahsilatBorcRow[]; key: string } | null {
  const key = normalizeKey(arama);
  if (key.length < 4) return null;

  const matchedKey =
    mockSiciller[key] !== undefined
      ? key
      : Object.keys(mockSiciller).find((k) => k.startsWith(key) || key.startsWith(k));

  if (!matchedKey) return null;

  return {
    key: matchedKey,
    sicil: mockSiciller[matchedKey],
    borclar: mockBorclar[matchedKey] ?? [],
  };
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
    if (opts.refNo && !b.refNo.toLocaleLowerCase("tr").includes(opts.refNo.toLocaleLowerCase("tr"))) {
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
