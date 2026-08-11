"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getMemurKesintileri,
  getMemurListesi,
  getMemurMaasBilgileri,
  getMemurYardimlar,
} from "@/lib/memur-repository";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import {
  IslemActionBar,
  PersonelArama,
  PrintPreviewPanel,
  useMemurKlavye,
  useMemurWorkspaceUrl,
  WorkspaceTabBar,
} from "./shared";
import { MemurDataTable } from "./MemurPersonelKartiWorkspace";

const ws = memurWorkspaces.listeler;

export function MemurListelerWorkspace() {
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const tabParam = searchParams.get("tab") ?? "memurlar";
  const [tab, setTab] = useState(tabParam);
  const [arama, setArama] = useState("");

  useEffect(() => setTab(tabParam), [tabParam]);

  const memurlar = useMemo(() => getMemurListesi(), []);
  const filtered = useMemo(() => {
    const q = arama.trim().toLocaleLowerCase("tr");
    if (!q) return memurlar;
    return memurlar.filter(
      (m) =>
        m.sicilNo.toLocaleLowerCase("tr").includes(q) ||
        m.adSoyad.toLocaleLowerCase("tr").includes(q),
    );
  }, [memurlar, arama]);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
  };

  useMemurKlavye({ onAra: () => {} });

  let columns: string[] = [];
  let rows: string[][] = [];

  if (tab === "memurlar") {
    columns = ["Sicil", "Ad Soyad", "Birim", "Mevki", "Durum"];
    rows = filtered.map((m) => [m.sicilNo, m.adSoyad, m.birim, m.mevki, m.durum]);
  } else if (tab === "maas-bilgileri") {
    columns = ["Sicil", "Dönem", "Grup", "Derece", "Kademe"];
    rows = getMemurMaasBilgileri().map((m) => [m.sicilNo, m.donem, m.maasGrubu, m.derece, m.kademe]);
  } else if (tab === "mevki") {
    columns = ["Sicil", "Ad Soyad", "Mevki", "Kadro", "Birim"];
    rows = filtered.map((m) => [m.sicilNo, m.adSoyad, m.mevki, m.kadro, m.birim]);
  } else if (tab === "ek-yardimlar") {
    columns = ["Sicil", "Ad Soyad", "Tür", "Tutar", "Dönem"];
    rows = getMemurYardimlar().map((y) => [y.sicilNo, y.adSoyad, y.yardimTuru, String(y.tutar), y.donem]);
  } else if (tab === "kesintiler") {
    columns = ["Sicil", "Ad Soyad", "Tür", "Tutar", "Dönem"];
    rows = getMemurKesintileri().map((k) => [k.sicilNo, k.adSoyad, k.kesintiTuru, String(k.tutar), k.donem]);
  }

  return (
    <div className="card overflow-hidden">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />
      <div className="space-y-4 p-4">
        <PersonelArama value={arama} onChange={setArama} />
        <MemurDataTable columns={columns} rows={rows} />
        <PrintPreviewPanel
          baslik={`${ws.tabs.find((t) => t.id === tab)?.label} — Yazdır / Export`}
          onYazdir={() => window.print()}
          onPdf={() => {}}
        />
      </div>
      <IslemActionBar cikisHref="/personel/memur" />
    </div>
  );
}
