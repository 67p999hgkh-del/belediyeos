export type SuAboneDurum = "aktif" | "kapali" | "beklemede";

export interface SuAboneKayit {
  id: string;
  aboneNo: string;
  sicilNo: string;
  adSoyad: string;
  kimlikNo: string;
  vergiNo?: string;
  adres: string;
  telefon: string;
  eposta?: string;
  abonelikTuru: string;
  tarifeGrubu: string;
  durum: SuAboneDurum;
  sayacNo: string;
  sayacMarka?: string;
  sonOkuma: string;
  sonOkumaTarihi: string;
  guncelBorc: number;
  bakiye: number;
  aciklama?: string;
}

export interface SuAboneFatura {
  id: string;
  donem: string;
  faturaNo: string;
  tutar: number;
  sonOdeme: string;
  durum: "odenmedi" | "odendi" | "iptal";
}

export interface SuAboneHareket {
  id: string;
  tarih: string;
  islem: string;
  tutar: number;
  aciklama: string;
}

export interface SuAboneBelge {
  id: string;
  tur: string;
  tarih: string;
  aciklama: string;
}

export interface SuTahakkukKayit {
  id: string;
  yil: number;
  donem: number;
  aboneSayisi: number;
  tahakkukTutar: number;
  durum: "acik" | "kapali" | "taslak";
  olusturmaTarihi: string;
}

export interface SuSayacOkuma {
  id: string;
  aboneNo: string;
  adSoyad: string;
  sayacNo: string;
  oncekiOkuma: number;
  yeniOkuma: number;
  tuketim: number;
  okumaTarihi: string;
  durum: "girildi" | "aktarildi" | "faturalandi";
}

export interface SuFaturaKayit {
  id: string;
  faturaNo: string;
  aboneNo: string;
  adSoyad: string;
  donem: string;
  tuketim: number;
  tutar: number;
  sonOdeme: string;
  durum: "taslak" | "kesildi" | "odendi" | "iptal";
}

export interface SuEkHizmetBorc {
  id: string;
  aboneNo: string;
  adSoyad: string;
  gelirKodu: string;
  aciklama: string;
  tutar: number;
  donem: string;
}

export interface SuTankerKayit {
  id: string;
  aboneNo: string;
  adSoyad: string;
  tonaj: number;
  birimFiyat: number;
  tutar: number;
  tarih: string;
}

/** Kredi listesi — legacy'de doğrulanan alanlar (Kredi Tutarı/Kullanılan/Kalan hariç) */
export interface SuKrediKayit {
  id: string;
  aboneNo: string;
  adSoyad: string;
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

export interface SuGenelFatura {
  id: string;
  faturaNo: string;
  aboneNo: string;
  adSoyad: string;
  gelirKodu: string;
  aciklama: string;
  tutar: number;
  donem: string;
  sonOdeme: string;
  durum: "kesildi" | "iptal";
}

export interface SuEkBakiyeKayit {
  id: string;
  aboneNo: string;
  adSoyad: string;
  bakiyeTuru: string;
  tutar: number;
  donem: string;
  aciklama: string;
  durum: "aktif" | "duzeltildi";
}

export interface SuCezaBasvuru {
  id: string;
  basvuruNo: string;
  aboneNo: string;
  adSoyad: string;
  basvuruTarihi: string;
  durum: "acik" | "onaylandi" | "reddedildi";
  toplamBorc: number;
  cezaTutar: number;
  indirimOrani: number;
  indirimTutar: number;
  yeniBorc: number;
  gerekce: string;
}

export interface SuCezaBorc {
  id: string;
  donem: string;
  gelirKodu: string;
  tutar: number;
  ceza: number;
}

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

export type SuOnOdemeliSistem = string;

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

export type SuDuzeltmeTur =
  | "fatura-duzeltme"
  | "abone-duzeltme"
  | "sayac-okuma-duzeltme"
  | "tahakkuk-duzeltme";

export interface SuDuzeltmeKayit {
  id: string;
  tur: SuDuzeltmeTur;
  aboneNo: string;
  referans: string;
  eskiDeger: string;
  yeniDeger: string;
  gerekce: string;
  kullanici: string;
  tarih: string;
}
