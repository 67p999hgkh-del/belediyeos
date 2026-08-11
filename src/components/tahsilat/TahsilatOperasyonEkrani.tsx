"use client";

import { useRef } from "react";
import {
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

function AboneNoInput({
  value,
  onChange,
  onSearch,
}: {
  value: string[];
  onChange: (parts: string[]) => void;
  onSearch: () => void;
}) {
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

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
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="h-9 w-11 rounded border border-slate-200 bg-white px-1 text-center text-sm font-medium outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/20"
          />
          {i < 3 && <span className="text-slate-300">-</span>}
        </span>
      ))}
    </div>
  );
}

function MukellefBadge({ children, tone }: { children: React.ReactNode; tone: "ok" | "warn" | "info" | "neutral" }) {
  const styles = {
    ok: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    warn: "bg-amber-50 text-amber-800 ring-amber-100",
    info: "bg-blue-50 text-blue-700 ring-blue-100",
    neutral: "bg-slate-100 text-slate-600 ring-slate-200",
  };
  return (
    <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset", styles[tone])}>
      {children}
    </span>
  );
}

function MukellefKarti({ sicil }: { sicil: TahsilatSicil }) {
  return (
    <div className="border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-base font-semibold text-slate-900">{sicil.adSoyad}</p>
          <div className="mt-2 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-slate-400">Sicil No </span>
              <span className="font-medium text-slate-700">{sicil.sicilNo}</span>
            </div>
            <div>
              <span className="text-slate-400">{sicil.vergiNo ? "Vergi No " : "TC Kimlik "}</span>
              <span className="font-medium text-slate-700">{sicil.vergiNo || sicil.tcKimlik || "—"}</span>
            </div>
            <div>
              <span className="text-slate-400">Abone No </span>
              <span className="font-medium text-slate-700">{sicil.aboneNo}</span>
            </div>
            <div>
              <span className="text-slate-400">Telefon </span>
              <span className="font-medium text-slate-700">{sicil.telefon}</span>
            </div>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">{sicil.adres}</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {sicil.aktif && <MukellefBadge tone="ok">Aktif</MukellefBadge>}
          {sicil.borcuVar && <MukellefBadge tone="warn">Borcu Var</MukellefBadge>}
          {sicil.yapilandirmaVar && <MukellefBadge tone="info">Yapılandırma Var</MukellefBadge>}
          {sicil.gecikmisBorc && <MukellefBadge tone="warn">Gecikmiş Borç</MukellefBadge>}
        </div>
      </div>
    </div>
  );
}

function TabloSkeleton() {
  return (
    <div className="animate-pulse space-y-2 px-4 py-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 rounded bg-slate-100" />
      ))}
    </div>
  );
}

