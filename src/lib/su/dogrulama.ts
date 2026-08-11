/**
 * Su modülü doğrulama audit kaydı — alan/fonksiyon kaynak durumu.
 * UI değiştirilmez; bu dosya kod içi referans ve bakım için tutulur.
 */

export type SuDogrulamaKaynak =
  | "legacy-birnet"
  | "legacy-kod"
  | "backend-model"
  | "demo-mock"
  | "cursor-varsayim"
  | "henuz-dogrulanmadi";

export interface SuDogrulamaKayit {
  alan: string;
  kaynak: SuDogrulamaKaynak;
  not?: string;
}

/** Workspace fonksiyon doğrulama özeti */
export const suDogrulamaAudit: SuDogrulamaKayit[] = [
  // Abone
  { alan: "Abone Kayıt / Sorgulama / Detay", kaynak: "legacy-birnet" },
  { alan: "Abone No 4 parça format", kaynak: "legacy-birnet" },
  { alan: "F5/F8/F9/F12 kısayollar", kaynak: "legacy-birnet" },
  { alan: "Abone action menüsü (kapama, devir, vb.)", kaynak: "legacy-birnet" },
  { alan: "Abonelik türü / tarife listesi değerleri", kaynak: "henuz-dogrulanmadi", not: "Backend parametre bekliyor" },

  // Fatura
  { alan: "Dönem & Tahakkuk", kaynak: "legacy-birnet" },
  { alan: "Sayaç Okuma liste/giriş/değiştirme", kaynak: "legacy-birnet" },
  { alan: "Faturalandırma tekil/liste/yazdır/iptal", kaynak: "legacy-birnet" },
  { alan: "Toplu işlemler + raporlar", kaynak: "legacy-birnet" },
  { alan: "Fatura birim fiyat formülü (23.5)", kaynak: "cursor-varsayim", not: "Demo hesaplama; backend formül bekliyor" },

  // Düzeltme
  { alan: "4 düzeltme türü", kaynak: "legacy-birnet" },
  { alan: "Gerekçe + audit", kaynak: "legacy-birnet" },

  // El Terminali
  { alan: "Veri Hazırla / Veri Al / Geçmiş", kaynak: "legacy-birnet" },
  { alan: "Terminal tanım alanları (marka/seri)", kaynak: "henuz-dogrulanmadi", not: "Demo fixture; production'da gizli" },

  // Genel Fatura
  { alan: "Kayıt + Liste + Yazdır + Ekstre", kaynak: "legacy-birnet" },
  { alan: "199 — Ek Hizmet default gelir kodu", kaynak: "cursor-varsayim", not: "Kaldırıldı; seçim zorunlu" },

  // Kredi
  { alan: "Kredi Listesi", kaynak: "legacy-birnet" },
  { alan: "Kredi Geri Ödeme", kaynak: "legacy-birnet" },
  { alan: "Dönem/Tarih kredi raporları", kaynak: "legacy-birnet" },
  { alan: "Kredi Tutarı / Kullanılan / Kalan kolonları", kaynak: "cursor-varsayim", not: "Kaldırıldı; legacy'de doğrulanmadı" },
  { alan: "Kredi Yükleme", kaynak: "henuz-dogrulanmadi", not: "ASKIDA — implement edilmedi" },

  // Ek Bakiye
  { alan: "Giriş + Liste + Düzeltme", kaynak: "legacy-birnet" },
  { alan: "Bakiye türü sabit listesi", kaynak: "henuz-dogrulanmadi", not: "Config/backend bekliyor" },

  // Ceza İndirimi
  { alan: "Başvuru / Liste / Borç / Ekstre / Taahhütname", kaynak: "legacy-birnet" },
  { alan: "Varsayılan %50 indirim", kaynak: "cursor-varsayim", not: "Kaldırıldı; kullanıcı girişi zorunlu" },

  // Kanalizasyon
  { alan: "Bağlama + Liste", kaynak: "legacy-birnet" },
  { alan: "Demo kanal numaraları", kaynak: "demo-mock", not: "Fixture'a taşındı" },
  { alan: "Kanalizasyon Tahakkuk/Rapor/Abone", kaynak: "henuz-dogrulanmadi", not: "Production UI'da yok" },

  // Ön Ödemeli
  { alan: "Kart Okuma / İşlemler / Fatura Hesap / Satış Listesi", kaynak: "legacy-birnet" },
  { alan: "Baylan / Cem sistem ayrımı", kaynak: "henuz-dogrulanmadi", not: "Config'de; legacy ekran detayı bekliyor" },
];

export function getSuDogrulama(alan: string): SuDogrulamaKayit | undefined {
  return suDogrulamaAudit.find((k) => k.alan === alan);
}
