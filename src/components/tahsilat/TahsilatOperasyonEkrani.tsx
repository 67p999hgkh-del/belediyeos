"use client";

import { useMemo, useRef } from "react";
import {
  AlertCircle,
  ArrowRight,
  ChevronDown,
  CreditCard,
  Loader2,
  Search,
  SlidersHorizontal,
  UserSearch,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  borcGecikmisMi,
  gelirKodlari,
  sicilTipleri,
  type TahsilatAramaSekmesi,
  type TahsilatBorcRow,
  type TahsilatSicil,
} from "@/lib/tahsilat-mock";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { TahsilatOdemeDrawer } from "./TahsilatOdemeDrawer";
import { TahsilatSuccessModal } from "./TahsilatSuccessModal";
import { useTahsilatKlavye, useTahsilatOperasyon } from "./useTahsilatOperasyon";

const aramaSekmeleri: { id: TahsilatAramaSekmesi; label: string }[] = [
  { id: "su-isyeri", label: "Su / İşyeri Abone No" },
  { id: "emlak", label: "Emlak Beyan No" },
  { id: "imar", label: "İmar İzinleri" },
  { id: "kimlik", label: "Kimlik No" },
];

const aboneSegmentWidths = ["w-12", "w-12", "w-12", "w-14"];

function maskKimlik(value: string) {
  if (!value || value.length < 6) return value || "—";
  return `${value.slice(0, 3)}${"*".repeat(Math.max(0, value.length - 5))}${value.slice(-2)}`;
}

