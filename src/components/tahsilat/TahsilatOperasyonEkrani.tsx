"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  CreditCard,
  Loader2,
  LogOut,
  RotateCcw,
  Save,
} from "lucide-react";
import {
  borcGecikmisMi,
  gelirKodlari,
  sicilTipleri,
  type TahsilatAramaSekmesi,
  type TahsilatBorcRow,
} from "@/lib/tahsilat-mock";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { TahsilatYeniHeader } from "./TahsilatYeniHeader";
import { tahsildarlar, useTahsilatKlavye, useTahsilatOperasyon } from "./useTahsilatOperasyon";

const aramaSekmeleri: { id: TahsilatAramaSekmesi; label: string }[] = [
  { id: "su-isyeri", label: "Su / İşyeri Abone No" },
  { id: "emlak", label: "Emlak Beyan No" },
  { id: "imar", label: "İmar İzinleri" },
  { id: "kimlik", label: "Kimlik No" },
];

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
    if (digits.length >= 2 && index < 3) refs[index + 1].current?.focus();
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-600">Abone No:</span>
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
              onKeyDown={(e) => e.key === "Enter" && onSearch()}
              className="h-8 w-12 rounded border border-slate-200 bg-white px-1 text-center text-sm tabular-nums outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/15"
            />
            {i < 3 && <span className="text-slate-400">-</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TahsilatOperasyonEkrani() {
  const router = useRouter();
  const op = useTahsilatOperasyon();

  useTahsilatKlavye({
    aramaSekmesi: op.aramaSekmesi,
    onSekmeArama: op.handleSekmeArama,
    onKaydet: op.handleKaydet,
    onIptal: op.handleIptal,
    onCikis: () => router.push("/tahsilat"),
  });

  const tarihGosterim = op.tarih.includes("-")
    ? formatDate(new Date(op.tarih + "T12:00:00"))
    : op.tarih;

  return (
    <div>
      <TahsilatYeniHeader
        hizliArama={op.hizliArama}
        onHizliAramaChange={op.setHizliArama}
        onHizliAramaSubmit={op.handleHizliArama}
      />

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* 1. Tahsilatçı / Tarih / Şifre — tek satır kompakt */}
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-slate-200 px-4 py-2.5">
          <div className="min-w-[140px] flex-1">
            <label htmlFor="tahsildar" className="label">
              Tahsilatçı
            </label>
            <select
              id="tahsildar"
              value={op.tahsildar}
              onChange={(e) => op.setTahsildar(e.target.value)}
              className="input-field h-9 py-1.5 text-sm"
            >
              {tahsildarlar.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[140px] flex-1">
            <label htmlFor="tahsilat-tarihi" className="label">
              Tahsilat Tarihi
            </label>
            <input
              id="tahsilat-tarihi"
              type="date"
              value={op.tarih}
              onChange={(e) => op.setTarih(e.target.value)}
              className="input-field h-9 py-1.5 text-sm"
              title={tarihGosterim}
            />
          </div>
          <div className="min-w-[160px] flex-1">
            <label htmlFor="sifre" className="label">
              Şifre
            </label>
            <div className="flex gap-2">
              <input
                id="sifre"
                type="password"
                value={op.sifre}
                onChange={(e) => op.setSifre(e.target.value)}
                onBlur={op.handleSifreBlur}
                className="input-field h-9 flex-1 py-1.5 text-sm"
                autoComplete="off"
              />
              <span
                className={cn(
                  "h-9 w-9 shrink-0 rounded border",
                  op.sifreOk === true && "border-emerald-300 bg-emerald-50",
                  op.sifreOk === false && "border-red-300 bg-red-50",
                  op.sifreOk === null && "border-slate-200 bg-slate-50",
                )}
                title={
                  op.sifreOk === false
                    ? "Şifre geçersiz"
                    : op.sifreOk === true
                      ? "Şifre OK"
                      : undefined
                }
              />
            </div>
          </div>
        </div>

        {/* 2. Sekmeler */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50/50">
          {aramaSekmeleri.map((sekme) => (
            <button
              key={sekme.id}
              type="button"
              onClick={() => op.setAramaSekmesi(sekme.id)}
              className={cn(
                "border-b-2 px-4 py-2 text-sm font-medium transition",
                op.aramaSekmesi === sekme.id
                  ? "border-[#1e40af] bg-white text-[#1e40af]"
                  : "border-transparent text-slate-600 hover:bg-white/80 hover:text-slate-900",
              )}
            >
              {sekme.label}
            </button>
          ))}
        </div>

        {/* 3. Abone No + F9 + F10 + Kart Oku */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 px-4 py-2.5">
          {op.aramaSekmesi === "su-isyeri" ? (
            <AboneNoInput
              value={op.aboneParca}
              onChange={op.setAboneParca}
              onSearch={op.handleSekmeArama}
            />
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">
                {op.aramaSekmesi === "emlak"
                  ? "Beyan No:"
                  : op.aramaSekmesi === "imar"
                    ? "İzin No:"
                    : "Kimlik No:"}
              </span>
              <input
                type="text"
                value={op.tekArama}
                onChange={(e) => op.setTekArama(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && op.handleSekmeArama()}
                className="h-8 w-48 rounded border border-slate-200 px-2 text-sm outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/15"
              />
            </div>
          )}
          {op.aramaSekmesi === "su-isyeri" && (
            <>
              <AksiyonBtn onClick={op.handleSekmeArama}>F9 — Su Sicil Ara</AksiyonBtn>
              <AksiyonBtn onClick={op.handleSekmeArama}>F10 — İşyeri Sicil Ara</AksiyonBtn>
            </>
          )}
          {op.aramaSekmesi !== "su-isyeri" && (
            <AksiyonBtn onClick={op.handleSekmeArama}>Ara</AksiyonBtn>
          )}
          <AksiyonBtn icon={CreditCard}>Kart Oku</AksiyonBtn>
          {op.aramaDurumu === "loading" && (
            <Loader2 className="h-4 w-4 animate-spin text-[#1e40af]" />
          )}
        </div>

        {/* Durum mesajları */}
        {op.aramaDurumu === "bulunamadi" && (
          <div className="border-b border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-800">
            Sicil bulunamadı. Arama bilgilerini kontrol edin.
          </div>
        )}
        {op.aramaDurumu === "hata" && (
          <div className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
            Sorgulama sırasında bir hata oluştu.
          </div>
        )}
        {op.kayitDurumu === "hata" && op.kayitMesaj && (
          <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {op.kayitMesaj}
          </div>
        )}
        {op.kayitDurumu === "loading" && (
          <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            {op.kayitMesaj}
          </div>
        )}
        {op.kayitDurumu === "basarili" && (
          <div className="flex items-center gap-2 border-b border-emerald-100 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {op.kayitMesaj}
          </div>
        )}

        {/* 4. Sicil Bilgileri */}
        <div className="border-b border-slate-200 px-4 py-2.5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Sicil Bilgileri
          </p>
          <div className="grid gap-2 sm:grid-cols-[minmax(140px,auto)_1fr] sm:items-center">
            <label className="text-sm text-slate-600 sm:text-right">Adı Soyadı (Ünvanı):</label>
            <input
              readOnly
              value={op.sicil?.adSoyad ?? ""}
              className="input-field h-9 bg-slate-50/80 py-1.5 text-sm"
            />
            <label className="text-sm text-slate-600 sm:text-right">Adres:</label>
            <input
              readOnly
              value={op.sicil?.adres ?? ""}
              className="input-field h-9 bg-slate-50/80 py-1.5 text-sm"
            />
          </div>
        </div>

        {/* 5. Filtre — tüm alanlar görünür */}
        <div className="border-b border-slate-200 bg-slate-50/60 px-4 py-2.5">
          <div className="flex flex-wrap items-end gap-2">
            <FilterSelect
              label="Sicil Tipi"
              value={op.filtre.sicilTipi}
              onChange={(v) => op.setFiltre((f) => ({ ...f, sicilTipi: v }))}
              options={sicilTipleri.map((t) => ({ value: t.id, label: t.label }))}
            />
            <FilterSelect
              label="Yıl"
              value={op.filtre.yil}
              onChange={(v) => op.setFiltre((f) => ({ ...f, yil: v }))}
              options={[
                { value: "tumu", label: "Tümü" },
                { value: "2026", label: "2026" },
                { value: "2025", label: "2025" },
                { value: "2024", label: "2024" },
              ]}
            />
            <FilterSelect
              label="Dönem"
              value={op.filtre.donem}
              onChange={(v) => op.setFiltre((f) => ({ ...f, donem: v }))}
              options={[
                { value: "tumu", label: "Tümü" },
                ...[1, 2, 3, 4].map((d) => ({ value: String(d), label: String(d) })),
              ]}
            />
            <label className="flex h-8 cursor-pointer items-center gap-1.5 pb-0.5 text-xs text-slate-700">
              <input
                type="checkbox"
                checked={op.filtre.veOncesi}
                onChange={(e) => op.setFiltre((f) => ({ ...f, veOncesi: e.target.checked }))}
                className="rounded border-slate-300"
              />
              Ve Öncesi
            </label>
            <FilterSelect
              label="Gelir Kodu"
              value={op.filtre.gelirKodu}
              onChange={(v) => op.setFiltre((f) => ({ ...f, gelirKodu: v }))}
              options={gelirKodlari.map((g) => ({ value: g.id, label: g.label }))}
              wide
            />
            <div>
              <label className="mb-0.5 block text-[10px] font-medium uppercase text-slate-400">
                Ref No
              </label>
              <input
                type="text"
                value={op.filtre.refNo}
                onChange={(e) => op.setFiltre((f) => ({ ...f, refNo: e.target.value }))}
                className="h-8 w-24 rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/15"
              />
            </div>
          </div>
        </div>

        {/* 6. Borç tablosu */}
        <div className="max-h-[min(360px,45vh)] overflow-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr className="border-b border-slate-200">
                <th className="w-10 px-3 py-2">
                  <input
                    type="checkbox"
                    checked={
                      op.filtrelenmisBorclar.length > 0 &&
                      op.filtrelenmisBorclar.every((r) => op.secili[r.id])
                    }
                    onChange={(e) => op.tumunuSec(e.target.checked)}
                    disabled={!op.sicil || op.filtrelenmisBorclar.length === 0}
                    className="rounded border-slate-300"
                    aria-label="Tümünü seç"
                  />
                </th>
                <th className="px-3 py-2">Ref No</th>
                <th className="px-3 py-2">Yıl</th>
                <th className="px-3 py-2">Dönem</th>
                <th className="px-3 py-2">Gelir Kodu</th>
                <th className="px-3 py-2">Son Ödeme Tar.</th>
                <th className="px-3 py-2 text-right">Ana Para</th>
                <th className="px-3 py-2 text-right">Ceza</th>
                <th className="px-3 py-2 text-right">KDV</th>
                <th className="px-3 py-2 text-right">Toplam</th>
                <th className="px-3 py-2 text-right">Ödeme Tutarı</th>
              </tr>
            </thead>
            <tbody>
              {!op.sicil ? (
                <tr>
                  <td colSpan={11} className="px-4 py-10 text-center text-sm text-slate-400">
                    Gösterilecek herhangi bir veri bulunmuyor.
                  </td>
                </tr>
              ) : op.filtrelenmisBorclar.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-sm text-slate-500">
                    Filtreye uygun borç bulunamadı.
                  </td>
                </tr>
              ) : (
                op.filtrelenmisBorclar.map((row) => (
                  <BorcSatiri
                    key={row.id}
                    row={row}
                    secili={!!op.secili[row.id]}
                    odemeTutari={op.odemeTutarlari[row.id] ?? ""}
                    onToggle={(c) => op.toggleSatir(row, c)}
                    onOdemeChange={(v) =>
                      op.setOdemeTutarlari((prev) => ({ ...prev, [row.id]: v }))
                    }
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 7. Ödeme Tutarı — tablo altı sağ */}
        <div className="border-t border-slate-200 px-4 py-2 text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Ödeme Tutarı
          </p>
          <p className="text-2xl font-bold tabular-nums text-[#1e40af] sm:text-3xl">
            {formatCurrency(op.odemeTutari)}
          </p>
        </div>

        {/* 8. Ödeme Bilgileri */}
        <div className="border-t border-slate-200 px-4 py-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Ödeme Bilgileri
          </p>
          <div className="grid max-w-xl gap-3">
            <div>
              <label htmlFor="cek-no" className="label">
                Çek No
              </label>
              <input
                id="cek-no"
                type="text"
                value={op.cekNo}
                onChange={(e) => op.setCekNo(e.target.value)}
                className="input-field h-9 py-1.5 text-sm"
              />
            </div>
            <div>
              <label htmlFor="aciklama" className="label">
                Açıklama
              </label>
              <input
                id="aciklama"
                type="text"
                value={op.aciklama}
                onChange={(e) => op.setAciklama(e.target.value)}
                className="input-field h-9 py-1.5 text-sm"
              />
            </div>
          </div>
        </div>

        {/* 9. F8 / F5 / F12 — sağ hizalı */}
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-slate-50/80 px-4 py-3">
          <button type="button" onClick={op.handleKaydet} className="btn-primary inline-flex">
            <Save className="h-4 w-4" />
            F8 — Kaydet
          </button>
          <button type="button" onClick={op.handleIptal} className="btn-secondary inline-flex">
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

function AksiyonBtn({
  children,
  onClick,
  icon: Icon,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex h-8 items-center gap-1 rounded border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 focus:border-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e40af]/15"
    >
      {Icon && <Icon className="h-3.5 w-3.5" />}
      {children}
    </button>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  wide,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  wide?: boolean;
}) {
  return (
    <div>
      <label className="mb-0.5 block text-[10px] font-medium uppercase text-slate-400">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          "h-8 rounded border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/15",
          wide ? "max-w-[160px]" : "w-24",
        )}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function BorcSatiri({
  row,
  secili,
  odemeTutari,
  onToggle,
  onOdemeChange,
}: {
  row: TahsilatBorcRow;
  secili: boolean;
  odemeTutari: string;
  onToggle: (checked: boolean) => void;
  onOdemeChange: (value: string) => void;
}) {
  const gecikmis = borcGecikmisMi(row.sonOdemeTarihi);

  return (
    <tr
      className={cn(
        "border-b border-slate-100 transition-colors hover:bg-slate-50/70",
        secili && "bg-blue-50/40",
      )}
    >
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={secili}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded border-slate-300"
        />
      </td>
      <td className="px-3 py-2 font-medium text-slate-800">{row.refNo}</td>
      <td className="px-3 py-2 tabular-nums">{row.yil}</td>
      <td className="px-3 py-2 tabular-nums">{row.donem}</td>
      <td className="px-3 py-2">
        <span className="font-mono text-xs font-semibold" title={row.gelirAdi}>
          {row.gelirKodu}
        </span>
        <span className="ml-1.5 text-xs text-slate-500">{row.gelirAdi}</span>
      </td>
      <td className="px-3 py-2 whitespace-nowrap text-slate-600">
        {row.sonOdemeTarihi}
        {gecikmis && (
          <span className="ml-1 text-[10px] font-medium text-amber-700">Gecikmiş</span>
        )}
      </td>
      <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.anaPara)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.ceza)}</td>
      <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(row.kdv)}</td>
      <td className="px-3 py-2 text-right font-semibold tabular-nums">
        {formatCurrency(row.toplam)}
      </td>
      <td className="px-3 py-2 text-right">
        <input
          type="text"
          inputMode="decimal"
          disabled={!secili}
          value={odemeTutari}
          onChange={(e) => onOdemeChange(e.target.value)}
          className={cn(
            "ml-auto w-24 rounded border px-2 py-1 text-right text-sm tabular-nums outline-none",
            secili
              ? "border-slate-200 bg-white focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/15"
              : "cursor-not-allowed border-transparent bg-transparent text-slate-400",
          )}
        />
      </td>
    </tr>
  );
}
