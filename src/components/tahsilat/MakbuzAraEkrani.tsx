"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileDown,
  Loader2,
  LogOut,
  Printer,
  RotateCcw,
  Search,
} from "lucide-react";
import {
  araMakbuzlar,
  getTahsilatTurleri,
  kriterBosMu,
  tarihAraligiGecersiz,
  type MakbuzAramaDurumu,
  type MakbuzAramaKriterleri,
  type MakbuzAramaSatir,
  type MakbuzIslemDurumu,
} from "@/lib/tahsilat-makbuz-mock";
import { cn, formatCurrency } from "@/lib/utils";

const defaultKriter: MakbuzAramaKriterleri = {
  adSoyad: "",
  baslangicTarihi: "",
  bitisTarihi: "",
  tahsilatTuru: "tumu",
  aboneNo: "",
  emlakSicilNo: "",
};

function AboneNoInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (parts: string[]) => void;
}) {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handlePart = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    const next = [...value];
    next[index] = digits;
    onChange(next);
    if (digits.length >= 2 && index < 3) refs[index + 1].current?.focus();
  };

  return (
    <div className="flex items-center gap-1">
      {value.map((part, i) => (
        <span key={i} className="flex items-center gap-1">
          <input
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={part}
            onChange={(e) => handlePart(i, e.target.value)}
            className="h-8 w-10 rounded border border-slate-200 bg-white px-1 text-center text-sm tabular-nums outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/15"
          />
          {i < 3 && <span className="text-slate-400">-</span>}
        </span>
      ))}
    </div>
  );
}

