/**
 * Personel (Memur) repository — UI bu katmanı kullanır; mock/API adapter değiştirilebilir.
 */

import { kaydetMemurAudit } from "@/lib/memur/audit";
import { formatMemurDonem, memurDemoKesintiTurleri, memurDemoYardimTurleri, memurHesaplamaTurleri } from "@/lib/memur/config";
import { memurMockStore } from "@/lib/memur/mock-store";
import type {
  MemurBordro,
  MemurCek,
  MemurEkMesai,
  MemurEmeklilik,
  MemurGeriAlmaKayit,
  MemurHesaplamaKayit,
  MemurHesaplamaSonuc,
  MemurHubKpi,
  MemurKayit,
  MemurKesinti,
  MemurKesintiRapor,
  MemurMaasBilgisi,
  MemurYardim,
} from "@/lib/memur/types";

export function getMemurListesi(): MemurKayit[] {
  return [...memurMockStore.memurlar];
}

export function getMemurBySicil(sicilNo: string): MemurKayit | undefined {
  return memurMockStore.memurlar.find((m) => m.sicilNo === sicilNo);
}

export function getMemurById(id: string): MemurKayit | undefined {
  return memurMockStore.memurlar.find((m) => m.id === id);
}

export function searchMemurByQuery(q: string): MemurKayit[] {
  const query = q.trim().toLocaleLowerCase("tr");
  if (!query) return getMemurListesi();
  return memurMockStore.memurlar.filter(
    (m) =>
      m.sicilNo.toLocaleLowerCase("tr").includes(query) ||
      m.adSoyad.toLocaleLowerCase("tr").includes(query) ||
      m.kimlikNo.includes(query),
  );
}

export function getMemurMaasBilgileri(memurId?: string): MemurMaasBilgisi[] {
  if (!memurId) return [...memurMockStore.maasBilgileri];
  return memurMockStore.maasBilgileri.filter((m) => m.memurId === memurId);
}

export function getMemurYardimlar(memurId?: string): MemurYardim[] {
  if (!memurId) return [...memurMockStore.yardimlar];
  return memurMockStore.yardimlar.filter((y) => y.memurId === memurId);
}

export function getMemurKesintileri(memurId?: string): MemurKesinti[] {
  if (!memurId) return [...memurMockStore.kesintiler];
  return memurMockStore.kesintiler.filter((k) => k.memurId === memurId);
}

export function getMemurHesaplamalar(): MemurHesaplamaKayit[] {
  return [...memurMockStore.hesaplamalar];
}

export function getMemurBordrolar(): MemurBordro[] {
  return [...memurMockStore.bordrolar];
}

export function getMemurEkMesai(): MemurEkMesai[] {
  return [...memurMockStore.ekMesai];
}

export function getMemurEmeklilik(): MemurEmeklilik[] {
  return [...memurMockStore.emeklilik];
}

export function getMemurCekler(): MemurCek[] {
  return [...memurMockStore.cekler];
}

export function getMemurGeriAlmaKayitlari(): MemurGeriAlmaKayit[] {
  return [...memurMockStore.geriAlma];
}

export function getMemurKesintiRaporlari(raporTuru?: string): MemurKesintiRapor[] {
  if (!raporTuru) return [...memurMockStore.kesintiRaporlari];
  return memurMockStore.kesintiRaporlari.filter((r) => r.raporTuru === raporTuru);
}

export function getMemurHubKpi(): MemurHubKpi {
  return {
    aktifMemur: memurMockStore.memurlar.filter((m) => m.durum === "aktif").length,
    buAyBordro: null,
    ekMesaiBekleyen: memurMockStore.ekMesai.filter((e) => e.durum === "girildi").length,
    emeklilikIslemleri: memurMockStore.emeklilik.length,
    bekleyenKesintiYardim: memurMockStore.yardimlar.length + memurMockStore.kesintiler.length,
    kaynak: "mock",
  };
}

export function getMemurYardimTurleri(): string[] {
  return memurDemoYardimTurleri;
}

