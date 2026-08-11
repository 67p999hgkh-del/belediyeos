import { kaydetSuAudit } from "./su-audit";

export interface SuTerminalTanim {
  id: string;
  kod: string;
  marka: string;
  seriNo: string;
  durum: "aktif" | "pasif";
}

export interface SuAktarimKayit {
  id: string;
  tarih: string;
  kullanici: string;
  dosya: string;
  terminal: string;
  kayitSayisi: number;
  basarili: number;
  hatali: number;
  uyarili: number;
  durum: "basarili" | "hatali" | "uyarili";
  hataDetay?: string;
}

const terminaller: SuTerminalTanim[] = [
  { id: "t1", kod: "ET-01", marka: "Honeywell", seriNo: "HW-2024-001", durum: "aktif" },
  { id: "t2", kod: "ET-02", marka: "Honeywell", seriNo: "HW-2024-002", durum: "aktif" },
  { id: "t3", kod: "ET-03", marka: "Datalogic", seriNo: "DL-2023-014", durum: "pasif" },
];

const aktarimGecmisi: SuAktarimKayit[] = [
  {
    id: "a1",
    tarih: "11.08.2026 08:15",
    kullanici: "Ayşe Yılmaz",
    dosya: "okuma_20260705.et",
    terminal: "ET-01",
    kayitSayisi: 186,
    basarili: 184,
    hatali: 1,
    uyarili: 1,
    durum: "uyarili",
    hataDetay: "1 kayıt: sayaç no eşleşmedi",
  },
  {
    id: "a2",
    tarih: "05.07.2026 17:40",
    kullanici: "Mehmet Kaya",
    dosya: "okuma_20260701.et",
    terminal: "ET-02",
    kayitSayisi: 192,
    basarili: 192,
    hatali: 0,
    uyarili: 0,
    durum: "basarili",
  },
];

export function getSuTerminaller(): SuTerminalTanim[] {
  return terminaller;
}

export function getSuAktarimGecmisi(): SuAktarimKayit[] {
  return aktarimGecmisi;
}

export function hazirlaSuOkumaVerisi(donem: string, kullanici: string) {
  kaydetSuAudit({
    kullanici,
    islem: "Veri Hazırla",
    aciklama: `${donem} dönemi okuma paketi oluşturuldu`,
  });
  return {
    dosyaAdi: `okuma_${donem.replace("/", "")}.et`,
    aboneSayisi: 2184,
    kayitSayisi: 2184,
  };
}

export function alSuOkumaVerisi(
  dosya: string,
  terminal: string,
  kullanici: string,
): SuAktarimKayit {
  const kayit: SuAktarimKayit = {
    id: `a-${Date.now()}`,
    tarih: new Date().toLocaleString("tr-TR"),
    kullanici,
    dosya,
    terminal,
    kayitSayisi: 186,
    basarili: 184,
    hatali: 1,
    uyarili: 1,
    durum: "uyarili",
    hataDetay: "1 kayıt: sayaç no eşleşmedi",
  };
  aktarimGecmisi.unshift(kayit);
  kaydetSuAudit({
    kullanici,
    islem: "Veri Al",
    aciklama: `${dosya} — ${kayit.basarili}/${kayit.kayitSayisi} başarılı`,
  });
  return kayit;
}
