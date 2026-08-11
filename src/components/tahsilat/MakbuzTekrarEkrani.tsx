"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  Printer,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  araMakbuz,
  hesaplaMakbuzToplam,
  type MakbuzAramaDurumu,
  type MakbuzKayit,
  type MakbuzYazdirDurumu,
} from "@/lib/tahsilat-makbuz-mock";
import { cn, formatCurrency } from "@/lib/utils";

function BilgiAlani({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-800">{value || "—"}</dd>
    </div>
  );
}

export function MakbuzTekrarEkrani() {
  const router = useRouter();
  const makbuzInputRef = useRef<HTMLInputElement>(null);

  const [makbuzNo, setMakbuzNo] = useState("");
  const [aramaDurumu, setAramaDurumu] = useState<MakbuzAramaDurumu>("idle");
  const [kayit, setKayit] = useState<MakbuzKayit | null>(null);
  const [yazdirDurumu, setYazdirDurumu] = useState<MakbuzYazdirDurumu>("idle");
  const [yazdirMesaj, setYazdirMesaj] = useState("");

  const toplam = useMemo(
    () => (kayit ? hesaplaMakbuzToplam(kayit.satirlar) : 0),
    [kayit],
  );

  const handleAra = useCallback(async () => {
    const q = makbuzNo.trim();
    if (!q) {
      setAramaDurumu("idle");
      setKayit(null);
      return;
    }
    setAramaDurumu("loading");
    setYazdirDurumu("idle");
    setYazdirMesaj("");
    await new Promise((r) => setTimeout(r, 300));
    try {
      const sonuc = araMakbuz(q);
      if (!sonuc) {
        setKayit(null);
        setAramaDurumu("bulunamadi");
        return;
      }
      setKayit(sonuc);
      setMakbuzNo(sonuc.makbuzNo);
      setAramaDurumu("bulundu");
    } catch {
      setKayit(null);
      setAramaDurumu("hata");
    }
  }, [makbuzNo]);

  const handleTemizle = useCallback(() => {
    setMakbuzNo("");
    setKayit(null);
    setAramaDurumu("idle");
    setYazdirDurumu("idle");
    setYazdirMesaj("");
    makbuzInputRef.current?.focus();
  }, []);

  const handleYazdir = useCallback(async () => {
    if (!kayit) {
      setYazdirDurumu("hata");
      setYazdirMesaj("Önce bir makbuz sorgulayın.");
      return;
    }
    setYazdirDurumu("loading");
    setYazdirMesaj("Makbuz hazırlanıyor...");
    await new Promise((r) => setTimeout(r, 600));
    setYazdirDurumu("basarili");
    setYazdirMesaj("Makbuz yazdırmaya hazır");
  }, [kayit]);

  useEffect(() => {
    makbuzInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
        router.push("/tahsilat");
        return;
      }
      if (e.key === "F5") {
        e.preventDefault();
        handleTemizle();
        return;
      }
      if (e.key === "F8") {
        e.preventDefault();
        handleYazdir();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, handleTemizle, handleYazdir]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Makbuz No arama */}
      <div className="border-b border-slate-200 px-4 py-3">
        <label htmlFor="makbuz-no" className="mb-1.5 block text-sm font-medium text-slate-700">
          Makbuz No
        </label>
        <div className="flex max-w-xl overflow-hidden rounded-lg border border-slate-200 shadow-sm focus-within:border-[#1e40af] focus-within:ring-2 focus-within:ring-[#1e40af]/15">
          <input
            ref={makbuzInputRef}
            id="makbuz-no"
            type="text"
            value={makbuzNo}
            onChange={(e) => setMakbuzNo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAra()}
            placeholder="Makbuz numarasını girin"
            className="min-w-0 flex-1 border-0 px-3 py-2.5 text-sm outline-none"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={handleAra}
            disabled={aramaDurumu === "loading"}
            className="inline-flex shrink-0 items-center gap-1.5 border-l border-slate-200 bg-[#1e40af] px-4 text-sm font-medium text-white transition hover:bg-[#1e3a8a] disabled:opacity-60"
          >
            {aramaDurumu === "loading" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Search className="h-4 w-4" />
            )}
            Makbuz Ara
          </button>
        </div>
      </div>

      {/* Uyarı mesajları */}
      {aramaDurumu === "bulunamadi" && (
        <div className="flex items-start gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2.5 text-sm text-amber-800" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-medium">Bu numaraya ait makbuz bulunamadı.</p>
            <p className="mt-0.5 text-xs text-amber-700/90">
              Makbuz numarasını kontrol ederek tekrar deneyin.
            </p>
          </div>
        </div>
      )}
      {aramaDurumu === "hata" && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
          Sorgulama sırasında bir hata oluştu. Lütfen tekrar deneyin.
        </div>
      )}
      {yazdirDurumu === "hata" && yazdirMesaj && (
        <div className="border-b border-red-100 bg-red-50 px-4 py-2.5 text-sm text-red-700" role="alert">
          {yazdirMesaj}
        </div>
      )}
      {yazdirDurumu === "loading" && (
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin text-[#1e40af]" />
          {yazdirMesaj}
        </div>
      )}
      {yazdirDurumu === "basarili" && (
        <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {yazdirMesaj}
        </div>
      )}

      {/* Makbuz bilgileri — eski sıra korunur */}
      <div className="border-b border-slate-100 px-4 py-3">
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <BilgiAlani label="Tarih" value={kayit?.tarih ?? ""} />
          <BilgiAlani label="Müstahlik No" value={kayit?.mustahlikNo ?? ""} />
          <BilgiAlani label="Adı Soyadı" value={kayit?.adSoyad ?? ""} />
          <BilgiAlani label="Çek No" value={kayit?.cekNo ?? ""} />
          <BilgiAlani label="Tahsildar" value={kayit?.tahsildar ?? ""} />
          <div className="sm:col-span-2 lg:col-span-3">
            <BilgiAlani label="Adresi" value={kayit?.adres ?? ""} />
          </div>
        </dl>
      </div>

      {/* Tahsilat detay tablosu */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-2.5">Tahsilat Türü</th>
              <th className="px-4 py-2.5">Cari Dönem</th>
              <th className="px-4 py-2.5 text-right">Bakiye</th>
              <th className="px-4 py-2.5 text-right">Gecikme Zammı</th>
              <th className="px-4 py-2.5 text-right">KDV</th>
            </tr>
          </thead>
          <tbody>
            {aramaDurumu === "loading" ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-400" />
                </td>
              </tr>
            ) : !kayit ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-400">
                  Makbuz numarası girerek tahsilat bilgilerini görüntüleyin.
                </td>
              </tr>
            ) : kayit.satirlar.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                  Makbuz detay satırı bulunmuyor.
                </td>
              </tr>
            ) : (
              kayit.satirlar.map((satir) => (
                <tr
                  key={satir.id}
                  className="border-b border-slate-100 transition-colors hover:bg-slate-50/80"
                >
                  <td className="px-4 py-2.5 font-medium text-slate-800">{satir.tahsilatTuru}</td>
                  <td className="px-4 py-2.5 tabular-nums text-slate-600">{satir.cariDonem}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {formatCurrency(satir.bakiye)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {formatCurrency(satir.gecikmeZammi)}
                  </td>
                  <td className="px-4 py-2.5 text-right tabular-nums text-slate-700">
                    {formatCurrency(satir.kdv)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Toplam + Açıklama */}
      <div className="border-t border-slate-100 px-4 py-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1">
            <label className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
              Açıklama
            </label>
            <p className="mt-1 min-h-[2rem] text-sm text-slate-700">
              {kayit?.aciklama || "—"}
            </p>
          </div>
          <div className="shrink-0 text-right sm:pl-6">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Toplam
            </p>
            <p
              className={cn(
                "text-2xl font-bold tabular-nums tracking-tight",
                kayit ? "text-[#1e40af]" : "text-slate-300",
              )}
            >
              {formatCurrency(toplam)}
            </p>
          </div>
        </div>
      </div>

      {/* Alt işlem barı — F8 / F5 / F12 */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-3">
        <button
          type="button"
          onClick={handleYazdir}
          disabled={!kayit || yazdirDurumu === "loading"}
          className="btn-primary inline-flex"
        >
          <Printer className="h-4 w-4" />
          Makbuz Yazdır
          <kbd className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-normal">F8</kbd>
        </button>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleTemizle} className="btn-secondary inline-flex">
            <RotateCcw className="h-4 w-4" />
            İptal
            <kbd className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
              F5
            </kbd>
          </button>
          <Link href="/tahsilat" className="btn-ghost inline-flex">
            <LogOut className="h-4 w-4" />
            Çıkış
            <kbd className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
              F12
            </kbd>
          </Link>
        </div>
      </div>
    </div>
  );
}
