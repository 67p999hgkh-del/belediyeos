"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemurKayit } from "@/lib/memur/types";

interface PersonelAramaProps {
  value: string;
  onChange: (value: string) => void;
  onSearch?: () => void;
  placeholder?: string;
  className?: string;
}

export function PersonelArama({
  value,
  onChange,
  onSearch,
  placeholder = "Sicil no, ad soyad veya kimlik no…",
  className,
}: PersonelAramaProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-10 pr-4 text-sm outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

interface PersonelSeciciProps {
  memurlar: MemurKayit[];
  selectedId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function PersonelSecici({ memurlar, selectedId, onSelect, className }: PersonelSeciciProps) {
  return (
    <select
      value={selectedId}
      onChange={(e) => onSelect(e.target.value)}
      className={cn(
        "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#1e40af]",
        className,
      )}
    >
      <option value="">Personel seçin…</option>
      {memurlar.map((m) => (
        <option key={m.id} value={m.id}>
          {m.sicilNo} — {m.adSoyad}
        </option>
      ))}
    </select>
  );
}

interface DonemSeciciProps {
  yil: number;
  ay: number;
  onYilChange: (yil: number) => void;
  onAyChange: (ay: number) => void;
  yillar?: number[];
  className?: string;
}

export function DonemSecici({
  yil,
  ay,
  onYilChange,
  onAyChange,
  yillar = [2024, 2025, 2026],
  className,
}: DonemSeciciProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <select
        value={yil}
        onChange={(e) => onYilChange(Number(e.target.value))}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        {yillar.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>
      <select
        value={ay}
        onChange={(e) => onAyChange(Number(e.target.value))}
        className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        {Array.from({ length: 12 }, (_, i) => i + 1).map((a) => (
          <option key={a} value={a}>
            {a}. Ay
          </option>
        ))}
      </select>
    </div>
  );
}

interface MemurBilgiOzetiProps {
  memur: MemurKayit | undefined;
}

export function MemurBilgiOzeti({ memur }: MemurBilgiOzetiProps) {
  if (!memur) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-6 text-center text-sm text-slate-500">
        Personel seçilmedi
      </div>
    );
  }
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-slate-50/30 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-500">Sicil No</p>
        <p className="text-sm font-medium text-slate-900">{memur.sicilNo}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-500">Ad Soyad</p>
        <p className="text-sm font-medium text-slate-900">{memur.adSoyad}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-500">Birim / Mevki</p>
        <p className="text-sm text-slate-700">
          {memur.birim} — {memur.mevki}
        </p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase text-slate-500">Durum</p>
        <p className="text-sm capitalize text-slate-700">{memur.durum}</p>
      </div>
    </div>
  );
}

interface RaporFiltreSatiriProps {
  children: React.ReactNode;
  className?: string;
}

export function RaporFiltreSatiri({ children, className }: RaporFiltreSatiriProps) {
  return (
    <div className={cn("flex flex-wrap items-end gap-3 border-b border-slate-100 px-4 py-3", className)}>
      {children}
    </div>
  );
}

interface HesaplamaSonucTablosuProps {
  kalemler: { kod: string; aciklama: string; tutar: number | null }[];
  mesaj?: string;
}

export function HesaplamaSonucTablosu({ kalemler, mesaj }: HesaplamaSonucTablosuProps) {
  return (
    <div className="space-y-3">
      {mesaj && (
        <div className="rounded-lg border border-amber-200 bg-amber-50/80 px-4 py-2 text-sm text-amber-800">
          {mesaj}
        </div>
      )}
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
            <tr>
              <th className="px-4 py-2 text-left">Kod</th>
              <th className="px-4 py-2 text-left">Açıklama</th>
              <th className="px-4 py-2 text-right">Tutar</th>
            </tr>
          </thead>
          <tbody>
            {kalemler.map((k, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2">{k.kod}</td>
                <td className="px-4 py-2">{k.aciklama}</td>
                <td className="px-4 py-2 text-right">{k.tutar ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface YetkiGuardProps {
  yetkili: boolean;
  children: React.ReactNode;
  mesaj?: string;
}

export function YetkiGuard({
  yetkili,
  children,
  mesaj = "Bu işlem için yetkiniz bulunmuyor.",
}: YetkiGuardProps) {
  if (!yetkili) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-800">
        {mesaj}
      </div>
    );
  }
  return <>{children}</>;
}

interface PrintPreviewPanelProps {
  baslik: string;
  onYazdir?: () => void;
  onPdf?: () => void;
  children?: React.ReactNode;
}

export function PrintPreviewPanel({ baslik, onYazdir, onPdf, children }: PrintPreviewPanelProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <p className="text-sm font-medium text-slate-900">{baslik}</p>
        <div className="flex gap-2">
          <button type="button" onClick={onYazdir} className="btn-secondary text-xs">
            Yazdır
          </button>
          <button type="button" onClick={onPdf} className="btn-secondary text-xs">
            PDF
          </button>
        </div>
      </div>
      <div className="p-4">{children ?? <p className="text-sm text-slate-500">Önizleme — resmi form backend doğrulaması bekleniyor</p>}</div>
    </div>
  );
}

export function MemurAuditLogPanel({ kayitlar }: { kayitlar: import("@/lib/memur/audit").MemurAuditKayit[] }) {
  if (kayitlar.length === 0) return null;
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50">
      <div className="border-b border-slate-200 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">İşlem Geçmişi</p>
      </div>
      <div className="max-h-48 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-[10px] font-semibold uppercase text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-1.5 text-left">Tarih</th>
              <th className="px-3 py-1.5 text-left">Kullanıcı</th>
              <th className="px-3 py-1.5 text-left">İşlem</th>
              <th className="px-3 py-1.5 text-left">Gerekçe</th>
            </tr>
          </thead>
          <tbody>
            {kayitlar.map((k) => (
              <tr key={k.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5 text-slate-600">{k.tarih}</td>
                <td className="px-3 py-1.5">{k.kullanici}</td>
                <td className="px-3 py-1.5">{k.islem}</td>
                <td className="px-3 py-1.5 text-slate-500">{k.gerekce ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