function maskTelefon(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length < 10) return value || "—";
  return `05** *** ** ${digits.slice(-2)}`;
}

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
    const maxLen = index === 3 ? 2 : 2;
    const digits = raw.replace(/\D/g, "").slice(0, maxLen);
    const next = [...value];
    next[index] = digits;
    onChange(next);
    if (digits.length >= maxLen && index < 3) refs[index + 1].current?.focus();
  };

  return (
    <div>
      <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
        Abone Numarası
      </label>
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
              className={cn(
                "h-9 rounded-md border border-slate-200 bg-white px-2 text-center text-sm font-medium tabular-nums outline-none transition focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/15",
                aboneSegmentWidths[i],
              )}
            />
            {i < 3 && <span className="select-none text-slate-300">-</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function MukellefBadge({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "ok" | "warn" | "info";
}) {
  const styles = {
    ok: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warn: "bg-amber-50 text-amber-800 ring-amber-100",
    info: "bg-blue-50 text-blue-700 ring-blue-100",
  };
  return (
    <span
      className={cn(
        "inline-flex rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ring-1 ring-inset",
        styles[tone],
      )}
    >
      {children}
    </span>
  );
}

function MukellefOzeti({ sicil }: { sicil: TahsilatSicil }) {
  const kimlik = sicil.vergiNo || sicil.tcKimlik;

  return (
    <div className="border-b border-slate-200 bg-slate-50/40 px-4 py-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Mükellef
        </span>
        <div className="flex flex-wrap gap-1">
          {sicil.aktif && <MukellefBadge tone="ok">Aktif</MukellefBadge>}
          {sicil.borcuVar && <MukellefBadge tone="warn">Borcu Var</MukellefBadge>}
          {sicil.yapilandirmaVar && <MukellefBadge tone="info">Yapılandırma</MukellefBadge>}
          {sicil.gecikmisBorc && <MukellefBadge tone="warn">Gecikmiş Borç</MukellefBadge>}
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <p className="text-lg font-semibold text-slate-900">{sicil.adSoyad}</p>
      </div>
      <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <dt className="text-xs text-slate-400">Sicil No</dt>
          <dd className="font-medium text-slate-800">{sicil.sicilNo}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">{sicil.vergiNo ? "Vergi No" : "TC Kimlik"}</dt>
          <dd className="font-medium tabular-nums text-slate-800">{maskKimlik(kimlik)}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Abone No</dt>
          <dd className="font-medium tabular-nums text-slate-800">{sicil.aboneNo}</dd>
        </div>
        <div>
          <dt className="text-xs text-slate-400">Telefon</dt>
          <dd className="font-medium tabular-nums text-slate-800">{maskTelefon(sicil.telefon)}</dd>
        </div>
        <div className="sm:col-span-2 lg:col-span-4">
          <dt className="text-xs text-slate-400">Adres</dt>
          <dd className="text-slate-700">{sicil.adres}</dd>
        </div>
      </dl>
    </div>
  );
}

function FinansalOzetBar({ borclar }: { borclar: TahsilatBorcRow[] }) {
  const ozet = useMemo(() => {
    let acik = 0;
    let gecikmis = 0;
    let ceza = 0;
    borclar.forEach((b) => {
      acik += b.toplam;
      ceza += b.ceza;
      if (borcGecikmisMi(b.sonOdemeTarihi)) gecikmis += b.toplam;
    });
    return { acik, gecikmis, ceza, toplam: acik };
  }, [borclar]);

  if (borclar.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 border-b border-slate-100 bg-white px-4 py-2 text-sm">
      <Metric label="Açık Borç" value={formatCurrency(ozet.acik)} />
      <Metric label="Gecikmiş" value={formatCurrency(ozet.gecikmis)} warn={ozet.gecikmis > 0} />
      <Metric label="Ceza" value={formatCurrency(ozet.ceza)} />
      <Metric label="Toplam" value={formatCurrency(ozet.toplam)} emphasis />
    </div>
  );
}

function Metric({
  label,
  value,
  emphasis,
  warn,
}: {
  label: string;
  value: string;
  emphasis?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-xs text-slate-400">{label}</span>
      <span
        className={cn(
          "tabular-nums",
          emphasis && "text-base font-bold text-[#1e40af]",
          warn && !emphasis && "font-medium text-amber-700",
          !emphasis && !warn && "font-medium text-slate-800",
        )}
      >
        {value}
      </span>
    </div>
  );
}

function TabloSkeleton() {
  return (
    <tbody className="animate-pulse">
      {[1, 2, 3].map((i) => (
        <tr key={i} className="border-b border-slate-100">
          <td colSpan={11} className="px-4 py-3">
            <div className="h-8 rounded bg-slate-100" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}

const EMPTY_ROW_CLASS = "px-4 py-8 text-center";

export function TahsilatOperasyonEkrani() {
  const { user } = useApp();
  const op = useTahsilatOperasyon();

  useTahsilatKlavye({
    aramaSekmesi: op.aramaSekmesi,
    odemeDrawerAcik: op.odemeDrawerAcik,
    successAcik: op.successAcik,
    seciliAdet: op.ozet.seciliAdet,
    onSekmeArama: op.handleSekmeArama,
    onGlobalArama: op.handleGlobalArama,
    onOdemeDrawerKapat: () => op.setOdemeDrawerAcik(false),
    onSuccessKapat: op.yeniTahsilat,
    onOdemeyeGec: op.odemeyeGec,
  });

  const tarihGosterim = formatDate(new Date());

  const tabloMesaji = () => {
    if (op.aramaDurumu === "loading") return null;
    if (op.aramaDurumu === "idle") {
      return (
        <tr>
          <td colSpan={11} className={EMPTY_ROW_CLASS}>
            <UserSearch className="mx-auto mb-1.5 h-6 w-6 text-slate-300" />
            <p className="text-sm text-slate-500">
              Sorgulama yaparak mükellefin borçlarını görüntüleyin.
            </p>
          </td>
        </tr>
      );
    }
    if (op.sicil && op.filtrelenmisBorclar.length === 0 && op.aramaDurumu === "bulundu") {
      return (
        <tr>
          <td colSpan={11} className={cn(EMPTY_ROW_CLASS, "text-sm text-slate-500")}>
            Bu sicile ait ödenmemiş borç bulunmuyor.
          </td>
        </tr>
      );
    }
    return null;
  };

  const showInlineAlert =
    op.aramaDurumu === "bulunamadi" || op.aramaDurumu === "hata";

  return (
    <div className={cn("pb-4", op.ozet.seciliAdet > 0 && "pb-24")}>
      {/* İşlem bilgi barı */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-slate-200 bg-slate-50/90 px-3 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-600">
          <span>
            <span className="text-slate-400">Tahsilatçı:</span>{" "}
            <span className="font-medium text-slate-800">{user.name}</span>
          </span>
          <span>
            <span className="text-slate-400">Tahsilat Tarihi:</span>{" "}
            <span className="font-medium text-slate-800">{tarihGosterim}</span>
          </span>
          <span>
            <span className="text-slate-400">Vezne:</span>{" "}
            <span className="font-medium text-slate-800">Ana Vezne — V001</span>
          </span>
        </div>
        <div className="hidden text-xs text-slate-400 sm:block">
          F9 Su Ara · F10 İşyeri Ara · F8 Ödemeye Geç · Esc Kapat
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Global arama — güçlü search component */}
        <div className="border-b border-slate-100 bg-white px-3 py-3">
          <label htmlFor="global-tahsilat-ara" className="sr-only">
            Global mükellef arama
          </label>
          <div className="flex overflow-hidden rounded-lg border border-slate-200 shadow-sm ring-1 ring-slate-100 focus-within:border-[#1e40af] focus-within:ring-2 focus-within:ring-[#1e40af]/15">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="global-tahsilat-ara"
                data-global-search="true"
                type="search"
                value={op.globalQuery}
                onChange={(e) => op.setGlobalQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && op.handleGlobalArama()}
                placeholder="TC Kimlik, Vergi No, Sicil No, Abone No veya Ad Soyad ile ara..."
                className="h-10 w-full border-0 bg-white pl-10 pr-3 text-sm outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              type="button"
              onClick={op.handleGlobalArama}
              className="shrink-0 border-l border-slate-200 bg-[#1e40af] px-5 text-sm font-medium text-white transition hover:bg-[#1e3a8a]"
            >
              Ara
            </button>
          </div>
        </div>

        {/* Sekmeler */}
        <div className="flex flex-wrap gap-1 border-b border-slate-100 px-3 py-2">
          {aramaSekmeleri.map((sekme) => (
            <button
              key={sekme.id}
              type="button"
              onClick={() => op.setAramaSekmesi(sekme.id)}
              className={cn(
                "rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:text-sm",
                op.aramaSekmesi === sekme.id
                  ? "bg-[#1e40af] text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100",
              )}
            >
              {sekme.label}
            </button>
          ))}
        </div>

        {/* Sekme arama satırı */}
        <div className="flex flex-wrap items-end gap-3 border-b border-slate-100 px-3 py-3">
          {op.aramaSekmesi === "su-isyeri" ? (
            <AboneNoInput
              value={op.aboneParca}
              onChange={op.setAboneParca}
              onSearch={op.handleSekmeArama}
            />
          ) : (
            <div>
              <label className="mb-1 block text-[11px] font-medium uppercase tracking-wide text-slate-500">
                {op.aramaSekmesi === "emlak"
                  ? "Beyan Numarası"
                  : op.aramaSekmesi === "imar"
                    ? "İzin Numarası"
                    : "TC Kimlik No"}
              </label>
              <input
                type="text"
                value={op.tekArama}
                onChange={(e) => op.setTekArama(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && op.handleSekmeArama()}
                className="h-9 w-48 rounded-md border border-slate-200 px-2.5 text-sm outline-none transition focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/15"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 pb-0.5">
            {op.aramaSekmesi === "su-isyeri" && (
              <>
                <SekmeBtn onClick={op.handleSekmeArama}>F9 — Su Sicil Ara</SekmeBtn>
                <SekmeBtn onClick={op.handleSekmeArama}>F10 — İşyeri Sicil Ara</SekmeBtn>
              </>
            )}
            {op.aramaSekmesi !== "su-isyeri" && (
              <SekmeBtn onClick={op.handleSekmeArama}>Ara</SekmeBtn>
            )}
            <SekmeBtn icon={CreditCard}>Kart Oku</SekmeBtn>
          </div>
        </div>

        {/* Mükellef alanı */}
        {op.aramaDurumu === "loading" ? (
          <div className="border-b border-slate-100 px-4 py-4">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-[#1e40af]" />
              Sorgulanıyor…
            </div>
          </div>
        ) : op.sicil ? (
          <MukellefOzeti sicil={op.sicil} />
        ) : (
          !showInlineAlert && (
            <div className="border-b border-slate-100 px-4 py-3 text-xs text-slate-400">
              Sorgulama yapıldığında mükellef bilgileri burada görüntülenecektir.
            </div>
          )
        )}

        {/* Inline alert */}
        {showInlineAlert && (
          <div
            className={cn(
              "flex items-center gap-2 border-b px-4 py-2.5 text-sm",
              op.aramaDurumu === "bulunamadi"
                ? "border-amber-100 bg-amber-50 text-amber-800"
                : "border-red-100 bg-red-50 text-red-700",
            )}
            role="alert"
          >
            <AlertCircle className="h-4 w-4 shrink-0" />
            {op.aramaDurumu === "bulunamadi"
              ? "Sicil bulunamadı. Arama bilgilerini kontrol edin."
              : "Sorgulama sırasında bir hata oluştu. Lütfen tekrar deneyin."}
          </div>
        )}

        {/* Finansal özet */}
        {op.sicil && op.tumBorclar.length > 0 && (
          <FinansalOzetBar borclar={op.filtrelenmisBorclar} />
        )}

        {/* Filtre toolbar — mükellef bulunduğunda */}
        {op.sicil && (
          <div className="border-b border-slate-100 bg-slate-50/70 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => op.setGelismisFiltre(!op.gelismisFiltre)}
                className={cn(
                  "inline-flex h-8 items-center gap-1 rounded-md border px-2.5 text-xs font-medium transition",
                  op.gelismisFiltre
                    ? "border-[#1e40af]/30 bg-blue-50 text-[#1e40af]"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
                )}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                Filtreler
                <ChevronDown
                  className={cn("h-3 w-3 transition", op.gelismisFiltre && "rotate-180")}
                />
              </button>
              <select
                value={op.filtre.yil}
                onChange={(e) => op.setFiltre((f) => ({ ...f, yil: e.target.value }))}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                aria-label="Yıl"
              >
                <option value="tumu">Tüm Yıllar</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <select
                value={op.filtre.donem}
                onChange={(e) => op.setFiltre((f) => ({ ...f, donem: e.target.value }))}
                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                aria-label="Dönem"
              >
                <option value="tumu">Tüm Dönemler</option>
                {[1, 2, 3, 4].map((d) => (
                  <option key={d} value={String(d)}>
                    {d}. Dönem
                  </option>
                ))}
              </select>
              <select
                value={op.filtre.gelirKodu}
                onChange={(e) => op.setFiltre((f) => ({ ...f, gelirKodu: e.target.value }))}
                className="h-8 max-w-[130px] rounded-md border border-slate-200 bg-white px-2 text-xs"
                aria-label="Gelir Türü"
              >
                {gelirKodlari.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.id === "tumu" ? "Gelir Türü" : g.label.split("—")[1]?.trim() ?? g.id}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={op.filtre.refNo}
                onChange={(e) => op.setFiltre((f) => ({ ...f, refNo: e.target.value }))}
                placeholder="Ref No"
                className="h-8 w-24 rounded-md border border-slate-200 bg-white px-2 text-xs outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/15"
              />
              <label className="flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-1 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={op.filtre.veOncesi}
                  onChange={(e) => op.setFiltre((f) => ({ ...f, veOncesi: e.target.checked }))}
                  className="rounded border-slate-300 text-[#1e40af] focus:ring-[#1e40af]/20"
                />
                Önceki dönemleri dahil et
              </label>
              <button
                type="button"
                onClick={op.filtreleriTemizle}
                className="ml-auto h-8 px-2 text-xs font-medium text-slate-500 transition hover:text-[#1e40af]"
              >
                Filtreleri Temizle
              </button>
            </div>
            {op.gelismisFiltre && (
              <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-2">
                <select
                  value={op.filtre.sicilTipi}
                  onChange={(e) => op.setFiltre((f) => ({ ...f, sicilTipi: e.target.value }))}
                  className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs"
                  aria-label="Sicil Tipi"
                >
                  {sicilTipleri.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Borç tablosu */}
        <div className="max-h-[min(420px,50vh)] overflow-auto">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              <tr className="border-b border-slate-200 shadow-sm">
                <th className="w-10 px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={
                      op.filtrelenmisBorclar.length > 0 &&
                      op.filtrelenmisBorclar.every((r) => op.secili[r.id])
                    }
                    onChange={(e) => op.tumunuSec(e.target.checked)}
                    disabled={op.filtrelenmisBorclar.length === 0}
                    className="rounded border-slate-300"
                    aria-label="Tümünü seç"
                  />
                </th>
                <th className="px-3 py-2.5">Ref No</th>
                <th className="px-3 py-2.5">Yıl</th>
                <th className="px-3 py-2.5">Dönem</th>
                <th className="px-3 py-2.5">Gelir</th>
                <th className="px-3 py-2.5">Son Ödeme</th>
                <th className="px-3 py-2.5 text-right">Ana Para</th>
                <th className="px-3 py-2.5 text-right">Ceza</th>
                <th className="px-3 py-2.5 text-right">KDV</th>
                <th className="px-3 py-2.5 text-right">Toplam</th>
                <th className="px-3 py-2.5 text-right">Ödeme Tutarı</th>
              </tr>
            </thead>
            {op.aramaDurumu === "loading" ? (
              <TabloSkeleton />
            ) : (
              <tbody>
                {tabloMesaji()}
                {op.filtrelenmisBorclar.map((row) => (
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
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>

      {/* Sticky tahsilat barı */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_24px_rgba(15,23,42,0.1)] backdrop-blur-sm transition-all duration-200 lg:left-72",
          op.ozet.seciliAdet > 0
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-full opacity-0",
        )}
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
            <span className="font-semibold text-slate-800">
              {op.ozet.seciliAdet} borç seçildi
            </span>
            <Metric label="Ana Para" value={formatCurrency(op.ozet.anaPara)} />
            <Metric label="Ceza" value={formatCurrency(op.ozet.ceza)} />
            <Metric label="KDV" value={formatCurrency(op.ozet.kdv)} />
            <Metric label="Genel Toplam" value={formatCurrency(op.ozet.genelToplam)} emphasis />
          </div>
          <button
            type="button"
            onClick={op.odemeyeGec}
            className="btn-primary inline-flex shrink-0 items-center gap-2 px-6"
          >
            Ödemeye Geç
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <TahsilatOdemeDrawer
        acik={op.odemeDrawerAcik}
        sicil={op.sicil}
        ozet={op.ozet}
        odemeYontemi={op.odemeYontemi}
        setOdemeYontemi={op.setOdemeYontemi}
        alinanTutar={op.alinanTutar}
        setAlinanTutar={op.setAlinanTutar}
        paraUstu={op.paraUstu}
        posRef={op.posRef}
        setPosRef={op.setPosRef}
        havaleRef={op.havaleRef}
        setHavaleRef={op.setHavaleRef}
        aciklama={op.aciklama}
        setAciklama={op.setAciklama}
        veznePin={op.veznePin}
        setVeznePin={op.setVeznePin}
        onKapat={() => op.setOdemeDrawerAcik(false)}
        onTamamla={op.tahsilatiTamamla}
      />

      <TahsilatSuccessModal
        acik={op.successAcik}
        makbuzNo={op.makbuzNo}
        toplam={op.ozet.genelToplam}
        odemeYontemi={op.odemeYontemi}
        mukellefAd={op.sicil?.adSoyad ?? ""}
        onYeniTahsilat={op.yeniTahsilat}
      />
    </div>
  );
}

function SekmeBtn({
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
      className="inline-flex h-9 items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 focus:border-[#1e40af] focus:outline-none focus:ring-2 focus:ring-[#1e40af]/15"
    >
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
      {children}
    </button>
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
        "border-b border-slate-100 transition-colors hover:bg-slate-50/80",
        secili && "bg-blue-50/50 hover:bg-blue-50/60",
      )}
    >
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={secili}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded border-slate-300 text-[#1e40af] focus:ring-[#1e40af]/20"
        />
      </td>
      <td className="px-3 py-2 font-medium text-slate-800">{row.refNo}</td>
      <td className="px-3 py-2 tabular-nums text-slate-600">{row.yil}</td>
      <td className="px-3 py-2 tabular-nums text-slate-600">{row.donem}</td>
      <td className="px-3 py-2">
        <div className="leading-tight">
          <span className="font-mono text-xs font-semibold text-slate-800">{row.gelirKodu}</span>
          <p className="text-[11px] text-slate-500">{row.gelirAdi}</p>
        </div>
      </td>
      <td className="px-3 py-2 whitespace-nowrap">
        <span className="text-slate-600">{row.sonOdemeTarihi}</span>
        {gecikmis && (
          <span className="ml-1 inline-flex rounded bg-amber-50 px-1 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-100">
            Gecikmiş
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-slate-700">
        {formatCurrency(row.anaPara)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-slate-700">
        {formatCurrency(row.ceza)}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-slate-700">
        {formatCurrency(row.kdv)}
      </td>
      <td className="px-3 py-2 text-right text-sm font-semibold tabular-nums text-slate-900">
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
            "ml-auto block w-24 rounded-md border px-2 py-1 text-right text-sm tabular-nums outline-none transition",
            secili
              ? "border-slate-200 bg-white focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/15"
              : "cursor-not-allowed border-transparent bg-transparent text-slate-400",
          )}
        />
      </td>
    </tr>
  );
}
