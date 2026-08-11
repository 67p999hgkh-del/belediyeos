import { kaydetSuAudit } from "./su-audit";

export type SuOnOdemeliSistem = "Baylan" | "Cem";

export interface SuOnOdemeliSatis {
  id: string;
  sistem: SuOnOdemeliSistem;
  aboneNo: string;
  adSoyad: string;
  kartNo: string;
  islem: string;
  tutar: number;
  tarih: string;
  durum: "basarili" | "iptal";
}

export const suOnOdemeliConfig = {
  varsayilanSistem: "Baylan" as SuOnOdemeliSistem,
  sistemler: ["Baylan", "Cem"] as SuOnOdemeliSistem[],
};

const satislar: SuOnOdemeliSatis[] = [
  {
    id: "s1",
    sistem: "Baylan",
    aboneNo: "45-67-89-01",
    adSoyad: "Ali Veli",
    kartNo: "BL-88442211",
    islem: "Kart Yükleme",
    tutar: 200,
    tarih: "10.08.2026 11:30",
    durum: "basarili",
  },
  {
    id: "s2",
    sistem: "Cem",
    aboneNo: "33-44-55-66",
    adSoyad: "Fatma Yıldız",
    kartNo: "CM-11223344",
    islem: "Fatura Hesaplama",
    tutar: 85,
    tarih: "09.08.2026 15:12",
    durum: "basarili",
  },
];

export function getSuOnOdemeliSatislar(sistem?: SuOnOdemeliSistem): SuOnOdemeliSatis[] {
  if (!sistem) return satislar;
  return satislar.filter((s) => s.sistem === sistem);
}

export function okuSuOnOdemeliKart(sistem: SuOnOdemeliSistem, kartNo: string) {
  return {
    sistem,
    kartNo,
    aboneNo: sistem === "Baylan" ? "45-67-89-01" : "33-44-55-66",
    adSoyad: sistem === "Baylan" ? "Ali Veli" : "Fatma Yıldız",
    bakiye: sistem === "Baylan" ? 142.5 : 68.0,
    sonIslem: "10.08.2026",
  };
}

export function islemSuOnOdemeliKart(input: {
  sistem: SuOnOdemeliSistem;
  kartNo: string;
  islem: string;
  tutar: number;
  kullanici: string;
}): SuOnOdemeliSatis {
  const satis: SuOnOdemeliSatis = {
    id: `s-${Date.now()}`,
    sistem: input.sistem,
    aboneNo: input.sistem === "Baylan" ? "45-67-89-01" : "33-44-55-66",
    adSoyad: input.sistem === "Baylan" ? "Ali Veli" : "Fatma Yıldız",
    kartNo: input.kartNo,
    islem: input.islem,
    tutar: input.tutar,
    tarih: new Date().toLocaleString("tr-TR"),
    durum: "basarili",
  };
  satislar.unshift(satis);
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: `${input.sistem} — ${input.islem}`,
    yeniDeger: String(input.tutar),
    aciklama: input.kartNo,
  });
  return satis;
}

export function hesaplaSuOnOdemeliFatura(input: {
  sistem: SuOnOdemeliSistem;
  kartNo: string;
  tuketim: number;
  kullanici: string;
}) {
  const tutar = input.tuketim * 23.5;
  kaydetSuAudit({
    kullanici: input.kullanici,
    islem: "Ön Ödemeli Fatura Hesaplama",
    yeniDeger: String(tutar),
    aciklama: input.kartNo,
  });
  return { tuketim: input.tuketim, tutar, sonOdeme: "15.09.2026" };
}
