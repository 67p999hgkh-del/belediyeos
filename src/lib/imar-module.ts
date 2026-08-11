import type { LucideIcon } from "lucide-react";
import {
  Archive,
  Calculator,
  FileText,
  FolderOpen,
  List,
  ScrollText,
} from "lucide-react";

export type ImarGroupId = "islem" | "liste";

export interface ImarModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: ImarGroupId;
}

export const imarModuleItems: ImarModuleItem[] = [
  {
    id: "dosya-kayit",
    label: "İnşaat İzin — Dosya Kayıt",
    description: "Yeni inşaat izin dosyası aç ve kaydet",
    href: "/imar/dosya-kayit",
    icon: FolderOpen,
    group: "islem",
  },
  {
    id: "ruhsat-hesaplama",
    label: "İnşaat İzin — Ruhsat Hesaplama",
    description: "İnşaat ruhsat harç ve ücret hesaplama",
    href: "/imar/ruhsat-hesaplama",
    icon: Calculator,
    group: "islem",
  },
  {
    id: "dilekce",
    label: "İnşaat İzin Dilekçesi",
    description: "İnşaat izin dilekçesi oluştur ve yazdır",
    href: "/imar/dilekce",
    icon: ScrollText,
    group: "islem",
  },
  {
    id: "izin-listesi",
    label: "İnşaat İzinleri Listesi",
    description: "Tüm inşaat izinlerini listele ve sorgula",
    href: "/imar/izin-listesi",
    icon: List,
    group: "liste",
  },
  {
    id: "eski-giris",
    label: "Eski İnşaat İzinleri Girişi",
    description: "Eski dönem inşaat izin kayıtlarını gir",
    href: "/imar/eski-giris",
    icon: Archive,
    group: "liste",
  },
];

export const imarHubIcon = FileText;

export function getImarItem(id: string) {
  return imarModuleItems.find((m) => m.id === id);
}

export const imarTotalItemCount = imarModuleItems.length;
