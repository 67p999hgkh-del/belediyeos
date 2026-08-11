"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { getMemurAuditByPersonel, getMemurAuditLog } from "@/lib/memur/audit";
import {
  formatMemurDonem,
  memurDonemConfig,
} from "@/lib/memur/config";
import {
  getMemurBordrolar,
  getMemurById,
  getMemurCekler,
  getMemurEkMesai,
  getMemurEmeklilik,
  getMemurKesintileri,
  getMemurMaasBilgileri,
  getMemurYardimlar,
  guncelleMemurMaasBilgisi,
  kaydetMemurOzelKesinti,
  kaydetMemurYardim,
  searchMemurByQuery,
} from "@/lib/memur-repository";
import { canMemurIslem } from "@/lib/memur/yetki";
import { memurWorkspaces } from "@/lib/memur-workspaces";
import { cn } from "@/lib/utils";
import {
  DonemSecici,
  IslemActionBar,
  MemurAuditLogPanel,
  MemurBilgiOzeti,
  PersonelArama,
  ReadOnlyInfoField,
  useMemurKlavye,
  useMemurWorkspaceUrl,
  WorkspaceTabBar,
  YetkiGuard,
} from "./shared";

const ws = memurWorkspaces["personel-karti"];

type Mesaj = { tip: "ok" | "err"; text: string } | null;

