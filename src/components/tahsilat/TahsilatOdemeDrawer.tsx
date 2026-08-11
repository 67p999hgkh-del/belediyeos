"use client";

import { X } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { OdemeYontemi, TahsilatOzet } from "./useTahsilatOperasyon";
import type { TahsilatSicil } from "@/lib/tahsilat-mock";

interface TahsilatOdemeDrawerProps {
  acik: boolean;
  sicil: TahsilatSicil | null;
  ozet: TahsilatOzet;
  odemeYontemi: OdemeYontemi;
  setOdemeYontemi: (v: OdemeYontemi) => void;
  alinanTutar: string;
  setAlinanTutar: (v: string) => void;
  paraUstu: number;
  posRef: string;
  setPosRef: (v: string) => void;
  havaleRef: string;
  setHavaleRef: (v: string) => void;
  aciklama: string;
  setAciklama: (v: string) => void;
  veznePin: string;
  setVeznePin: (v: string) => void;
  onKapat: () => void;
  onTamamla: () => void;
}

const yontemler: { id: OdemeYontemi; label: string }[] = [
  { id: "nakit", label: "Nakit" },
  { id: "kart", label: "Kredi / Banka Kartı" },
  { id: "havale", label: "Havale / EFT" },
];

export function TahsilatOdemeDrawer({
  acik,
  sicil,
  ozet,
  odemeYontemi,
  setOdemeYontemi,
  alinanTutar,
  setAlinanTutar,
  paraUstu,
  posRef,
  setPosRef,
  havaleRef,
  setHavaleRef,
  aciklama,
  setAciklama,
  veznePin,
  setVeznePin,
  onKapat,
  onTamamla,
}: TahsilatOdemeDrawerProps) {
  const pinGecerli = veznePin.length >= 4;
  const nakitGecerli =
    odemeYontemi !== "nakit" ||
    parseFloat(alinanTutar.replace(",", ".")) >= ozet.genelToplam;

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-900/30 transition-opacity ${
          acik ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onKapat}
        aria-hidden={!acik}
      />
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-200 ${
          acik ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="odeme-drawer-title"
        aria-hidden={!acik}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-3">
          <h2 id="odeme-drawer-title" className="text-base font-semibold text-slate-900">
            Tahsilatı Tamamla
          </h2>
          <button
            type="button"
            onClick={onKapat}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <dl className="space-y-2 rounded-lg border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm">
            <div>
              <dt className="text-xs text-slate-500">Mükellef</dt>
              <dd className="font-medium text-slate-900">{sicil?.adSoyad ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <div>
                <dt className="text-xs text-slate-500">Seçilen Borç</dt>
                <dd className="font-medium text-slate-900">{ozet.seciliAdet} adet</dd>
              </div>
              <div className="text-right">
                <dt className="text-xs text-slate-500">Toplam</dt>
                <dd className="text-lg font-bold text-[#1e40af]">
                  {formatCurrency(ozet.genelToplam)}
                </dd>
              </div>
            </div>
          </dl>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              Ödeme Yöntemi
            </p>
            <div className="grid grid-cols-3 gap-2">
              {yontemler.map((y) => (
                <button
                  key={y.id}
                  type="button"
                  onClick={() => setOdemeYontemi(y.id)}
                  className={`rounded-lg border px-2 py-2.5 text-xs font-medium transition sm:text-sm ${
                    odemeYontemi === y.id
                      ? "border-[#1e40af] bg-blue-50 text-[#1e40af]"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {y.label}
                </button>
              ))}
            </div>
          </div>

          {odemeYontemi === "nakit" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <label htmlFor="alinan-tutar" className="label">
                  Alınan Tutar
                </label>
                <input
                  id="alinan-tutar"
                  type="text"
                  inputMode="decimal"
                  value={alinanTutar}
                  onChange={(e) => setAlinanTutar(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Para Üstü</label>
                <p className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm font-semibold tabular-nums text-slate-900">
                  {formatCurrency(paraUstu)}
                </p>
              </div>
            </div>
          )}

          {odemeYontemi === "kart" && (
            <div className="mt-4 space-y-3">
              <div>
                <label htmlFor="pos" className="label">
                  POS Seçimi
                </label>
                <select id="pos" className="input-field">
                  <option>Vezne POS — Terminal 1</option>
                  <option>Vezne POS — Terminal 2</option>
                </select>
              </div>
              <div>
                <label htmlFor="pos-ref" className="label">
                  İşlem / Referans No
                </label>
                <input
                  id="pos-ref"
                  type="text"
                  value={posRef}
                  onChange={(e) => setPosRef(e.target.value)}
                  className="input-field"
                  placeholder="Opsiyonel"
                />
              </div>
            </div>
          )}

          {odemeYontemi === "havale" && (
            <div className="mt-4">
              <label htmlFor="havale-ref" className="label">
                Havale Referans No
              </label>
              <input
                id="havale-ref"
                type="text"
                value={havaleRef}
                onChange={(e) => setHavaleRef(e.target.value)}
                className="input-field"
              />
            </div>
          )}

          <div className="mt-4">
            <label htmlFor="odeme-aciklama" className="label">
              Açıklama
            </label>
            <textarea
              id="odeme-aciklama"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              rows={2}
              className="input-field resize-none"
              placeholder="Opsiyonel not"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="vezne-pin" className="label">
              Vezne PIN / Şifre <span className="text-red-500">*</span>
            </label>
            <input
              id="vezne-pin"
              type="password"
              value={veznePin}
              onChange={(e) => setVeznePin(e.target.value)}
              className="input-field"
              autoComplete="off"
              placeholder="En az 4 karakter"
            />
          </div>
        </div>

        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <button type="button" onClick={onKapat} className="btn-secondary flex-1">
            İptal
          </button>
          <button
            type="button"
            onClick={onTamamla}
            disabled={!pinGecerli || !nakitGecerli}
            className="btn-primary flex-1"
          >
            Tahsilatı Tamamla
          </button>
        </div>
      </aside>
    </>
  );
}
