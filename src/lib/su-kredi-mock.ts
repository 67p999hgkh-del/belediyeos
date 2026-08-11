import { kaydetSuAudit } from "./su-audit";

export interface SuKrediKayit {
  id: string;
  aboneNo: string;
  adSoyad: string;
  krediTutar: number;
  kullanilan: number;
  kalan: number;
  sonIslem: string;
  durum: "aktif" | "kapali";
}

export interface SuKrediGeriOdeme {
  id: string;
  aboneNo: string;
  tutar: number;
  tarih: string;
  makbuzNo: string;
}

const krediler: SuKrediKayit[] = [
  {
    id: "k1",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    krediTutar: 500,
    kullanilan: 320,
    kalan: 180,
    sonIslem: "01.07.2026",
    durum: "aktif",
  },
  {
    id: "k2",
    aboneNo: "87-65-43-21",
    adSoyad: "Ayşe Kaya",
    krediTutar: 300,
    kullanilan: 300,
    kalan: 0,
    sonIslem: "15.06.2026",
    durum: "kapali",
  },
];

const geriOdemeler: SuKrediGeriOdeme[] = [
  { id: "go1", aboneNo: "12-34-56-78", tutar: 120, tarih: "01.07.2026", makbuzNo: "2026001180" },
];

export const suKrediRaporTurleri = [
  { id: "donem", label: "Dönem Kredi Kullanım Raporu" },
  { id: "tarih", label: "Tarih Aralığı Kredi Kullanım Raporu" },
];

export function getSuKrediListesi(): SuKrediKayit[] {
  return krediler;
}

export function getSuKrediGeriOdemeler(): SuKrediGeriOdeme[] {
  return geriOdemeler;
}

export function kaydetSuKrediGeriOdeme(input: {
  aboneNo: string;
  tutar: number;
  kullanici: string;
}): SuKrediGeriOdeme {
  const odeme: SuKrediGeriOdeme = {
    id: `go-${Date.now()}`,
    aboneNo: input.aboneNo,
    tutar: input.tutar,
    tarih: new Date().toLocaleDateString("tr-TR"),
    makbuzNo: `2026${String(geriOdemeler.length + 1200).padStart(6, "0")}`,
  };
  geriOdemeler.unshift(odeme);
  const kredi = krediler.find((k) => k.aboneNo === input.aboneNo);
  if (kredi) {
    kredi.kalan = Math.max(0, kredi.kalan - input.tutar);
    kredi.sonIslem = odeme.tarih;
  }
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: "Kredi Geri Ödeme",
    yeniDeger: String(input.tutar),
    aciklama: input.aboneNo,
  });
  return odeme;
}

export function getSuKrediRapor(tur: string, yil: number, donem: number) {
  if (tur === "donem") {
    return krediler.map((k) => ({
      aboneNo: k.aboneNo,
      adSoyad: k.adSoyad,
      kullanilan: k.kullanilan,
      donem: `${yil}/${donem}`,
    }));
  }
  return geriOdemeler.map((g) => ({
    aboneNo: g.aboneNo,
    tutar: g.tutar,
    tarih: g.tarih,
    makbuzNo: g.makbuzNo,
  }));
}
