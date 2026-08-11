"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  Calculator,
  CheckCircle2,
  FileText,
  Loader2,
  Printer,
  Search,
  XCircle,
} from "lucide-react";
import {
  formatDonem,
  getSuEkHizmetBorclari,
  getSuFaturaListesi,
  getSuRaporSonuc,
  getSuSayacOkumalar,
  getSuTahakkuklar,
  getSuTankerKayitlari,
  suDonemConfig,
  suGelirKodlari,
  suRaporTurleri,
  type SuFaturaKayit,
} from "@/lib/su-fatura-mock";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn, formatCurrency } from "@/lib/utils";
import {
  AboneNoInput,
  DonemFiltreSatiri,
  IslemActionBar,
  SectionTabBar,
  StatusBadge,
  WorkspaceTabBar,
} from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";

const ws = suWorkspaces.fatura;

const sayacSections = [
  { id: "okuma-liste", label: "Okuma Listeleri" },
  { id: "okuma-giris", label: "Okuma Girişi" },
  { id: "sayac-degistir", label: "Sayaç Değiştirme" },
];

const topluSections = [
  { id: "toplu-hesap", label: "Toplu Hesaplama" },
  { id: "toplu-kes", label: "Toplu Kesme" },
  { id: "ek-hizmet", label: "Ek Hizmet Borç" },
  { id: "tanker", label: "Tanker Taşıma" },
];

function faturaDurumBadge(durum: SuFaturaKayit["durum"]) {
  if (durum === "kesildi") return <StatusBadge label="Kesildi" variant="success" />;
  if (durum === "taslak") return <StatusBadge label="Taslak" variant="warning" />;
  if (durum === "iptal") return <StatusBadge label="İptal" variant="danger" />;
  return <StatusBadge label="Ödendi" variant="neutral" />;
}

