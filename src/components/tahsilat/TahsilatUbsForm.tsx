"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  LogOut,
  RotateCcw,
  Save,
  Search,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  aramaSicil,
  filtreleBorclar,
  gelirKodlari,
  sicilTipleri,
  tahsildarlar,
  type TahsilatAramaSekmesi,
  type TahsilatBorcRow,
} from "@/lib/tahsilat-mock";
import { cn, formatCurrency } from "@/lib/utils";

const aramaSekmeleri: { id: TahsilatAramaSekmesi; label: string }[] = [
  { id: "su-isyeri", label: "Su / İşyeri Abone No" },
  { id: "emlak", label: "Emlak Beyan No" },
  { id: "imar", label: "İmar İzinleri" },
  { id: "kimlik", label: "Kimlik No" },
];

const aramaPlaceholder: Record<TahsilatAramaSekmesi, string> = {
  "su-isyeri": "Abone numarası",
  "emlak": "Beyan numarası",
  imar: "İzin numarası",
  kimlik: "TC Kimlik No",
};

const demoArama: Record<TahsilatAramaSekmesi, string> = {
  "su-isyeri": "12-34-56-78",
  emlak: "12345678",
  imar: "12345678",
  kimlik: "12345678",
};

function AboneNoInput({
  value,
  onChange,
  onSearch,
}: {
  value: string[];
  onChange: (parts: string[]) => void;
  onSearch: () => void;
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
    if (digits.length >= 2 && index < 3) {
      refs[index + 1].current?.focus();
    }
  };

  return (
    <div className="flex items-center gap-1.5">
      {value.map((part, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <input
            ref={refs[i]}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={part}
            onChange={(e) => handlePart(i, e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-12 rounded-lg border border-slate-200 bg-white px-2 py-2 text-center text-sm font-medium outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/10"
          />
          {i < 3 && <span className="text-slate-400">-</span>}
        </span>
      ))}
    </div>
  );
}

export function TahsilatUbsForm() {
  const router = useRouter();
  const { user } = useApp();

  const [tahsildar, setTahsildar] = useState("ayse");
  const [tarih, setTarih] = useState(() => new Date().toISOString().slice(0, 10));
  const [sifre, setSifre] = useState("");
  const [sifreOk, setSifreOk] = useState<boolean | null>(null);

  const [aramaSekmesi, setAramaSekmesi] = useState<TahsilatAramaSekmesi>("su-isyeri");
  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [tekArama, setTekArama] = useState("");

  const [sicil, setSicil] = useState<{ adSoyad: string; adres: string } | null>(null);
  const [tumBorclar, setTumBorclar] = useState<TahsilatBorcRow[]>([]);
  const [secili, setSecili] = useState<Record<string, boolean>>({});
  const [odemeTutarlari, setOdemeTutarlari] = useState<Record<string, string>>({});

  const [sicilTipi, setSicilTipi] = useState("tumu");
  const [yil, setYil] = useState("tumu");
  const [donem, setDonem] = useState("tumu");
  const [veOncesi, setVeOncesi] = useState(true);
  const [gelirKodu, setGelirKodu] = useState("tumu");
  const [refNo, setRefNo] = useState("");

  const [cekNo, setCekNo] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [kaydedildi, setKaydedildi] = useState(false);

  const aramaMetni =
    aramaSekmesi === "su-isyeri" ? aboneParca.join("") : tekArama.replace(/\D/g, "");

  const filtrelenmisBorclar = useMemo(
    () =>
      filtreleBorclar(tumBorclar, {
        sicilTipi,
        yil,
        donem,
        veOncesi,
        gelirKodu,
        refNo,
      }),
    [tumBorclar, sicilTipi, yil, donem, veOncesi, gelirKodu, refNo],
  );

  const toplamOdeme = useMemo(() => {
    return filtrelenmisBorclar.reduce((sum, row) => {
      if (!secili[row.id]) return sum;
      const tutar = parseFloat((odemeTutarlari[row.id] ?? String(row.toplam)).replace(",", "."));
      return sum + (Number.isFinite(tutar) ? tutar : 0);
    }, 0);
  }, [filtrelenmisBorclar, secili, odemeTutarlari]);

  const handleSifreBlur = () => {
    if (!sifre) {
      setSifreOk(null);
      return;
    }
    setSifreOk(sifre.length >= 4);
  };

  const handleArama = useCallback(() => {
    const sonuc = aramaSicil(aramaMetni, aramaSekmesi);
    if (!sonuc) {
      setSicil(null);
      setTumBorclar([]);
      setSecili({});
      setOdemeTutarlari({});
      return;
    }
    setSicil(sonuc.sicil);
    setTumBorclar(sonuc.borclar);
    setSecili({});
    setOdemeTutarlari({});
    setKaydedildi(false);
  }, [aramaMetni, aramaSekmesi]);

  const toggleSatir = (row: TahsilatBorcRow, checked: boolean) => {
    setSecili((prev) => ({ ...prev, [row.id]: checked }));
    if (checked && !odemeTutarlari[row.id]) {
      setOdemeTutarlari((prev) => ({
        ...prev,
        [row.id]: row.toplam.toFixed(2).replace(".", ","),
      }));
    }
  };

  const tumunuSec = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    const tutarlar: Record<string, string> = { ...odemeTutarlari };
    filtrelenmisBorclar.forEach((row) => {
      next[row.id] = checked;
      if (checked) {
        tutarlar[row.id] = row.toplam.toFixed(2).replace(".", ",");
      }
    });
    setSecili(next);
    setOdemeTutarlari(tutarlar);
  };

  const handleKaydet = useCallback(() => {
    if (toplamOdeme <= 0) return;
    setKaydedildi(true);
  }, [toplamOdeme]);

  const handleIptal = () => {
    setSecili({});
    setOdemeTutarlari({});
    setCekNo("");
    setAciklama("");
    setKaydedildi(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F8") {
        e.preventDefault();
        handleKaydet();
      }
      if (e.key === "F5") {
        e.preventDefault();
        handleIptal();
      }
      if (e.key === "F12") {
        e.preventDefault();
        router.push("/tahsilat");
      }
      if (e.key === "F9" && aramaSekmesi === "su-isyeri") {
        e.preventDefault();
        handleArama();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleArama, aramaSekmesi, router, handleKaydet]);

  const defaultTahsildar = tahsildarlar.find((t) =>
    t.label.toLocaleLowerCase("tr").includes(user.name.split(" ")[0].toLocaleLowerCase("tr")),
  );

  return (
    <div className="space-y-4">
      {/* Üst: Tahsildar / Tarih / Şifre */}
      <div className="card p-4 sm:p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="tahsildar" className="label">
              Tahsildar
            </label>
            <select
              id="tahsildar"
              value={tahsildar || defaultTahsildar?.id}
              onChange={(e) => setTahsildar(e.target.value)}
              className="input-field"
            >
              {tahsildarlar.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tahsilat-tarihi" className="label">
              Tahsilat Tarihi
            </label>
            <input
              id="tahsilat-tarihi"
              type="date"
              value={tarih}
              onChange={(e) => setTarih(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="sifre" className="label">
              Şifre
            </label>
            <div className="flex items-center gap-2">
              <input
                id="sifre"
                type="password"
                value={sifre}
                onChange={(e) => {
                  setSifre(e.target.value);
                  setSifreOk(null);
                }}
                onBlur={handleSifreBlur}
                className="input-field"
                autoComplete="off"
              />
              <span
                className={cn(
                  "h-9 w-9 shrink-0 rounded-lg border",
                  sifreOk === true && "border-emerald-300 bg-emerald-50",
                  sifreOk === false && "border-red-300 bg-red-50",
                  sifreOk === null && "border-slate-200 bg-slate-50",
                )}
                title={sifreOk === false ? "Şifre geçersiz" : sifreOk === true ? "Şifre OK" : ""}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Arama sekmeleri */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap gap-0 border-b border-slate-200 bg-slate-50/80">
          {aramaSekmeleri.map((sekme) => (
            <button
              key={sekme.id}
              type="button"
              onClick={() => setAramaSekmesi(sekme.id)}
              className={cn(
                "px-4 py-3 text-sm font-medium transition",
                aramaSekmesi === sekme.id
                  ? "border-b-2 border-[#1e40af] bg-white text-[#1e40af]"
                  : "text-slate-500 hover:text-slate-800",
              )}
            >
              {sekme.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">
              {aramaPlaceholder[aramaSekmesi]}
            </p>
            {aramaSekmesi === "su-isyeri" ? (
              <AboneNoInput value={aboneParca} onChange={setAboneParca} onSearch={handleArama} />
            ) : (
              <input
                type="text"
                value={tekArama}
                onChange={(e) => setTekArama(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleArama()}
                placeholder={demoArama[aramaSekmesi]}
                className="input-field max-w-xs"
              />
            )}
            <p className="mt-2 text-xs text-slate-400">
              Demo: {demoArama[aramaSekmesi]} ile arayın
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {aramaSekmesi === "su-isyeri" && (
              <>
                <button type="button" onClick={handleArama} className="btn-secondary text-xs">
                  <Search className="h-3.5 w-3.5" />
                  F9 — Su Sicil Ara
                </button>
                <button type="button" onClick={handleArama} className="btn-secondary text-xs">
                  <Search className="h-3.5 w-3.5" />
                  F10 — İşyeri Sicil Ara
                </button>
              </>
            )}
            {aramaSekmesi !== "su-isyeri" && (
              <button type="button" onClick={handleArama} className="btn-secondary">
                <Search className="h-4 w-4" />
                Ara
              </button>
            )}
            <button type="button" className="btn-secondary">
              <CreditCard className="h-4 w-4" />
              Kart Oku
            </button>
          </div>
        </div>
      </div>

      {/* Sicil bilgileri */}
      <div className="card p-4 sm:p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Sicil Bilgileri</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Adı Soyadı (Ünvanı)</label>
            <input
              readOnly
              value={sicil?.adSoyad ?? ""}
              placeholder="Sicil araması yapın"
              className="input-field bg-slate-50"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Adres</label>
            <input
              readOnly
              value={sicil?.adres ?? ""}
              placeholder="—"
              className="input-field bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Filtre */}
      <div className="card p-4 sm:p-5">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Filtre</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <div>
            <label className="label">Sicil Tipi</label>
            <select
              value={sicilTipi}
              onChange={(e) => setSicilTipi(e.target.value)}
              className="input-field"
            >
              {sicilTipleri.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Yıl</label>
            <select value={yil} onChange={(e) => setYil(e.target.value)} className="input-field">
              <option value="tumu">Tümü</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div>
            <label className="label">Dönem</label>
            <select value={donem} onChange={(e) => setDonem(e.target.value)} className="input-field">
              <option value="tumu">Tümü</option>
              {[1, 2, 3, 4].map((d) => (
                <option key={d} value={String(d)}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={veOncesi}
                onChange={(e) => setVeOncesi(e.target.checked)}
                className="rounded border-slate-300"
              />
              Ve Öncesi
            </label>
          </div>
          <div>
            <label className="label">Gelir Kodu</label>
            <select
              value={gelirKodu}
              onChange={(e) => setGelirKodu(e.target.value)}
              className="input-field"
            >
              {gelirKodlari.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Ref No</label>
            <input
              type="text"
              value={refNo}
              onChange={(e) => setRefNo(e.target.value)}
              className="input-field"
              placeholder="Ref no"
            />
          </div>
        </div>
      </div>

      {/* Borç tablosu */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={
                      filtrelenmisBorclar.length > 0 &&
                      filtrelenmisBorclar.every((r) => secili[r.id])
                    }
                    onChange={(e) => tumunuSec(e.target.checked)}
                    className="rounded border-slate-300"
                  />
                  <span className="ml-2">Seç</span>
                </th>
                <th className="px-3 py-3">Ref No</th>
                <th className="px-3 py-3">Yıl</th>
                <th className="px-3 py-3">Dönem</th>
                <th className="px-3 py-3">Gelir Kodu</th>
                <th className="px-3 py-3">Son Ödeme Tar.</th>
                <th className="px-3 py-3 text-right">Ana Para</th>
                <th className="px-3 py-3 text-right">Ceza</th>
                <th className="px-3 py-3 text-right">KDV</th>
                <th className="px-3 py-3 text-right">Toplam</th>
                <th className="px-3 py-3 text-right">Ödeme Tutarı</th>
              </tr>
            </thead>
            <tbody>
              {filtrelenmisBorclar.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-12 text-center text-slate-400">
                    {sicil
                      ? "Filtreye uygun borç bulunamadı."
                      : "Gösterilecek herhangi bir veri bulunmuyor."}
                  </td>
                </tr>
              ) : (
                filtrelenmisBorclar.map((row) => (
                  <tr
                    key={row.id}
                    className={cn(
                      "border-b border-slate-100 transition",
                      secili[row.id] && "bg-blue-50/50",
                    )}
                  >
                    <td className="px-3 py-2.5">
                      <input
                        type="checkbox"
                        checked={!!secili[row.id]}
                        onChange={(e) => toggleSatir(row, e.target.checked)}
                        className="rounded border-slate-300"
                      />
                    </td>
                    <td className="px-3 py-2.5 font-medium text-slate-800">{row.refNo}</td>
                    <td className="px-3 py-2.5">{row.yil}</td>
                    <td className="px-3 py-2.5">{row.donem}</td>
                    <td className="px-3 py-2.5">
                      <span className="font-mono text-xs">{row.gelirKodu}</span>
                      <span className="ml-1 text-slate-500">{row.gelirAdi}</span>
                    </td>
                    <td className="px-3 py-2.5">{row.sonOdemeTarihi}</td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {formatCurrency(row.anaPara)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {formatCurrency(row.ceza)}
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums">
                      {formatCurrency(row.kdv)}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium tabular-nums">
                      {formatCurrency(row.toplam)}
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        type="text"
                        inputMode="decimal"
                        disabled={!secili[row.id]}
                        value={odemeTutarlari[row.id] ?? ""}
                        onChange={(e) =>
                          setOdemeTutarlari((prev) => ({
                            ...prev,
                            [row.id]: e.target.value,
                          }))
                        }
                        className="w-28 rounded border border-slate-200 px-2 py-1 text-right text-sm disabled:bg-slate-50 disabled:text-slate-400"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Alt: Ödeme + butonlar */}
      <div className="card p-4 sm:p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="grid flex-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="label">Ödeme Tutarı</p>
              <p className="text-3xl font-bold tabular-nums text-[#1e40af] sm:text-4xl">
                {formatCurrency(toplamOdeme)}
              </p>
            </div>
            <div>
              <label htmlFor="cek-no" className="label">
                Çek No
              </label>
              <input
                id="cek-no"
                type="text"
                value={cekNo}
                onChange={(e) => setCekNo(e.target.value)}
                className="input-field"
              />
            </div>
            <div className="sm:col-span-1 lg:col-span-1">
              <label htmlFor="aciklama" className="label">
                Açıklama
              </label>
              <input
                id="aciklama"
                type="text"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 lg:shrink-0">
            <button
              type="button"
              onClick={handleKaydet}
              disabled={toplamOdeme <= 0}
              className="btn-primary"
            >
              <Save className="h-4 w-4" />
              F8 — Kaydet
            </button>
            <button type="button" onClick={handleIptal} className="btn-secondary">
              <RotateCcw className="h-4 w-4" />
              F5 — İptal
            </button>
            <Link href="/tahsilat" className="btn-ghost">
              <LogOut className="h-4 w-4" />
              F12 — Çıkış
            </Link>
          </div>
        </div>

        {kaydedildi && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            <Save className="h-4 w-4 shrink-0" />
            Tahsilat kaydedildi — makbuz yazdırma (demo).
          </div>
        )}
      </div>
    </div>
  );
}
