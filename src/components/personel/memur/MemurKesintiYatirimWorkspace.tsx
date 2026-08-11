"use client";

import { useEffect, useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatMemurDonem, memurDonemConfig, memurKesintiRaporTurleri } from "@/lib/memur/config";
import { getMemurKesintiRaporlari } from "@/lib/memur-repository";
import { canMemurIslem } from "@/lib/memur/yetki";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import {
  DonemSecici,
  IslemActionBar,
  PrintPreviewPanel,
  RaporFiltreSatiri,
  useMemurWorkspaceUrl,
  WorkspaceTabBar,
  YetkiGuard,
} from "./shared";
import { MemurDataTable } from "./MemurPersonelKartiWorkspace";

const ws = memurWorkspaces["kesinti-yatirim"];

export function MemurKesintiYatirimWorkspace() {
  const { user } = useApp();
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const tabParam = searchParams.get("tab") ?? "kesintiler";
  const raporParam = searchParams.get("rapor") ?? "";

  const [tab, setTab] = useState(tabParam);
  const [yil, setYil] = useState(memurDonemConfig.aktifYil);
  const [ay, setAy] = useState(memurDonemConfig.aktifAy);
  const [seciliRapor, setSeciliRapor] = useState(raporParam);

  useEffect(() => setTab(tabParam), [tabParam]);

  const yetkili = canMemurIslem("MANAGE_DEDUCTIONS", user.role);
  const donem = formatMemurDonem(yil, ay);

  const tabRaporlari = useMemo(
    () => memurKesintiRaporTurleri.filter((r) => r.segment === tab),
    [tab],
  );

  const raporVerisi = useMemo(() => {
    const label = tabRaporlari.find((r) => r.id === seciliRapor)?.label
      ?? tabRaporlari[0]?.label;
    if (!label) return [];
    return getMemurKesintiRaporlari(label);
  }, [seciliRapor, tabRaporlari]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setSeciliRapor("");
  };

  return (
    <div className="card overflow-hidden">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />
      <RaporFiltreSatiri>
        <DonemSecici yil={yil} ay={ay} onYilChange={setYil} onAyChange={setAy} />
        <select
          value={seciliRapor || tabRaporlari[0]?.id || ""}
          onChange={(e) => { setSeciliRapor(e.target.value); setUrl({ rapor: e.target.value }); }}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        >
          {tabRaporlari.map((r) => (
            <option key={r.id} value={r.id}>{r.label}</option>
          ))}
        </select>
      </RaporFiltreSatiri>

      <div className="space-y-4 p-4">
        <YetkiGuard yetkili={yetkili || canMemurIslem("VIEW_PERSONNEL", user.role)}>
          <MemurDataTable
            columns={["Rapor Türü", "Dönem", "Kayıt Sayısı", "Toplam"]}
            rows={
              raporVerisi.length > 0
                ? raporVerisi.map((r) => [r.raporTuru, r.donem, String(r.kayitSayisi), String(r.toplam)])
                : tabRaporlari.map((r) => [r.label, donem, "—", "Backend bekleniyor"])
            }
          />
          <PrintPreviewPanel
            baslik={tabRaporlari.find((r) => r.id === seciliRapor)?.label ?? "Rapor"}
            onYazdir={() => window.print()}
            onPdf={() => {}}
          />
        </YetkiGuard>
      </div>

      <IslemActionBar cikisHref="/personel/memur" />
    </div>
  );
}