export function getMemurKesintiTurleri(): string[] {
  return memurDemoKesintiTurleri;
}

export function kaydetMemurYardim(
  data: Omit<MemurYardim, "id">,
  kullanici: string,
  gerekce?: string,
): MemurYardim {
  const kayit: MemurYardim = { ...data, id: `y-${Date.now()}` };
  memurMockStore.yardimlar.unshift(kayit);
  kaydetMemurAudit({
    kullanici,
    islem: "Ek Yardım Girişi",
    personel: data.sicilNo,
    donem: data.donem,
    yeniDeger: `${data.yardimTuru}: ${data.tutar}`,
    gerekce,
    kaynakEkran: "personel-karti",
    islemSonucu: "basarili",
  });
  return kayit;
}

export function kaydetMemurOzelKesinti(
  data: Omit<MemurKesinti, "id">,
  kullanici: string,
  gerekce?: string,
): MemurKesinti {
  const kayit: MemurKesinti = { ...data, id: `k-${Date.now()}` };
  memurMockStore.kesintiler.unshift(kayit);
  kaydetMemurAudit({
    kullanici,
    islem: "Özel Kesinti Girişi",
    personel: data.sicilNo,
    donem: data.donem,
    yeniDeger: `${data.kesintiTuru}: ${data.tutar}`,
    gerekce,
    kaynakEkran: "personel-karti",
    islemSonucu: "basarili",
  });
  return kayit;
}

export function guncelleMemurMaasBilgisi(
  memurId: string,
  data: Partial<MemurMaasBilgisi>,
  kullanici: string,
  gerekce?: string,
): MemurMaasBilgisi | undefined {
  const idx = memurMockStore.maasBilgileri.findIndex((m) => m.memurId === memurId);
  const memur = getMemurById(memurId);
  if (!memur) return undefined;

  if (idx >= 0) {
    const eski = { ...memurMockStore.maasBilgileri[idx] };
    memurMockStore.maasBilgileri[idx] = {
      ...eski,
      ...data,
      guncellemeTarihi: new Date().toLocaleDateString("tr-TR"),
    };
    kaydetMemurAudit({
      kullanici,
      islem: "Memur Maaş Bilgisi Değişikliği",
      personel: memur.sicilNo,
      donem: data.donem ?? eski.donem,
      eskiDeger: JSON.stringify(eski),
      yeniDeger: JSON.stringify(memurMockStore.maasBilgileri[idx]),
      gerekce,
      kaynakEkran: "personel-karti",
      islemSonucu: "basarili",
    });
    return memurMockStore.maasBilgileri[idx];
  }

  const yeni: MemurMaasBilgisi = {
    id: `mb-${Date.now()}`,
    memurId,
    sicilNo: memur.sicilNo,
    donem: data.donem ?? formatMemurDonem(2026, 2),
    maasGrubu: data.maasGrubu ?? "",
    derece: data.derece ?? "",
    kademe: data.kademe ?? "",
    guncellemeTarihi: new Date().toLocaleDateString("tr-TR"),
  };
  memurMockStore.maasBilgileri.unshift(yeni);
  kaydetMemurAudit({
    kullanici,
    islem: "Memur Maaş Bilgisi Değişikliği",
    personel: memur.sicilNo,
    donem: yeni.donem,
    yeniDeger: JSON.stringify(yeni),
    gerekce,
    kaynakEkran: "personel-karti",
    islemSonucu: "basarili",
  });
  return yeni;
}

