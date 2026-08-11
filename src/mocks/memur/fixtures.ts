/**
 * Personel (Memur) demo fixture verileri — production state DEĞİLDİR.
 */

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

export const FIXTURE_MEMURLAR: MemurKayit[] = [
  {
    id: "m1",
    sicilNo: "MEM-001",
    adSoyad: "Demo Memur 1",
    kimlikNo: "10000000001",
    dogumTarihi: "15.03.1985",
    dogumYeri: "Mağusa",
    iseGirisTarihi: "01.09.2010",
    kadro: "Memur",
    mevki: "Şef",
    birim: "Mali Hizmetler",
    statu: "Kadrolu",
    telefon: "0532 100 00 01",
    eposta: "demo1@belediye.demo",
    durum: "aktif",
  },
  {
    id: "m2",
    sicilNo: "MEM-002",
    adSoyad: "Demo Memur 2",
    kimlikNo: "10000000002",
    dogumTarihi: "22.07.1990",
    dogumYeri: "Girne",
    iseGirisTarihi: "15.01.2015",
    kadro: "Memur",
    mevki: "Memur",
    birim: "Su Hizmetleri",
    statu: "Kadrolu",
    telefon: "0532 100 00 02",
    eposta: "demo2@belediye.demo",
    durum: "aktif",
  },
  {
    id: "m3",
    sicilNo: "MEM-003",
    adSoyad: "Demo Memur 3",
    kimlikNo: "10000000003",
    dogumTarihi: "08.11.1978",
    dogumYeri: "Lefkoşa",
    iseGirisTarihi: "01.06.2005",
    kadro: "Memur",
    mevki: "Müdür Yardımcısı",
    birim: "İnsan Kaynakları",
    statu: "Kadrolu",
    telefon: "0532 100 00 03",
    eposta: "demo3@belediye.demo",
    durum: "aktif",
  },
];

export const FIXTURE_MAAS_BILGILERI: MemurMaasBilgisi[] = [
  {
    id: "mb1",
    memurId: "m1",
    sicilNo: "MEM-001",
    donem: "2026/2",
    maasGrubu: "Demo Grup A",
    derece: "3",
    kademe: "2",
    guncellemeTarihi: "01.02.2026",
  },
  {
    id: "mb2",
    memurId: "m2",
    sicilNo: "MEM-002",
    donem: "2026/2",
    maasGrubu: "Demo Grup B",
    derece: "2",
    kademe: "1",
    guncellemeTarihi: "01.02.2026",
  },
];

export const FIXTURE_YARDIMLAR: MemurYardim[] = [
  {
    id: "y1",
    memurId: "m1",
    sicilNo: "MEM-001",
    adSoyad: "Demo Memur 1",
    yardimTuru: "Aile Yardımı",
    tutar: 0,
    donem: "2026/2",
    aciklama: "Demo kayıt — tutar backend'den",
  },
];

export const FIXTURE_KESINTILER: MemurKesinti[] = [
  {
    id: "k1",
    memurId: "m1",
    sicilNo: "MEM-001",
    adSoyad: "Demo Memur 1",
    kesintiTuru: "Sendika",
    tutar: 0,
    donem: "2026/2",
    aciklama: "Demo kayıt — tutar backend'den",
  },
];

export const FIXTURE_HESAPLAMALAR: MemurHesaplamaKayit[] = [
  {
    id: "h1",
    donem: "2026/1",
    hesaplamaTuru: "Normal Maaş",
    kapsam: "Tüm Personel",
    durum: "onaylandi",
    olusturmaTarihi: "05.01.2026",
    hesaplayan: "Demo Kullanıcı",
    sonucOzeti: "Backend hesaplama sonucu bekleniyor",
  },
];

export const FIXTURE_BORDROLAR: MemurBordro[] = [
  {
    id: "b1",
    donem: "2026/1",
    bordroTipi: "Maaş Bordroları",
    personelSayisi: 3,
    durum: "onaylandi",
    olusturmaTarihi: "06.01.2026",
  },
  {
    id: "b2",
    donem: "2026/1",
    bordroTipi: "Maaş Bordrosu – Memur SGY",
    personelSayisi: 3,
    durum: "yazdirildi",
    olusturmaTarihi: "07.01.2026",
  },
];

export const FIXTURE_EK_MESAI: MemurEkMesai[] = [
  {
    id: "em1",
    memurId: "m1",
    sicilNo: "MEM-001",
    adSoyad: "Demo Memur 1",
    donem: "2026/2",
    saat: 8,
    gun: 2,
    durum: "girildi",
  },
];

export const FIXTURE_EMEKLILIK: MemurEmeklilik[] = [];

export const FIXTURE_CEKLER: MemurCek[] = [
  {
    id: "c1",
    memurId: "m2",
    sicilNo: "MEM-002",
    adSoyad: "Demo Memur 2",
    tarih: "10.02.2026",
    tutar: 0,
    durum: "bekliyor",
    referans: "CEK-2026-001",
  },
];

export const FIXTURE_GERI_ALMA: MemurGeriAlmaKayit[] = [];

export const FIXTURE_KESINTI_RAPORLARI: MemurKesintiRapor[] = [
  { id: "kr1", raporTuru: "Özel Kesintiler Raporu", donem: "2026/1", toplam: 0, kayitSayisi: 1 },
  { id: "kr2", raporTuru: "İhtiyat Sandığı", donem: "2026/1", toplam: 0, kayitSayisi: 3 },
];
