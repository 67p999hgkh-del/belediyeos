/**
 * Su modülü mock repository — fixture'dan başlatılır, runtime'da mutable.
 * Production'da backend adapter ile değiştirilecek.
 */

import {
  FIXTURE_ABONE_BELGELER,
  FIXTURE_ABONE_FATURALAR,
  FIXTURE_ABONE_HAREKETLER,
  FIXTURE_ABONELER,
} from "@/mocks/su/fixtures";
import type {
  SuAboneBelge,
  SuAboneFatura,
  SuAboneHareket,
  SuAboneKayit,
  SuAktarimKayit,
  SuCezaBasvuru,
  SuCezaBorc,
  SuDuzeltmeKayit,
  SuEkBakiyeKayit,
  SuEkHizmetBorc,
  SuFaturaKayit,
  SuGenelFatura,
  SuKanalBaglanti,
  SuKrediGeriOdeme,
  SuKrediKayit,
  SuOnOdemeliSatis,
  SuSayacOkuma,
  SuTahakkukKayit,
  SuTankerKayit,
  SuTerminalTanim,
} from "@/lib/su/types";

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T;
}

/** Demo birim fiyat — backend formül bekliyor */
export const SU_DEMO_BIRIM_FIYAT = 23.5;

class SuMockStore {
  aboneler: SuAboneKayit[] = clone(FIXTURE_ABONELER);
  aboneFaturalar: Record<string, SuAboneFatura[]> = clone(FIXTURE_ABONE_FATURALAR);
  aboneHareketler: Record<string, SuAboneHareket[]> = clone(FIXTURE_ABONE_HAREKETLER);
  aboneBelgeler: Record<string, SuAboneBelge[]> = clone(FIXTURE_ABONE_BELGELER);

  tahakkuklar: SuTahakkukKayit[] = [
    { id: "t1", yil: 2026, donem: 1, aboneSayisi: 2184, tahakkukTutar: 842000, durum: "acik", olusturmaTarihi: "01.07.2026" },
    { id: "t2", yil: 2025, donem: 4, aboneSayisi: 2170, tahakkukTutar: 798500, durum: "kapali", olusturmaTarihi: "01.04.2026" },
  ];

