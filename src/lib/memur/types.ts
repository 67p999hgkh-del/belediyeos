/** Personel (Memur) modülü — paylaşılan tipler */

export type MemurDurum = "aktif" | "pasif" | "emekli" | "ayrildi";

export interface MemurKayit {
  id: string;
  sicilNo: string;
  adSoyad: string;
  kimlikNo: string;
  dogumTarihi: string;
  dogumYeri: string;
  iseGirisTarihi: string;
  kadro: string;
  mevki: string;
  birim: string;
  statu: string;
  telefon: string;
  eposta: string;
  durum: MemurDurum;
}

export interface MemurMaasBilgisi {
  id: string;
  memurId: string;
  sicilNo: string;
  donem: string;
  /** Backend parametre bekliyor — mock'ta demo etiket */
  maasGrubu: string;
  derece: string;
  kademe: string;
  guncellemeTarihi: string;
}

export interface MemurYardim {
  id: string;
  memurId: string;
  sicilNo: string;
  adSoyad: string;
  yardimTuru: string;
  tutar: number;
  donem: string;
  aciklama: string;
}

export interface MemurKesinti {
  id: string;
  memurId: string;
  sicilNo: string;
  adSoyad: string;
  kesintiTuru: string;
  tutar: number;
  donem: string;
  aciklama: string;
}

export interface MemurHesaplamaKayit {
  id: string;
  donem: string;
  hesaplamaTuru: string;
  kapsam: string;
  durum: "bekliyor" | "hesaplandi" | "onaylandi" | "iptal";
  olusturmaTarihi: string;
  hesaplayan: string;
  /** Backend hesaplama sonucu — mock'ta placeholder */
  sonucOzeti: string;
}

export interface MemurBordro {
  id: string;
  donem: string;
  bordroTipi: string;
  personelSayisi: number;
  durum: "taslak" | "onaylandi" | "yazdirildi";
  olusturmaTarihi: string;
}

export interface MemurEkMesai {
  id: string;
  memurId: string;
  sicilNo: string;
  adSoyad: string;
  donem: string;
  saat: number;
  gun: number;
  durum: "girildi" | "hesaplandi" | "onaylandi";
}

export interface MemurEmeklilik {
  id: string;
  memurId: string;
  sicilNo: string;
  adSoyad: string;
  basvuruTarihi: string;
  durum: "bilgi-girildi" | "hesaplandi" | "onaylandi";
  /** Backend hesaplama çıktısı */
  hesapOzeti: string;
}

export interface MemurCek {
  id: string;
  memurId: string;
  sicilNo: string;
  adSoyad: string;
  tarih: string;
  tutar: number;
  durum: "bekliyor" | "hesaplandi" | "odendi";
  referans: string;
}

export interface MemurGeriAlmaKayit {
  id: string;
  islemTuru: string;
  donem: string;
  referans: string;
  mevcutDurum: string;
  geriAlmaTarihi?: string;
  geriAlan?: string;
  gerekce?: string;
}

export interface MemurKesintiRapor {
  id: string;
  raporTuru: string;
  donem: string;
  toplam: number;
  kayitSayisi: number;
}

export interface MemurHubKpi {
  aktifMemur: number;
  buAyBordro: number | null;
  ekMesaiBekleyen: number;
  emeklilikIslemleri: number;
  bekleyenKesintiYardim: number;
  kaynak: "mock" | "backend";
}

export interface MemurHesaplamaSonuc {
  basarili: boolean;
  mesaj: string;
  kalemler: { kod: string; aciklama: string; tutar: number | null }[];
  hesapTarihi: string;
  hesaplayan: string;
  parametreVersiyon: string;
}
