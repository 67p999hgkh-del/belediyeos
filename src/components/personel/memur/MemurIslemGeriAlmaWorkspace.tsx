"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getMemurAuditLog } from "@/lib/memur/audit";
import { formatMemurDonem, memurDonemConfig, memurGeriAlmaTurleri } from "@/lib/memur/config";
import {
  geriAlMemurIslem,
  getMemurGeriAlmaKayitlari,
  getMemurHesaplamalar,
} from "@/lib/memur-repository";
import { canMemurIslem } from "@/lib/memur/yetki";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import {
  DonemSecici,
  IslemActionBar,
  MemurAuditLogPanel,
  useMemurKlavye,
  useMemurWorkspaceUrl,
  WorkspaceTabBar,
  YetkiGuard,
} from "./shared";
import { MemurDataTable } from "./MemurPersonelKartiWorkspace";

const ws = memurWorkspaces["islem-geri-alma"];

export function MemurIslemGeriAlmaWorkspace() {
  const { user } = useApp();
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const turParam = searchParams.get("tur") ?? "maas";

  const [islemTuru, setIslemTuru] = useState(turParam);
  const [yil, setYil] = useState(memurDonemConfig.aktifYil);
  const [ay, setAy] = useState(memurDonemConfig.aktifAy);
  const [referans, setReferans] = useState("");
  const [gerekce, setGerekce] = useState("");
  const [onayModal, setOnayModal] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [mesaj, setMesaj] = useState<string | null>(null);
  const [versiyon, setVersiyon] = useState(0);

  const yetkili = canMemurIslem("ROLLBACK_PAYROLL", user.role);
  const donem = formatMemurDonem(yil, ay);
  const geriAlmaKayitlari = useMemo(() => getMemurGeriAlmaKayitlari(), [versiyon]);
  const hesaplamalar = useMemo(() => getMemurHesaplamalar(), [versiyon]);

  const handleGeriAl = async () => {
    if (!gerekce.trim()) {
      setMesaj("Geri alma gerekçesi zorunludur.");
      return;
    }
    setYukleniyor(true);
    await new Promise((r) => setTimeout(r, 400));
    geriAlMemurIslem(
      memurGeriAlmaTurleri.find((t) => t.id === islemTuru)?.label ?? islemTuru,
      donem,
      referans || "—",
      gerekce,
      user.name,
    );
    setVersiyon((v) => v + 1);
    setYukleniyor(false);
    setOnayModal(false);
    setMesaj("İşlem geri alma kaydı oluşturuldu.");
    setGerekce("");
    setReferans("");
  };

  useMemurKlavye({
    onKaydet: onayModal ? handleGeriAl : () => setOnayModal(true),
    kaydetEnabled: yetkili && !!gerekce.trim(),
  });

  return (
    <div className="card overflow-hidden">
      <WorkspaceTabBar tabs={ws.tabs} active="geri-alma" onChange={() => {}} />
      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-red-200 bg-red-50/80 px-4 py-3 text-sm text-red-800">
          <AlertTriangle className="mb-1 inline h-4 w-4" /> Kritik işlem — Geri Dönüşümler (legacy). Gerekçe zorunlu, audit kaydı oluşturulur.
        </div>

        <YetkiGuard yetkili={yetkili}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              <span className="mb-1 block text-slate-600">İşlem Türü</span>
              <select
                value={islemTuru}
                onChange={(e) => { setIslemTuru(e.target.value); setUrl({ tur: e.target.value }); }}
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                {memurGeriAlmaTurleri.map((t) => (
                  <option key={t.id} value={t.id}>{t.label}</option>
                ))}
              </select>
            </label>
            <DonemSecici yil={yil} ay={ay} onYilChange={setYil} onAyChange={setAy} />
          </div>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Kayıt / Referans</span>
            <select
              value={referans}
              onChange={(e) => setReferans(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              <option value="">Kayıt seçin…</option>
              {hesaplamalar.map((h) => (
                <option key={h.id} value={h.id}>{h.donem} — {h.hesaplamaTuru} ({h.durum})</option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">Geri Alma Gerekçesi *</span>
            <textarea
              value={gerekce}
              onChange={(e) => setGerekce(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              placeholder="Gerekçe zorunlu"
            />
          </label>

          {onayModal && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
              Bu işlem ilgili hesaplamayı geri alacaktır. Onaylıyor musunuz?
              <div className="mt-3 flex gap-2">
                <button type="button" onClick={handleGeriAl} disabled={yukleniyor} className="btn-primary text-sm">
                  {yukleniyor ? <Loader2 className="h-4 w-4 animate-spin" /> : "Onayla ve Geri Al"}
                </button>
                <button type="button" onClick={() => setOnayModal(false)} className="btn-secondary text-sm">Vazgeç</button>
              </div>
            </div>
          )}

          {mesaj && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800">
              <CheckCircle2 className="h-4 w-4" />{mesaj}
            </div>
          )}

          <MemurDataTable
            columns={["İşlem Türü", "Dönem", "Referans", "Durum", "Geri Alan", "Tarih"]}
            rows={geriAlmaKayitlari.map((g) => [
              g.islemTuru, g.donem, g.referans, g.mevcutDurum, g.geriAlan ?? "—", g.geriAlmaTarihi ?? "—",
            ])}
          />
        </YetkiGuard>

        <MemurAuditLogPanel kayitlar={getMemurAuditLog(10)} />
      </div>

      <IslemActionBar
        cikisHref="/personel/memur"
        onKaydet={yetkili ? () => setOnayModal(true) : undefined}
        kaydetLabel="Geri Al"
        kaydetDisabled={!gerekce.trim() || yukleniyor}
      />
    </div>
  );
}
