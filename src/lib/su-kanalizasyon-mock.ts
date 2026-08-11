import { kaydetSuAudit } from "./su-audit";

export interface SuKanalBaglanti {
  id: string;
  aboneNo: string;
  adSoyad: string;
  adres: string;
  baglantiTarihi: string;
  kanalNo: string;
  durum: "aktif" | "iptal";
  aciklama?: string;
}

const baglantilar: SuKanalBaglanti[] = [
  {
    id: "kn1",
    aboneNo: "12-34-56-78",
    adSoyad: "Mehmet Demir",
    adres: "Erenköy Mah. Atatürk Cad. No:12",
    baglantiTarihi: "15.03.2024",
    kanalNo: "KN-2024-0142",
    durum: "aktif",
  },
  {
    id: "kn2",
    aboneNo: "11-22-33-44",
    adSoyad: "Erenköy Site Yönetimi",
    adres: "Erenköy Mah. Site Sok. No:1",
    baglantiTarihi: "02.01.2023",
    kanalNo: "KN-2023-0089",
    durum: "aktif",
    aciklama: "Site ana bağlantı",
  },
];

export function getSuKanalBaglantilar(): SuKanalBaglanti[] {
  return baglantilar;
}

export function kaydetSuKanalBaglanti(input: {
  aboneNo: string;
  adSoyad: string;
  adres: string;
  kanalNo: string;
  aciklama?: string;
  kullanici: string;
}): SuKanalBaglanti {
  const kayit: SuKanalBaglanti = {
    id: `kn-${Date.now()}`,
    ...input,
    baglantiTarihi: new Date().toLocaleDateString("tr-TR"),
    durum: "aktif",
  };
  baglantilar.unshift(kayit);
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: "Kanalizasyon Bağlama",
    yeniDeger: input.kanalNo,
    aciklama: input.aboneNo,
  });
  return kayit;
}
