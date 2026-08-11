"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getMemurAuditLog } from "@/lib/memur/audit";
import {
  formatMemurDonem,
  memurBordroTurleri,
  memurDonemConfig,
  memurHesaplamaTurleri,
} from "@/lib/memur/config";
import {
  calistir13MaasHesaplama,
  calistirMemurHesaplama,
  getMemurBordrolar,
  getMemurHesaplamalar,
  getMemurListesi,
  olustur13MaasBilgileri,
  olusturMemurBordro,
} from "@/lib/memur-repository";
import { canMemurIslem } from "@/lib/memur/yetki";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import { cn } from "@/lib/utils";
import {
  DonemSecici,
  HesaplamaSonucTablosu,
  IslemActionBar,
  MemurAuditLogPanel,
  PersonelSecici,
  PrintPreviewPanel,
  SectionTabBar,
  useMemurKlavye,
  useMemurWorkspaceUrl,
  WorkspaceTabBar,
  YetkiGuard,
} from "./shared";
import { MemurDataTable } from "./MemurPersonelKartiWorkspace";

const ws = memurWorkspaces["maas-bordro"];

type Mesaj = { tip: "ok" | "err" | "info"; text: string } | null;

export function MemurMaasBordroWorkspace() {
  const { user } = useApp();
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const tabParam = searchParams.get("tab") ?? "maas-hesaplama";
  const turParam = searchParams.get("tur") ?? "normal-maas";
  const sectionParam = searchParams.get("section") ?? "bilgi-olustur";
  const bordroTurParam = searchParams.get("tur-bordro") ?? "maas-bordrolari";

  const [tab, setTab] = useState(tabParam);
  const [section, setSection] = useState(sectionParam);
  const [mesaj, setMesaj] = useState<Mesaj>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [versiyon, setVersiyon] = useState(0);

  const [yil, setYil] = useState(memurDonemConfig.aktifYil);
  const [ay, setAy] = useState(memurDonemConfig.aktifAy);
  const [hesaplamaTuru, setHesaplamaTuru] = useState(turParam);
  const [kapsam, setKapsam] = useState("tum-personel");
  const [hesapSonuc, setHesapSonuc] = useState<import("@/lib/memur/types").MemurHesaplamaSonuc | null>(null);
  const [bordroTipi, setBordroTipi] = useState(bordroTurParam);
  const [yil13, setYil13] = useState(2026);

  useEffect(() => setTab(tabParam), [tabParam]);
  useEffect(() => setHesaplamaTuru(turParam), [turParam]);

  const yetkiliHesap = canMemurIslem("CALCULATE_PAYROLL", user.role);
  const yetkili13 = canMemurIslem("RUN_13TH_SALARY", user.role);
  const yetkiliBordro = canMemurIslem("PRINT_PAYROLL", user.role);

  const hesaplamalar = useMemo(() => getMemurHesaplamalar(), [versiyon]);
  const bordrolar = useMemo(() => getMemurBordrolar(), [versiyon]);
  const memurlar = useMemo(() => getMemurListesi(), []);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
    setHesapSonuc(null);
  };

  const handleHesapla = useCallback(async () => {
    if (!yetkiliHesap) {
      setMesaj({ tip: "err", text: "Maaş hesaplama yetkiniz bulunmuyor." });
      return;
    }
    setYukleniyor(true);
    const donem = formatMemurDonem(yil, ay);
    const sonuc = await calistirMemurHesaplama(
      { donem, hesaplamaTuru, kapsam },
      user.name,
    );
    setHesapSonuc(sonuc);
    setVersiyon((v) => v + 1);
    setYukleniyor(false);
    setMesaj({ tip: "ok", text: sonuc.mesaj });
  }, [yetkiliHesap, yil, ay, hesaplamaTuru, kapsam, user.name]);

  const handle13Olustur = () => {
    if (!yetkili13) return;
    olustur13MaasBilgileri(yil13, user.name);
    setMesaj({ tip: "ok", text: `${yil13} yılı 13. maaş bilgileri oluşturma kaydı alındı.` });
    setVersiyon((v) => v + 1);
  };

  const handle13Hesapla = async () => {
    if (!yetkili13) return;
    setYukleniyor(true);
    const sonuc = await calistir13MaasHesaplama(yil13, user.name);
    setHesapSonuc(sonuc);
    setYukleniyor(false);
    setMesaj({ tip: "ok", text: sonuc.mesaj });
  };

  const handleBordroOlustur = () => {
    if (!yetkiliBordro) return;
    const tip = memurBordroTurleri.find((t) => t.id === bordroTipi)?.label ?? bordroTipi;
    olusturMemurBordro(formatMemurDonem(yil, ay), tip, user.name);
    setVersiyon((v) => v + 1);
    setMesaj({ tip: "ok", text: "Bordro kaydı oluşturuldu." });
  };

  useMemurKlavye({
    onKaydet: tab === "maas-hesaplama" ? handleHesapla : undefined,
    onIptal: () => { setMesaj(null); setHesapSonuc(null); },
    kaydetEnabled: yetkiliHesap,
  });

  const pusulaSections = [
    { id: "maas-pusulasi", label: "Maaş Pusulası" },
    { id: "net-maas-listesi", label: "Net Maaş Listesi" },
  ];

  return (
    <div className="card overflow-hidden">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />

      <div className="space-y-4 p-4">
        {mesaj && (
          <div className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 text-sm",
            mesaj.tip === "ok" ? "border border-emerald-200 bg-emerald-50 text-emerald-800" :
            mesaj.tip === "err" ? "border border-red-200 bg-red-50 text-red-800" :
            "border border-blue-200 bg-blue-50 text-blue-800",
          )}>
            {mesaj.tip === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {mesaj.text}
          </div>
        )}

        {tab === "maas-hesaplama" && (
          <YetkiGuard yetkili={yetkiliHesap}>
            <div className="space-y-4">
              <DonemSecici yil={yil} ay={ay} onYilChange={setYil} onAyChange={setAy} />
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm">
                  <span className="mb-1 block text-slate-600">Hesaplama Türü</span>
                  <select
                    value={hesaplamaTuru}
                    onChange={(e) => { setHesaplamaTuru(e.target.value); setUrl({ tur: e.target.value }); }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    {memurHesaplamaTurleri.map((t) => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </label>
                <label className="text-sm">
                  <span className="mb-1 block text-slate-600">Personel Kapsamı</span>
                  <select
                    value={kapsam}
                    onChange={(e) => setKapsam(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <option value="tum-personel">Tüm Personel</option>
                    <option value="secili-birim">Seçili Birim</option>
                    <option value="tek-personel">Tek Personel</option>
                  </select>
                </label>
              </div>
              {kapsam === "tek-personel" && (
                <PersonelSecici memurlar={memurlar} selectedId="" onSelect={() => {}} />
              )}
              <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-600">
                Toplu PÖG Girişi — legacy label korunur; detay backend doğrulaması bekleniyor.
              </div>
              {hesapSonuc && (
                <HesaplamaSonucTablosu kalemler={hesapSonuc.kalemler} mesaj={hesapSonuc.mesaj} />
              )}
            </div>
          </YetkiGuard>
        )}

        {tab === "13-maas" && (
          <YetkiGuard yetkili={yetkili13}>
            <SectionTabBar
              sections={[
                { id: "bilgi-olustur", label: "Bilgileri Oluştur" },
                { id: "hesapla", label: "Hesapla" },
              ]}
              active={section}
              onChange={(id) => { setSection(id); setUrl({ section: id }); }}
            />
            <div className="pt-4">
              <label className="text-sm">
                <span className="mb-1 block text-slate-600">Yıl</span>
                <select value={yil13} onChange={(e) => setYil13(Number(e.target.value))} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                  {[2024, 2025, 2026].map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>
              {section === "bilgi-olustur" ? (
                <button type="button" onClick={handle13Olustur} className="btn-primary mt-4">Bilgileri Oluştur</button>
              ) : (
                <button type="button" onClick={handle13Hesapla} disabled={yukleniyor} className="btn-primary mt-4">
                  {yukleniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : "Hesapla"}
                </button>
              )}
              {hesapSonuc && section === "hesapla" && (
                <div className="mt-4">
                  <HesaplamaSonucTablosu kalemler={hesapSonuc.kalemler} mesaj={hesapSonuc.mesaj} />
                </div>
              )}
            </div>
          </YetkiGuard>
        )}

        {tab === "bordrolar" && (
          <YetkiGuard yetkili={yetkiliBordro}>
            <div className="space-y-4">
              <DonemSecici yil={yil} ay={ay} onYilChange={setYil} onAyChange={setAy} />
              <select
                value={bordroTipi}
                onChange={(e) => setBordroTipi(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {memurBordroTurleri.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
              <button type="button" onClick={handleBordroOlustur} className="btn-secondary text-sm">Bordro Oluştur</button>
              <MemurDataTable
                columns={["Dönem", "Bordro Tipi", "Personel", "Durum", "Tarih"]}
                rows={bordrolar.map((b) => [b.donem, b.bordroTipi, String(b.personelSayisi), b.durum, b.olusturmaTarihi])}
              />
            </div>
          </YetkiGuard>
        )}

        {tab === "pusula-listeler" && (
          <>
            <SectionTabBar sections={pusulaSections} active={section} onChange={setSection} />
            <PrintPreviewPanel
              baslik={section === "maas-pusulasi" ? "Maaş Pusulası" : "Net Maaş Listesi"}
              onYazdir={() => window.print()}
              onPdf={() => setMesaj({ tip: "info", text: "PDF çıktı altyapısı hazır — form formatı backend doğrulaması bekleniyor." })}
            />
          </>
        )}

        {tab === "hesaplama-gecmisi" && (
          <MemurDataTable
            columns={["Dönem", "Tür", "Kapsam", "Durum", "Hesaplayan", "Tarih"]}
            rows={hesaplamalar.map((h) => [h.donem, h.hesaplamaTuru, h.kapsam, h.durum, h.hesaplayan, h.olusturmaTarihi])}
          />
        )}

        <MemurAuditLogPanel kayitlar={getMemurAuditLog(8)} />
      </div>

      <IslemActionBar
        cikisHref="/personel/memur"
        onKaydet={tab === "maas-hesaplama" && yetkiliHesap ? handleHesapla : undefined}
        onIptal={() => { setMesaj(null); setHesapSonuc(null); }}
        kaydetLabel="Hesapla"
        kaydetDisabled={yukleniyor}
        kaydetLoading={yukleniyor}
      />
    </div>
  );
}