export function TahsilatOperasyonEkrani() {
  const { user } = useApp();
  const op = useTahsilatOperasyon();

  useTahsilatKlavye({
    aramaSekmesi: op.aramaSekmesi,
    odemeDrawerAcik: op.odemeDrawerAcik,
    successAcik: op.successAcik,
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
          <td colSpan={11} className="px-4 py-10 text-center">
            <UserSearch className="mx-auto mb-2 h-8 w-8 text-slate-300" />
            <p className="text-sm text-slate-500">Sorgulama yaparak mükellefin borçlarını görüntüleyin.</p>
          </td>
        </tr>
      );
    }
    if (op.aramaDurumu === "bulunamadi") {
      return (
        <tr>
          <td colSpan={11} className="px-4 py-10 text-center text-sm text-amber-700">
            Sicil bulunamadı. Arama bilgilerini kontrol edin.
          </td>
        </tr>
      );
    }
    if (op.aramaDurumu === "hata") {
      return (
        <tr>
          <td colSpan={11} className="px-4 py-10 text-center text-sm text-red-600">
            Sorgulama sırasında bir hata oluştu. Lütfen tekrar deneyin.
          </td>
        </tr>
      );
    }
    if (op.sicil && op.filtrelenmisBorclar.length === 0) {
      return (
        <tr>
          <td colSpan={11} className="px-4 py-10 text-center text-sm text-slate-500">
            Bu sicile ait ödenmemiş borç bulunmuyor.
          </td>
        </tr>
      );
    }
    return null;
  };

  return (
    <div className="pb-24">
      {/* Kompakt işlem barı */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-600">
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
        <div className="text-xs text-slate-400">
          F9 Su Ara · F10 İşyeri Ara · F8 Ödemeye Geç · Esc Kapat
        </div>
      </div>

      {/* Ana operasyon paneli */}
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        {/* Global arama */}
        <div className="border-b border-slate-100 px-3 py-2.5">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              data-global-search="true"
              type="search"
              value={op.globalQuery}
              onChange={(e) => op.setGlobalQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && op.handleGlobalArama()}
              placeholder="TC Kimlik, Vergi No, Sicil No, Abone No veya Ad Soyad ile ara..."
              className="h-9 w-full rounded-md border border-slate-200 bg-slate-50/50 pl-9 pr-24 text-sm outline-none focus:border-[#1e40af] focus:bg-white focus:ring-1 focus:ring-[#1e40af]/20"
            />
            <button
              type="button"
              onClick={op.handleGlobalArama}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded px-2.5 py-1 text-xs font-medium text-[#1e40af] hover:bg-blue-50"
            >
              Ara
            </button>
          </div>
        </div>

        {/* Sekmeler + sekme araması */}
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-100 px-3 py-2">
          <div className="flex flex-wrap gap-0.5">
            {aramaSekmeleri.map((sekme) => (
              <button
                key={sekme.id}
                type="button"
                onClick={() => op.setAramaSekmesi(sekme.id)}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition sm:text-sm",
                  op.aramaSekmesi === sekme.id
                    ? "bg-[#1e40af] text-white"
                    : "text-slate-600 hover:bg-slate-100",
                )}
              >
                {sekme.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {op.aramaSekmesi === "su-isyeri" ? (
              <AboneNoInput
                value={op.aboneParca}
                onChange={op.setAboneParca}
                onSearch={op.handleSekmeArama}
              />
            ) : (
              <input
                type="text"
                value={op.tekArama}
                onChange={(e) => op.setTekArama(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && op.handleSekmeArama()}
                placeholder={
                  op.aramaSekmesi === "emlak"
                    ? "Beyan no"
                    : op.aramaSekmesi === "imar"
                      ? "İzin no"
                      : "TC Kimlik no"
                }
                className="h-9 w-40 rounded border border-slate-200 px-2.5 text-sm outline-none focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af]/20"
              />
            )}
            {op.aramaSekmesi === "su-isyeri" && (
              <>
                <button type="button" onClick={op.handleSekmeArama} className="h-9 rounded border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  F9 — Su Sicil Ara
                </button>
                <button type="button" onClick={op.handleSekmeArama} className="h-9 rounded border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  F10 — İşyeri Sicil Ara
                </button>
              </>
            )}
            {op.aramaSekmesi !== "su-isyeri" && (
              <button type="button" onClick={op.handleSekmeArama} className="h-9 rounded border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
                Ara
              </button>
            )}
            <button type="button" className="inline-flex h-9 items-center gap-1.5 rounded border border-slate-200 px-2.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              <CreditCard className="h-3.5 w-3.5" />
              Kart Oku
            </button>
          </div>
        </div>

        {/* Mükellef bilgisi */}
        {op.aramaDurumu === "loading" ? (
          <div className="border-b border-slate-100 px-4 py-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Sorgulanıyor…
            </div>
          </div>
        ) : op.sicil ? (
          <MukellefKarti sicil={op.sicil} />
        ) : op.aramaDurumu !== "bulunamadi" && op.aramaDurumu !== "hata" ? (
          <div className="border-b border-slate-100 px-4 py-4 text-sm text-slate-400">
            Sorgulama yapıldığında mükellef bilgileri burada görüntülenecektir.
          </div>
        ) : null}

        {/* Filtre toolbar */}
        {op.sicil && (
          <div className="border-b border-slate-100 bg-slate-50/60 px-3 py-2">
            <div className="flex flex-wrap items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-slate-400" />
              <select
                value={op.filtre.sicilTipi}
                onChange={(e) => op.setFiltre((f) => ({ ...f, sicilTipi: e.target.value }))}
                className="h-8 rounded border border-slate-200 bg-white px-2 text-xs"
                aria-label="Sicil Tipi"
              >
                {sicilTipleri.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <select
                value={op.filtre.yil}
                onChange={(e) => op.setFiltre((f) => ({ ...f, yil: e.target.value }))}
                className="h-8 w-20 rounded border border-slate-200 bg-white px-2 text-xs"
                aria-label="Yıl"
              >
                <option value="tumu">Yıl</option>
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
              <select
                value={op.filtre.donem}
                onChange={(e) => op.setFiltre((f) => ({ ...f, donem: e.target.value }))}
                className="h-8 w-20 rounded border border-slate-200 bg-white px-2 text-xs"
                aria-label="Dönem"
              >
                <option value="tumu">Dönem</option>
                {[1, 2, 3, 4].map((d) => (
                  <option key={d} value={String(d)}>{d}</option>
                ))}
              </select>
              <select
                value={op.filtre.gelirKodu}
                onChange={(e) => op.setFiltre((f) => ({ ...f, gelirKodu: e.target.value }))}
                className="h-8 max-w-[140px] rounded border border-slate-200 bg-white px-2 text-xs"
                aria-label="Gelir Kodu"
              >
                {gelirKodlari.map((g) => (
                  <option key={g.id} value={g.id}>{g.id === "tumu" ? "Gelir Kodu" : g.id}</option>
                ))}
              </select>
              <input
                type="text"
                value={op.filtre.refNo}
                onChange={(e) => op.setFiltre((f) => ({ ...f, refNo: e.target.value }))}
                placeholder="Ref No"
                className="h-8 w-24 rounded border border-slate-200 bg-white px-2 text-xs"
              />
              <button
                type="button"
                onClick={() => op.setGelismisFiltre(!op.gelismisFiltre)}
                className="inline-flex h-8 items-center gap-1 rounded border border-slate-200 bg-white px-2 text-xs text-slate-600 hover:bg-slate-50"
              >
                Gelişmiş
                <ChevronDown className={cn("h-3 w-3 transition", op.gelismisFiltre && "rotate-180")} />
              </button>
              <button
                type="button"
                onClick={op.filtreleriTemizle}
                className="h-8 px-2 text-xs font-medium text-slate-500 hover:text-[#1e40af]"
              >
                Filtreleri Temizle
              </button>
            </div>
            {op.gelismisFiltre && (
              <label className="mt-2 flex w-fit cursor-pointer items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  checked={op.filtre.veOncesi}
                  onChange={(e) => op.setFiltre((f) => ({ ...f, veOncesi: e.target.checked }))}
                  className="rounded border-slate-300"
                />
                Ve Öncesi
              </label>
            )}
          </div>
        )}

        {/* Borç tablosu */}
        <div className="overflow-x-auto">
          {op.aramaDurumu === "loading" ? (
            <TabloSkeleton />
          ) : (
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500 shadow-sm">
                <tr className="border-b border-slate-200">
                  <th className="w-10 px-3 py-2">
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
                  <th className="px-3 py-2">Ref No</th>
                  <th className="px-3 py-2">Yıl</th>
                  <th className="px-3 py-2">Dönem</th>
                  <th className="px-3 py-2">Gelir</th>
                  <th className="px-3 py-2">Son Ödeme</th>
                  <th className="px-3 py-2 text-right">Ana Para</th>
                  <th className="px-3 py-2 text-right">Ceza</th>
                  <th className="px-3 py-2 text-right">KDV</th>
                  <th className="px-3 py-2 text-right">Toplam</th>
                  <th className="px-3 py-2 text-right">Ödeme Tutarı</th>
                </tr>
              </thead>
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
            </table>
          )}
        </div>
      </div>

      {/* Sticky özet bar */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-30 border-t border-slate-200 bg-white/95 px-4 py-3 shadow-[0_-4px_20px_rgba(15,23,42,0.08)] backdrop-blur-sm transition lg:left-72",
          op.ozet.seciliAdet > 0 ? "translate-y-0" : "translate-y-full opacity-0 pointer-events-none",
        )}
      >
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <span className="font-medium text-slate-800">{op.ozet.seciliAdet} borç seçildi</span>
            <div className="hidden h-4 w-px bg-slate-200 sm:block" />
            <div>
              <span className="text-xs text-slate-400">Ana Para </span>
              <span className="font-medium tabular-nums">{formatCurrency(op.ozet.anaPara)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400">Ceza </span>
              <span className="font-medium tabular-nums">{formatCurrency(op.ozet.ceza)}</span>
            </div>
            <div>
              <span className="text-xs text-slate-400">KDV </span>
              <span className="font-medium tabular-nums">{formatCurrency(op.ozet.kdv)}</span>
            </div>
            <div>
              <span className="text-xs font-semibold uppercase text-slate-500">Genel Toplam </span>
              <span className="text-lg font-bold tabular-nums text-[#1e40af]">
                {formatCurrency(op.ozet.genelToplam)}
              </span>
            </div>
          </div>
          <button type="button" onClick={op.odemeyeGec} className="btn-primary shrink-0 px-6">
            Ödemeye Geç
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
    <tr className={cn("border-b border-slate-100 transition", secili && "bg-blue-50/40")}>
      <td className="px-3 py-2">
        <input
          type="checkbox"
          checked={secili}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded border-slate-300"
        />
      </td>
      <td className="px-3 py-2 font-medium text-slate-800">{row.refNo}</td>
      <td className="px-3 py-2 text-slate-600">{row.yil}</td>
      <td className="px-3 py-2 text-slate-600">{row.donem}</td>
      <td className="px-3 py-2">
        <div className="leading-tight">
          <span className="font-mono text-xs font-semibold text-slate-700">{row.gelirKodu}</span>
          <p className="text-xs text-slate-500">{row.gelirAdi}</p>
        </div>
      </td>
      <td className="px-3 py-2">
        <span className="text-slate-600">{row.sonOdemeTarihi}</span>
        {gecikmis && (
          <span className="ml-1.5 inline-flex rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 ring-1 ring-inset ring-amber-100">
            Gecikmiş
          </span>
        )}
      </td>
      <td className="px-3 py-2 text-right tabular-nums text-slate-700">{formatCurrency(row.anaPara)}</td>
      <td className="px-3 py-2 text-right tabular-nums text-slate-700">{formatCurrency(row.ceza)}</td>
      <td className="px-3 py-2 text-right tabular-nums text-slate-700">{formatCurrency(row.kdv)}</td>
      <td className="px-3 py-2 text-right font-semibold tabular-nums text-slate-900">
        {formatCurrency(row.toplam)}
      </td>
      <td className="px-3 py-2">
        <input
          type="text"
          inputMode="decimal"
          disabled={!secili}
          value={odemeTutari}
          onChange={(e) => onOdemeChange(e.target.value)}
          className="ml-auto block w-24 rounded border border-slate-200 px-2 py-1 text-right text-sm tabular-nums disabled:bg-slate-50 disabled:text-slate-400"
        />
      </td>
    </tr>
  );
}