export function MakbuzAraEkrani() {
  const router = useRouter();
  const adInputRef = useRef<HTMLInputElement>(null);

  const [kriter, setKriter] = useState<MakbuzAramaKriterleri>(defaultKriter);
  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [aramaDurumu, setAramaDurumu] = useState<MakbuzAramaDurumu>("idle");
  const [sonuclar, setSonuclar] = useState<MakbuzAramaSatir[]>([]);
  const [seciliId, setSeciliId] = useState<string | null>(null);
  const [tarihHata, setTarihHata] = useState(false);
  const [islemDurumu, setIslemDurumu] = useState<MakbuzIslemDurumu>("idle");
  const [islemMesaj, setIslemMesaj] = useState("");

  const tahsilatTurleri = getTahsilatTurleri();
  const seciliKayit = sonuclar.find((s) => s.id === seciliId) ?? null;

  const handleAra = useCallback(async () => {
    if (aramaDurumu === "loading") return;

    if (tarihAraligiGecersiz(kriter.baslangicTarihi, kriter.bitisTarihi)) {
      setTarihHata(true);
      return;
    }
    setTarihHata(false);

    if (kriterBosMu({ ...kriter, aboneNo: aboneParca.join("") })) {
      setAramaDurumu("idle");
      setSonuclar([]);
      setSeciliId(null);
      return;
    }

    setAramaDurumu("loading");
    setIslemDurumu("idle");
    setIslemMesaj("");
    setSeciliId(null);

    await new Promise((r) => setTimeout(r, 350));

    try {
      const liste = araMakbuzlar({ ...kriter, aboneNo: aboneParca.join("") });
      setSonuclar(liste);
      setAramaDurumu(liste.length > 0 ? "bulundu" : "bulunamadi");
      if (liste.length === 1) setSeciliId(liste[0].id);
    } catch {
      setSonuclar([]);
      setAramaDurumu("hata");
    }
  }, [kriter, aboneParca, aramaDurumu]);

  const handleIptal = useCallback(() => {
    setKriter(defaultKriter);
    setAboneParca(["", "", "", ""]);
    setSonuclar([]);
    setSeciliId(null);
    setAramaDurumu("idle");
    setTarihHata(false);
    setIslemDurumu("idle");
    setIslemMesaj("");
    adInputRef.current?.focus();
  }, []);

  const handleEkran = useCallback(() => {
    if (!seciliKayit) return;
    router.push(`/tahsilat/makbuz-tekrar?no=${encodeURIComponent(seciliKayit.makbuzNo)}`);
  }, [router, seciliKayit]);

  const handleYazici = useCallback(async () => {
    if (!seciliKayit) return;
    setIslemDurumu("loading");
    setIslemMesaj("Makbuz yazıcıya gönderiliyor...");
    await new Promise((r) => setTimeout(r, 600));
    setIslemDurumu("basarili");
    setIslemMesaj(`${seciliKayit.makbuzNo} yazdırmaya hazır`);
  }, [seciliKayit]);

  const handleDosya = useCallback(async () => {
    if (!seciliKayit) return;
    setIslemDurumu("loading");
    setIslemMesaj("Dosyaya aktarılıyor...");
    await new Promise((r) => setTimeout(r, 500));
    setIslemDurumu("basarili");
    setIslemMesaj(`${seciliKayit.makbuzNo} dosyaya aktarıldı`);
  }, [seciliKayit]);

  const handleSatirSec = (satir: MakbuzAramaSatir) => {
    setSeciliId(satir.id);
    setIslemDurumu("idle");
    setIslemMesaj("");
  };

  const handleKlavyeSatir = useCallback(
    (delta: number) => {
      if (sonuclar.length === 0) return;
      const idx = seciliId ? sonuclar.findIndex((s) => s.id === seciliId) : -1;
      const next = Math.max(0, Math.min(sonuclar.length - 1, idx + delta));
      setSeciliId(sonuclar[next].id);
    },
    [sonuclar, seciliId],
  );

  useEffect(() => {
    adInputRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      const inputIci = tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";

      if (e.key === "F12") {
        e.preventDefault();
        router.push("/tahsilat");
        return;
      }
      if (e.key === "F5") {
        e.preventDefault();
        handleIptal();
        return;
      }
      if (e.key === "F9") {
        e.preventDefault();
        handleAra();
        return;
      }
      if (!inputIci && e.key === "ArrowDown") {
        e.preventDefault();
        handleKlavyeSatir(1);
      }
      if (!inputIci && e.key === "ArrowUp") {
        e.preventDefault();
        handleKlavyeSatir(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, handleIptal, handleAra, handleKlavyeSatir]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {/* Arama Kriterleri */}
      <div className="border-b border-slate-200 px-4 py-2.5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Arama Kriterleri
        </p>
        <div className="grid gap-x-6 gap-y-2 lg:grid-cols-2">
          {/* Sol kolon */}
          <div className="space-y-2">
            <div>
              <label htmlFor="ad-soyad" className="label">
                Adı ve Soyadı
              </label>
              <input
                ref={adInputRef}
                id="ad-soyad"
                type="text"
                value={kriter.adSoyad}
                onChange={(e) => setKriter((k) => ({ ...k, adSoyad: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleAra()}
                placeholder="Ad veya soyad girin"
                className="input-field h-8 py-1 text-sm"
              />
            </div>
            <div>
              <label className="label">Tarih Aralığı</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={kriter.baslangicTarihi}
                  onChange={(e) => {
                    setKriter((k) => ({ ...k, baslangicTarihi: e.target.value }));
                    setTarihHata(false);
                  }}
                  className="input-field h-8 flex-1 py-1 text-sm"
                  aria-label="Başlangıç Tarihi"
                />
                <span className="text-slate-400">—</span>
                <input
                  type="date"
                  value={kriter.bitisTarihi}
                  onChange={(e) => {
                    setKriter((k) => ({ ...k, bitisTarihi: e.target.value }));
                    setTarihHata(false);
                  }}
                  className="input-field h-8 flex-1 py-1 text-sm"
                  aria-label="Bitiş Tarihi"
                />
              </div>
              {tarihHata && (
                <p className="mt-1 text-xs text-red-600">
                  Başlangıç tarihi bitiş tarihinden büyük olamaz.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="tahsilat-turu" className="label">
                Tahsilat Türü
              </label>
              <select
                id="tahsilat-turu"
                value={kriter.tahsilatTuru}
                onChange={(e) => setKriter((k) => ({ ...k, tahsilatTuru: e.target.value }))}
                className="input-field h-8 py-1 text-sm"
              >
                {tahsilatTurleri.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Sağ kolon */}
          <div className="space-y-2">
            <div>
              <label className="label">Abone No</label>
              <AboneNoInput value={aboneParca} onChange={setAboneParca} />
            </div>
            <div>
              <label htmlFor="emlak-sicil" className="label">
                Emlak Sicil No
              </label>
              <input
                id="emlak-sicil"
                type="text"
                value={kriter.emlakSicilNo}
                onChange={(e) => setKriter((k) => ({ ...k, emlakSicilNo: e.target.value }))}
                onKeyDown={(e) => e.key === "Enter" && handleAra()}
                className="input-field h-8 py-1 text-sm"
              />
            </div>
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAra}
                disabled={aramaDurumu === "loading"}
                className="btn-primary inline-flex h-8 px-3 text-sm"
              >
                {aramaDurumu === "loading" ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Aranıyor...
                  </>
                ) : (
                  <>
                    <Search className="h-3.5 w-3.5" />
                    F9 — Ara
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* İşlem / hata mesajları */}
      {aramaDurumu === "hata" && (
        <div
          className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          Makbuzlar alınırken bir sorun oluştu. Lütfen tekrar deneyin.
        </div>
      )}
      {islemDurumu === "loading" && (
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-600">
          <Loader2 className="h-4 w-4 animate-spin text-[#1e40af]" />
          {islemMesaj}
        </div>
      )}
      {islemDurumu === "basarili" && (
        <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {islemMesaj}
        </div>
      )}

      {/* Sonuç sayısı */}
      {aramaDurumu === "bulundu" && (
        <div className="border-b border-slate-100 px-4 py-1.5 text-right text-xs text-slate-500">
          {sonuclar.length} kayıt bulundu
        </div>
      )}

      {/* Sonuç tablosu */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="px-4 py-2">Sicil No</th>
              <th className="px-4 py-2">Adı Soyadı</th>
              <th className="px-4 py-2">Makbuz No</th>
              <th className="px-4 py-2">Tarih</th>
              <th className="px-4 py-2 text-right">Toplam Cari</th>
            </tr>
          </thead>
          <tbody>
            {aramaDurumu === "loading" ? (
              <tr>
                <td colSpan={5} className="h-[140px] px-4 text-center align-middle">
                  <div className="flex flex-col items-center gap-2 text-sm text-slate-500">
                    <Loader2 className="h-5 w-5 animate-spin text-[#1e40af]" />
                    Makbuzlar aranıyor...
                  </div>
                </td>
              </tr>
            ) : aramaDurumu === "bulunamadi" ? (
              <tr>
                <td colSpan={5} className="h-[140px] px-4 text-center align-middle">
                  <p className="text-sm text-slate-600">
                    Arama kriterlerine uygun makbuz bulunamadı.
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Arama kriterlerini değiştirerek tekrar deneyin.
                  </p>
                </td>
              </tr>
            ) : sonuclar.length === 0 ? (
              <tr>
                <td colSpan={5} className="h-[140px] px-4 text-center align-middle text-sm text-slate-400">
                  Arama kriterlerini girerek tahsilat makbuzlarını görüntüleyin.
                </td>
              </tr>
            ) : (
              sonuclar.map((satir) => (
                <tr
                  key={satir.id}
                  onClick={() => handleSatirSec(satir)}
                  className={cn(
                    "h-10 cursor-pointer border-b border-slate-100 transition-colors hover:bg-slate-50/80",
                    seciliId === satir.id &&
                      "border-l-2 border-l-[#1e40af] bg-blue-50/40 hover:bg-blue-50/50",
                  )}
                >
                  <td className="px-4 py-1.5 font-medium text-slate-800">{satir.sicilNo}</td>
                  <td className="px-4 py-1.5 text-slate-700">{satir.adSoyad}</td>
                  <td className="px-4 py-1.5 font-mono text-xs text-slate-700">{satir.makbuzNo}</td>
                  <td className="px-4 py-1.5 tabular-nums text-slate-600">{satir.tarih}</td>
                  <td className="px-4 py-1.5 text-right font-medium tabular-nums text-slate-800">
                    {formatCurrency(satir.toplamCari)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Alt action bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleEkran}
            disabled={!seciliKayit}
            className="btn-secondary inline-flex"
          >
            <Eye className="h-4 w-4" />
            Ekran
          </button>
          <button
            type="button"
            onClick={handleYazici}
            disabled={!seciliKayit || islemDurumu === "loading"}
            className="btn-secondary inline-flex"
          >
            <Printer className="h-4 w-4" />
            Yazıcı
          </button>
          <button
            type="button"
            onClick={handleDosya}
            disabled={!seciliKayit || islemDurumu === "loading"}
            className="btn-secondary inline-flex"
          >
            <FileDown className="h-4 w-4" />
            Dosya
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={handleIptal} className="btn-secondary inline-flex">
            <RotateCcw className="h-4 w-4" />
            F5 — İptal
          </button>
          <Link href="/tahsilat" className="btn-ghost inline-flex">
            <LogOut className="h-4 w-4" />
            F12 — Çıkış
          </Link>
        </div>
      </div>
    </div>
  );
}