  okumalar: SuSayacOkuma[] = [
    { id: "o1", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", sayacNo: "SN-884521", oncekiOkuma: 1240, yeniOkuma: 1258, tuketim: 18, okumaTarihi: "05.07.2026", durum: "girildi" },
    { id: "o2", aboneNo: "87-65-43-21", adSoyad: "Demo Abone 2", sayacNo: "SN-772198", oncekiOkuma: 890, yeniOkuma: 905, tuketim: 15, okumaTarihi: "05.07.2026", durum: "aktarildi" },
    { id: "o3", aboneNo: "11-22-33-44", adSoyad: "Demo Ticari Abone", sayacNo: "SN-559876", oncekiOkuma: 5420, yeniOkuma: 5510, tuketim: 90, okumaTarihi: "06.07.2026", durum: "faturalandi" },
  ];

  faturalar: SuFaturaKayit[] = [
    { id: "f1", faturaNo: "SU-2026-00142", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", donem: "2026/1", tuketim: 18, tutar: 420, sonOdeme: "15.08.2026", durum: "kesildi" },
    { id: "f2", faturaNo: "SU-2026-00089", aboneNo: "87-65-43-21", adSoyad: "Demo Abone 2", donem: "2026/1", tuketim: 15, tutar: 380, sonOdeme: "15.08.2026", durum: "kesildi" },
    { id: "f3", faturaNo: "SU-2026-00210", aboneNo: "11-22-33-44", adSoyad: "Demo Ticari Abone", donem: "2026/1", tuketim: 90, tutar: 2100, sonOdeme: "30.08.2026", durum: "kesildi" },
    { id: "f4", faturaNo: "SU-2026-00155", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", donem: "2026/1", tuketim: 18, tutar: 420, sonOdeme: "15.08.2026", durum: "taslak" },
  ];

  ekHizmetler: SuEkHizmetBorc[] = [
    { id: "e1", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", gelirKodu: "101", aciklama: "Sayaç söküm-takım", tutar: 150, donem: "2026/1" },
  ];

  tankerKayitlari: SuTankerKayit[] = [
    { id: "tk1", aboneNo: "11-22-33-44", adSoyad: "Demo Ticari Abone", tonaj: 12, birimFiyat: 85, tutar: 1020, tarih: "08.07.2026" },
  ];

  krediler: SuKrediKayit[] = [
    { id: "k1", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", sonIslem: "01.07.2026", durum: "aktif" },
    { id: "k2", aboneNo: "87-65-43-21", adSoyad: "Demo Abone 2", sonIslem: "15.06.2026", durum: "kapali" },
  ];

  geriOdemeler: SuKrediGeriOdeme[] = [
    { id: "go1", aboneNo: "12-34-56-78", tutar: 120, tarih: "01.07.2026", makbuzNo: "2026001180" },
  ];

  genelFaturalar: SuGenelFatura[] = [
    { id: "gf1", faturaNo: "GF-2026-0042", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", gelirKodu: "101", aciklama: "Bağlantı bedeli", tutar: 850, donem: "2026/1", sonOdeme: "30.08.2026", durum: "kesildi" },
    { id: "gf2", faturaNo: "GF-2026-0038", aboneNo: "11-22-33-44", adSoyad: "Demo Ticari Abone", gelirKodu: "101", aciklama: "Tesis katkı payı", tutar: 4200, donem: "2026/1", sonOdeme: "30.08.2026", durum: "kesildi" },
  ];

  ekBakiyeler: SuEkBakiyeKayit[] = [
    { id: "eb1", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", bakiyeTuru: "Ek Tüketim", tutar: 75, donem: "2026/1", aciklama: "Ek okuma farkı", durum: "aktif" },
    { id: "eb2", aboneNo: "11-22-33-44", adSoyad: "Demo Ticari Abone", bakiyeTuru: "Bağlantı Farkı", tutar: 200, donem: "2026/1", aciklama: "Site ortak alan", durum: "aktif" },
  ];

  cezaBasvurular: SuCezaBasvuru[] = [
    { id: "cb1", basvuruNo: "CI-2026-0012", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", basvuruTarihi: "05.08.2026", durum: "acik", toplamBorc: 838, cezaTutar: 42, indirimOrani: 40, indirimTutar: 16.8, yeniBorc: 821.2, gerekce: "Maddi zorluk" },
  ];

  kanalBaglantilar: SuKanalBaglanti[] = [
    { id: "kn1", aboneNo: "12-34-56-78", adSoyad: "Demo Abone 1", adres: "Erenköy Mah. Atatürk Cad. No:12", baglantiTarihi: "15.03.2024", kanalNo: "KN-DEMO-0142", durum: "aktif" },
    { id: "kn2", aboneNo: "11-22-33-44", adSoyad: "Demo Ticari Abone", adres: "Erenköy Mah. Site Sok. No:1", baglantiTarihi: "02.01.2023", kanalNo: "KN-DEMO-0089", durum: "aktif", aciklama: "Site ana bağlantı" },
  ];

  onOdemeliSatislar: SuOnOdemeliSatis[] = [
    { id: "s1", sistem: "Baylan", aboneNo: "45-67-89-01", adSoyad: "Demo Kart Abone 1", kartNo: "BL-DEMO-001", islem: "Kart Yükleme", tutar: 200, tarih: "10.08.2026 11:30", durum: "basarili" },
    { id: "s2", sistem: "Cem", aboneNo: "33-44-55-66", adSoyad: "Demo Kart Abone 2", kartNo: "CM-DEMO-001", islem: "Fatura Hesaplama", tutar: 85, tarih: "09.08.2026 15:12", durum: "basarili" },
  ];

  /** Demo terminal tanımları — legacy doğrulanmadı */
  terminaller: SuTerminalTanim[] = [
    { id: "t1", kod: "ET-01", marka: "Honeywell", seriNo: "HW-DEMO-001", durum: "aktif" },
    { id: "t2", kod: "ET-02", marka: "Honeywell", seriNo: "HW-DEMO-002", durum: "aktif" },
    { id: "t3", kod: "ET-03", marka: "Datalogic", seriNo: "DL-DEMO-014", durum: "pasif" },
  ];

  aktarimGecmisi: SuAktarimKayit[] = [
    { id: "a1", tarih: "11.08.2026 08:15", kullanici: "Demo Kullanıcı", dosya: "okuma_20260705.et", terminal: "ET-01", kayitSayisi: 186, basarili: 184, hatali: 1, uyarili: 1, durum: "uyarili", hataDetay: "1 kayıt: sayaç no eşleşmedi" },
    { id: "a2", tarih: "05.07.2026 17:40", kullanici: "Demo Kullanıcı", dosya: "okuma_20260701.et", terminal: "ET-02", kayitSayisi: 192, basarili: 192, hatali: 0, uyarili: 0, durum: "basarili" },
  ];

  duzeltmeKayitlari: SuDuzeltmeKayit[] = [
    { id: "d1", tur: "sayac-okuma-duzeltme", aboneNo: "12-34-56-78", referans: "2026/1 Okuma", eskiDeger: "1258", yeniDeger: "1256", gerekce: "Okuma giriş hatası", kullanici: "Demo Kullanıcı", tarih: "10.08.2026 14:22" },
  ];

  cezaBorclari: Record<string, SuCezaBorc[]> = {
    "12-34-56-78": [
      { id: "b1", donem: "2026/1", gelirKodu: "101", tutar: 420, ceza: 21 },
      { id: "b2", donem: "2025/4", gelirKodu: "101", tutar: 418, ceza: 21 },
    ],
  };

  onOdemeliKartlar: Record<string, { aboneNo: string; adSoyad: string; bakiye: number; sonIslem: string }> = {
    "BL-DEMO-001": { aboneNo: "45-67-89-01", adSoyad: "Demo Kart Abone 1", bakiye: 142.5, sonIslem: "10.08.2026" },
    "CM-DEMO-001": { aboneNo: "33-44-55-66", adSoyad: "Demo Kart Abone 2", bakiye: 68.0, sonIslem: "09.08.2026" },
  };
}

export const suMockStore = new SuMockStore();

export function isSuMockMode(): boolean {
  return process.env.NEXT_PUBLIC_SU_DATA_SOURCE !== "backend";
}
