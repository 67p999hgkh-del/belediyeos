import type { LucideIcon } from "lucide-react";
import {
  Calendar,
  CalendarCheck,
  CalendarDays,
  ClipboardList,
  FileText,
  List,
  Palmtree,
  Settings,
  UserCheck,
} from "lucide-react";

export type IzinGroupId = "tanim" | "personel" | "kayit" | "liste";

export type IzinFrequency = "daily" | "periodic" | "admin";

export interface IzinModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: IzinGroupId;
  frequency: IzinFrequency;
}

export const izinModuleItems: IzinModuleItem[] = [
  {
    id: "izin-turu-tanim",
    label: "İzin Türü Tanımlama",
    description: "Yıllık, mazeret ve diğer izin türlerini tanımla",
    href: "/izin/izin-turu-tanim",
    icon: Settings,
    group: "tanim",
    frequency: "admin",
  },
  {
    id: "mazeret-tanim",
    label: "Mazeret İzin Tanımlama",
    description: "Mazeret izin türleri ve kurallarını tanımla",
    href: "/izin/mazeret-tanim",
    icon: FileText,
    group: "tanim",
    frequency: "admin",
  },
  {
    id: "tatil-gun-giris",
    label: "Tatil İzin Günü Girişi",
    description: "Resmi tatil ve izin günlerini sisteme gir",
    href: "/izin/tatil-gun-giris",
    icon: CalendarDays,
    group: "tanim",
    frequency: "admin",
  },
  {
    id: "personel-izin-turu",
    label: "Personel İzin Türü Girişi",
    description: "Personele izin türü ve hak ataması yap",
    href: "/izin/personel-izin-turu",
    icon: UserCheck,
    group: "personel",
    frequency: "daily",
  },
  {
    id: "devreden-izin",
    label: "Yıllık Devreden İzin Kaydı",
    description: "Geçmiş dönemden devreden izin bakiyesi gir",
    href: "/izin/devreden-izin",
    icon: Calendar,
    group: "personel",
    frequency: "periodic",
  },
  {
    id: "izin-kaydi",
    label: "İzin Kaydı",
    description: "Personel izin başvurusu kaydet ve onayla",
    href: "/izin/izin-kaydi",
    icon: CalendarCheck,
    group: "kayit",
    frequency: "daily",
  },
  {
    id: "mazeret-kaydi",
    label: "Mazeret İzin Kaydı",
    description: "Mazeret izni kaydı oluştur",
    href: "/izin/mazeret-kaydi",
    icon: ClipboardList,
    group: "kayit",
    frequency: "daily",
  },
  {
    id: "izin-listesi",
    label: "İzin Listesi",
    description: "Tüm izin kayıtlarını listele ve sorgula",
    href: "/izin/izin-listesi",
    icon: List,
    group: "liste",
    frequency: "daily",
  },
  {
    id: "izin-durum-liste",
    label: "İzin Durum Listesi",
    description: "Personel izin bakiye ve durum dökümü",
    href: "/izin/izin-durum-liste",
    icon: Palmtree,
    group: "liste",
    frequency: "daily",
  },
];

export const izinHubIcon = Palmtree;

export function getIzinItem(id: string) {
  return izinModuleItems.find((m) => m.id === id);
}

export function searchIzinItems(query: string) {
  const q = query.trim().toLocaleLowerCase("tr");
  if (!q) return [];

  return izinModuleItems.filter(
    (item) =>
      item.label.toLocaleLowerCase("tr").includes(q) ||
      item.description.toLocaleLowerCase("tr").includes(q),
  );
}

export const izinTotalItemCount = izinModuleItems.length;
