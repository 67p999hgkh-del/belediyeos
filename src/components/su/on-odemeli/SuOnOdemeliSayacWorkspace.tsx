"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  Calculator,
  CheckCircle2,
  CreditCard,
  Loader2,
} from "lucide-react";
import {
  getSuOnOdemeliSatislar,
  hesaplaSuOnOdemeliFatura,
  islemSuOnOdemeliKart,
  okuSuOnOdemeliKart,
  suOnOdemeliConfig,
  type SuOnOdemeliSistem,
} from "@/lib/su-on-odemeli-mock";
import { canSuIslem } from "@/lib/su-yetki";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn, formatCurrency } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import {
  IslemActionBar,
  ReadOnlyInfoField,
  StatusBadge,
  WorkspaceTabBar,
} from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";
import { useSuWorkspaceUrl } from "../shared/useSuWorkspaceUrl";

const ws = suWorkspaces["on-odemeli-sayac"];

const kartIslemTurleri = ["Kart Yükleme", "İptal"];

type Mesaj = { tip: "ok" | "err" | "info"; text: string } | null;

export function SuOnOdemeliSayacWorkspace() {
  const router = useRouter();
  const { user } = useApp();
  const { searchParams, setUrl } = useSuWorkspaceUrl(ws.route);

  const tabParam = searchParams.get("tab") ?? "kart-okuma";
  const sistemParam = (searchParams.get("sistem") ??
    suOnOdemeliConfig.varsayilanSistem) as SuOnOdemeliSistem;

  const [tab, setTab] = useState(tabParam);
  const [sistem, setSistem] = useState<SuOnOdemeliSistem>(sistemParam);
  const [mesaj, setMesaj] = useState<Mesaj>(null);
  const [islemYukleniyor, setIslemYukleniyor] = useState(false);
  const [listeVersiyon, setListeVersiyon] = useState(0);

  const [kartNo, setKartNo] = useState("");
  const [kartBilgi, setKartBilgi] = useState<ReturnType<typeof okuSuOnOdemeliKart> | null>(null);
  const [islemTuru, setIslemTuru] = useState(kartIslemTurleri[0]);
  const [islemTutar, setIslemTutar] = useState("");
  const [tuketim, setTuketim] = useState("");
  const [faturaSonuc, setFaturaSonuc] = useState<ReturnType<
    typeof hesaplaSuOnOdemeliFatura
  > | null>(null);

  const sistemYetkili = canSuIslem("on-odemeli-sistem", user.role);

  useEffect(() => {
    setTab(tabParam);
    setSistem(sistemParam);
  }, [tabParam, sistemParam]);

  const satislar = useMemo(
    () => getSuOnOdemeliSatislar(sistem),
    [sistem, listeVersiyon],
  );

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
    setFaturaSonuc(null);
  };

  const handleSistemChange = (s: SuOnOdemeliSistem) => {
    if (!sistemYetkili) {
      setMesaj({ tip: "err", text: "Sistem değiştirme yetkiniz bulunmuyor." });
      return;
    }
    setSistem(s);
    setUrl({ sistem: s });
    setKartBilgi(null);
    setKartNo("");
    setFaturaSonuc(null);
    setMesaj(null);
  };

  const handleKartOku = async () => {
    if (!kartNo.trim()) {
      setMesaj({ tip: "err", text: "Kart numarası girin." });
      return;
    }
    setIslemYukleniyor(true);
    await new Promise((r) => setTimeout(r, 300));
    const bilgi = okuSuOnOdemeliKart(sistem, kartNo.trim());
    setIslemYukleniyor(false);
    if (!bilgi) {
      setKartBilgi(null);
      setMesaj({ tip: "err", text: "Kart bulunamadı." });
      return;
    }
    setKartBilgi(bilgi);
    setMesaj({ tip: "ok", text: `${sistem} kartı okundu.` });
  };

  const handleKaydet = useCallback(async () => {
    if (tab === "kart-islemleri") {
      if (!kartNo.trim()) {
        setMesaj({ tip: "err", text: "Kart numarası zorunludur." });
        return;
      }
      const tutar = parseFloat(islemTutar.replace(",", "."));
      if (!tutar || tutar <= 0) {
        setMesaj({ tip: "err", text: "Geçerli bir tutar girin." });
        return;
      }
      setIslemYukleniyor(true);
      await new Promise((r) => setTimeout(r, 400));
      islemSuOnOdemeliKart({
        sistem,
        kartNo: kartNo.trim(),
        islem: islemTuru,
        tutar,
        kullanici: user.name,
      });
      setIslemYukleniyor(false);
      setListeVersiyon((v) => v + 1);
      setMesaj({ tip: "ok", text: `${islemTuru} işlemi tamamlandı.` });
      setIslemTutar("");
    } else if (tab === "fatura-hesap") {
      if (!kartNo.trim()) {
        setMesaj({ tip: "err", text: "Kart numarası zorunludur." });
        return;
      }
      const tuketimVal = parseFloat(tuketim.replace(",", "."));
      if (!tuketimVal || tuketimVal <= 0) {
        setMesaj({ tip: "err", text: "Geçerli bir tüketim değeri girin." });
        return;
      }
      setIslemYukleniyor(true);
      await new Promise((r) => setTimeout(r, 400));
      const sonuc = hesaplaSuOnOdemeliFatura({
        sistem,
        kartNo: kartNo.trim(),
        tuketim: tuketimVal,
        kullanici: user.name,
      });
      setFaturaSonuc(sonuc);
      setIslemYukleniyor(false);
      setListeVersiyon((v) => v + 1);
      setMesaj({ tip: "ok", text: "Fatura hesaplaması tamamlandı." });
    }
  }, [tab, kartNo, islemTutar, islemTuru, tuketim, sistem, user.name]);

  const handleIptal = useCallback(() => {
    setKartNo("");
    setKartBilgi(null);
    setIslemTuru(kartIslemTurleri[0]);
    setIslemTutar("");
    setTuketim("");
    setFaturaSonuc(null);
    setMesaj(null);
  }, []);

  useSuKlavye({
    onKaydet:
      tab === "kart-islemleri" || tab === "fatura-hesap" ? handleKaydet : undefined,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab === "kart-islemleri" || tab === "fatura-hesap",
  });

  const durumBadge = (durum: "basarili" | "iptal") =>
    durum === "basarili" ? (
      <StatusBadge label="Başarılı" variant="success" />
    ) : (
      <StatusBadge label="İptal" variant="danger" />
    );

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2">
        <span className="text-xs font-medium text-slate-600">Sistem:</span>
        {suOnOdemeliConfig.sistemler.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSistemChange(s)}
            disabled={!sistemYetkili && s !== sistem}
            className={cn(
              "rounded-md px-3 py-1 text-xs font-medium transition",
              sistem === s
                ? "bg-[#1e40af] text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              !sistemYetkili && s !== sistem && "cursor-not-allowed opacity-50",
            )}
          >
            {s}
          </button>
        ))}
        {!sistemYetkili && (
          <span className="text-[11px] text-slate-500">Sistem değiştirme yetkisi gerekli</span>
        )}
      </div>

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

      {tab === "kart-okuma" && (
        <div className="space-y-4 p-4">
          <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="label">Kart No</label>
              <input
                className="input-field h-9 w-48 font-mono text-sm"
                value={kartNo}
                onChange={(e) => setKartNo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleKartOku()}
              />
            </div>
            <button
              type="button"
              onClick={handleKartOku}
              disabled={islemYukleniyor}
              className="btn-primary inline-flex h-9"
            >
              {islemYukleniyor ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CreditCard className="h-4 w-4" />
              )}
              Kart Oku
            </button>
          </div>

          {kartBilgi && (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <ReadOnlyInfoField label="Sistem" value={kartBilgi.sistem} />
              <ReadOnlyInfoField label="Kart No" value={kartBilgi.kartNo} />
              <ReadOnlyInfoField label="Abone No" value={kartBilgi.aboneNo} />
              <ReadOnlyInfoField label="Adı Soyadı" value={kartBilgi.adSoyad} />
              <ReadOnlyInfoField label="Bakiye" value={formatCurrency(kartBilgi.bakiye)} />
              <ReadOnlyInfoField label="Son İşlem" value={kartBilgi.sonIslem} />
            </div>
          )}
        </div>
      )}

      {tab === "kart-islemleri" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label">Kart No</label>
              <input
                className="input-field h-9 font-mono text-sm"
                value={kartNo}
                onChange={(e) => setKartNo(e.target.value)}
              />
            </div>
            <div>
              <label className="label">İşlem Türü</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={islemTuru}
                onChange={(e) => setIslemTuru(e.target.value)}
              >
                {kartIslemTurleri.map((t) => (
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
                value={islemTutar}
                onChange={(e) => setIslemTutar(e.target.value)}
              />
            </div>
          </div>
          {islemYukleniyor && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> İşlem yapılıyor...
            </div>
          )}
        </div>
      )}

      {tab === "fatura-hesap" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="label">Kart No</label>
              <input
                className="input-field h-9 font-mono text-sm"
                value={kartNo}
                onChange={(e) => setKartNo(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Tüketim (m³)</label>
              <input
                className="input-field h-9 text-sm"
                inputMode="decimal"
                value={tuketim}
                onChange={(e) => setTuketim(e.target.value)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleKaydet}
                disabled={islemYukleniyor}
                className="btn-primary inline-flex h-9"
              >
                {islemYukleniyor ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Calculator className="h-4 w-4" />
                )}
                Hesapla
              </button>
            </div>
          </div>

          {faturaSonuc && (
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Hesaplama Sonucu
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <ReadOnlyInfoField
                  label="Tüketim"
                  value={`${faturaSonuc.tuketim} m³`}
                />
                <ReadOnlyInfoField label="Tutar" value={formatCurrency(faturaSonuc.tutar)} />
                <ReadOnlyInfoField label="Son Ödeme" value={faturaSonuc.sonOdeme} />
              </div>
            </div>
          )}
        </div>
      )}

      {tab === "satis-liste" && (
        <div className="p-4">
          <p className="mb-3 text-sm text-slate-600">
            {sistem} sistemi satış kayıtları
          </p>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Tarih</th>
                  <th className="px-3 py-2 text-left">Kart No</th>
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">İşlem</th>
                  <th className="px-3 py-2 text-right">Tutar</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {satislar.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      {sistem} sistemi için satış kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  satislar.map((s) => (
                    <tr key={s.id} className="h-10 border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="px-3 py-1.5 text-slate-600">{s.tarih}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{s.kartNo}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{s.aboneNo}</td>
                      <td className="px-3 py-1.5">{s.adSoyad}</td>
                      <td className="px-3 py-1.5">{s.islem}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(s.tutar)}</td>
                      <td className="px-3 py-1.5">{durumBadge(s.durum)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <IslemActionBar
        onKaydet={
          tab === "kart-islemleri" || tab === "fatura-hesap" ? handleKaydet : undefined
        }
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetLabel={tab === "fatura-hesap" ? "Hesapla" : "Kaydet"}
        kaydetDisabled={islemYukleniyor}
        extra={
          tab === "kart-okuma" ? (
            <button
              type="button"
              onClick={handleKartOku}
              disabled={islemYukleniyor}
              className="btn-secondary inline-flex h-9 text-xs"
            >
              <CreditCard className="h-3.5 w-3.5" />
              Kart Oku
            </button>
          ) : undefined
        }
      />
    </div>
  );
}
