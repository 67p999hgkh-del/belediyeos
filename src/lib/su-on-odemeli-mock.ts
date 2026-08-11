import { suDemoOnOdemeliSistemler, suOnOdemeliSistemConfig } from "@/lib/su/config";
import { SU_DEMO_BIRIM_FIYAT, suMockStore } from "@/lib/su/mock-store";
import type { SuOnOdemeliSatis, SuOnOdemeliSistem } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export type { SuOnOdemeliSatis, SuOnOdemeliSistem };

/** Demo sistem listesi — legacy ekran detayı henüz doğrulanmadı */
export const suOnOdemeliConfig = {
  legacyDogrulandi: suOnOdemeliSistemConfig.legacyDogrulandi,
  sistemler: [...suDemoOnOdemeliSistemler] as SuOnOdemeliSistem[],
  varsayilanSistem: suDemoOnOdemeliSistemler[0] as SuOnOdemeliSistem,
};

export function getSuOnOdemeliSatislar(sistem?: SuOnOdemeliSistem): SuOnOdemeliSatis[] {
  if (!sistem) return suMockStore.onOdemeliSatislar;
  return suMockStore.onOdemeliSatislar.filter((s) => s.sistem === sistem);
}

export function okuSuOnOdemeliKart(sistem: SuOnOdemeliSistem, kartNo: string) {
  const kart = suMockStore.onOdemeliKartlar[kartNo];
  if (!kart) return null;
  return { sistem, kartNo, ...kart };
}

export function islemSuOnOdemeliKart(input: {
  sistem: SuOnOdemeliSistem;
  kartNo: string;
  islem: string;
  tutar: number;
  kullanici: string;
}): SuOnOdemeliSatis | null {
  const kart = okuSuOnOdemeliKart(input.sistem, input.kartNo);
  if (!kart) return null;
  const satis: SuOnOdemeliSatis = {
    id: `s-${Date.now()}`,
    sistem: input.sistem,
    aboneNo: kart.aboneNo,
    adSoyad: kart.adSoyad,
    kartNo: input.kartNo,
    islem: input.islem,
    tutar: input.tutar,
    tarih: new Date().toLocaleString("tr-TR"),
    durum: "basarili",
  };
  suMockStore.onOdemeliSatislar.unshift(satis);
  kaydetSuAudit({ kullanici: input.kullanici, islem: `${input.sistem} — ${input.islem}`, yeniDeger: String(input.tutar), aciklama: input.kartNo });
  return satis;
}

export function hesaplaSuOnOdemeliFatura(input: {
  sistem: SuOnOdemeliSistem;
  kartNo: string;
  tuketim: number;
  kullanici: string;
}) {
  const kart = okuSuOnOdemeliKart(input.sistem, input.kartNo);
  if (!kart) return null;
  const tutar = input.tuketim * SU_DEMO_BIRIM_FIYAT;
  kaydetSuAudit({ kullanici: input.kullanici, islem: "Ön Ödemeli Fatura Hesaplama", yeniDeger: String(tutar), aciklama: input.kartNo });
  return { tuketim: input.tuketim, tutar, sonOdeme: "15.09.2026" };
}
