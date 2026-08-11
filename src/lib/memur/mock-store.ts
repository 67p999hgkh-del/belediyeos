/**
 * Personel (Memur) mock runtime store — fixture'dan başlatılır, UI mock import etmez.
 */

import {
  FIXTURE_BORDROLAR,
  FIXTURE_CEKLER,
  FIXTURE_EK_MESAI,
  FIXTURE_EMEKLILIK,
  FIXTURE_GERI_ALMA,
  FIXTURE_HESAPLAMALAR,
  FIXTURE_KESINTILER,
  FIXTURE_KESINTI_RAPORLARI,
  FIXTURE_MAAS_BILGILERI,
  FIXTURE_MEMURLAR,
  FIXTURE_YARDIMLAR,
} from "@/mocks/memur/fixtures";
import type {
  MemurBordro,
  MemurCek,
  MemurEkMesai,
  MemurEmeklilik,
  MemurGeriAlmaKayit,
  MemurHesaplamaKayit,
  MemurKayit,
  MemurKesinti,
  MemurKesintiRapor,
  MemurMaasBilgisi,
  MemurYardim,
} from "@/lib/memur/types";

function clone<T>(data: T): T {
  return JSON.parse(JSON.stringify(data)) as T;
}

export const memurMockStore = {
  memurlar: clone(FIXTURE_MEMURLAR),
  maasBilgileri: clone(FIXTURE_MAAS_BILGILERI),
  yardimlar: clone(FIXTURE_YARDIMLAR),
  kesintiler: clone(FIXTURE_KESINTILER),
  hesaplamalar: clone(FIXTURE_HESAPLAMALAR),
  bordrolar: clone(FIXTURE_BORDROLAR),
  ekMesai: clone(FIXTURE_EK_MESAI),
  emeklilik: clone(FIXTURE_EMEKLILIK),
  cekler: clone(FIXTURE_CEKLER),
  geriAlma: clone(FIXTURE_GERI_ALMA),
  kesintiRaporlari: clone(FIXTURE_KESINTI_RAPORLARI),
};

export function resetMemurMockStore() {
  memurMockStore.memurlar = clone(FIXTURE_MEMURLAR);
  memurMockStore.maasBilgileri = clone(FIXTURE_MAAS_BILGILERI);
  memurMockStore.yardimlar = clone(FIXTURE_YARDIMLAR);
  memurMockStore.kesintiler = clone(FIXTURE_KESINTILER);
  memurMockStore.hesaplamalar = clone(FIXTURE_HESAPLAMALAR);
  memurMockStore.bordrolar = clone(FIXTURE_BORDROLAR);
  memurMockStore.ekMesai = clone(FIXTURE_EK_MESAI);
  memurMockStore.emeklilik = clone(FIXTURE_EMEKLILIK);
  memurMockStore.cekler = clone(FIXTURE_CEKLER);
  memurMockStore.geriAlma = clone(FIXTURE_GERI_ALMA);
  memurMockStore.kesintiRaporlari = clone(FIXTURE_KESINTI_RAPORLARI);
}

export type MemurMockStore = typeof memurMockStore;

export type {
  MemurKayit,
  MemurMaasBilgisi,
  MemurYardim,
  MemurKesinti,
  MemurHesaplamaKayit,
  MemurBordro,
  MemurEkMesai,
  MemurEmeklilik,
  MemurCek,
  MemurGeriAlmaKayit,
  MemurKesintiRapor,
};
