"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { formatAboneNo, getSuAboneByAboneNo } from "@/lib/su-abone-mock";
import {
  duzeltSuEkBakiye,
  getSuEkBakiyeListesi,
  kaydetSuEkBakiye,
  suEkBakiyeTurleri,
  type SuEkBakiyeKayit,
} from "@/lib/su-ek-bakiye-mock";
import { formatDonem, suDonemConfig } from "@/lib/su-fatura-mock";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn, formatCurrency } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import {
  AboneNoInput,
  IslemActionBar,
  ReadOnlyInfoField,
  StatusBadge,
  WorkspaceTabBar,
} from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";
import { useSuWorkspaceUrl } from "../shared/useSuWorkspaceUrl";

const ws = suWorkspaces["ek-bakiye"];

type Mesaj = { tip: "ok" | "err" | "info"; text: string } | null;

export function SuEkBakiyeWorkspace() {
  const router = useRouter();
  const { user } = useApp();
  const { searchParams, setUrl } = useSuWorkspaceUrl(ws.route);

  const tabParam = searchParams.get("tab") ?? "giris";
  const [tab, setTab] = useState(tabParam);
  const [mesaj, setMesaj] = useState<Mesaj>(null);
  const [kayitYukleniyor, setKayitYukleniyor] = useState(false);
  const [listeVersiyon, setListeVersiyon] = useState(0);

  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [girisForm, setGirisForm] = useState({
    bakiyeTuru: suEkBakiyeTurleri[0],
    tutar: "",
    donem: formatDonem(suDonemConfig.aktifYil, suDonemConfig.aktifDonem),
    aciklama: "",
  });

  const [duzeltmeKayit, setDuzeltmeKayit] = useState<SuEkBakiyeKayit | null>(null);
  const [duzeltmeForm, setDuzeltmeForm] = useState({ yeniTutar: "", gerekce: "" });
  const [duzeltmeYukleniyor, setDuzeltmeYukleniyor] = useState(false);

  useEffect(() => {
    setTab(tabParam);
  }, [tabParam]);

  const aboneNo = formatAboneNo(aboneParca);
  const abone = useMemo(
    () => (aboneNo.length >= 11 ? getSuAboneByAboneNo(aboneNo) : undefined),
    [aboneNo],
  );

  const liste = useMemo(() => getSuEkBakiyeListesi(), [listeVersiyon]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
    setDuzeltmeKayit(null);
  };

  const handleKaydet = useCallback(async () => {
    if (tab !== "giris") return;
    if (!abone) {
      setMesaj({ tip: "err", text: "Geçerli bir abone numarası girin." });
      return;
    }
    const tutar = parseFloat(girisForm.tutar.replace(",", "."));
    if (!tutar || tutar <= 0) {
      setMesaj({ tip: "err", text: "Tutar zorunludur ve sıfırdan büyük olmalıdır." });
      return;
    }
    if (!girisForm.donem.trim()) {
      setMesaj({ tip: "err", text: "Dönem zorunludur." });
      return;
    }

    setKayitYukleniyor(true);
    await new Promise((r) => setTimeout(r, 350));
    kaydetSuEkBakiye({
      aboneNo: abone.aboneNo,
      adSoyad: abone.adSoyad,
      bakiyeTuru: girisForm.bakiyeTuru,
      tutar,
      donem: girisForm.donem,
      aciklama: girisForm.aciklama,
      kullanici: user.name,
    });
    setKayitYukleniyor(false);
    setListeVersiyon((v) => v + 1);
    setMesaj({ tip: "ok", text: `${abone.aboneNo} için ek bakiye kaydı oluşturuldu.` });
    setGirisForm((f) => ({ ...f, tutar: "", aciklama: "" }));
  }, [tab, abone, girisForm, user.name]);

  const handleIptal = useCallback(() => {
    setAboneParca(["", "", "", ""]);
    setGirisForm({
      bakiyeTuru: suEkBakiyeTurleri[0],
      tutar: "",
      donem: formatDonem(suDonemConfig.aktifYil, suDonemConfig.aktifDonem),
      aciklama: "",
    });
    setMesaj(null);
    setDuzeltmeKayit(null);
    setDuzeltmeForm({ yeniTutar: "", gerekce: "" });
  }, []);

  const handleDuzeltmeKaydet = async () => {
    if (!duzeltmeKayit) return;
    const yeniTutar = parseFloat(duzeltmeForm.yeniTutar.replace(",", "."));
    if (!yeniTutar || yeniTutar <= 0) {
      setMesaj({ tip: "err", text: "Yeni tutar geçerli olmalıdır." });
      return;
    }
    if (!duzeltmeForm.gerekce.trim()) {
      setMesaj({ tip: "err", text: "Düzeltme gerekçesi zorunludur." });
      return;
    }

    setDuzeltmeYukleniyor(true);
    await new Promise((r) => setTimeout(r, 350));
    duzeltSuEkBakiye(duzeltmeKayit.id, yeniTutar, duzeltmeForm.gerekce, user.name);
    setDuzeltmeYukleniyor(false);
    setListeVersiyon((v) => v + 1);
    setMesaj({ tip: "ok", text: `${duzeltmeKayit.aboneNo} ek bakiye tutarı güncellendi.` });
    setDuzeltmeKayit(null);
    setDuzeltmeForm({ yeniTutar: "", gerekce: "" });
  };

  const satirSec = (kayit: SuEkBakiyeKayit) => {
    setDuzeltmeKayit(kayit);
    setDuzeltmeForm({ yeniTutar: String(kayit.tutar), gerekce: "" });
    setMesaj(null);
  };

  useSuKlavye({
    onKaydet: tab === "giris" ? handleKaydet : undefined,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab === "giris",
  });

  const durumBadge = (durum: SuEkBakiyeKayit["durum"]) =>
    durum === "aktif" ? (
      <StatusBadge label="Aktif" variant="success" />
    ) : (
      <StatusBadge label="Düzeltildi" variant="warning" />
    );

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

      {tab === "giris" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={aboneParca} onChange={setAboneParca} />
          {abone && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyInfoField label="Adı Soyadı (Ünvanı)" value={abone.adSoyad} />
              <ReadOnlyInfoField label="Adres" value={abone.adres} />
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Bakiye Türü</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={girisForm.bakiyeTuru}
                onChange={(e) => setGirisForm((f) => ({ ...f, bakiyeTuru: e.target.value }))}
              >
                {suEkBakiyeTurleri.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tutar</label>
              <input
                className="input-field h-9 text-sm"
                inputMode="decimal"
                value={girisForm.tutar}
                onChange={(e) => setGirisForm((f) => ({ ...f, tutar: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Dönem</label>
              <input
                className="input-field h-9 text-sm"
                value={girisForm.donem}
                onChange={(e) => setGirisForm((f) => ({ ...f, donem: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Açıklama</label>
              <input
                className="input-field h-9 text-sm"
                value={girisForm.aciklama}
                onChange={(e) => setGirisForm((f) => ({ ...f, aciklama: e.target.value }))}
              />
            </div>
          </div>
          {kayitYukleniyor && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Kaydediliyor...
            </div>
          )}
        </div>
      )}

      {tab === "liste" && (
        <div className="space-y-4 p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">Bakiye Türü</th>
                  <th className="px-3 py-2 text-left">Dönem</th>
                  <th className="px-3 py-2 text-right">Tutar</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {liste.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Ek bakiye kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  liste.map((k) => (
                    <tr
                      key={k.id}
                      onClick={() => satirSec(k)}
                      className={cn(
                        "h-10 cursor-pointer border-b border-slate-100 hover:bg-slate-50/80",
                        duzeltmeKayit?.id === k.id && "border-l-2 border-l-[#1e40af] bg-blue-50/40",
                      )}
                    >
                      <td className="px-3 py-1.5 font-mono text-xs">{k.aboneNo}</td>
                      <td className="px-3 py-1.5">{k.adSoyad}</td>
                      <td className="px-3 py-1.5">{k.bakiyeTuru}</td>
                      <td className="px-3 py-1.5 tabular-nums">{k.donem}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(k.tutar)}</td>
                      <td className="px-3 py-1.5">{durumBadge(k.durum)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {duzeltmeKayit && tab === "liste" && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-800">Ek Bakiye Düzeltme</p>
              <p className="text-xs text-slate-500">
                {duzeltmeKayit.aboneNo} — {duzeltmeKayit.adSoyad} · Mevcut tutar:{" "}
                {formatCurrency(duzeltmeKayit.tutar)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setDuzeltmeKayit(null);
                setDuzeltmeForm({ yeniTutar: "", gerekce: "" });
              }}
              className="rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Yeni Tutar</label>
              <input
                className="input-field h-9 text-sm"
                inputMode="decimal"
                value={duzeltmeForm.yeniTutar}
                onChange={(e) => setDuzeltmeForm((f) => ({ ...f, yeniTutar: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Gerekçe</label>
              <input
                className="input-field h-9 text-sm"
                value={duzeltmeForm.gerekce}
                onChange={(e) => setDuzeltmeForm((f) => ({ ...f, gerekce: e.target.value }))}
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={handleDuzeltmeKaydet}
              disabled={duzeltmeYukleniyor}
              className="btn-primary inline-flex h-8 text-xs"
            >
              {duzeltmeYukleniyor ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Düzeltmeyi Kaydet
            </button>
          </div>
        </div>
      )}

      <IslemActionBar
        onKaydet={tab === "giris" ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetDisabled={tab !== "giris" || kayitYukleniyor}
      />
    </div>
  );
}