/** Backend hesaplama servisi bekleniyor — mock yalnızca placeholder döner */
export async function calistirMemurHesaplama(
  params: { donem: string; hesaplamaTuru: string; kapsam: string },
  kullanici: string,
): Promise<MemurHesaplamaSonuc> {
  await new Promise((r) => setTimeout(r, 400));
  const turLabel =
    memurHesaplamaTurleri.find((t) => t.id === params.hesaplamaTuru)?.label ?? params.hesaplamaTuru;

  const kayit: MemurHesaplamaKayit = {
    id: `h-${Date.now()}`,
    donem: params.donem,
    hesaplamaTuru: turLabel,
    kapsam: params.kapsam,
    durum: "hesaplandi",
    olusturmaTarihi: new Date().toLocaleDateString("tr-TR"),
    hesaplayan: kullanici,
    sonucOzeti: "Backend hesaplama motoru bekleniyor — demo önizleme",
  };
  memurMockStore.hesaplamalar.unshift(kayit);

  kaydetMemurAudit({
    kullanici,
    islem: `Maaş Hesaplama — ${turLabel}`,
    donem: params.donem,
    yeniDeger: params.kapsam,
    kaynakEkran: "maas-bordro",
    islemSonucu: "basarili",
  });

  return {
    basarili: true,
    mesaj: "Hesaplama servisi mock modunda — gerçek formül backend'den gelecek.",
    kalemler: [
      { kod: "—", aciklama: "Brüt / Net kalemler backend'den", tutar: null },
    ],
    hesapTarihi: new Date().toLocaleString("tr-TR"),
    hesaplayan: kullanici,
    parametreVersiyon: "backend-bekleniyor",
  };
}

export async function calistir13MaasHesaplama(
  yil: number,
  kullanici: string,
): Promise<MemurHesaplamaSonuc> {
  await new Promise((r) => setTimeout(r, 400));
  kaydetMemurAudit({
    kullanici,
    islem: "13. Maaş Hesaplama",
    donem: String(yil),
    kaynakEkran: "maas-bordro",
    islemSonucu: "basarili",
  });
  return {
    basarili: true,
    mesaj: "13. maaş hesaplama servisi mock modunda.",
    kalemler: [{ kod: "—", aciklama: "13. maaş kalemleri backend'den", tutar: null }],
    hesapTarihi: new Date().toLocaleString("tr-TR"),
    hesaplayan: kullanici,
    parametreVersiyon: "backend-bekleniyor",
  };
}

export function olustur13MaasBilgileri(yil: number, kullanici: string): void {
  kaydetMemurAudit({
    kullanici,
    islem: "13. Maaş Bilgileri Oluşturma",
    donem: String(yil),
    kaynakEkran: "maas-bordro",
    islemSonucu: "basarili",
  });
}

export async function calistirEkMesaiHesaplama(
  donem: string,
  kullanici: string,
): Promise<MemurHesaplamaSonuc> {
  await new Promise((r) => setTimeout(r, 350));
  memurMockStore.ekMesai.forEach((e) => {
    if (e.donem === donem && e.durum === "girildi") e.durum = "hesaplandi";
  });
  kaydetMemurAudit({
    kullanici,
    islem: "Ek Mesai Hesaplama",
    donem,
    kaynakEkran: "ek-mesai",
    islemSonucu: "basarili",
  });
  return {
    basarili: true,
    mesaj: "Ek mesai hesaplama servisi mock modunda.",
    kalemler: [{ kod: "—", aciklama: "Ek mesai kalemleri backend'den", tutar: null }],
    hesapTarihi: new Date().toLocaleString("tr-TR"),
    hesaplayan: kullanici,
    parametreVersiyon: "backend-bekleniyor",
  };
}

export function kaydetEkMesai(
  data: Omit<MemurEkMesai, "id" | "durum">,
  kullanici: string,
): MemurEkMesai {
  const kayit: MemurEkMesai = { ...data, id: `em-${Date.now()}`, durum: "girildi" };
  memurMockStore.ekMesai.unshift(kayit);
  kaydetMemurAudit({
    kullanici,
    islem: "Ek Mesai Bilgi Girişi",
    personel: data.sicilNo,
    donem: data.donem,
    kaynakEkran: "ek-mesai",
    islemSonucu: "basarili",
  });
  return kayit;
}

