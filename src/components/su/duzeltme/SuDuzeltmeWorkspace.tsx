"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, Search, ShieldAlert } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { formatAboneNo, getSuAboneByAboneNo } from "@/lib/su-abone-mock";
import { getSuAuditLog } from "@/lib/su-audit";
import {
  bulSuDuzeltmeReferans,
  getSuDuzeltmeKayitlari,
  kaydetSuDuzeltme,
  suDuzeltmeTurleri,
  type SuDuzeltmeTur,
} from "@/lib/su-duzeltme-mock";
import { suWorkspaces } from "@/lib/su-workspaces";
import { canSuIslem } from "@/lib/su-yetki";
import { cn } from "@/lib/utils";
import { AboneNoInput, IslemActionBar, WorkspaceTabBar } from "../shared";
import { AuditLogPanel } from "../shared/AuditLogPanel";
import { useSuKlavye } from "../shared/useSuKlavye";

const ws = suWorkspaces.duzeltme;

type KayitDurum = "idle" | "loading" | "basarili" | "hata";

export function SuDuzeltmeWorkspace() {
  const router = useRouter();
  const { user } = useApp();

  const yetkili = canSuIslem("duzeltme", user.role);

  const [tab, setTab] = useState("duzeltme");
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "err" | "info"; text: string } | null>(null);
  const [kayitDurum, setKayitDurum] = useState<KayitDurum>("idle");
  const [auditGoster, setAuditGoster] = useState(false);

  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [referans, setReferans] = useState("");
  const [tur, setTur] = useState<SuDuzeltmeTur>("fatura-duzeltme");
  const [gerekce, setGerekce] = useState("");
  const [yeniDegerler, setYeniDegerler] = useState<Record<string, string>>({});
  const [kayitlar, setKayitlar] = useState(getSuDuzeltmeKayitlari());

  const aboneNo = formatAboneNo(aboneParca);
  const abone = aboneNo ? getSuAboneByAboneNo(aboneNo) : undefined;

  const turConfig = suDuzeltmeTurleri.find((t) => t.id === tur)!;
  const bulunan = useMemo(() => {
    const arama = referans.trim() || aboneNo;
    if (!arama) return null;
    return bulSuDuzeltmeReferans(tur, arama);
  }, [tur, referans, aboneNo]);

  useEffect(() => {
    if (bulunan) {
      const baslangic: Record<string, string> = {};
      turConfig.alanlar.forEach((a) => {
        baslangic[a.key] = bulunan.eski[a.key] ?? "";
      });
      setYeniDegerler(baslangic);
    } else {
      setYeniDegerler({});
    }
  }, [bulunan, turConfig.alanlar]);

  const handleAra = useCallback(() => {
    if (!aboneNo && !referans.trim()) {
      setMesaj({ tip: "err", text: "Abone no veya referans giriniz." });
      return;
    }
    const sonuc = bulSuDuzeltmeReferans(tur, referans.trim() || aboneNo);
    if (!sonuc) {
      setMesaj({ tip: "err", text: "Kayıt bulunamadı." });
      return;
    }
    setMesaj({ tip: "info", text: `Kayıt bulundu: ${sonuc.referans}` });
  }, [aboneNo, referans, tur]);

  const handleKaydet = useCallback(async () => {
    if (!yetkili) {
      setMesaj({ tip: "err", text: "Bu işlem için yetkiniz bulunmuyor." });
      return;
    }
    if (!bulunan) {
      setMesaj({ tip: "err", text: "Önce kayıt arayınız." });
      return;
    }
    if (!gerekce.trim()) {
      setMesaj({ tip: "err", text: "Gerekçe zorunludur." });
      return;
    }

    const degisen = turConfig.alanlar.find(
      (a) => yeniDegerler[a.key] !== undefined && yeniDegerler[a.key] !== bulunan.eski[a.key],
    );
    if (!degisen) {
      setMesaj({ tip: "err", text: "En az bir alanda yeni değer giriniz." });
      return;
    }

    setKayitDurum("loading");
    await new Promise((r) => setTimeout(r, 400));

    kaydetSuDuzeltme({
      tur,
      aboneNo: aboneNo || referans,
      referans: bulunan.referans,
      eskiDeger: bulunan.eski[degisen.key] ?? "",
      yeniDeger: yeniDegerler[degisen.key] ?? "",
      gerekce: gerekce.trim(),
      kullanici: user.name,
    });

    setKayitlar(getSuDuzeltmeKayitlari());
    setAuditGoster(true);
    setKayitDurum("basarili");
    setMesaj({ tip: "ok", text: "Düzeltme kaydı oluşturuldu." });
  }, [yetkili, bulunan, gerekce, turConfig.alanlar, yeniDegerler, tur, aboneNo, referans, user.name]);

  const handleIptal = useCallback(() => {
    setAboneParca(["", "", "", ""]);
    setReferans("");
    setTur("fatura-duzeltme");
    setGerekce("");
    setYeniDegerler({});
    setMesaj(null);
    setKayitDurum("idle");
    setAuditGoster(false);
  }, []);

  useSuKlavye({
    onKaydet: handleKaydet,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    onAra: handleAra,
    kaydetEnabled: yetkili && !!bulunan,
  });

  const auditKayitlar = auditGoster ? getSuAuditLog(10) : [];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={setTab} />

      {!yetkili && (
        <div className="flex items-center gap-2 border-b border-amber-100 bg-amber-50 px-4 py-2 text-sm text-amber-800">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          Düzeltme işlemi için yetkiniz bulunmuyor ({user.role}).
        </div>
      )}

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

      {tab === "duzeltme" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <AboneNoInput value={aboneParca} onChange={setAboneParca} onEnter={handleAra} />
            <div>
              <label className="label">Referans / Fatura No / Dönem</label>
              <div className="flex gap-2">
                <input
                  className="input-field h-9 flex-1 text-sm"
                  value={referans}
                  onChange={(e) => setReferans(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAra()}
                  placeholder="SU-2026-00142 veya 2026/1"
                />
                <button type="button" onClick={handleAra} className="btn-primary inline-flex h-9">
                  <Search className="h-4 w-4" />
                  F9 — Ara
                </button>
              </div>
            </div>
          </div>

          {abone && (
            <p className="text-sm text-slate-600">
              <span className="font-medium">{abone.adSoyad}</span>
              <span className="mx-2 text-slate-300">·</span>
              {abone.adres}
            </p>
          )}

          <div>
            <label className="label">Düzeltme Türü</label>
            <select
              className="input-field h-9 max-w-md py-1 text-sm"
              value={tur}
              onChange={(e) => setTur(e.target.value as SuDuzeltmeTur)}
            >
              {suDuzeltmeTurleri.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {bulunan && (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[560px] text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left">Alan</th>
                    <th className="px-3 py-2 text-left">Eski Değer</th>
                    <th className="px-3 py-2 text-left">Yeni Değer</th>
                  </tr>
                </thead>
                <tbody>
                  {turConfig.alanlar.map((a) => (
                    <tr key={a.key} className="border-b border-slate-100">
                      <td className="px-3 py-2 font-medium text-slate-700">{a.label}</td>
                      <td className="px-3 py-2 font-mono text-xs text-slate-500">
                        {bulunan.eski[a.key] ?? "—"}
                      </td>
                      <td className="px-3 py-2">
                        <input
                          className="input-field h-8 w-full text-sm"
                          value={yeniDegerler[a.key] ?? ""}
                          onChange={(e) =>
                            setYeniDegerler((d) => ({ ...d, [a.key]: e.target.value }))
                          }
                          disabled={!yetkili}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {bulunan && (
            <div>
              <label className="label">Gerekçe</label>
              <textarea
                className="input-field min-h-[72px] w-full resize-y py-2 text-sm"
                value={gerekce}
                onChange={(e) => setGerekce(e.target.value)}
                disabled={!yetkili}
                rows={3}
              />
            </div>
          )}

          {kayitDurum === "loading" && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Kaydediliyor...
            </div>
          )}

          {auditGoster && auditKayitlar.length > 0 && (
            <AuditLogPanel kayitlar={auditKayitlar} />
          )}

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Düzeltme Kayıtları
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full min-w-[720px] text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  <tr className="border-b border-slate-200">
                    <th className="px-3 py-2 text-left">Tarih</th>
                    <th className="px-3 py-2 text-left">Tür</th>
                    <th className="px-3 py-2 text-left">Abone No</th>
                    <th className="px-3 py-2 text-left">Referans</th>
                    <th className="px-3 py-2 text-left">Eski → Yeni</th>
                    <th className="px-3 py-2 text-left">Gerekçe</th>
                    <th className="px-3 py-2 text-left">Kullanıcı</th>
                  </tr>
                </thead>
                <tbody>
                  {kayitlar.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                        Düzeltme kaydı bulunmuyor.
                      </td>
                    </tr>
                  ) : (
                    kayitlar.map((k) => (
                      <tr key={k.id} className="h-10 border-b border-slate-100">
                        <td className="px-3 py-1.5 text-slate-600">{k.tarih}</td>
                        <td className="px-3 py-1.5">
                          {suDuzeltmeTurleri.find((t) => t.id === k.tur)?.label ?? k.tur}
                        </td>
                        <td className="px-3 py-1.5 font-mono text-xs">{k.aboneNo}</td>
                        <td className="px-3 py-1.5">{k.referans}</td>
                        <td className="px-3 py-1.5 font-mono text-xs">
                          {k.eskiDeger} → {k.yeniDeger}
                        </td>
                        <td className="px-3 py-1.5 text-slate-600">{k.gerekce}</td>
                        <td className="px-3 py-1.5">{k.kullanici}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <IslemActionBar
        onKaydet={bulunan && yetkili ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetDisabled={!yetkili || !bulunan || kayitDurum === "loading"}
      />
    </div>
  );
}
