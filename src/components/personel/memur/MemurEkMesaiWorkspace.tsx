"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getMemurAuditLog } from "@/lib/memur/audit";
import { formatMemurDonem, memurDonemConfig } from "@/lib/memur/config";
import {
  calistirEkMesaiHesaplama,
  getMemurEkMesai,
  getMemurListesi,
  kaydetEkMesai,
} from "@/lib/memur-repository";
import { canMemurIslem } from "@/lib/memur/yetki";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import {
  DonemSecici,
  HesaplamaSonucTablosu,
  IslemActionBar,
  MemurAuditLogPanel,
  PersonelSecici,
  PrintPreviewPanel,
  useMemurKlavye,
  useMemurWorkspaceUrl,
  WorkspaceTabBar,
  YetkiGuard,
} from "./shared";
import { MemurDataTable } from "./MemurPersonelKartiWorkspace";

const ws = memurWorkspaces["ek-mesai"];

export function MemurEkMesaiWorkspace() {
  const { user } = useApp();
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const tabParam = searchParams.get("tab") ?? "bilgi-girisi";
  const [tab, setTab] = useState(tabParam);
  const [versiyon, setVersiyon] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [hesapSonuc, setHesapSonuc] = useState<import("@/lib/memur/types").MemurHesaplamaSonuc | null>(null);

  const [yil, setYil] = useState(memurDonemConfig.aktifYil);
  const [ay, setAy] = useState(memurDonemConfig.aktifAy);
  const [memurId, setMemurId] = useState("");
  const [saat, setSaat] = useState("");
  const [gun, setGun] = useState("");

  useEffect(() => setTab(tabParam), [tabParam]);

  const yetkiliGiris = canMemurIslem("RUN_OVERTIME", user.role);
  const kayitlar = useMemo(() => getMemurEkMesai(), [versiyon]);
  const memurlar = useMemo(() => getMemurListesi(), []);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
  };

  const handleKaydet = useCallback(async () => {
    if (!memurId || !yetkiliGiris) return;
    const memur = memurlar.find((m) => m.id === memurId);
    if (!memur) return;
    setYukleniyor(true);
    await new Promise((r) => setTimeout(r, 300));
    kaydetEkMesai(
      {
        memurId,
        sicilNo: memur.sicilNo,
        adSoyad: memur.adSoyad,
        donem: formatMemurDonem(yil, ay),
        saat: parseFloat(saat) || 0,
        gun: parseFloat(gun) || 0,
      },
      user.name,
    );
    setVersiyon((v) => v + 1);
    setYukleniyor(false);
    setMesaj("Ek mesai kaydı oluşturuldu.");
    setSaat("");
    setGun("");
  }, [memurId, yetkiliGiris, memurlar, yil, ay, saat, gun, user.name]);

  const handleHesapla = async () => {
    if (!yetkiliGiris) return;
    setYukleniyor(true);
    const sonuc = await calistirEkMesaiHesaplama(formatMemurDonem(yil, ay), user.name);
    setHesapSonuc(sonuc);
    setVersiyon((v) => v + 1);
    setYukleniyor(false);
    setMesaj(sonuc.mesaj);
  };

  useMemurKlavye({
    onKaydet: tab === "bilgi-girisi" ? handleKaydet : tab === "hesaplama" ? handleHesapla : undefined,
    kaydetEnabled: yetkiliGiris,
  });

  return (
    <div className="card overflow-hidden">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />
      <div className="space-y-4 p-4">
        {mesaj && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />{mesaj}
          </div>
        )}

        {tab === "bilgi-girisi" && (
          <YetkiGuard yetkili={yetkiliGiris}>
            <DonemSecici yil={yil} ay={ay} onYilChange={setYil} onAyChange={setAy} />
            <PersonelSecici memurlar={memurlar} selectedId={memurId} onSelect={setMemurId} />
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Saat" value={saat} onChange={(e) => setSaat(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <input placeholder="Gün" value={gun} onChange={(e) => setGun(e.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
            </div>
            <MemurDataTable
              columns={["Sicil", "Ad Soyad", "Dönem", "Saat", "Gün", "Durum"]}
              rows={kayitlar.map((k) => [k.sicilNo, k.adSoyad, k.donem, String(k.saat), String(k.gun), k.durum])}
            />
          </YetkiGuard>
        )}

        {tab === "hesaplama" && (
          <YetkiGuard yetkili={yetkiliGiris}>
            <DonemSecici yil={yil} ay={ay} onYilChange={setYil} onAyChange={setAy} />
            {hesapSonuc && <HesaplamaSonucTablosu kalemler={hesapSonuc.kalemler} mesaj={hesapSonuc.mesaj} />}
          </YetkiGuard>
        )}

        {tab === "bordro-pusula" && (
          <PrintPreviewPanel baslik="Ek Mesai Bordro & Pusula" onYazdir={() => window.print()} onPdf={() => setMesaj("PDF — form formatı backend doğrulaması bekleniyor.")} />
        )}

        {tab === "kesintiler" && (
          <MemurDataTable
            columns={["Sicil", "Dönem", "Açıklama"]}
            rows={kayitlar.map((k) => [k.sicilNo, k.donem, "Ek Mesai Kesintileri — backend bekleniyor"])}
          />
        )}

        <MemurAuditLogPanel kayitlar={getMemurAuditLog(5)} />
      </div>
      <IslemActionBar
        cikisHref="/personel/memur"
        onKaydet={tab === "bilgi-girisi" ? handleKaydet : tab === "hesaplama" ? handleHesapla : undefined}
        kaydetLabel={tab === "hesaplama" ? "Hesapla" : "Kaydet"}
        kaydetDisabled={yukleniyor}
        kaydetLoading={yukleniyor}
      />
    </div>
  );
}
