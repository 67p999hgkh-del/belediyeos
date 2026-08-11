"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { formatAboneNo, getSuAboneByAboneNo } from "@/lib/su-abone-mock";
import {
  getSuKanalBaglantilar,
  kaydetSuKanalBaglanti,
  type SuKanalBaglanti,
} from "@/lib/su-kanalizasyon-mock";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn } from "@/lib/utils";
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

const ws = suWorkspaces.kanalizasyon;

type Mesaj = { tip: "ok" | "err" | "info"; text: string } | null;

export function SuKanalizasyonWorkspace() {
  const router = useRouter();
  const { user } = useApp();
  const { searchParams, setUrl } = useSuWorkspaceUrl(ws.route);

  const tabParam = searchParams.get("tab") ?? "liste";
  const [tab, setTab] = useState(tabParam);
  const [mesaj, setMesaj] = useState<Mesaj>(null);
  const [kayitYukleniyor, setKayitYukleniyor] = useState(false);
  const [listeVersiyon, setListeVersiyon] = useState(0);

  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [yeniForm, setYeniForm] = useState({
    adSoyad: "",
    adres: "",
    kanalNo: "",
    aciklama: "",
  });

  useEffect(() => {
    setTab(tabParam);
  }, [tabParam]);

  const aboneNo = formatAboneNo(aboneParca);
  const abone = useMemo(
    () => (aboneNo.length >= 11 ? getSuAboneByAboneNo(aboneNo) : undefined),
    [aboneNo],
  );

  useEffect(() => {
    if (abone && tab === "yeni") {
      setYeniForm((f) => ({
        ...f,
        adSoyad: abone.adSoyad,
        adres: abone.adres,
      }));
    }
  }, [abone, tab]);

  const baglantilar = useMemo(() => getSuKanalBaglantilar(), [listeVersiyon]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
  };

  const handleKaydet = useCallback(async () => {
    if (tab !== "yeni") return;
    if (!abone) {
      setMesaj({ tip: "err", text: "Geçerli bir abone numarası girin." });
      return;
    }
    if (!yeniForm.kanalNo.trim()) {
      setMesaj({ tip: "err", text: "Kanal numarası zorunludur." });
      return;
    }
    if (!yeniForm.adSoyad.trim()) {
      setMesaj({ tip: "err", text: "Adı Soyadı zorunludur." });
      return;
    }

    setKayitYukleniyor(true);
    await new Promise((r) => setTimeout(r, 400));
    kaydetSuKanalBaglanti({
      aboneNo: abone.aboneNo,
      adSoyad: yeniForm.adSoyad,
      adres: yeniForm.adres,
      kanalNo: yeniForm.kanalNo,
      aciklama: yeniForm.aciklama || undefined,
      kullanici: user.name,
    });
    setKayitYukleniyor(false);
    setListeVersiyon((v) => v + 1);
    setMesaj({ tip: "ok", text: `${abone.aboneNo} için kanalizasyon bağlantısı kaydedildi.` });
    setAboneParca(["", "", "", ""]);
    setYeniForm({ adSoyad: "", adres: "", kanalNo: "", aciklama: "" });
  }, [tab, abone, yeniForm, user.name]);

  const handleIptal = useCallback(() => {
    setAboneParca(["", "", "", ""]);
    setYeniForm({ adSoyad: "", adres: "", kanalNo: "", aciklama: "" });
    setMesaj(null);
  }, []);

  useSuKlavye({
    onKaydet: tab === "yeni" ? handleKaydet : undefined,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab === "yeni",
  });

  const durumBadge = (durum: SuKanalBaglanti["durum"]) =>
    durum === "aktif" ? (
      <StatusBadge label="Aktif" variant="success" />
    ) : (
      <StatusBadge label="İptal" variant="danger" />
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

      {tab === "liste" && (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Kanal No</th>
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">Adres</th>
                  <th className="px-3 py-2 text-left">Bağlantı Tarihi</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {baglantilar.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                      Kanalizasyon bağlantı kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  baglantilar.map((b) => (
                    <tr key={b.id} className="h-10 border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="px-3 py-1.5 font-mono text-xs">{b.kanalNo}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{b.aboneNo}</td>
                      <td className="px-3 py-1.5">{b.adSoyad}</td>
                      <td className="px-3 py-1.5 text-slate-600">{b.adres}</td>
                      <td className="px-3 py-1.5">{b.baglantiTarihi}</td>
                      <td className="px-3 py-1.5">{durumBadge(b.durum)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "yeni" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={aboneParca} onChange={setAboneParca} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Adı Soyadı (Ünvanı)</label>
              <input
                className="input-field h-9 text-sm"
                value={yeniForm.adSoyad}
                onChange={(e) => setYeniForm((f) => ({ ...f, adSoyad: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Kanal No</label>
              <input
                className="input-field h-9 text-sm"
                value={yeniForm.kanalNo}
                onChange={(e) => setYeniForm((f) => ({ ...f, kanalNo: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Adres</label>
              <input
                className="input-field h-9 text-sm"
                value={yeniForm.adres}
                onChange={(e) => setYeniForm((f) => ({ ...f, adres: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Açıklama</label>
              <input
                className="input-field h-9 text-sm"
                value={yeniForm.aciklama}
                onChange={(e) => setYeniForm((f) => ({ ...f, aciklama: e.target.value }))}
              />
            </div>
          </div>
          {kayitYukleniyor && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Bağlantı kaydediliyor...
            </div>
          )}
        </div>
      )}

      <IslemActionBar
        onKaydet={tab === "yeni" ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetDisabled={tab !== "yeni" || kayitYukleniyor}
      />
    </div>
  );
}
