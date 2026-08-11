"use client";

import { CheckCircle2, FileDown, Printer, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { OdemeYontemi } from "./useTahsilatOperasyon";

interface TahsilatSuccessModalProps {
  acik: boolean;
  makbuzNo: string;
  toplam: number;
  odemeYontemi: OdemeYontemi;
  mukellefAd: string;
  onYeniTahsilat: () => void;
}

const odemeEtiket: Record<OdemeYontemi, string> = {
  nakit: "Nakit",
  kart: "Kredi / Banka Kartı",
  havale: "Havale / EFT",
};

export function TahsilatSuccessModal({
  acik,
  makbuzNo,
  toplam,
  odemeYontemi,
  mukellefAd,
  onYeniTahsilat,
}: TahsilatSuccessModalProps) {
  if (!acik) return null;

  const simdi = new Date();
  const tarihSaat = `${formatDate(simdi)} ${simdi.toLocaleTimeString("tr-TR", {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="success-title"
      >
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 id="success-title" className="text-lg font-semibold text-slate-900">
            Tahsilat Başarıyla Tamamlandı
          </h2>
          <p className="mt-1 text-sm text-slate-500">{mukellefAd}</p>
        </div>

        <dl className="mt-6 space-y-2 rounded-lg bg-slate-50 px-4 py-3 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Makbuz No</dt>
            <dd className="font-mono font-medium text-slate-900">{makbuzNo}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Toplam</dt>
            <dd className="font-semibold text-slate-900">{formatCurrency(toplam)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Ödeme</dt>
            <dd className="text-slate-900">{odemeEtiket[odemeYontemi]}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-slate-500">Tarih</dt>
            <dd className="text-slate-900">{tarihSaat}</dd>
          </div>
        </dl>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button type="button" className="btn-secondary flex-1">
            <Printer className="h-4 w-4" />
            Makbuz Yazdır
          </button>
          <button type="button" className="btn-secondary flex-1">
            <FileDown className="h-4 w-4" />
            PDF Makbuz
          </button>
        </div>
        <button type="button" onClick={onYeniTahsilat} className="btn-primary mt-2 w-full">
          <Plus className="h-4 w-4" />
          Yeni Tahsilat
        </button>
      </div>
    </div>
  );
}
