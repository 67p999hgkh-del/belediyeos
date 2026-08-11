"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Printer,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  formatAboneNo,
  getSuAboneByAboneNo,
} from "@/lib/su-abone-mock";
import { suDonemConfig } from "@/lib/su/config";
import {
  getSuKrediByAboneNo,
  getSuKrediListesi,
  getSuKrediRapor,
  kaydetSuKrediGeriOdeme,
  suKrediRaporTurleri,
  type SuKrediKayit,
} from "@/lib/su-kredi-mock";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn, formatCurrency } from "@/lib/utils";
import { AboneNoInput, DonemFiltreSatiri, IslemActionBar, StatusBadge, WorkspaceTabBar } from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";
import { useSuWorkspaceUrl } from "../shared/useSuWorkspaceUrl";

const ws = suWorkspaces.kredi;

type KayitDurum = "idle" | "loading";

function krediDurumBadge(durum: SuKrediKayit["durum"]) {
  if (durum === "aktif") return <StatusBadge label="Aktif" variant="success" />;
  return <StatusBadge label="Kapalı" variant="neutral" />;
}

export function SuKrediWorkspace() {
  const router = useRouter();
  const { user } = useApp();
  const { searchParams, setUrl } = useSuWorkspaceUrl(ws.route);

  const tabParam = searchParams.get("tab") ?? "liste";
  const [tab, setTab] = useState(tabParam);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "err" | "info"; text: string } | null>(null);
  const [kayitDurum, setKayitDurum] = useState<KayitDurum>("idle");

  const [yil, setYil] = useState(suDonemConfig.aktifYil);
  const [donem, setDonem] = useState(suDonemConfig.aktifDonem);
  const [krediler, setKrediler] = useState(getSuKrediListesi());

  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [tutar, setTutar] = useState("");

  const [raporTuru, setRaporTuru] = useState<string>(suKrediRaporTurleri[0].id);
  const [raporGoster, setRaporGoster] = useState(false);

  const aboneNo = formatAboneNo(aboneParca);
  const abone = aboneNo ? getSuAboneByAboneNo(aboneNo) : undefined;
  const kredi = aboneNo ? getSuKrediByAboneNo(aboneNo) : undefined;

  useEffect(() => {
    setTab(tabParam);
  }, [tabParam]);

  const raporSonuc = useMemo(
    () => (raporGoster ? getSuKrediRapor(raporTuru, yil, donem) : []),
    [raporGoster, raporTuru, yil, donem],
  );

  const handleTabChange = (id: string) => {
    setTab(id);
    setMesaj(null);
    setRaporGoster(false);
    setUrl({ tab: id });
  };

  const handleKaydet = useCallback(async () => {
    if (tab === "geri-odeme") {
      if (!aboneNo) {
        setMesaj({ tip: "err", text: "Abone no giriniz." });
        return;
      }
      if (!kredi) {
        setMesaj({ tip: "err", text: "Bu abone için kredi kaydı bulunamadı." });
        return;
      }
      if (kredi.durum !== "aktif") {
        setMesaj({ tip: "err", text: "Kapalı kredi kaydı için geri ödeme yapılamaz." });
        return;
      }
      const tutarNum = parseFloat(tutar.replace(",", "."));
      if (!tutarNum || tutarNum <= 0) {
        setMesaj({ tip: "err", text: "Geçerli bir tutar giriniz." });
        return;
      }

      setKayitDurum("loading");
      await new Promise((r) => setTimeout(r, 400));

      const odeme = kaydetSuKrediGeriOdeme({
        aboneNo,
        tutar: tutarNum,
        kullanici: user.name,
      });

      setKrediler(getSuKrediListesi());
      setKayitDurum("idle");
      setMesaj({
        tip: "ok",
        text: `Geri ödeme kaydedildi. Makbuz No: ${odeme.makbuzNo}`,
      });
      setAboneParca(["", "", "", ""]);
      setTutar("");
    } else if (tab === "raporlar") {
      setRaporGoster(true);
      setMesaj({ tip: "info", text: "Rapor oluşturuldu." });
    }
  }, [tab, aboneNo, kredi, tutar, user.name]);

  const handleIptal = useCallback(() => {
    setAboneParca(["", "", "", ""]);
    setTutar("");
    setMesaj(null);
    setKayitDurum("idle");
    setRaporGoster(false);
  }, []);

  useSuKlavye({
    onKaydet: tab === "liste" ? undefined : handleKaydet,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab !== "liste",
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

      {tab === "liste" && (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">Son İşlem</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {krediler.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                      Kredi kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  krediler.map((k) => (
                    <tr key={k.id} className="h-10 border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="px-3 py-1.5 font-mono text-xs">{k.aboneNo}</td>
                      <td className="px-3 py-1.5">{k.adSoyad}</td>
                      <td className="px-3 py-1.5 text-slate-600">{k.sonIslem}</td>
                      <td className="px-3 py-1.5">{krediDurumBadge(k.durum)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "geri-odeme" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={aboneParca} onChange={setAboneParca} />
          {abone && kredi && (
            <p className="text-sm text-slate-600">
              <span className="font-medium">{abone.adSoyad}</span>
              <span className="mx-2 text-slate-300">·</span>
              Son işlem:{" "}
              <span className="font-semibold tabular-nums text-[#1e40af]">{kredi.sonIslem}</span>
            </p>
          )}
          <div className="max-w-xs">
            <label className="label">Geri Ödeme Tutarı (₺)</label>
            <input
              className="input-field h-9 text-sm"
              value={tutar}
              onChange={(e) => setTutar(e.target.value)}
              placeholder="0,00"
            />
          </div>
          {kayitDurum === "loading" && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Kaydediliyor...
            </div>
          )}
        </div>
      )}

      {tab === "raporlar" && (
        <div className="space-y-4 p-4">
          <DonemFiltreSatiri
            yil={yil}
            donem={donem}
            onYilChange={(v) => {
              setYil(v);
              setRaporGoster(false);
            }}
            onDonemChange={(v) => {
              setDonem(v);
              setRaporGoster(false);
            }}
          />
          <div className="max-w-md">
            <label className="label">Rapor Türü</label>
            <select
              className="input-field h-9 py-1 text-sm"
              value={raporTuru}
              onChange={(e) => {
                setRaporTuru(e.target.value);
                setRaporGoster(false);
              }}
            >
              {suKrediRaporTurleri.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <button type="button" onClick={handleKaydet} className="btn-primary inline-flex h-9">
            <Printer className="h-4 w-4" />
            Rapor Oluştur
          </button>
          {raporGoster && (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                  <tr className="border-b border-slate-200">
                    {raporTuru === "donem" ? (
                      <>
                        <th className="px-3 py-2 text-left">Abone No</th>
                        <th className="px-3 py-2 text-left">Adı Soyadı</th>
                        <th className="px-3 py-2 text-left">Son İşlem</th>
                        <th className="px-3 py-2 text-left">Dönem</th>
                        <th className="px-3 py-2 text-left">Durum</th>
                      </>
                    ) : (
                      <>
                        <th className="px-3 py-2 text-left">Abone No</th>
                        <th className="px-3 py-2 text-right">Tutar</th>
                        <th className="px-3 py-2 text-left">Tarih</th>
                        <th className="px-3 py-2 text-left">Makbuz No</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {raporSonuc.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                        Rapor verisi bulunmuyor.
                      </td>
                    </tr>
                  ) : raporTuru === "donem" ? (
                    raporSonuc.map((row, i) => (
                      <tr key={i} className="h-10 border-b border-slate-100">
                        <td className="px-3 py-1.5 font-mono text-xs">
                          {(row as { aboneNo: string }).aboneNo}
                        </td>
                        <td className="px-3 py-1.5">{(row as { adSoyad: string }).adSoyad}</td>
                        <td className="px-3 py-1.5">{(row as { sonIslem: string }).sonIslem}</td>
                        <td className="px-3 py-1.5">{(row as { donem: string }).donem}</td>
                        <td className="px-3 py-1.5">{(row as { durum: string }).durum}</td>
                      </tr>
                    ))
                  ) : (
                    raporSonuc.map((row, i) => (
                      <tr key={i} className="h-10 border-b border-slate-100">
                        <td className="px-3 py-1.5 font-mono text-xs">
                          {(row as { aboneNo: string }).aboneNo}
                        </td>
                        <td className="px-3 py-1.5 text-right tabular-nums">
                          {formatCurrency((row as { tutar: number }).tutar)}
                        </td>
                        <td className="px-3 py-1.5">{(row as { tarih: string }).tarih}</td>
                        <td className="px-3 py-1.5 font-mono text-xs">
                          {(row as { makbuzNo: string }).makbuzNo}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <IslemActionBar
        onKaydet={tab !== "liste" ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetLabel={tab === "raporlar" ? "Rapor Oluştur" : tab === "geri-odeme" ? "Kaydet" : undefined}
        kaydetDisabled={tab === "geri-odeme" && kayitDurum === "loading"}
        kaydetLoading={kayitDurum === "loading"}
      />
    </div>
  );
}
