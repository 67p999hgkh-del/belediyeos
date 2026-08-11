"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatAboneNo, getSuAboneByAboneNo } from "@/lib/su-abone-mock";
import { formatDonem, suDonemConfig, suDemoGelirKodlari, suGelirKodlari } from "@/lib/su/config";
import {
  getSuGenelFaturaEkstre,
  getSuGenelFaturalar,
  kaydetSuGenelFatura,
  type SuGenelFatura,
} from "@/lib/su-genel-fatura-mock";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn, formatCurrency } from "@/lib/utils";
import { AboneNoInput, IslemActionBar, WorkspaceTabBar } from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";
import { useSuWorkspaceUrl } from "../shared/useSuWorkspaceUrl";

const gelirKoduSecenekleri = [...suGelirKodlari, ...suDemoGelirKodlari];

const ws = suWorkspaces["genel-fatura"];

type KayitDurum = "idle" | "loading" | "basarili";

export function SuGenelFaturaWorkspace() {
  const router = useRouter();
  const { user } = useApp();
  const { searchParams, setUrl } = useSuWorkspaceUrl(ws.route);

  const tabParam = searchParams.get("tab") ?? "kayit";
  const [tab, setTab] = useState(tabParam);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "err" | "info"; text: string } | null>(null);
  const [kayitDurum, setKayitDurum] = useState<KayitDurum>("idle");

  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [gelirKodu, setGelirKodu] = useState("");
  const [aciklama, setAciklama] = useState("");
  const [tutar, setTutar] = useState("");
  const [yil, setYil] = useState(suDonemConfig.aktifYil);
  const [donem, setDonem] = useState(suDonemConfig.aktifDonem);

  const [faturalar, setFaturalar] = useState(getSuGenelFaturalar());
  const [seciliFatura, setSeciliFatura] = useState<SuGenelFatura | null>(null);
  const [ekstreGoster, setEkstreGoster] = useState(false);

  const aboneNo = formatAboneNo(aboneParca);
  const abone = aboneNo ? getSuAboneByAboneNo(aboneNo) : undefined;
  const donemStr = formatDonem(yil, donem);

  useEffect(() => {
    setTab(tabParam);
  }, [tabParam]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setMesaj(null);
    setSeciliFatura(null);
    setEkstreGoster(false);
    setUrl({ tab: id });
  };

  const handleKaydet = useCallback(async () => {
    if (!aboneNo) {
      setMesaj({ tip: "err", text: "Abone no giriniz." });
      return;
    }
    if (!abone) {
      setMesaj({ tip: "err", text: "Abone bulunamadı." });
      return;
    }
    if (!gelirKodu) {
      setMesaj({ tip: "err", text: "Gelir kodu seçiniz." });
      return;
    }
    if (!aciklama.trim()) {
      setMesaj({ tip: "err", text: "Açıklama zorunludur." });
      return;
    }
    const tutarNum = parseFloat(tutar.replace(",", "."));
    if (!tutarNum || tutarNum <= 0) {
      setMesaj({ tip: "err", text: "Geçerli bir tutar giriniz." });
      return;
    }

    setKayitDurum("loading");
    await new Promise((r) => setTimeout(r, 400));

    const fatura = kaydetSuGenelFatura({
      aboneNo,
      adSoyad: abone.adSoyad,
      gelirKodu,
      aciklama: aciklama.trim(),
      tutar: tutarNum,
      donem: donemStr,
      kullanici: user.name,
    });

    setFaturalar(getSuGenelFaturalar());
    setKayitDurum("basarili");
    setMesaj({ tip: "ok", text: `Genel fatura kesildi: ${fatura.faturaNo}` });
    setAboneParca(["", "", "", ""]);
    setAciklama("");
    setTutar("");
  }, [aboneNo, abone, aciklama, tutar, gelirKodu, donemStr, user.name]);

  const handleIptal = useCallback(() => {
    setAboneParca(["", "", "", ""]);
    setGelirKodu("");
    setAciklama("");
    setTutar("");
    setYil(suDonemConfig.aktifYil);
    setDonem(suDonemConfig.aktifDonem);
    setMesaj(null);
    setKayitDurum("idle");
    setSeciliFatura(null);
    setEkstreGoster(false);
  }, []);

  const handleYazdir = () => {
    if (!seciliFatura) return;
    setMesaj({ tip: "info", text: `${seciliFatura.faturaNo} yazdırılıyor.` });
  };

  const handleEkstre = () => {
    if (!seciliFatura) return;
    const ekstre = getSuGenelFaturaEkstre(seciliFatura.faturaNo);
    if (ekstre) {
      setEkstreGoster(true);
      setMesaj({ tip: "info", text: `${seciliFatura.faturaNo} ekstresi görüntüleniyor.` });
    }
  };

  useSuKlavye({
    onKaydet: tab === "kayit" ? handleKaydet : undefined,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab === "kayit",
  });

  const ekstre = seciliFatura ? getSuGenelFaturaEkstre(seciliFatura.faturaNo) : null;

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />

      {mesaj && (
        <div
          className={cn(
            "flex items-center gap-2 border-b px-4 py-2 text-sm",
            mesaj.tip === "ok" && "border-emerald-100 bg-emerald-50 text-emerald-800",
            mesaj.tip === "err" && "border-red-100 bg-red-50 text-red-700",
            mesaj.tip === "info" && "border-slate-100 bg-slate-50 text-slate-600",
          )}
        >
          {mesaj.tip === "ok" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {mesaj.text}
        </div>
      )}

      {tab === "kayit" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={aboneParca} onChange={setAboneParca} />
          {abone && (
            <p className="text-sm text-slate-600">
              <span className="font-medium">{abone.adSoyad}</span>
              <span className="mx-2 text-slate-300">·</span>
              {abone.adres}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Gelir Kodu</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={gelirKodu}
                onChange={(e) => setGelirKodu(e.target.value)}
              >
                <option value="">Seçiniz</option>
                {gelirKoduSecenekleri.map((g) => (
                  <option key={g.kod} value={g.kod}>
                    {g.kod} — {g.ad}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tutar (₺)</label>
              <input
                className="input-field h-9 text-sm"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
                placeholder="0,00"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Açıklama</label>
              <input
                className="input-field h-9 text-sm"
                value={aciklama}
                onChange={(e) => setAciklama(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Yıl</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={yil}
                onChange={(e) => setYil(Number(e.target.value))}
              >
                {suDonemConfig.yillar.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Dönem</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={donem}
                onChange={(e) => setDonem(Number(e.target.value))}
              >
                {Array.from({ length: suDonemConfig.donemSayisi }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}. Dönem ({formatDonem(yil, d)})
                  </option>
                ))}
              </select>
            </div>
          </div>
          {kayitDurum === "loading" && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Kaydediliyor...
            </div>
          )}
        </div>
      )}

      {tab === "liste" && (
        <div className="space-y-4 p-4">
          {seciliFatura && (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-2">
              <div className="text-sm">
                <span className="font-mono font-medium">{seciliFatura.faturaNo}</span>
                <span className="mx-2 text-slate-300">·</span>
                {seciliFatura.adSoyad}
                <span className="mx-2 text-slate-300">·</span>
                <span className="tabular-nums">{formatCurrency(seciliFatura.tutar)}</span>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={handleYazdir} className="btn-secondary inline-flex h-8 text-xs">
                  <Printer className="h-3.5 w-3.5" />
                  Yazdır
                </button>
                <button type="button" onClick={handleEkstre} className="btn-secondary inline-flex h-8 text-xs">
                  <FileText className="h-3.5 w-3.5" />
                  Ekstre
                </button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Fatura No</th>
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">Gelir Kodu</th>
                  <th className="px-3 py-2 text-left">Açıklama</th>
                  <th className="px-3 py-2 text-right">Tutar</th>
                  <th className="px-3 py-2 text-left">Dönem</th>
                  <th className="px-3 py-2 text-left">Son Ödeme</th>
                </tr>
              </thead>
              <tbody>
                {faturalar.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-slate-400">
                      Genel fatura kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  faturalar.map((f) => (
                    <tr
                      key={f.id}
                      onClick={() => {
                        setSeciliFatura(f);
                        setEkstreGoster(false);
                      }}
                      className={cn(
                        "h-10 cursor-pointer border-b border-slate-100 hover:bg-slate-50/70",
                        seciliFatura?.id === f.id && "border-l-2 border-l-[#1e40af] bg-blue-50/40",
                      )}
                    >
                      <td className="px-3 py-1.5 font-mono text-xs">{f.faturaNo}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{f.aboneNo}</td>
                      <td className="px-3 py-1.5">{f.adSoyad}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{f.gelirKodu}</td>
                      <td className="px-3 py-1.5">{f.aciklama}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {formatCurrency(f.tutar)}
                      </td>
                      <td className="px-3 py-1.5">{f.donem}</td>
                      <td className="px-3 py-1.5 text-slate-600">{f.sonOdeme}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {ekstreGoster && ekstre && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Fatura Ekstresi — {ekstre.faturaNo}
              </p>
              <p className="mt-1 text-sm text-slate-700">
                {ekstre.aboneNo} · {ekstre.adSoyad}
              </p>
              <table className="mt-3 w-full text-sm">
                <thead className="text-[11px] font-semibold uppercase text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="py-1.5 text-left">Açıklama</th>
                    <th className="py-1.5 text-left">Gelir Kodu</th>
                    <th className="py-1.5 text-right">Tutar</th>
                  </tr>
                </thead>
                <tbody>
                  {ekstre.satirlar.map((s, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      <td className="py-1.5">{s.aciklama}</td>
                      <td className="py-1.5 font-mono text-xs">{s.gelirKodu}</td>
                      <td className="py-1.5 text-right tabular-nums">{formatCurrency(s.tutar)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2} className="py-2 text-right font-medium">
                      Toplam
                    </td>
                    <td className="py-2 text-right font-bold tabular-nums">
                      {formatCurrency(ekstre.toplam)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <IslemActionBar
        onKaydet={tab === "kayit" ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetDisabled={tab !== "kayit" || kayitDurum === "loading"}
      />
    </div>
  );
}