export function MemurPersonelKartiWorkspace() {
  const { user } = useApp();
  const { searchParams, setUrl } = useMemurWorkspaceUrl(ws.route);
  const tabParam = searchParams.get("tab") ?? "genel";
  const sicilParam = searchParams.get("sicil") ?? "";

  const [tab, setTab] = useState(tabParam);
  const [arama, setArama] = useState(sicilParam);
  const [selectedId, setSelectedId] = useState("");
  const [mesaj, setMesaj] = useState<Mesaj>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [versiyon, setVersiyon] = useState(0);

  const [yil, setYil] = useState(memurDonemConfig.aktifYil);
  const [ay, setAy] = useState(memurDonemConfig.aktifAy);
  const [maasForm, setMaasForm] = useState({ maasGrubu: "", derece: "", kademe: "" });
  const [yardimForm, setYardimForm] = useState({ tur: "", tutar: "", aciklama: "" });
  const [kesintiForm, setKesintiForm] = useState({ tur: "", tutar: "", aciklama: "" });

  useEffect(() => setTab(tabParam), [tabParam]);

  const aramaSonuclari = useMemo(() => searchMemurByQuery(arama), [arama, versiyon]);
  const memur = useMemo(() => getMemurById(selectedId), [selectedId, versiyon]);
  const maasBilgi = useMemo(
    () => (selectedId ? getMemurMaasBilgileri(selectedId)[0] : undefined),
    [selectedId, versiyon],
  );
  const yardimlar = useMemo(
    () => (selectedId ? getMemurYardimlar(selectedId) : []),
    [selectedId, versiyon],
  );
  const kesintiler = useMemo(
    () => (selectedId ? getMemurKesintileri(selectedId) : []),
    [selectedId, versiyon],
  );

  const yetkiliMaas = canMemurIslem("EDIT_SALARY_INFO", user.role);
  const yetkiliKesinti = canMemurIslem("MANAGE_DEDUCTIONS", user.role);

  const handleTabChange = (id: string) => {
    setTab(id);
    setUrl({ tab: id });
    setMesaj(null);
  };

  const handlePersonelSec = (id: string) => {
    setSelectedId(id);
    const m = getMemurById(id);
    if (m) setUrl({ sicil: m.sicilNo });
    const mb = getMemurMaasBilgileri(id)[0];
    if (mb) setMaasForm({ maasGrubu: mb.maasGrubu, derece: mb.derece, kademe: mb.kademe });
  };

  const handleKaydet = useCallback(async () => {
    if (!memur) {
      setMesaj({ tip: "err", text: "Önce personel seçin." });
      return;
    }
    setYukleniyor(true);
    await new Promise((r) => setTimeout(r, 300));

    if (tab === "maas-bilgileri" && yetkiliMaas) {
      guncelleMemurMaasBilgisi(
        memur.id,
        { ...maasForm, donem: formatMemurDonem(yil, ay) },
        user.name,
      );
      setMesaj({ tip: "ok", text: "Maaş bilgileri kaydedildi." });
    } else if (tab === "yardimlar" && yetkiliMaas) {
      kaydetMemurYardim(
        {
          memurId: memur.id,
          sicilNo: memur.sicilNo,
          adSoyad: memur.adSoyad,
          yardimTuru: yardimForm.tur || "Diğer",
          tutar: parseFloat(yardimForm.tutar) || 0,
          donem: formatMemurDonem(yil, ay),
          aciklama: yardimForm.aciklama,
        },
        user.name,
      );
      setMesaj({ tip: "ok", text: "Ek yardım kaydı oluşturuldu." });
      setYardimForm({ tur: "", tutar: "", aciklama: "" });
    } else if (tab === "kesintiler" && yetkiliKesinti) {
      kaydetMemurOzelKesinti(
        {
          memurId: memur.id,
          sicilNo: memur.sicilNo,
          adSoyad: memur.adSoyad,
          kesintiTuru: kesintiForm.tur || "Diğer",
          tutar: parseFloat(kesintiForm.tutar) || 0,
          donem: formatMemurDonem(yil, ay),
          aciklama: kesintiForm.aciklama,
        },
        user.name,
      );
      setMesaj({ tip: "ok", text: "Özel kesinti kaydı oluşturuldu." });
      setKesintiForm({ tur: "", tutar: "", aciklama: "" });
    }

    setYukleniyor(false);
    setVersiyon((v) => v + 1);
  }, [tab, memur, maasForm, yardimForm, kesintiForm, yil, ay, user.name, yetkiliMaas, yetkiliKesinti]);

  useMemurKlavye({
    onKaydet: tab !== "genel" && tab !== "iliskili" ? handleKaydet : undefined,
    onIptal: () => setMesaj(null),
    kaydetEnabled: !!memur,
  });

  const auditKayitlari = memur
    ? getMemurAuditByPersonel(memur.sicilNo)
    : getMemurAuditLog(5);

  return (
    <div className="card overflow-hidden">
      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />

      <div className="space-y-4 p-4">
        <PersonelArama value={arama} onChange={setArama} />

        {aramaSonuclari.length > 0 && !selectedId && (
          <ul className="divide-y divide-slate-100 rounded-lg border border-slate-200">
            {aramaSonuclari.slice(0, 8).map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => handlePersonelSec(m.id)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-slate-50"
                >
                  <span className="font-medium">{m.sicilNo} — {m.adSoyad}</span>
                  <span className="text-slate-400">{m.birim}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        <MemurBilgiOzeti memur={memur} />

        {mesaj && (
          <div
            className={cn(
              "flex items-center gap-2 rounded-lg px-4 py-2 text-sm",
              mesaj.tip === "ok"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border border-red-200 bg-red-50 text-red-800",
            )}
          >
            {mesaj.tip === "ok" ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            {mesaj.text}
          </div>
        )}

        {tab === "genel" && memur && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ReadOnlyInfoField label="Kimlik No" value={memur.kimlikNo} />
            <ReadOnlyInfoField label="Doğum Tarihi / Yeri" value={`${memur.dogumTarihi} — ${memur.dogumYeri}`} />
            <ReadOnlyInfoField label="İşe Giriş" value={memur.iseGirisTarihi} />
            <ReadOnlyInfoField label="Kadro" value={memur.kadro} />
            <ReadOnlyInfoField label="Mevki" value={memur.mevki} />
            <ReadOnlyInfoField label="Birim" value={memur.birim} />
            <ReadOnlyInfoField label="Statü" value={memur.statu} />
            <ReadOnlyInfoField label="Telefon" value={memur.telefon} />
            <ReadOnlyInfoField label="E-posta" value={memur.eposta} />
          </div>
        )}

        {tab === "maas-bilgileri" && (
          <YetkiGuard yetkili={yetkiliMaas}>
            <div className="space-y-4">
              <DonemSecici yil={yil} ay={ay} onYilChange={setYil} onAyChange={setAy} />
              <div className="grid gap-4 sm:grid-cols-3">
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Maaş Grubu</span>
                  <input
                    value={maasForm.maasGrubu}
                    onChange={(e) => setMaasForm((f) => ({ ...f, maasGrubu: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                    placeholder="Backend parametre"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Derece</span>
                  <input
                    value={maasForm.derece}
                    onChange={(e) => setMaasForm((f) => ({ ...f, derece: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block text-sm">
                  <span className="mb-1 block text-slate-600">Kademe</span>
                  <input
                    value={maasForm.kademe}
                    onChange={(e) => setMaasForm((f) => ({ ...f, kademe: e.target.value }))}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  />
                </label>
              </div>
              {maasBilgi && (
                <p className="text-xs text-slate-500">Son güncelleme: {maasBilgi.guncellemeTarihi}</p>
              )}
            </div>
          </YetkiGuard>
        )}

        {tab === "yardimlar" && (
          <YetkiGuard yetkili={yetkiliMaas}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  placeholder="Yardım türü"
                  value={yardimForm.tur}
                  onChange={(e) => setYardimForm((f) => ({ ...f, tur: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Tutar"
                  value={yardimForm.tutar}
                  onChange={(e) => setYardimForm((f) => ({ ...f, tutar: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Açıklama"
                  value={yardimForm.aciklama}
                  onChange={(e) => setYardimForm((f) => ({ ...f, aciklama: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <MemurDataTable
                columns={["Tür", "Tutar", "Dönem", "Açıklama"]}
                rows={yardimlar.map((y) => [y.yardimTuru, String(y.tutar), y.donem, y.aciklama])}
              />
            </div>
          </YetkiGuard>
        )}

        {tab === "kesintiler" && (
          <YetkiGuard yetkili={yetkiliKesinti}>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  placeholder="Kesinti türü"
                  value={kesintiForm.tur}
                  onChange={(e) => setKesintiForm((f) => ({ ...f, tur: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Tutar"
                  value={kesintiForm.tutar}
                  onChange={(e) => setKesintiForm((f) => ({ ...f, tutar: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  placeholder="Açıklama"
                  value={kesintiForm.aciklama}
                  onChange={(e) => setKesintiForm((f) => ({ ...f, aciklama: e.target.value }))}
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
                />
              </div>
              <MemurDataTable
                columns={["Tür", "Tutar", "Dönem", "Açıklama"]}
                rows={kesintiler.map((k) => [k.kesintiTuru, String(k.tutar), k.donem, k.aciklama])}
              />
            </div>
          </YetkiGuard>
        )}

        {tab === "iliskili" && memur && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-slate-700">İlişkili Kayıtlar</h3>
            <MemurDataTable
              columns={["Tür", "Dönem", "Durum"]}
              rows={[
                ...getMemurBordrolar().slice(0, 3).map((b) => ["Bordro", b.donem, b.durum]),
                ...getMemurEkMesai().filter((e) => e.memurId === memur.id).map((e) => ["Ek Mesai", e.donem, e.durum]),
                ...getMemurEmeklilik().filter((e) => e.memurId === memur.id).map((e) => ["Emeklilik", e.basvuruTarihi, e.durum]),
                ...getMemurCekler().filter((c) => c.memurId === memur.id).map((c) => ["Çek", c.tarih, c.durum]),
              ]}
            />
          </div>
        )}

        <MemurAuditLogPanel kayitlar={auditKayitlari} />
      </div>

      <IslemActionBar
        cikisHref="/personel/memur"
        onKaydet={tab !== "genel" && tab !== "iliskili" ? handleKaydet : undefined}
        onIptal={() => setMesaj(null)}
        kaydetDisabled={!memur || yukleniyor}
        kaydetLoading={yukleniyor}
        kaydetLabel={tab === "maas-bilgileri" ? "Kaydet" : tab === "yardimlar" || tab === "kesintiler" ? "Ekle" : "Kaydet"}
        extra={yukleniyor ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : null}
      />
    </div>
  );
}

function MemurDataTable({ columns, rows }: { columns: string[]; rows: string[][] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-slate-500">Kayıt bulunamadı.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c} className="px-4 py-2 text-left">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-slate-100">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { MemurDataTable };
