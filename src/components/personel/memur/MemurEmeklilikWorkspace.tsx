"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getMemurAuditLog } from "@/lib/memur/audit";
import {
  calistirEmeklilikHesaplama,
  getMemurEmeklilik,
  getMemurListesi,
  kaydetEmeklilikBilgi,
} from "@/lib/memur-repository";
import { canMemurIslem } from "@/lib/memur/yetki";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import {
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

const ws = memurWorkspaces.emeklilik;

export function MemurEmeklilikWorkspace() {
  const { user } = useApp();
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const tabParam = searchParams.get("tab") ?? "bilgi-girisi";
  const [tab, setTab] = useState(tabParam);
  const [versiyon, setVersiyon] = useState(0);
  const [memurId, setMemurId] = useState("");
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hesapSonuc, setHesapSonuc] = useState<import("@/lib/memur/types").MemurHesaplamaSonuc | null>(null);
  const [seciliEmeklilik, setSeciliEmeklilik] = useState("");

  useEffect(() => setTab(tabParam), [tabParam]);

  const yetkili = canMemurIslem("RUN_RETIREMENT", user.role);
  const memurlar = useMemo(() => getMemurListesi(), []);
  const kayitlar = useMemo(() => getMemurEmeklilik(), [versiyon]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
  };

  const handleKaydet = async () => {
    if (!memurId || !yetkili) return;
    const memur = memurlar.find((m) => m.id === memurId);
    if (!memur) return;
    setYukleniyor(true);
    await new Promise((r) => setTimeout(r, 300));
    const kayit = kaydetEmeklilikBilgi(
      {
        memurId,
        sicilNo: memur.sicilNo,
        adSoyad: memur.adSoyad,
        basvuruTarihi: new Date().toLocaleDateString("tr-TR"),
      },
      user.name,
    );
    setSeciliEmeklilik(kayit.id);
    setVersiyon((v) => v + 1);
    setYukleniyor(false);
    setMesaj("Emeklilik bilgi girişi kaydedildi.");
  };

  const handleHesapla = async () => {
    if (!seciliEmeklilik || !yetkili) return;
    setYukleniyor(true);
    const sonuc = await calistirEmeklilikHesaplama(seciliEmeklilik, user.name);
    setHesapSonuc(sonuc);
    setVersiyon((v) => v + 1);
    setYukleniyor(false);
    setMesaj(sonuc.mesaj);
  };

  useMemurKlavye({
    onKaydet: tab === "bilgi-girisi" ? handleKaydet : tab === "hesaplama" ? handleHesapla : undefined,
    kaydetEnabled: yetkili,
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
          <YetkiGuard yetkili={yetkili}>
            <PersonelSecici memurlar={memurlar} selectedId={memurId} onSelect={setMemurId} />
          </YetkiGuard>
        )}

        {tab === "hesaplama" && (
          <YetkiGuard yetkili={yetkili}>
            <select
              value={seciliEmeklilik}
              onChange={(e) => setSeciliEmeklilik(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Emeklilik kaydı seçin…</option>
              {kayitlar.map((k) => (
                <option key={k.id} value={k.id}>{k.sicilNo} — {k.adSoyad}</option>
              ))}
            </select>
            {hesapSonuc && (
              <HesaplamaSonucTablosu kalemler={hesapSonuc.kalemler} mesaj={hesapSonuc.mesaj} />
            )}
          </YetkiGuard>
        )}

        {tab === "emekli-maas-listesi" && (
          <MemurDataTable
            columns={["Sicil", "Ad Soyad", "Başvuru", "Durum", "Özet"]}
            rows={kayitlar.map((k) => [k.sicilNo, k.adSoyad, k.basvuruTarihi, k.durum, k.hesapOzeti || "—"])}
          />
        )}

        {tab === "hesap-dokumu" && (
          <PrintPreviewPanel
            baslik="Emekli Maaş Hesap Dökümü"
            onYazdir={() => window.print()}
            onPdf={() => setMesaj("PDF — form formatı backend doğrulaması bekleniyor.")}
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
