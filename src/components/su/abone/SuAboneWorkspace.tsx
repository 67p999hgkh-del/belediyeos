"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Loader2,
  Printer,
  Search,
} from "lucide-react";
import {
  araSuAbone,
  formatAboneNo,
  getSuAboneBelgeler,
  getSuAboneByAboneNo,
  getSuAboneFaturalar,
  getSuAboneHareketler,
  kaydetSuAbone,
  suAbonelikTurleri,
  suTarifeGruplari,
  type SuAboneKayit,
} from "@/lib/su-abone-mock";
import { kaydetSuAudit } from "@/lib/su-audit";
import { useApp } from "@/context/AppContext";
import { canSuIslem } from "@/lib/su-yetki";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AboneNoInput,
  BorcTablosu,
  IslemActionBar,
  ReadOnlyInfoField,
  SectionTabBar,
  SicilBilgileriPanel,
  StatusBadge,
  WorkspaceTabBar,
} from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";

const ws = suWorkspaces.abone;
const detaySections = ws.sections ?? [];

const aboneActions = ws.actions ?? [];

type KayitDurum = "idle" | "loading" | "basarili" | "hata";

export function SuAboneWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useApp();
  const yetkiliKapama = canSuIslem("abone-kapama", user.role);
  const yetkiliDevir = canSuIslem("abone-devir", user.role);

  const tabParam = searchParams.get("tab") ?? "sorgulama";
  const sectionParam = searchParams.get("section") ?? "genel";
  const actionParam = searchParams.get("action");

  const [tab, setTab] = useState(tabParam);
  const [detaySection, setDetaySection] = useState(sectionParam);
  const [seciliAbone, setSeciliAbone] = useState<SuAboneKayit | null>(null);
  const [actionMenuAcik, setActionMenuAcik] = useState(false);
  const [actionModal, setActionModal] = useState<string | null>(actionParam);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "err" | "info"; text: string } | null>(null);
  const [kayitDurum, setKayitDurum] = useState<KayitDurum>("idle");

  // Kayıt form
  const [kayitAboneParca, setKayitAboneParca] = useState(["", "", "", ""]);
  const [kayitForm, setKayitForm] = useState({
    adSoyad: "",
    kimlikNo: "",
    adres: "",
    telefon: "",
    abonelikTuru: suAbonelikTurleri[0],
    tarifeGrubu: suTarifeGruplari[0],
    sayacNo: "",
    aciklama: "",
  });

  // Sorgulama
  const [sorguAboneParca, setSorguAboneParca] = useState(["", "", "", ""]);
  const [sorgu, setSorgu] = useState({
    sicilNo: "",
    adSoyad: "",
    kimlikNo: "",
    sayacNo: "",
    adres: "",
  });
  const [sonuclar, setSonuclar] = useState<SuAboneKayit[]>([]);
  const [aramaYapildi, setAramaYapildi] = useState(false);
  const [kapamaGerekce, setKapamaGerekce] = useState("");
  const [devirForm, setDevirForm] = useState({ yeniAdSoyad: "", yeniAdres: "", gerekce: "" });

  const setUrl = useCallback(
    (next: { tab?: string; section?: string; action?: string | null; abone?: string }) => {
      const p = new URLSearchParams(searchParams.toString());
      if (next.tab) p.set("tab", next.tab);
      if (next.section) p.set("section", next.section);
      if (next.action === null) p.delete("action");
      else if (next.action) p.set("action", next.action);
      if (next.abone) p.set("abone", next.abone);
      router.replace(`/su/abone?${p.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    setTab(tabParam);
    setDetaySection(sectionParam);
    if (actionParam) setActionModal(actionParam);
    const aboneQ = searchParams.get("abone");
    if (aboneQ) {
      const found = getSuAboneByAboneNo(aboneQ);
      if (found) {
        setSeciliAbone(found);
        setTab("detay");
      }
    }
  }, [tabParam, sectionParam, actionParam, searchParams]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id, action: null });
    setMesaj(null);
  };

  const handleSorgula = useCallback(() => {
    setAramaYapildi(true);
    const liste = araSuAbone({
      aboneNo: formatAboneNo(sorguAboneParca),
      ...sorgu,
    });
    setSonuclar(liste);
    if (liste.length === 1) {
      setSeciliAbone(liste[0]);
    }
  }, [sorguAboneParca, sorgu]);

  const aboneSec = (a: SuAboneKayit) => {
    setSeciliAbone(a);
    setTab("detay");
    setUrl({ tab: "detay", abone: a.aboneNo, action: null });
  };

  const handleKaydet = useCallback(async () => {
    if (!kayitForm.adSoyad.trim()) {
      setMesaj({ tip: "err", text: "Adı Soyadı (Ünvanı) zorunludur." });
      return;
    }
    setKayitDurum("loading");
    await new Promise((r) => setTimeout(r, 400));
    const aboneNo = formatAboneNo(kayitAboneParca) || `${Date.now()}`.slice(-8).replace(/(.{2})/g, "$1-").slice(0, -1);
    kaydetSuAbone({ ...kayitForm, aboneNo });
    kaydetSuAudit({
      kullanici: user.name,
      islem: "Su Abone Kaydı",
      yeniDeger: aboneNo,
      aciklama: kayitForm.adSoyad,
    });
    setKayitDurum("basarili");
    setMesaj({ tip: "ok", text: `Abone kaydı oluşturuldu — ${aboneNo}` });
  }, [kayitForm, kayitAboneParca, user.name]);

  const handleIptal = useCallback(() => {
    setKayitAboneParca(["", "", "", ""]);
    setKayitForm({
      adSoyad: "",
      kimlikNo: "",
      adres: "",
      telefon: "",
      abonelikTuru: suAbonelikTurleri[0],
      tarifeGrubu: suTarifeGruplari[0],
      sayacNo: "",
      aciklama: "",
    });
    setSorguAboneParca(["", "", "", ""]);
    setSorgu({ sicilNo: "", adSoyad: "", kimlikNo: "", sayacNo: "", adres: "" });
    setSonuclar([]);
    setAramaYapildi(false);
    setSeciliAbone(null);
    setMesaj(null);
    setKayitDurum("idle");
    setActionModal(null);
    setUrl({ tab: "sorgulama", action: null });
  }, [setUrl]);

  useSuKlavye({
    onKaydet: tab === "kayit" ? handleKaydet : undefined,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    onAra: tab === "sorgulama" ? handleSorgula : undefined,
    kaydetEnabled: tab === "kayit",
  });

  const faturalar = seciliAbone ? getSuAboneFaturalar(seciliAbone.id) : [];
  const hareketler = seciliAbone ? getSuAboneHareketler(seciliAbone.id) : [];
  const belgeler = seciliAbone ? getSuAboneBelgeler(seciliAbone.id) : [];

  const borcSatirlari = useMemo(() => {
    if (!seciliAbone) return [];
    return faturalar
      .filter((f) => f.durum === "odenmedi")
      .map((f) => ({
        id: f.id,
        donem: f.donem,
        gelirKodu: "101",
        gelirAdi: "Su Bedeli",
        tutar: f.tutar,
        sonOdeme: f.sonOdeme,
      }));
  }, [seciliAbone, faturalar]);

  const durumBadge = (durum: SuAboneKayit["durum"]) => {
    if (durum === "aktif") return <StatusBadge label="Aktif" variant="success" />;
    if (durum === "kapali") return <StatusBadge label="Kapalı" variant="danger" />;
    return <StatusBadge label="Beklemede" variant="warning" />;
  };

  const openAction = (actionId: string) => {
    setActionModal(actionId);
    setActionMenuAcik(false);
    setUrl({ action: actionId });
  };

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

      {/* KAYIT */}
      {tab === "kayit" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={kayitAboneParca} onChange={setKayitAboneParca} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Adı Soyadı (Ünvanı)</label>
              <input
                className="input-field h-9 text-sm"
                value={kayitForm.adSoyad}
                onChange={(e) => setKayitForm((f) => ({ ...f, adSoyad: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Kimlik / Vergi No</label>
              <input
                className="input-field h-9 text-sm"
                value={kayitForm.kimlikNo}
                onChange={(e) => setKayitForm((f) => ({ ...f, kimlikNo: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Adres</label>
              <input
                className="input-field h-9 text-sm"
                value={kayitForm.adres}
                onChange={(e) => setKayitForm((f) => ({ ...f, adres: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Telefon</label>
              <input
                className="input-field h-9 text-sm"
                value={kayitForm.telefon}
                onChange={(e) => setKayitForm((f) => ({ ...f, telefon: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Abonelik Türü</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={kayitForm.abonelikTuru}
                onChange={(e) => setKayitForm((f) => ({ ...f, abonelikTuru: e.target.value }))}
              >
                {suAbonelikTurleri.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tarife Grubu</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={kayitForm.tarifeGrubu}
                onChange={(e) => setKayitForm((f) => ({ ...f, tarifeGrubu: e.target.value }))}
              >
                {suTarifeGruplari.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Sayaç No</label>
              <input
                className="input-field h-9 text-sm"
                value={kayitForm.sayacNo}
                onChange={(e) => setKayitForm((f) => ({ ...f, sayacNo: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Açıklama</label>
              <input
                className="input-field h-9 text-sm"
                value={kayitForm.aciklama}
                onChange={(e) => setKayitForm((f) => ({ ...f, aciklama: e.target.value }))}
              />
            </div>
          </div>
          {kayitDurum === "loading" && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Kaydediliyor...
            </div>
          )}
        </div>
      )}

      {/* SORGULAMA */}
      {tab === "sorgulama" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 lg:grid-cols-2">
            <AboneNoInput
              value={sorguAboneParca}
              onChange={setSorguAboneParca}
              onEnter={handleSorgula}
            />
            <div className="flex items-end justify-end">
              <button type="button" onClick={handleSorgula} className="btn-primary inline-flex h-9">
                <Search className="h-4 w-4" />
                F9 — Ara
              </button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label">Sicil No</label>
              <input
                className="input-field h-9 text-sm"
                value={sorgu.sicilNo}
                onChange={(e) => setSorgu((s) => ({ ...s, sicilNo: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Adı ve Soyadı</label>
              <input
                className="input-field h-9 text-sm"
                value={sorgu.adSoyad}
                onChange={(e) => setSorgu((s) => ({ ...s, adSoyad: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Kimlik No</label>
              <input
                className="input-field h-9 text-sm"
                value={sorgu.kimlikNo}
                onChange={(e) => setSorgu((s) => ({ ...s, kimlikNo: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Sayaç No</label>
              <input
                className="input-field h-9 text-sm"
                value={sorgu.sayacNo}
                onChange={(e) => setSorgu((s) => ({ ...s, sayacNo: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Adres</label>
              <input
                className="input-field h-9 text-sm"
                value={sorgu.adres}
                onChange={(e) => setSorgu((s) => ({ ...s, adres: e.target.value }))}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Sicil No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                  <th className="px-3 py-2 text-right">Borç</th>
                </tr>
              </thead>
              <tbody>
                {!aramaYapildi ? (
                  <tr>
                    <td colSpan={5} className="h-[120px] px-4 text-center text-slate-400">
                      Arama kriterlerini girerek abone sorgulayın.
                    </td>
                  </tr>
                ) : sonuclar.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="h-[120px] px-4 text-center text-slate-500">
                      Kriterlere uygun abone bulunamadı.
                    </td>
                  </tr>
                ) : (
                  sonuclar.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => aboneSec(a)}
                      className={cn(
                        "h-10 cursor-pointer border-b border-slate-100 hover:bg-slate-50/80",
                        seciliAbone?.id === a.id && "border-l-2 border-l-[#1e40af] bg-blue-50/40",
                      )}
                    >
                      <td className="px-3 py-1.5 font-mono text-xs">{a.aboneNo}</td>
                      <td className="px-3 py-1.5">{a.sicilNo}</td>
                      <td className="px-3 py-1.5">{a.adSoyad}</td>
                      <td className="px-3 py-1.5">{durumBadge(a.durum)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        {formatCurrency(a.guncelBorc)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAY */}
      {tab === "detay" && (
        <>
          {!seciliAbone ? (
            <div className="px-4 py-12 text-center text-sm text-slate-500">
              Abone detayı görüntülemek için Sorgulama sekmesinden bir abone seçin.
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-semibold text-slate-800">
                    {seciliAbone.aboneNo}
                  </span>
                  <span className="text-sm text-slate-600">{seciliAbone.adSoyad}</span>
                  {durumBadge(seciliAbone.durum)}
                </div>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActionMenuAcik(!actionMenuAcik)}
                    className="btn-secondary inline-flex h-8 text-xs"
                  >
                    İşlemler
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                  {actionMenuAcik && (
                    <div className="absolute right-0 z-20 mt-1 min-w-[220px] rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                      {aboneActions.map((act) => (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => openAction(act.id)}
                          className="block w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                        >
                          {act.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <SectionTabBar
                sections={detaySections}
                active={detaySection}
                onChange={(id) => {
                  setDetaySection(id);
                  setUrl({ section: id });
                }}
              />
              <div className="p-4">
                {detaySection === "genel" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <SicilBilgileriPanel
                      adSoyad={seciliAbone.adSoyad}
                      adres={seciliAbone.adres}
                      sicilNo={seciliAbone.sicilNo}
                      aboneNo={seciliAbone.aboneNo}
                    />
                    <ReadOnlyInfoField label="Telefon" value={seciliAbone.telefon} />
                    <ReadOnlyInfoField label="Abonelik Türü" value={seciliAbone.abonelikTuru} />
                    <ReadOnlyInfoField label="Tarife Grubu" value={seciliAbone.tarifeGrubu} />
                    <ReadOnlyInfoField
                      label="Kimlik / Vergi No"
                      value={seciliAbone.kimlikNo || seciliAbone.vergiNo || "—"}
                    />
                  </div>
                )}
                {detaySection === "sayac" && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ReadOnlyInfoField label="Sayaç No" value={seciliAbone.sayacNo} />
                    <ReadOnlyInfoField label="Marka" value={seciliAbone.sayacMarka ?? "—"} />
                    <ReadOnlyInfoField label="Son Okuma" value={seciliAbone.sonOkuma} />
                    <ReadOnlyInfoField label="Son Okuma Tarihi" value={seciliAbone.sonOkumaTarihi} />
                  </div>
                )}
                {detaySection === "borc-bakiye" && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-6">
                      <div>
                        <p className="text-xs text-slate-500">Güncel Borç</p>
                        <p className="text-xl font-bold tabular-nums text-slate-900">
                          {formatCurrency(seciliAbone.guncelBorc)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Bakiye</p>
                        <p className="text-xl font-bold tabular-nums text-[#1e40af]">
                          {formatCurrency(seciliAbone.bakiye)}
                        </p>
                      </div>
                    </div>
                    <BorcTablosu rows={borcSatirlari} emptyMessage="Ödenmemiş borç bulunmuyor." />
                  </div>
                )}
                {detaySection === "abonelik-durumu" && (
                  <div className="space-y-4">
                    <ReadOnlyInfoField
                      label="Mevcut Durum"
                      value={seciliAbone.durum === "aktif" ? "Aktif" : seciliAbone.durum === "kapali" ? "Kapalı" : "Beklemede"}
                    />
                    {yetkiliKapama ? (
                      <>
                        <div>
                          <label className="label">Gerekçe</label>
                          <input
                            className="input-field h-9 text-sm"
                            value={kapamaGerekce}
                            onChange={(e) => setKapamaGerekce(e.target.value)}
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            className="btn-primary inline-flex h-9 text-xs"
                            onClick={() => {
                              kaydetSuAudit({
                                kullanici: user.name,
                                islem: seciliAbone.durum === "aktif" ? "Abone Kapama" : "Abone Açma",
                                eskiDeger: seciliAbone.durum,
                                yeniDeger: seciliAbone.durum === "aktif" ? "kapali" : "aktif",
                                gerekce: kapamaGerekce,
                                aciklama: seciliAbone.aboneNo,
                              });
                              setMesaj({ tip: "ok", text: "Abonelik durumu güncellendi." });
                            }}
                          >
                            {seciliAbone.durum === "aktif" ? "Abone Kapat" : "Abone Aç"}
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-slate-500">Bu işlem için yetkiniz bulunmuyor.</p>
                    )}
                  </div>
                )}
                {detaySection === "devir-nakil" && (
                  <div className="space-y-4">
                    {yetkiliDevir ? (
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="label">Yeni Adı Soyadı (Ünvanı)</label>
                          <input
                            className="input-field h-9 text-sm"
                            value={devirForm.yeniAdSoyad}
                            onChange={(e) => setDevirForm((f) => ({ ...f, yeniAdSoyad: e.target.value }))}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Yeni Adres</label>
                          <input
                            className="input-field h-9 text-sm"
                            value={devirForm.yeniAdres}
                            onChange={(e) => setDevirForm((f) => ({ ...f, yeniAdres: e.target.value }))}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="label">Gerekçe</label>
                          <input
                            className="input-field h-9 text-sm"
                            value={devirForm.gerekce}
                            onChange={(e) => setDevirForm((f) => ({ ...f, gerekce: e.target.value }))}
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            className="btn-primary inline-flex h-9"
                            onClick={() => {
                              kaydetSuAudit({
                                kullanici: user.name,
                                islem: "Abone Devir / Nakil",
                                eskiDeger: seciliAbone.adSoyad,
                                yeniDeger: devirForm.yeniAdSoyad,
                                gerekce: devirForm.gerekce,
                                aciklama: seciliAbone.aboneNo,
                              });
                              setMesaj({ tip: "ok", text: "Devir / nakil işlemi kaydedildi." });
                            }}
                          >
                            Devir / Nakil Kaydet
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Bu işlem için yetkiniz bulunmuyor.</p>
                    )}
                  </div>
                )}
                {detaySection === "faturalar" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                        <tr className="border-b border-slate-200">
                          <th className="px-3 py-2 text-left">Dönem</th>
                          <th className="px-3 py-2 text-left">Fatura No</th>
                          <th className="px-3 py-2 text-left">Son Ödeme</th>
                          <th className="px-3 py-2 text-right">Tutar</th>
                          <th className="px-3 py-2 text-left">Durum</th>
                        </tr>
                      </thead>
                      <tbody>
                        {faturalar.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="py-8 text-center text-slate-400">
                              Fatura kaydı yok.
                            </td>
                          </tr>
                        ) : (
                          faturalar.map((f) => (
                            <tr key={f.id} className="h-10 border-b border-slate-100">
                              <td className="px-3 py-1.5">{f.donem}</td>
                              <td className="px-3 py-1.5 font-mono text-xs">{f.faturaNo}</td>
                              <td className="px-3 py-1.5">{f.sonOdeme}</td>
                              <td className="px-3 py-1.5 text-right tabular-nums">
                                {formatCurrency(f.tutar)}
                              </td>
                              <td className="px-3 py-1.5">
                                <StatusBadge
                                  label={f.durum === "odenmedi" ? "Ödenmedi" : f.durum}
                                  variant={f.durum === "odenmedi" ? "warning" : "success"}
                                />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {detaySection === "hareketler" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                        <tr className="border-b border-slate-200">
                          <th className="px-3 py-2 text-left">Tarih</th>
                          <th className="px-3 py-2 text-left">İşlem</th>
                          <th className="px-3 py-2 text-right">Tutar</th>
                          <th className="px-3 py-2 text-left">Açıklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hareketler.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="py-8 text-center text-slate-400">
                              Hareket kaydı yok.
                            </td>
                          </tr>
                        ) : (
                          hareketler.map((h) => (
                            <tr key={h.id} className="h-10 border-b border-slate-100">
                              <td className="px-3 py-1.5">{h.tarih}</td>
                              <td className="px-3 py-1.5">{h.islem}</td>
                              <td className="px-3 py-1.5 text-right tabular-nums">
                                {formatCurrency(h.tutar)}
                              </td>
                              <td className="px-3 py-1.5 text-slate-600">{h.aciklama}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
                {detaySection === "belgeler" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                        <tr className="border-b border-slate-200">
                          <th className="px-3 py-2 text-left">Tür</th>
                          <th className="px-3 py-2 text-left">Tarih</th>
                          <th className="px-3 py-2 text-left">Açıklama</th>
                        </tr>
                      </thead>
                      <tbody>
                        {belgeler.length === 0 ? (
                          <tr>
                            <td colSpan={3} className="py-8 text-center text-slate-400">
                              Belge kaydı yok.
                            </td>
                          </tr>
                        ) : (
                          belgeler.map((b) => (
                            <tr key={b.id} className="h-10 border-b border-slate-100">
                              <td className="px-3 py-1.5">{b.tur}</td>
                              <td className="px-3 py-1.5">{b.tarih}</td>
                              <td className="px-3 py-1.5">{b.aciklama}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* Action modal */}
      {actionModal && seciliAbone && (
        <div className="border-t border-slate-200 bg-slate-50 px-4 py-3">
          <p className="text-sm font-medium text-slate-800">
            {aboneActions.find((a) => a.id === actionModal)?.label}
          </p>
          <p className="mt-1 text-xs text-slate-500">
            {seciliAbone.aboneNo} — {seciliAbone.adSoyad}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              className="btn-primary inline-flex h-8 text-xs"
              onClick={() => {
                kaydetSuAudit({
                  kullanici: user.name,
                  islem: aboneActions.find((a) => a.id === actionModal)?.label ?? actionModal,
                  aciklama: seciliAbone.aboneNo,
                });
                setMesaj({ tip: "ok", text: "İşlem tamamlandı." });
                setActionModal(null);
                setUrl({ action: null });
              }}
            >
              <Printer className="h-3.5 w-3.5" />
              Onayla / Yazdır
            </button>
            <button
              type="button"
              onClick={() => {
                setActionModal(null);
                setUrl({ action: null });
              }}
              className="btn-secondary inline-flex h-8 text-xs"
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      <IslemActionBar
        onKaydet={tab === "kayit" ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetDisabled={tab !== "kayit" || kayitDurum === "loading"}
        extra={
          tab === "sorgulama" ? (
            <button type="button" className="btn-secondary inline-flex h-9 text-xs">
              <CreditCard className="h-3.5 w-3.5" />
              Kart Oku
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
