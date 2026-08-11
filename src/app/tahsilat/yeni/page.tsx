"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, Save, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { formatCurrency } from "@/lib/utils";

const borcTurleri = [
  { id: "su", label: "Su Hizmetleri" },
  { id: "emlak", label: "Emlak Vergisi" },
  { id: "isyeri", label: "İşyeri Vergisi" },
  { id: "imar", label: "İmar & Ruhsat" },
  { id: "depozit", label: "Depozit" },
  { id: "fatura", label: "Genel Fatura" },
  { id: "taksitli", label: "Taksitli Borç" },
];

export default function YeniTahsilatPage() {
  const [sicilNo, setSicilNo] = useState("");
  const [borcTuru, setBorcTuru] = useState("su");
  const [tutar, setTutar] = useState("");
  const [odemeSekli, setOdemeSekli] = useState("nakit");
  const [aciklama, setAciklama] = useState("");

  const parsedTutar = parseFloat(tutar.replace(",", ".")) || 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Yeni Tahsilat"
        description="Vezne tahsilat kaydı oluşturun"
        breadcrumbs={[
          { label: "Kontrol Paneli", href: "/" },
          { label: "Tahsilat", href: "/tahsilat" },
          { label: "Yeni Tahsilat" },
        ]}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card-elevated lg:col-span-2">
          <div className="border-b border-slate-100 px-6 py-4">
            <h3 className="font-semibold text-slate-900">Tahsilat Bilgileri</h3>
            <p className="mt-0.5 text-sm text-slate-500">
              Zorunlu alanları doldurarak kaydı tamamlayın
            </p>
          </div>

          <div className="space-y-5 p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="sicil" className="label">
                  Sicil Numarası <span className="text-red-500">*</span>
                </label>
                <input
                  id="sicil"
                  type="text"
                  value={sicilNo}
                  onChange={(e) => setSicilNo(e.target.value)}
                  placeholder="Örn. 12345"
                  className="input-field"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="borc-turu" className="label">
                  Borç Türü <span className="text-red-500">*</span>
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
                  Tahsilat Tutarı <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    ₺
                  </span>
                  <input
                    id="tutar"
                    type="text"
                    inputMode="decimal"
                    value={tutar}
                    onChange={(e) => setTutar(e.target.value)}
                    placeholder="0,00"
                    className="input-field pl-8 text-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="odeme-sekli" className="label">
                  Ödeme Yöntemi
                </label>
                <select
                  id="odeme-sekli"
                  value={odemeSekli}
                  onChange={(e) => setOdemeSekli(e.target.value)}
                  className="input-field"
                >
                  <option value="nakit">Nakit</option>
                  <option value="kart">Kredi / Banka Kartı</option>
                  <option value="havale">Havale / EFT</option>
                  <option value="cek">Çek / Senet</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="aciklama" className="label">
                Açıklama
              </label>
              <textarea
                id="aciklama"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                rows={3}
                className="input-field resize-none"
                placeholder="İsteğe bağlı not ekleyin"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-100 px-6 py-4">
            <button type="button" className="btn-primary">
              <Save className="h-4 w-4" />
              Kaydet ve Makbuz Yazdır
            </button>
            <button type="button" className="btn-secondary">
              Kaydet
            </button>
            <Link href="/tahsilat" className="btn-ghost">
              <ArrowLeft className="h-4 w-4" />
              İptal
            </Link>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="text-sm font-semibold text-slate-900">İşlem Özeti</h4>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Sicil No</dt>
                <dd className="font-medium text-slate-900">{sicilNo || "—"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Borç Türü</dt>
                <dd className="font-medium text-slate-900">
                  {borcTurleri.find((t) => t.id === borcTuru)?.label}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-500">Ödeme</dt>
                <dd className="font-medium text-slate-900 capitalize">{odemeSekli}</dd>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <dt className="font-medium text-slate-700">Toplam</dt>
                  <dd className="text-2xl font-bold text-[#1e40af]">
                    {formatCurrency(parsedTutar)}
                  </dd>
                </div>
              </div>
            </dl>
          </div>

          <div className="card p-5">
            <h4 className="text-sm font-semibold text-slate-900">Ödeme Yöntemleri</h4>
            <ul className="mt-3 space-y-2 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-slate-400" />
                Nakit — anında makbuz
              </li>
              <li className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-400" />
                Kart — POS entegrasyonu
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
