"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer, Save } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency } from "@/lib/utils";

const borcTurleri = [
  { id: "su", label: "Su" },
  { id: "emlak", label: "Emlak" },
  { id: "isyeri", label: "İşyeri" },
  { id: "imar", label: "İmar" },
  { id: "depozit", label: "Depozit" },
  { id: "fatura", label: "Fatura" },
  { id: "taksitli", label: "Taksitli" },
];

export default function YeniTahsilatPage() {
  const [sicilNo, setSicilNo] = useState("");
  const [borcTuru, setBorcTuru] = useState("su");
  const [tutar, setTutar] = useState("");
  const [aciklama, setAciklama] = useState("");

  const parsedTutar = parseFloat(tutar.replace(",", ".")) || 0;

  return (
    <div>
      <PageHeader
        title="Yeni Tahsilat"
        description="Vezne tahsilat kaydı oluştur"
        breadcrumbs={[
          { label: "Ana Sayfa", href: "/" },
          { label: "Tahsilat", href: "/tahsilat" },
          { label: "Yeni Tahsilat" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h3 className="mb-4 font-semibold text-slate-900">Tahsilat Bilgileri</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="sicil" className="label">
                Sicil No
              </label>
              <input
                id="sicil"
                type="text"
                value={sicilNo}
                onChange={(e) => setSicilNo(e.target.value)}
                placeholder="Örn: 12345"
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="borc-turu" className="label">
                Borç Türü
              </label>
              <select
                id="borc-turu"
                value={borcTuru}
                onChange={(e) => setBorcTuru(e.target.value)}
                className="input-field"
              >
                {borcTurleri.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="tutar" className="label">
                Tahsilat Tutarı (₺)
              </label>
              <input
                id="tutar"
                type="text"
                inputMode="decimal"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
                placeholder="0,00"
                className="input-field text-lg font-semibold"
              />
            </div>

            <div>
              <label htmlFor="odeme-sekli" className="label">
                Ödeme Şekli
              </label>
              <select id="odeme-sekli" className="input-field" defaultValue="nakit">
                <option value="nakit">Nakit</option>
                <option value="kart">Kredi / Banka Kartı</option>
                <option value="havale">Havale / EFT</option>
                <option value="cek">Çek</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="aciklama" className="label">
                Açıklama
              </label>
              <textarea
                id="aciklama"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                rows={2}
                className="input-field resize-none"
                placeholder="İsteğe bağlı açıklama"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-6">
            <button type="button" className="btn-primary">
              <Save className="h-4 w-4" />
              Kaydet ve Makbuz Yazdır
            </button>
            <button type="button" className="btn-secondary">
              <Printer className="h-4 w-4" />
              Sadece Kaydet
            </button>
            <Link href="/tahsilat" className="btn-secondary">
              <ArrowLeft className="h-4 w-4" />
              İptal
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="mb-3 font-semibold text-slate-900">Özet</h4>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Sicil No</dt>
                <dd className="font-medium">{sicilNo || "—"}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Borç Türü</dt>
                <dd className="font-medium">
                  {borcTurleri.find((t) => t.id === borcTuru)?.label}
                </dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <dt className="font-medium text-slate-700">Toplam</dt>
                <dd className="text-lg font-bold text-municipal-700">
                  {formatCurrency(parsedTutar)}
                </dd>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h4 className="mb-2 font-semibold text-slate-900">Klavye Kısayolları</h4>
            <ul className="space-y-1 text-sm text-slate-500">
              <li>
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Ctrl+1</kbd> Yeni
                Tahsilat
              </li>
              <li>
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Ctrl+S</kbd> Kaydet
              </li>
              <li>
                <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">Ctrl+P</kbd> Makbuz
                Yazdır
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