export function SuFaturaWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") ?? "donem-tahakkuk";
  const sectionParam = searchParams.get("section") ?? "okuma-liste";

  const [tab, setTab] = useState(tabParam);
  const [section, setSection] = useState(sectionParam);
  const [yil, setYil] = useState(suDonemConfig.aktifYil);
  const [donem, setDonem] = useState(suDonemConfig.aktifDonem);
  const [mesaj, setMesaj] = useState<{ tip: "ok" | "err" | "info"; text: string } | null>(null);
  const [islemYukleniyor, setIslemYukleniyor] = useState(false);

  const [seciliFatura, setSeciliFatura] = useState<SuFaturaKayit | null>(null);
  const [tekilAboneParca, setTekilAboneParca] = useState(["", "", "", ""]);
  const [okumaAboneParca, setOkumaAboneParca] = useState(["", "", "", ""]);
  const [okumaForm, setOkumaForm] = useState({ onceki: "", yeni: "" });
  const [raporTuru, setRaporTuru] = useState(suRaporTurleri[0].id);
  const [raporGoster, setRaporGoster] = useState(false);

  const setUrl = useCallback(
    (next: { tab?: string; section?: string }) => {
      const p = new URLSearchParams(searchParams.toString());
      if (next.tab) p.set("tab", next.tab);
      if (next.section) p.set("section", next.section);
      router.replace(`/su/fatura?${p.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    setTab(tabParam);
    setSection(sectionParam);
  }, [tabParam, sectionParam]);

  const tahakkuklar = useMemo(() => getSuTahakkuklar(yil, donem), [yil, donem]);
  const okumalar = useMemo(() => getSuSayacOkumalar(yil, donem), [yil, donem]);
  const faturalar = useMemo(() => getSuFaturaListesi(yil, donem), [yil, donem]);
  const ekHizmetler = useMemo(() => getSuEkHizmetBorclari(yil, donem), [yil, donem]);
  const tankerKayitlari = useMemo(() => getSuTankerKayitlari(), []);
  const raporSonuc = useMemo(
    () => (raporGoster ? getSuRaporSonuc(raporTuru, yil, donem) : []),
    [raporGoster, raporTuru, yil, donem],
  );

  const handleTabChange = (id: string) => {
    setTab(id);
    setMesaj(null);
    if (id === "sayac-okuma") {
      setSection("okuma-liste");
      setUrl({ tab: id, section: "okuma-liste" });
    } else if (id === "toplu") {
      setSection("toplu-hesap");
      setUrl({ tab: id, section: "toplu-hesap" });
    } else {
      setUrl({ tab: id });
    }
  };

  const islemMesaj = async (text: string) => {
    setIslemYukleniyor(true);
    await new Promise((r) => setTimeout(r, 400));
    setIslemYukleniyor(false);
    setMesaj({ tip: "ok", text });
  };

  const handleKaydet = useCallback(() => {
    if (tab === "donem-tahakkuk") {
      islemMesaj(`${formatDonem(yil, donem)} dönemi tahakkuku oluşturuldu.`);
    } else if (tab === "sayac-okuma" && section === "okuma-giris") {
      islemMesaj("Sayaç okuma bilgisi kaydedildi.");
    } else if (tab === "faturalandirma") {
      islemMesaj("Fatura hesaplama tamamlandı.");
    } else if (tab === "toplu" && section === "toplu-kes") {
      islemMesaj("Toplu fatura kesme işlemi başlatıldı.");
    } else if (tab === "raporlar") {
      setRaporGoster(true);
      setMesaj({ tip: "info", text: "Rapor oluşturuldu." });
    }
  }, [tab, section, yil, donem]);

  const handleIptal = useCallback(() => {
    setMesaj(null);
    setSeciliFatura(null);
    setTekilAboneParca(["", "", "", ""]);
    setOkumaAboneParca(["", "", "", ""]);
    setOkumaForm({ onceki: "", yeni: "" });
    setRaporGoster(false);
  }, []);

  useSuKlavye({
    onKaydet: handleKaydet,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab !== "raporlar" || !raporGoster,
  });

  const aktifSections =
    tab === "sayac-okuma" ? sayacSections : tab === "toplu" ? topluSections : [];

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <DonemFiltreSatiri
        yil={yil}
        donem={donem}
        onYilChange={setYil}
        onDonemChange={setDonem}
      />

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 bg-white px-4 py-2 text-xs text-slate-500">
        <span className="font-medium text-slate-600">Süreç:</span>
        <span>Dönem</span>
        <ArrowRight className="h-3 w-3" />
        <span>Sayaç Okuma</span>
        <ArrowRight className="h-3 w-3" />
        <span>Tahakkuk</span>
        <ArrowRight className="h-3 w-3" />
        <span>Faturalandırma</span>
      </div>

      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />

      {aktifSections.length > 0 && (
        <SectionTabBar
          sections={aktifSections}
          active={section}
          onChange={(id) => {
            setSection(id);
            setUrl({ section: id });
          }}
        />
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

      {/* DÖNEM & TAHAKKUK */}
      {tab === "donem-tahakkuk" && (
        <div className="space-y-4 p-4">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => islemMesaj(`${formatDonem(yil, donem)} tahakkuku oluşturuldu.`)}
              className="btn-primary inline-flex h-9"
              disabled={islemYukleniyor}
            >
              {islemYukleniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />}
              Tahakkuk Oluştur
            </button>
            <button type="button" onClick={() => islemMesaj("Tahakkuk kontrolü tamamlandı.")} className="btn-secondary inline-flex h-9">
              <Search className="h-4 w-4" />
              Tahakkuk Kontrol
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Dönem</th>
                  <th className="px-3 py-2 text-right">Abone Sayısı</th>
                  <th className="px-3 py-2 text-right">Tahakkuk Tutarı</th>
                  <th className="px-3 py-2 text-left">Oluşturma</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {tahakkuklar.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                      Seçili dönem için tahakkuk kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  tahakkuklar.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                      <td className="px-3 py-2 tabular-nums">{formatDonem(t.yil, t.donem)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{t.aboneSayisi.toLocaleString("tr-TR")}</td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums">{formatCurrency(t.tahakkukTutar)}</td>
                      <td className="px-3 py-2 text-slate-600">{t.olusturmaTarihi}</td>
                      <td className="px-3 py-2">
                        {t.durum === "acik" ? (
                          <StatusBadge label="Açık" variant="success" />
                        ) : t.durum === "kapali" ? (
                          <StatusBadge label="Kapalı" variant="neutral" />
                        ) : (
                          <StatusBadge label="Taslak" variant="warning" />
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SAYAÇ OKUMA */}
      {tab === "sayac-okuma" && section === "okuma-liste" && (
        <div className="p-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">Sayaç No</th>
                  <th className="px-3 py-2 text-right">Önceki</th>
                  <th className="px-3 py-2 text-right">Yeni</th>
                  <th className="px-3 py-2 text-right">Tüketim</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {okumalar.map((o) => (
                  <tr key={o.id} className="border-b border-slate-100 hover:bg-slate-50/70">
                    <td className="px-3 py-2 font-mono text-xs">{o.aboneNo}</td>
                    <td className="px-3 py-2">{o.adSoyad}</td>
                    <td className="px-3 py-2 font-mono text-xs">{o.sayacNo}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{o.oncekiOkuma}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{o.yeniOkuma}</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">{o.tuketim}</td>
                    <td className="px-3 py-2">
                      {o.durum === "girildi" && <StatusBadge label="Girildi" variant="warning" />}
                      {o.durum === "aktarildi" && <StatusBadge label="Aktarıldı" variant="neutral" />}
                      {o.durum === "faturalandi" && <StatusBadge label="Faturalandı" variant="success" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "sayac-okuma" && section === "okuma-giris" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={okumaAboneParca} onChange={setOkumaAboneParca} />
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label">Önceki Okuma</label>
              <input
                className="input-field h-9 text-sm"
                value={okumaForm.onceki}
                onChange={(e) => setOkumaForm((f) => ({ ...f, onceki: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Yeni Okuma</label>
              <input
                className="input-field h-9 text-sm"
                value={okumaForm.yeni}
                onChange={(e) => setOkumaForm((f) => ({ ...f, yeni: e.target.value }))}
              />
            </div>
            <div>
              <label className="label">Okuma Tarihi</label>
              <input className="input-field h-9 text-sm" type="date" defaultValue="2026-07-05" />
            </div>
          </div>
        </div>
      )}

      {tab === "sayac-okuma" && section === "sayac-degistir" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={okumaAboneParca} onChange={setOkumaAboneParca} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Eski Sayaç No</label>
              <input className="input-field h-9 text-sm" placeholder="SC-88421" />
            </div>
            <div>
              <label className="label">Yeni Sayaç No</label>
              <input className="input-field h-9 text-sm" placeholder="SC-99000" />
            </div>
            <div>
              <label className="label">Son Okuma (Eski Sayaç)</label>
              <input className="input-field h-9 text-sm" />
            </div>
            <div>
              <label className="label">İlk Okuma (Yeni Sayaç)</label>
              <input className="input-field h-9 text-sm" defaultValue="0" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Sayaç değiştirme işlemi audit log ile kaydedilir.</p>
        </div>
      )}

      {/* FATURALANDIRMA */}
      {tab === "faturalandirma" && (
        <div className="space-y-4 p-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">Tekil Fatura Hesaplama</p>
            <div className="flex flex-wrap items-end gap-4">
              <AboneNoInput value={tekilAboneParca} onChange={setTekilAboneParca} />
              <button type="button" onClick={handleKaydet} className="btn-primary inline-flex h-9">
                <Calculator className="h-4 w-4" />
                Hesapla
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-slate-700">Fatura Listesi — {formatDonem(yil, donem)}</p>
            <div className="flex gap-2">
              {seciliFatura && (
                <>
                  <button
                    type="button"
                    onClick={() => islemMesaj(`${seciliFatura.faturaNo} yazdırılıyor.`)}
                    className="btn-secondary inline-flex h-8 text-xs"
                  >
                    <Printer className="h-3.5 w-3.5" />
                    Yazdır
                    <kbd className="ml-1 rounded bg-slate-100 px-1 text-[10px]">F8</kbd>
                  </button>
                  <button
                    type="button"
                    onClick={() => islemMesaj(`${seciliFatura.faturaNo} iptal edildi.`)}
                    className="btn-ghost inline-flex h-8 text-xs text-red-600"
                  >
                    <XCircle className="h-3.5 w-3.5" />
                    İptal
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Fatura No</th>
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-right">Tüketim</th>
                  <th className="px-3 py-2 text-right">Tutar</th>
                  <th className="px-3 py-2 text-left">Son Ödeme</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {faturalar.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Seçili dönem için fatura bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  faturalar.map((f) => (
                    <tr
                      key={f.id}
                      onClick={() => setSeciliFatura(f)}
                      className={cn(
                        "cursor-pointer border-b border-slate-100 hover:bg-slate-50/70",
                        seciliFatura?.id === f.id && "bg-blue-50/60",
                      )}
                    >
                      <td className="px-3 py-2 font-mono text-xs">{f.faturaNo}</td>
                      <td className="px-3 py-2 font-mono text-xs">{f.aboneNo}</td>
                      <td className="px-3 py-2">{f.adSoyad}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{f.tuketim} m³</td>
                      <td className="px-3 py-2 text-right font-medium tabular-nums">{formatCurrency(f.tutar)}</td>
                      <td className="px-3 py-2 text-slate-600">{f.sonOdeme}</td>
                      <td className="px-3 py-2">{faturaDurumBadge(f.durum)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TOPLU İŞLEMLER */}
      {tab === "toplu" && section === "toplu-hesap" && (
        <div className="space-y-4 p-4">
          <p className="text-sm text-slate-600">
            {formatDonem(yil, donem)} dönemi için toplu fatura hesaplama. Okuma aktarımı tamamlanan aboneler
            hesaplanır.
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs text-slate-500">Hesaplanacak Abone</p>
              <p className="text-lg font-semibold tabular-nums">1.956</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs text-slate-500">Okuma Bekleyen</p>
              <p className="text-lg font-semibold tabular-nums">12</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3">
              <p className="text-xs text-slate-500">Tahmini Tutar</p>
              <p className="text-lg font-semibold tabular-nums">{formatCurrency(842000)}</p>
            </div>
          </div>
          <button type="button" onClick={() => islemMesaj("Toplu fatura hesaplama başlatıldı.")} className="btn-primary inline-flex h-9">
            Toplu Hesaplama Başlat
          </button>
        </div>
      )}

      {tab === "toplu" && section === "toplu-kes" && (
        <div className="space-y-4 p-4">
          <p className="text-sm text-slate-600">Hesaplanmış faturaları toplu kesme işlemi.</p>
          <button type="button" onClick={handleKaydet} className="btn-primary inline-flex h-9">
            Toplu Fatura Kes
          </button>
        </div>
      )}

      {tab === "toplu" && section === "ek-hizmet" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <AboneNoInput value={tekilAboneParca} onChange={setTekilAboneParca} className="lg:col-span-2" />
            <div>
              <label className="label">Gelir Kodu</label>
              <select className="input-field h-9 py-1 text-sm">
                {suGelirKodlari.map((g) => (
                  <option key={g.kod} value={g.kod}>
                    {g.kod} — {g.ad}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Tutar</label>
              <input className="input-field h-9 text-sm" placeholder="0,00" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Açıklama</th>
                  <th className="px-3 py-2 text-left">Gelir Kodu</th>
                  <th className="px-3 py-2 text-right">Tutar</th>
                </tr>
              </thead>
              <tbody>
                {ekHizmetler.map((e) => (
                  <tr key={e.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono text-xs">{e.aboneNo}</td>
                    <td className="px-3 py-2">{e.aciklama}</td>
                    <td className="px-3 py-2 font-mono text-xs">{e.gelirKodu}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(e.tutar)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "toplu" && section === "tanker" && (
        <div className="space-y-4 p-4">
          <p className="text-sm text-slate-600">Tankerle su taşıma bilgileri — faturaya eklenecek kayıtlar.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                <tr className="border-b">
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-right">Tonaj</th>
                  <th className="px-3 py-2 text-right">Birim Fiyat</th>
                  <th className="px-3 py-2 text-right">Tutar</th>
                  <th className="px-3 py-2 text-left">Tarih</th>
                </tr>
              </thead>
              <tbody>
                {tankerKayitlari.map((t) => (
                  <tr key={t.id} className="border-b border-slate-100">
                    <td className="px-3 py-2 font-mono text-xs">{t.aboneNo}</td>
                    <td className="px-3 py-2">{t.adSoyad}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{t.tonaj} m³</td>
                    <td className="px-3 py-2 text-right tabular-nums">{formatCurrency(t.birimFiyat)}</td>
                    <td className="px-3 py-2 text-right font-medium tabular-nums">{formatCurrency(t.tutar)}</td>
                    <td className="px-3 py-2 text-slate-600">{t.tarih}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" onClick={() => islemMesaj("Tanker kaydı formu açıldı.")} className="btn-secondary inline-flex h-9">
            Yeni Tanker Kaydı
          </button>
        </div>
      )}

      {/* RAPORLAR */}
      {tab === "raporlar" && (
        <div className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="label">Rapor Türü</label>
              <select
                className="input-field h-9 py-1 text-sm"
                value={raporTuru}
                onChange={(e) => {
                  setRaporTuru(e.target.value);
                  setRaporGoster(false);
                }}
              >
                {suRaporTurleri.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="button" onClick={handleKaydet} className="btn-primary inline-flex h-9">
            <Printer className="h-4 w-4" />
            Rapor Oluştur
            <kbd className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-normal">F8</kbd>
          </button>
          {raporGoster && (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                  <tr className="border-b">
                    {raporTuru === "donem-ozet" ? (
                      <>
                        <th className="px-3 py-2 text-left">Dönem</th>
                        <th className="px-3 py-2 text-right">Fatura Sayısı</th>
                        <th className="px-3 py-2 text-right">Toplam Tüketim</th>
                        <th className="px-3 py-2 text-right">Toplam Tutar</th>
                      </>
                    ) : (
                      <>
                        <th className="px-3 py-2 text-left">Abone No</th>
                        <th className="px-3 py-2 text-left">Adı Soyadı</th>
                        <th className="px-3 py-2 text-right">{raporTuru === "tonaj-liste" ? "Tonaj" : "Tüketim"}</th>
                        {raporTuru === "sayac-fatura" && (
                          <th className="px-3 py-2 text-right">Tutar</th>
                        )}
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {raporSonuc.map((row, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {"donem" in row && raporTuru === "donem-ozet" ? (
                        <>
                          <td className="px-3 py-2">{(row as { donem: string }).donem}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{(row as { faturaSayisi: number }).faturaSayisi}</td>
                          <td className="px-3 py-2 text-right tabular-nums">{(row as { toplamTuketim: number }).toplamTuketim} m³</td>
                          <td className="px-3 py-2 text-right tabular-nums">{formatCurrency((row as { toplamTutar: number }).toplamTutar)}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-3 py-2 font-mono text-xs">{(row as { aboneNo: string }).aboneNo}</td>
                          <td className="px-3 py-2">{(row as { adSoyad: string }).adSoyad}</td>
                          <td className="px-3 py-2 text-right tabular-nums">
                            {"tonaj" in row ? (row as { tonaj: number }).tonaj : (row as { tuketim: number }).tuketim} m³
                          </td>
                          {raporTuru === "sayac-fatura" && (
                            <td className="px-3 py-2 text-right tabular-nums">
                              {formatCurrency((row as { tutar: number }).tutar)}
                            </td>
                          )}
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <IslemActionBar
        onKaydet={tab !== "faturalandirma" ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetLabel={
          tab === "raporlar" ? "Rapor Oluştur" : tab === "faturalandirma" ? undefined : "Kaydet"
        }
        kaydetLoading={islemYukleniyor}
      />
    </div>
  );
}