export async function calistirEmeklilikHesaplama(
  emeklilikId: string,
  kullanici: string,
): Promise<MemurHesaplamaSonuc> {
  await new Promise((r) => setTimeout(r, 400));
  const kayit = memurMockStore.emeklilik.find((e) => e.id === emeklilikId);
  if (kayit) {
    kayit.durum = "hesaplandi";
    kayit.hesapOzeti = "Backend emeklilik hesaplama sonucu bekleniyor";
  }
  kaydetMemurAudit({
    kullanici,
    islem: "Emeklilik Hesaplama",
    personel: kayit?.sicilNo,
    kaynakEkran: "emeklilik",
    islemSonucu: "basarili",
  });
  return {
    basarili: true,
    mesaj: "Emeklilik hesaplama servisi mock modunda.",
    kalemler: [{ kod: "—", aciklama: "Emeklilik kalemleri backend'den", tutar: null }],
    hesapTarihi: new Date().toLocaleString("tr-TR"),
    hesaplayan: kullanici,
    parametreVersiyon: "backend-bekleniyor",
  };
}

export function kaydetEmeklilikBilgi(
  data: Omit<MemurEmeklilik, "id" | "durum" | "hesapOzeti">,
  kullanici: string,
): MemurEmeklilik {
  const kayit: MemurEmeklilik = {
    ...data,
    id: `emk-${Date.now()}`,
    durum: "bilgi-girildi",
    hesapOzeti: "",
  };
  memurMockStore.emeklilik.unshift(kayit);
  kaydetMemurAudit({
    kullanici,
    islem: "Emeklilik Bilgi Girişi",
    personel: data.sicilNo,
    kaynakEkran: "emeklilik",
    islemSonucu: "basarili",
  });
  return kayit;
}

export async function calistirCekHesaplama(
  cekId: string,
  kullanici: string,
): Promise<MemurHesaplamaSonuc> {
  await new Promise((r) => setTimeout(r, 350));
  const cek = memurMockStore.cekler.find((c) => c.id === cekId);
  if (cek) cek.durum = "hesaplandi";
  kaydetMemurAudit({
    kullanici,
    islem: "Çek Hesaplatma",
    personel: cek?.sicilNo,
    kaynakEkran: "cek-islemleri",
    islemSonucu: "basarili",
  });
  return {
    basarili: true,
    mesaj: "Çek hesaplama servisi mock modunda.",
    kalemler: [{ kod: "—", aciklama: "Çek tutarı backend'den", tutar: null }],
    hesapTarihi: new Date().toLocaleString("tr-TR"),
    hesaplayan: kullanici,
    parametreVersiyon: "backend-bekleniyor",
  };
}

export function geriAlMemurIslem(
  islemTuru: string,
  donem: string,
  referans: string,
  gerekce: string,
  kullanici: string,
): MemurGeriAlmaKayit {
  const kayit: MemurGeriAlmaKayit = {
    id: `ga-${Date.now()}`,
    islemTuru,
    donem,
    referans,
    mevcutDurum: "geri-alindi",
    geriAlmaTarihi: new Date().toLocaleString("tr-TR"),
    geriAlan: kullanici,
    gerekce,
  };
  memurMockStore.geriAlma.unshift(kayit);
  kaydetMemurAudit({
    kullanici,
    islem: `İşlem Geri Alma — ${islemTuru}`,
    donem,
    gerekce,
    yeniDeger: referans,
    kaynakEkran: "islem-geri-alma",
    islemSonucu: "basarili",
  });
  return kayit;
}

export function olusturMemurBordro(
  donem: string,
  bordroTipi: string,
  kullanici: string,
): MemurBordro {
  const kayit: MemurBordro = {
    id: `b-${Date.now()}`,
    donem,
    bordroTipi,
    personelSayisi: memurMockStore.memurlar.filter((m) => m.durum === "aktif").length,
    durum: "taslak",
    olusturmaTarihi: new Date().toLocaleDateString("tr-TR"),
  };
  memurMockStore.bordrolar.unshift(kayit);
  kaydetMemurAudit({
    kullanici,
    islem: "Bordro Üretme",
    donem,
    yeniDeger: bordroTipi,
    kaynakEkran: "maas-bordro",
    islemSonucu: "basarili",
  });
  return kayit;
}
