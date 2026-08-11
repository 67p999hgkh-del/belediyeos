"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getMemurAuditLog } from "@/lib/memur/audit";
import { calistirCekHesaplama, getMemurCekler } from "@/lib/memur-repository";
import { canMemurIslem } from "@/lib/memur/yetki";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import {
  HesaplamaSonucTablosu,
  IslemActionBar,
  MemurAuditLogPanel,
  useMemurKlavye,
  useMemurWorkspaceUrl,
  WorkspaceTabBar,
  YetkiGuard,
} from "./shared";
import { MemurDataTable } from "./MemurPersonelKartiWorkspace";

const ws = memurWorkspaces["cek-islemleri"];

export function MemurCekIslemleriWorkspace() {
  const { user } = useApp();
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const tabParam = searchParams.get("tab") ?? "hesaplatma";
  const [tab, setTab] = useState(tabParam);
  const [seciliCek, setSeciliCek] = useState("");
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [hesapSonuc, setHesapSonuc] = useState<import("@/lib/memur/types").MemurHesaplamaSonuc | null>(null);
  const [versiyon, setVersiyon] = useState(0);

  useEffect(() => setTab(tabParam), [tabParam]);

  const yetkili = canMemurIslem("CALCULATE_PAYROLL", user.role);
  const cekler = useMemo(() => getMemurCekler(), [versiyon]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
  };

  const handleHesapla = async () => {
    if (!seciliCek || !yetkili) return;
    setYukleniyor(true);
    const sonuc = await calistirCekHesaplama(seciliCek, user.name);
    setHesapSonuc(sonuc);
    setVersiyon((v) => v + 1);
    setYukleniyor(false);
    setMesaj(sonuc.mesaj);
  };

  useMemurKlavye({ onKaydet: tab === "hesaplatma" ? handleHesapla : undefined, kaydetEnabled: yetkili });

  return (
    <div className="card overflow-hidden">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />
      <div className="space-y-4 p-4">
        {mesaj && (
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
            <CheckCircle2 className="h-4 w-4" />{mesaj}
          </div>
        )}

        {tab === "hesaplatma" && (
          <YetkiGuard yetkili={yetkili}>
            <select
              value={seciliCek}
              onChange={(e) => setSeciliCek(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Çek kaydı seçin…</option>
              {cekler.map((c) => (
                <option key={c.id} value={c.id}>{c.referans} — {c.adSoyad}</option>
              ))}
            </select>
            {hesapSonuc && <HesaplamaSonucTablosu kalemler={hesapSonuc.kalemler} mesaj={hesapSonuc.mesaj} />}
          </YetkiGuard>
        )}

        {tab === "cek-listesi" && (
          <MemurDataTable
            columns={["Referans", "Sicil", "Ad Soyad", "Tarih", "Tutar", "Durum"]}
            rows={cekler.map((c) => [c.referans, c.sicilNo, c.adSoyad, c.tarih, String(c.tutar), c.durum])}
          />
        )}

        <MemurAuditLogPanel kayitlar={getMemurAuditLog(5)} />
      </div>
      <IslemActionBar
        cikisHref="/personel/memur"
        onKaydet={tab === "hesaplatma" ? handleHesapla : undefined}
        kaydetLabel="Hesaplat"
        kaydetDisabled={yukleniyor}
        kaydetLoading={yukleniyor}
      />
    </div>
  );
}
