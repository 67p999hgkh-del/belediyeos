import { suElTerminaliConfig } from "@/lib/su/config";
import { suMockStore } from "@/lib/su/mock-store";
import type { SuAktarimKayit, SuTerminalTanim } from "@/lib/su/types";
import { kaydetSuAudit } from "./su-audit";

export type { SuAktarimKayit, SuTerminalTanim };

export { suElTerminaliConfig };

/** Demo terminal tanımları — legacy doğrulanmadı */
export function getSuTerminaller(): SuTerminalTanim[] {
  return suMockStore.terminaller;
}

export function getSuAktarimGecmisi(): SuAktarimKayit[] {
  return suMockStore.aktarimGecmisi;
}

export function hazirlaSuOkumaVerisi(donem: string, terminal: string, kullanici: string) {
  kaydetSuAudit({ kullanici, islem: "Veri Hazırla", aciklama: `${donem} — ${terminal}` });
  return {
    dosyaAdi: `okuma_${donem.replace("/", "")}.et`,
    aboneSayisi: suMockStore.aboneler.filter((a) => a.durum === "aktif").length,
    kayitSayisi: suMockStore.aboneler.filter((a) => a.durum === "aktif").length,
    terminal,
  };
}

export function alSuOkumaVerisi(dosya: string, terminal: string, kullanici: string): SuAktarimKayit {
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
  suMockStore.aktarimGecmisi.unshift(kayit);
  kaydetSuAudit({ kullanici, islem: "Veri Al", aciklama: `${dosya} — ${kayit.basarili}/${kayit.kayitSayisi} başarılı` });
  return kayit;
}
