import type { LucideIcon } from "lucide-react";
import {
  ArrowLeftRight,
  ClipboardList,
  CreditCard,
  FileText,
  Gauge,
  List,
  Pencil,
  Plus,
  Printer,
  Search,
  Smartphone,
  Upload,
  UserPlus,
  Wallet,
  Waves,
  XCircle,
} from "lucide-react";
import { suModuleItems, type SuModuleItem } from "./su-module";

export interface SuSubMenuItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export interface SuSection extends SuModuleItem {
  subMenus: SuSubMenuItem[];
}

export const suSections: SuSection[] = [
  {
    ...suModuleItems.find((m) => m.id === "abone")!,
    subMenus: [
      { id: "kayit", label: "Abone Kayıt", description: "Yeni su aboneliği oluştur", href: "/su/abone/kayit", icon: Plus },
      { id: "liste", label: "Abone Listesi", description: "Tüm aboneleri listele ve filtrele", href: "/su/abone/liste", icon: List },
      { id: "sorgulama", label: "Abone Sorgulama", description: "Sicil veya isim ile abone ara", href: "/su/abone/sorgulama", icon: Search },
      { id: "kapama", label: "Abone Kapama / Açma", description: "Abonelik durumu değiştir", href: "/su/abone/kapama", icon: XCircle },
      { id: "devir", label: "Abone Devir / Nakil", description: "Abonelik devir ve nakil işlemleri", href: "/su/abone/devir", icon: ArrowLeftRight },
      { id: "sayac", label: "Sayaç Bilgileri", description: "Abone sayaç kayıt ve güncelleme", href: "/su/abone/sayac", icon: Gauge },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "fatura")!,
    subMenus: [
      { id: "tahakkuk", label: "Fatura Tahakkuk", description: "Dönem tahakkuku oluştur", href: "/su/fatura/tahakkuk", icon: FileText },
      { id: "kesme", label: "Fatura Kesme", description: "Tekil fatura kes", href: "/su/fatura/kesme", icon: Plus },
      { id: "liste", label: "Fatura Listesi", description: "Kesilen faturaları listele", href: "/su/fatura/liste", icon: List },
      { id: "yazdir", label: "Fatura Yazdırma", description: "Fatura basım ve tekrar yazdır", href: "/su/fatura/yazdir", icon: Printer },
      { id: "toplu", label: "Toplu Fatura Kesme", description: "Toplu fatura işlemi başlat", href: "/su/fatura/toplu", icon: ClipboardList },
      { id: "iptal", label: "Fatura İptal", description: "Hatalı faturayı iptal et", href: "/su/fatura/iptal", icon: XCircle },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "duzeltme")!,
    subMenus: [
      { id: "fatura", label: "Fatura Düzeltme", description: "Kesilmiş fatura düzeltme", href: "/su/duzeltme/fatura", icon: Pencil },
      { id: "abone", label: "Abone Düzeltme", description: "Abone bilgisi düzeltme", href: "/su/duzeltme/abone", icon: UserPlus },
      { id: "sayac", label: "Sayaç Okuma Düzeltme", description: "Okuma değeri düzeltme", href: "/su/duzeltme/sayac", icon: Gauge },
      { id: "tahakkuk", label: "Tahakkuk Düzeltme", description: "Tahakkuk kaydı düzeltme", href: "/su/duzeltme/tahakkuk", icon: FileText },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "el-terminali")!,
    subMenus: [
      { id: "aktarim", label: "Okuma Aktarımı", description: "El terminalinden okuma aktar", href: "/su/el-terminali/aktarim", icon: Upload },
      { id: "liste", label: "Okuma Listesi", description: "Aktarılan okumaları görüntüle", href: "/su/el-terminali/liste", icon: List },
      { id: "tanim", label: "Terminal Tanımları", description: "El terminali cihaz tanımları", href: "/su/el-terminali/tanim", icon: Smartphone },
      { id: "rapor", label: "Saha Okuma Raporu", description: "Saha okuma dökümü al", href: "/su/el-terminali/rapor", icon: ClipboardList },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "genel-fatura")!,
    subMenus: [
      { id: "kesme", label: "Genel Fatura Kesme", description: "Genel fatura oluştur", href: "/su/genel-fatura/kesme", icon: Plus },
      { id: "liste", label: "Genel Fatura Listesi", description: "Genel faturaları listele", href: "/su/genel-fatura/liste", icon: List },
      { id: "tahakkuk", label: "Genel Tahakkuk", description: "Genel tahakkuk işlemleri", href: "/su/genel-fatura/tahakkuk", icon: FileText },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "kredi")!,
    subMenus: [
      { id: "yukleme", label: "Kredi Yükleme", description: "Abone kredi bakiyesi yükle", href: "/su/kredi/yukleme", icon: CreditCard },
      { id: "liste", label: "Kredi Listesi", description: "Kredi işlem geçmişi", href: "/su/kredi/liste", icon: List },
      { id: "sorgulama", label: "Kredi Bakiye Sorgulama", description: "Güncel bakiye sorgula", href: "/su/kredi/sorgulama", icon: Search },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "ek-bakiye")!,
    subMenus: [
      { id: "tanim", label: "Ek Bakiye Tanımlama", description: "Yeni ek bakiye kaydı", href: "/su/ek-bakiye/tanim", icon: Plus },
      { id: "liste", label: "Ek Bakiye Listesi", description: "Tüm ek bakiye kayıtları", href: "/su/ek-bakiye/liste", icon: List },
      { id: "duzeltme", label: "Ek Bakiye Düzeltme", description: "Ek bakiye düzeltme işlemi", href: "/su/ek-bakiye/duzeltme", icon: Pencil },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "ceza-indirimi")!,
    subMenus: [
      { id: "tanim", label: "Ceza İndirimi Tanımlama", description: "Yeni ceza indirimi uygula", href: "/su/ceza-indirimi/tanim", icon: Plus },
      { id: "liste", label: "Ceza İndirimi Listesi", description: "Uygulanan indirimleri listele", href: "/su/ceza-indirimi/liste", icon: List },
      { id: "sorgulama", label: "Ceza İndirimi Sorgulama", description: "Abone ceza indirimi sorgula", href: "/su/ceza-indirimi/sorgulama", icon: Search },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "kanalizasyon")!,
    subMenus: [
      { id: "tahakkuk", label: "Kanalizasyon Tahakkuk", description: "Kanalizasyon bedeli tahakkuk", href: "/su/kanalizasyon/tahakkuk", icon: Waves },
      { id: "abone", label: "Kanalizasyon Abone", description: "Kanalizasyon abonelik işlemleri", href: "/su/kanalizasyon/abone", icon: UserPlus },
      { id: "rapor", label: "Kanalizasyon Raporu", description: "Kanalizasyon döküm raporu", href: "/su/kanalizasyon/rapor", icon: ClipboardList },
    ],
  },
  {
    ...suModuleItems.find((m) => m.id === "on-odemeli-sayac")!,
    subMenus: [
      { id: "tanim", label: "Sayaç Tanımlama", description: "Ön ödemeli sayaç kaydı", href: "/su/on-odemeli-sayac/tanim", icon: Plus },
      { id: "yukleme", label: "Bakiye Yükleme", description: "Sayaç bakiyesi yükle", href: "/su/on-odemeli-sayac/yukleme", icon: Wallet },
      { id: "liste", label: "Sayaç Listesi", description: "Tüm ön ödemeli sayaçlar", href: "/su/on-odemeli-sayac/liste", icon: List },
      { id: "rapor", label: "Tüketim Raporu", description: "Tüketim ve bakiye raporu", href: "/su/on-odemeli-sayac/rapor", icon: Gauge },
    ],
  },
];

export function getSuSection(sectionId: string): SuSection | undefined {
  return suSections.find((s) => s.id === sectionId);
}

export function getSuSubMenuItem(sectionId: string, actionId: string): SuSubMenuItem | undefined {
  const section = getSuSection(sectionId);
  return section?.subMenus.find((s) => s.id === actionId);
}
