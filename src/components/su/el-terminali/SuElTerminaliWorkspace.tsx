"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  FileDown,
  FileUp,
  Loader2,
  Upload,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  alSuOkumaVerisi,
  getSuAktarimGecmisi,
  getSuTerminaller,
  hazirlaSuOkumaVerisi,
  type SuAktarimKayit,
} from "@/lib/su-el-terminali-mock";
import { formatDonem, suDonemConfig } from "@/lib/su-fatura-mock";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn } from "@/lib/utils";
import { IslemActionBar, WorkspaceTabBar } from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";
import { useSuWorkspaceUrl } from "../shared/useSuWorkspaceUrl";

const ws = suWorkspaces["el-terminali"];

function aktarimDurumBadge(durum: SuAktarimKayit["durum"]) {
  const map = {
    basarili: { label: "Başarılı", cls: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
    hatali: { label: "Hatalı", cls: "bg-red-50 text-red-700 ring-red-200" },
    uyarili: { label: "Uyarılı", cls: "bg-amber-50 text-amber-700 ring-amber-200" },
  };
  const c = map[durum];
  return (
    <span className={cn("inline-flex rounded px-2 py-0.5 text-[11px] font-medium ring-1", c.cls)}>
      {c.label}
    </span>
  );
}

export function SuElTerminaliWorkspace() {
  const router = useRouter();
  const { user } = useApp();
  const { searchParams, setUrl } = useSuWorkspaceUrl(ws.route);

  const tabParam = searchParams.get("tab") ?? "veri-hazirla";
  const [tab, setTab] = useState(tabParam);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "err" | "info"; text: string } | null>(null);
  const [islemYukleniyor, setIslemYukleniyor] = useState(false);

  const [yil, setYil] = useState(suDonemConfig.aktifYil);
  const [donem, setDonem] = useState(suDonemConfig.aktifDonem);
  const [hazirlikSonuc, setHazirlikSonuc] = useState<{
    dosyaAdi: string;
    aboneSayisi: number;
    kayitSayisi: number;
  } | null>(null);
  const [terminalPanelAcik, setTerminalPanelAcik] = useState(false);

  const [dosyaAdi, setDosyaAdi] = useState("");
  const [seciliTerminal, setSeciliTerminal] = useState("");
  const [aktarimSonuc, setAktarimSonuc] = useState<SuAktarimKayit | null>(null);
  const [gecmis, setGecmis] = useState(getSuAktarimGecmisi());

  const terminaller = useMemo(() => getSuTerminaller(), []);
  const donemStr = formatDonem(yil, donem);

  useEffect(() => {
    setTab(tabParam);
  }, [tabParam]);

  useEffect(() => {
    if (!seciliTerminal && terminaller.length > 0) {
      const aktif = terminaller.find((t) => t.durum === "aktif");
      setSeciliTerminal(aktif?.kod ?? terminaller[0].kod);
    }
  }, [terminaller, seciliTerminal]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setMesaj(null);
    setUrl({ tab: id });
  };

  const handleHazirla = useCallback(async () => {
    setIslemYukleniyor(true);
    await new Promise((r) => setTimeout(r, 400));
    const sonuc = hazirlaSuOkumaVerisi(donemStr, seciliTerminal, user.name);
    setHazirlikSonuc(sonuc);
    setIslemYukleniyor(false);
    setMesaj({
      tip: "ok",
      text: `${donemStr} dönemi okuma paketi hazırlandı (${sonuc.dosyaAdi}).`,
    });
  }, [donemStr, seciliTerminal, user.name]);

  const handleDosyaSec = () => {
    setDosyaAdi(`okuma_${String(yil)}${String(donem).padStart(2, "0")}.et`);
    setMesaj({ tip: "info", text: "Dosya seçildi." });
  };

  const handleAktar = useCallback(async () => {
    if (!dosyaAdi) {
      setMesaj({ tip: "err", text: "Aktarılacak dosyayı seçiniz." });
      return;
    }
    if (!seciliTerminal) {
      setMesaj({ tip: "err", text: "Terminal seçiniz." });
      return;
    }
    setIslemYukleniyor(true);
    await new Promise((r) => setTimeout(r, 400));
    const sonuc = alSuOkumaVerisi(dosyaAdi, seciliTerminal, user.name);
    setAktarimSonuc(sonuc);
    setGecmis(getSuAktarimGecmisi());
    setIslemYukleniyor(false);
    setMesaj({
      tip: "ok",
      text: `${sonuc.basarili}/${sonuc.kayitSayisi} kayıt aktarıldı.`,
    });
  }, [dosyaAdi, seciliTerminal, user.name]);

  const handleIptal = useCallback(() => {
    setMesaj(null);
    setHazirlikSonuc(null);
    setDosyaAdi("");
    setAktarimSonuc(null);
  }, []);

  const handleKaydet = useCallback(() => {
    if (tab === "veri-hazirla") handleHazirla();
    else if (tab === "veri-al") handleAktar();
  }, [tab, handleHazirla, handleAktar]);

  useSuKlavye({
    onKaydet: tab !== "gecmis" ? handleKaydet : undefined,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab !== "gecmis",
  });

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

      {tab === "veri-hazirla" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
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
                    {d}. Dönem
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleHazirla}
                disabled={islemYukleniyor}
                className="btn-primary inline-flex h-9 w-full sm:w-auto"
              >
                {islemYukleniyor ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                Veri Hazırla
              </button>
            </div>
          </div>

          {hazirlikSonuc && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Oluşturulan Paket
              </p>
              <div className="mt-2 grid gap-2 sm:grid-cols-3">
                <div>
                  <p className="text-xs text-slate-500">Dosya</p>
                  <p className="font-mono text-sm font-medium">{hazirlikSonuc.dosyaAdi}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Abone Sayısı</p>
                  <p className="text-sm font-semibold tabular-nums">
                    {hazirlikSonuc.aboneSayisi.toLocaleString("tr-TR")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Kayıt Sayısı</p>
                  <p className="text-sm font-semibold tabular-nums">
                    {hazirlikSonuc.kayitSayisi.toLocaleString("tr-TR")}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setTerminalPanelAcik(!terminalPanelAcik)}
              className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Terminal Tanımları
              {terminalPanelAcik ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>
            {terminalPanelAcik && (
              <div className="border-t border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                      <tr className="border-b border-slate-200">
                        <th className="px-3 py-2 text-left">Kod</th>
                        <th className="px-3 py-2 text-left">Marka</th>
                        <th className="px-3 py-2 text-left">Seri No</th>
                        <th className="px-3 py-2 text-left">Durum</th>
                      </tr>
                    </thead>
                    <tbody>
                      {terminaller.map((t) => (
                        <tr key={t.id} className="h-10 border-b border-slate-100">
                          <td className="px-3 py-1.5 font-mono text-xs">{t.kod}</td>
                          <td className="px-3 py-1.5">{t.marka}</td>
                          <td className="px-3 py-1.5 font-mono text-xs">{t.seriNo}</td>
                          <td className="px-3 py-1.5">
                            <span
                              className={cn(
                                "inline-flex rounded px-2 py-0.5 text-[11px] font-medium ring-1",
                                t.durum === "aktif"
                                  ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                                  : "bg-slate-100 text-slate-600 ring-slate-200",
                              )}
                            >
                              {t.durum === "aktif" ? "Aktif" : "Pasif"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === "veri-al" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label">Okuma Dosyası</label>
              <div className="flex gap-2">
                <input
                  className="input-field h-9 flex-1 text-sm"
                  value={dosyaAdi}
                  readOnly
                  placeholder="Dosya seçilmedi"
                />
                <button type="button" onClick={handleDosyaSec} className="btn-secondary inline-flex h-9">
                  <Upload className="h-4 w-4" />
                  Seç
                </button>
              </div>
            </div>
            <div>
              <label className="label">Terminal</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={seciliTerminal}
                onChange={(e) => setSeciliTerminal(e.target.value)}
              >
                {terminaller
                  .filter((t) => t.durum === "aktif")
                  .map((t) => (
                    <option key={t.id} value={t.kod}>
                      {t.kod} — {t.marka}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAktar}
                disabled={islemYukleniyor}
                className="btn-primary inline-flex h-9 w-full sm:w-auto"
              >
                {islemYukleniyor ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileUp className="h-4 w-4" />
                )}
                Veri Al / Aktar
              </button>
            </div>
          </div>

          {aktarimSonuc && (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[480px] text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left">Dosya</th>
                    <th className="px-3 py-2 text-left">Terminal</th>
                    <th className="px-3 py-2 text-right">Toplam</th>
                    <th className="px-3 py-2 text-right">Başarılı</th>
                    <th className="px-3 py-2 text-right">Hatalı</th>
                    <th className="px-3 py-2 text-right">Uyarılı</th>
                    <th className="px-3 py-2 text-left">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono text-xs">{aktarimSonuc.dosya}</td>
                    <td className="px-3 py-2">{aktarimSonuc.terminal}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{aktarimSonuc.kayitSayisi}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-emerald-700">
                      {aktarimSonuc.basarili}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-red-600">
                      {aktarimSonuc.hatali}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-amber-600">
                      {aktarimSonuc.uyarili}
                    </td>
                    <td className="px-3 py-2">{aktarimDurumBadge(aktarimSonuc.durum)}</td>
                  </tr>
                </tbody>
              </table>
              {aktarimSonuc.hataDetay && (
                <p className="border-t border-slate-100 px-3 py-2 text-xs text-amber-700">
                  {aktarimSonuc.hataDetay}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {tab === "gecmis" && (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Tarih</th>
                  <th className="px-3 py-2 text-left">Kullanıcı</th>
                  <th className="px-3 py-2 text-left">Dosya</th>
                  <th className="px-3 py-2 text-left">Terminal</th>
                  <th className="px-3 py-2 text-right">Kayıt</th>
                  <th className="px-3 py-2 text-right">Başarılı</th>
                  <th className="px-3 py-2 text-right">Hatalı</th>
                  <th className="px-3 py-2 text-right">Uyarılı</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {gecmis.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                      Aktarım geçmişi bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  gecmis.map((g) => (
                    <tr key={g.id} className="h-10 border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="px-3 py-1.5 text-slate-600">{g.tarih}</td>
                      <td className="px-3 py-1.5">{g.kullanici}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{g.dosya}</td>
                      <td className="px-3 py-1.5">{g.terminal}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{g.kayitSayisi}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-emerald-700">
                        {g.basarili}
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-red-600">{g.hatali}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums text-amber-600">
                        {g.uyarili}
                      </td>
                      <td className="px-3 py-1.5">{aktarimDurumBadge(g.durum)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <IslemActionBar
        onKaydet={tab !== "gecmis" ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetLabel={tab === "veri-hazirla" ? "Veri Hazırla" : tab === "veri-al" ? "Veri Al" : undefined}
        kaydetLoading={islemYukleniyor}
      />
    </div>
  );
}
