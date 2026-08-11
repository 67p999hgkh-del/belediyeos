import type { LucideIcon } from "lucide-react";
import {
  CreditCard,
  Droplets,
  FileText,
  Gauge,
  Pencil,
  Percent,
  Smartphone,
  UserPlus,
  Waves,
  Wallet,
} from "lucide-react";

export interface SuModuleItem {
  id: string;
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  group: "abonelik" | "fatura" | "islem" | "altyapi" | "saha";
  hasSubMenu?: boolean;
}

export const suModuleItems: SuModuleItem[] = [
  {
    id: "abone",
    label: "Abone",
    description: "Su abonelik kayıt, sicil ve abone işlemleri",
    href: "/su/abone",
    icon: UserPlus,
    group: "abonelik",
    hasSubMenu: true,
  },
  {
    id: "fatura",
    label: "Fatura",
    description: "Su faturası oluşturma, düzenleme ve listeleme",
    href: "/su/fatura",
    icon: FileText,
    group: "fatura",
    hasSubMenu: true,
  },
  {
    id: "duzeltme",
    label: "Düzeltme",
    description: "Fatura ve abonelik düzeltme işlemleri",
    href: "/su/duzeltme",
    icon: Pencil,
    group: "islem",
    hasSubMenu: true,
  },
  {
    id: "el-terminali",
    label: "El Terminali",
    description: "Saha sayaç okuma ve el terminali aktarımı",
    href: "/su/el-terminali",
    icon: Smartphone,
    group: "saha",
    hasSubMenu: true,
  },
  {
    id: "genel-fatura",
    label: "Genel Fatura",
    description: "Toplu ve genel fatura işlemleri",
    href: "/su/genel-fatura",
    icon: FileText,
    group: "fatura",
    hasSubMenu: true,
  },
  {
    id: "kredi",
    label: "Kredi",
    description: "Abone kredi bakiye işlemleri",
    href: "/su/kredi",
    icon: CreditCard,
    group: "islem",
    hasSubMenu: true,
  },
  {
    id: "ek-bakiye",
    label: "Ek Bakiye",
    description: "Ek bakiye tanımlama ve takibi",
    href: "/su/ek-bakiye",
    icon: Wallet,
    group: "islem",
    hasSubMenu: true,
  },
  {
    id: "ceza-indirimi",
    label: "Ceza İndirimi",
    description: "Gecikme cezası indirim işlemleri",
    href: "/su/ceza-indirimi",
    icon: Percent,
    group: "islem",
    hasSubMenu: true,
  },
  {
    id: "kanalizasyon",
    label: "Kanalizasyon",
    description: "Kanalizasyon bedeli ve abonelik işlemleri",
    href: "/su/kanalizasyon",
    icon: Waves,
    group: "altyapi",
    hasSubMenu: true,
  },
  {
    id: "on-odemeli-sayac",
    label: "Ön Ödemeli Sayaçlar",
    description: "Ön ödemeli sayaç yönetimi ve bakiye işlemleri",
    href: "/su/on-odemeli-sayac",
    icon: Gauge,
    group: "altyapi",
    hasSubMenu: true,
  },
];

export const suModuleGroups = [
  { id: "abonelik" as const, label: "Abonelik Yönetimi" },
  { id: "fatura" as const, label: "Faturalandırma" },
  { id: "islem" as const, label: "Düzeltme & Bakiye" },
  { id: "altyapi" as const, label: "Altyapı Hizmetleri" },
  { id: "saha" as const, label: "Saha Operasyonları" },
];

export const suHubIcon = Droplets;
