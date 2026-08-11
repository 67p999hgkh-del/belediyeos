"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { formatAboneNo, getSuAboneByAboneNo } from "@/lib/su-abone-mock";
import {
  getSuCezaBasvurular,
  getSuCezaBasvuru,
  getSuCezaBorclari,
  getSuCezaOdemeEkstre,
  getSuCezaTaahhutname,
  kaydetSuCezaBasvuru,
  type SuCezaBasvuru,
} from "@/lib/su-ceza-indirimi-mock";
import { canSuIslem } from "@/lib/su-yetki";
import { suWorkspaces } from "@/lib/su-workspaces";
import { cn, formatCurrency } from "@/lib/utils";
import { useApp } from "@/context/AppContext";
import {
  AboneNoInput,
  IslemActionBar,
  ReadOnlyInfoField,
  SectionTabBar,
  StatusBadge,
  WorkspaceTabBar,
} from "../shared";
import { useSuKlavye } from "../shared/useSuKlavye";
import { useSuWorkspaceUrl } from "../shared/useSuWorkspaceUrl";

const ws = suWorkspaces["ceza-indirimi"];
const detaySections = ws.sections ?? [];

type Mesaj = { tip: "ok" | "err" | "info"; text: string } | null;

export function SuCezaIndirimiWorkspace() {
  const router = useRouter();
  const { user } = useApp();
  const { searchParams, setUrl } = useSuWorkspaceUrl(ws.route);

  const tabParam = searchParams.get("tab") ?? "basvuru";
  const sectionParam = searchParams.get("section") ?? "borclar";
  const basvuruParam = searchParams.get("basvuru");

  const [tab, setTab] = useState(tabParam);
  const [section, setSection] = useState(sectionParam);
  const [mesaj, setMesaj] = useState<Mesaj>(null);
  const [kayitYukleniyor, setKayitYukleniyor] = useState(false);
  const [listeVersiyon, setListeVersiyon] = useState(0);

  const [aboneParca, setAboneParca] = useState(["", "", "", ""]);
  const [indirimOrani, setIndirimOrani] = useState("");
  const [gerekce, setGerekce] = useState("");
  const [seciliBasvuruId, setSeciliBasvuruId] = useState<string | null>(basvuruParam);

  const yetkili = canSuIslem("ceza-indirimi", user.role);

  useEffect(() => {
    setTab(tabParam);
    setSection(sectionParam);
    if (basvuruParam) setSeciliBasvuruId(basvuruParam);
  }, [tabParam, sectionParam, basvuruParam]);

  const aboneNo = formatAboneNo(aboneParca);
  const abone = useMemo(
    () => (aboneNo.length >= 11 ? getSuAboneByAboneNo(aboneNo) : undefined),
    [aboneNo],
  );

  const borclar = useMemo(
    () => (abone ? getSuCezaBorclari(abone.aboneNo) : []),
    [abone],
  );

  const toplamBorc = borclar.reduce((s, b) => s + b.tutar, 0);
  const cezaTutar = borclar.reduce((s, b) => s + b.ceza, 0);
  const oran = parseFloat(indirimOrani) || 0;
  const indirimTutar = (cezaTutar * oran) / 100;
  const yeniBorc = toplamBorc + cezaTutar - indirimTutar;

  const basvurular = useMemo(() => getSuCezaBasvurular(), [listeVersiyon]);
  const seciliBasvuru = seciliBasvuruId ? getSuCezaBasvuru(seciliBasvuruId) : undefined;
  const ekstre = seciliBasvuruId ? getSuCezaOdemeEkstre(seciliBasvuruId) : null;
  const taahhutname = seciliBasvuruId ? getSuCezaTaahhutname(seciliBasvuruId) : null;

  const handleTabChange = (id: string) => {
    setTab(id);
    setMesaj(null);
    if (id === "basvuru-liste") {
      setUrl({ tab: id, section: "borclar" });
      setSection("borclar");
    } else {
      setUrl({ tab: id, basvuru: null, section: null });
      setSeciliBasvuruId(null);
    }
  };

  const handleKaydet = useCallback(async () => {
    if (tab !== "basvuru") return;
    if (!yetkili) {
      setMesaj({ tip: "err", text: "Ceza indirimi kaydetme yetkiniz bulunmuyor." });
      return;
    }
    if (!abone) {
      setMesaj({ tip: "err", text: "Geçerli bir abone numarası girin." });
      return;
    }
    if (borclar.length === 0) {
      setMesaj({ tip: "err", text: "Seçili abone için ceza içeren borç bulunamadı." });
      return;
    }
    if (!gerekce.trim()) {
      setMesaj({ tip: "err", text: "Gerekçe zorunludur." });
      return;
    }
    if (oran <= 0 || oran > 100) {
      setMesaj({ tip: "err", text: "İndirim oranı 1–100 arasında olmalıdır." });
      return;
    }

    setKayitYukleniyor(true);
    await new Promise((r) => setTimeout(r, 400));
    const basvuru = kaydetSuCezaBasvuru({
      aboneNo: abone.aboneNo,
      adSoyad: abone.adSoyad,
      indirimOrani: oran,
      gerekce,
      kullanici: user.name,
    });
    setKayitYukleniyor(false);
    setListeVersiyon((v) => v + 1);
    setMesaj({ tip: "ok", text: `${basvuru.basvuruNo} numaralı başvuru oluşturuldu.` });
    setGerekce("");
    setIndirimOrani("");
  }, [tab, yetkili, abone, borclar.length, gerekce, oran, user.name]);

  const handleIptal = useCallback(() => {
    setAboneParca(["", "", "", ""]);
    setIndirimOrani("");
    setGerekce("");
    setMesaj(null);
    setSeciliBasvuruId(null);
    setUrl({ tab: "basvuru", basvuru: null, section: null });
    setTab("basvuru");
  }, [setUrl]);

  const basvuruSec = (b: SuCezaBasvuru) => {
    setSeciliBasvuruId(b.id);
    setSection("borclar");
    setUrl({ basvuru: b.id, section: "borclar" });
    setMesaj(null);
  };

  useSuKlavye({
    onKaydet: tab === "basvuru" && yetkili ? handleKaydet : undefined,
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: tab === "basvuru" && yetkili,
  });

  const durumBadge = (durum: SuCezaBasvuru["durum"]) => {
    if (durum === "onaylandi") return <StatusBadge label="Onaylandı" variant="success" />;
    if (durum === "reddedildi") return <StatusBadge label="Reddedildi" variant="danger" />;
    return <StatusBadge label="Açık" variant="warning" />;
  };

  const seciliBorclar = seciliBasvuru ? getSuCezaBorclari(seciliBasvuru.aboneNo) : [];

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

      {tab === "basvuru" && (
        <div className="space-y-4 p-4">
          <AboneNoInput value={aboneParca} onChange={setAboneParca} />
          {abone && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnlyInfoField label="Adı Soyadı (Ünvanı)" value={abone.adSoyad} />
              <ReadOnlyInfoField label="Adres" value={abone.adres} />
            </div>
          )}

          {borclar.length > 0 && (
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                  <tr className="border-b">
                    <th className="px-3 py-2 text-left">Dönem</th>
                    <th className="px-3 py-2 text-left">Gelir Kodu</th>
                    <th className="px-3 py-2 text-right">Borç</th>
                    <th className="px-3 py-2 text-right">Ceza</th>
                  </tr>
                </thead>
                <tbody>
                  {borclar.map((b) => (
                    <tr key={b.id} className="border-b border-slate-100">
                      <td className="px-3 py-1.5 tabular-nums">{b.donem}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{b.gelirKodu}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(b.tutar)}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(b.ceza)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyInfoField label="Toplam Borç" value={formatCurrency(toplamBorc)} />
            <ReadOnlyInfoField label="Ceza Tutarı" value={formatCurrency(cezaTutar)} />
            <div>
              <label className="label">İndirim Oranı (%)</label>
              <input
                className="input-field h-9 text-sm"
                inputMode="numeric"
                value={indirimOrani}
                onChange={(e) => setIndirimOrani(e.target.value)}
                disabled={!yetkili}
              />
            </div>
            <ReadOnlyInfoField label="İndirim Tutarı" value={formatCurrency(indirimTutar)} />
            <ReadOnlyInfoField label="Yeni Borç" value={formatCurrency(yeniBorc)} />
            <div className="sm:col-span-2 lg:col-span-3">
              <label className="label">Gerekçe</label>
              <input
                className="input-field h-9 text-sm"
                value={gerekce}
                onChange={(e) => setGerekce(e.target.value)}
                disabled={!yetkili}
              />
            </div>
          </div>

          {!yetkili && (
            <p className="text-xs text-amber-700">
              Ceza indirimi kaydetme yetkisi yalnızca Vezne Sorumlusu ve Sistem Yöneticisi rollerine tanımlıdır.
            </p>
          )}

          {kayitYukleniyor && (
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" /> Başvuru kaydediliyor...
            </div>
          )}
        </div>
      )}

      {tab === "basvuru-liste" && (
        <>
          <div className="overflow-x-auto p-4 pb-0">
            <table className="w-full min-w-[880px] text-sm">
              <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-2 text-left">Başvuru No</th>
                  <th className="px-3 py-2 text-left">Abone No</th>
                  <th className="px-3 py-2 text-left">Adı Soyadı</th>
                  <th className="px-3 py-2 text-left">Tarih</th>
                  <th className="px-3 py-2 text-right">İndirim</th>
                  <th className="px-3 py-2 text-right">Yeni Borç</th>
                  <th className="px-3 py-2 text-left">Durum</th>
                </tr>
              </thead>
              <tbody>
                {basvurular.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                      Başvuru kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  basvurular.map((b) => (
                    <tr
                      key={b.id}
                      onClick={() => basvuruSec(b)}
                      className={cn(
                        "h-10 cursor-pointer border-b border-slate-100 hover:bg-slate-50/80",
                        seciliBasvuruId === b.id && "border-l-2 border-l-[#1e40af] bg-blue-50/40",
                      )}
                    >
                      <td className="px-3 py-1.5 font-mono text-xs">{b.basvuruNo}</td>
                      <td className="px-3 py-1.5 font-mono text-xs">{b.aboneNo}</td>
                      <td className="px-3 py-1.5">{b.adSoyad}</td>
                      <td className="px-3 py-1.5">{b.basvuruTarihi}</td>
                      <td className="px-3 py-1.5 text-right tabular-nums">
                        %{b.indirimOrani} ({formatCurrency(b.indirimTutar)})
                      </td>
                      <td className="px-3 py-1.5 text-right tabular-nums">{formatCurrency(b.yeniBorc)}</td>
                      <td className="px-3 py-1.5">{durumBadge(b.durum)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {seciliBasvuru && (
            <>
              <div className="flex flex-wrap items-center gap-2 border-y border-slate-100 px-4 py-2">
                <span className="font-mono text-sm font-semibold text-slate-800">
                  {seciliBasvuru.basvuruNo}
                </span>
                <span className="text-sm text-slate-600">{seciliBasvuru.adSoyad}</span>
                {durumBadge(seciliBasvuru.durum)}
              </div>
              <SectionTabBar
                sections={detaySections}
                active={section}
                onChange={(id) => {
                  setSection(id);
                  setUrl({ section: id });
                }}
              />
              <div className="p-4">
                {section === "borclar" && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                        <tr className="border-b">
                          <th className="px-3 py-2 text-left">Dönem</th>
                          <th className="px-3 py-2 text-left">Gelir Kodu</th>
                          <th className="px-3 py-2 text-right">Borç</th>
                          <th className="px-3 py-2 text-right">Ceza</th>
                        </tr>
                      </thead>
                      <tbody>
                        {seciliBorclar.map((b) => (
                          <tr key={b.id} className="border-b border-slate-100">
                            <td className="px-3 py-1.5 tabular-nums">{b.donem}</td>
                            <td className="px-3 py-1.5 font-mono text-xs">{b.gelirKodu}</td>
                            <td className="px-3 py-1.5 text-right tabular-nums">
                              {formatCurrency(b.tutar)}
                            </td>
                            <td className="px-3 py-1.5 text-right tabular-nums">
                              {formatCurrency(b.ceza)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {section === "odeme-ekstre" && ekstre && (
                  <div className="space-y-4">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ReadOnlyInfoField label="Başvuru No" value={ekstre.basvuruNo} />
                      <ReadOnlyInfoField label="Abone No" value={ekstre.aboneNo} />
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50 text-[11px] font-semibold uppercase text-slate-500">
                          <tr className="border-b">
                            <th className="px-3 py-2 text-left">Dönem</th>
                            <th className="px-3 py-2 text-right">Borç</th>
                            <th className="px-3 py-2 text-right">Ceza</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ekstre.satirlar.map((s, i) => (
                            <tr key={i} className="border-b border-slate-100">
                              <td className="px-3 py-1.5 tabular-nums">{s.donem}</td>
                              <td className="px-3 py-1.5 text-right tabular-nums">
                                {formatCurrency(s.borc)}
                              </td>
                              <td className="px-3 py-1.5 text-right tabular-nums">
                                {formatCurrency(s.ceza)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex flex-wrap gap-6 border-t border-slate-100 pt-3">
                      <div>
                        <p className="text-xs text-slate-500">İndirim</p>
                        <p className="text-lg font-semibold tabular-nums text-emerald-700">
                          {formatCurrency(ekstre.indirim)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Yeni Toplam</p>
                        <p className="text-lg font-semibold tabular-nums text-slate-900">
                          {formatCurrency(ekstre.yeniToplam)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {section === "taahhutname" && taahhutname && (
                  <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Taahhütname Özeti
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <ReadOnlyInfoField label="Başvuru No" value={taahhutname.basvuruNo} />
                      <ReadOnlyInfoField label="Tarih" value={taahhutname.tarih} />
                      <ReadOnlyInfoField label="Abone No" value={taahhutname.aboneNo} />
                      <ReadOnlyInfoField label="Adı Soyadı" value={taahhutname.adSoyad} />
                      <ReadOnlyInfoField
                        label="İndirim Oranı"
                        value={`%${taahhutname.indirimOrani}`}
                      />
                      <ReadOnlyInfoField
                        label="Taahhüt Edilen Borç"
                        value={formatCurrency(taahhutname.yeniBorc)}
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {!seciliBasvuru && basvurular.length > 0 && (
            <div className="px-4 pb-4 text-center text-sm text-slate-500">
              Detay görüntülemek için listeden bir başvuru seçin.
            </div>
          )}
        </>
      )}

      <IslemActionBar
        onKaydet={tab === "basvuru" && yetkili ? handleKaydet : undefined}
        onIptal={handleIptal}
        cikisHref="/su"
        kaydetDisabled={tab !== "basvuru" || !yetkili || kayitYukleniyor}
      />
    </div>
  );
}
