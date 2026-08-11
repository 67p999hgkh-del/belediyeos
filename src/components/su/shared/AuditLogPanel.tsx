"use client";

import type { SuAuditKayit } from "@/lib/su-audit";

export function AuditLogPanel({ kayitlar }: { kayitlar: SuAuditKayit[] }) {
  if (kayitlar.length === 0) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50">
      <div className="border-b border-slate-200 px-3 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">İşlem Geçmişi</p>
      </div>
      <div className="max-h-48 overflow-y-auto">
        <table className="w-full text-xs">
          <thead className="bg-slate-50 text-[10px] font-semibold uppercase text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="px-3 py-1.5 text-left">Tarih</th>
              <th className="px-3 py-1.5 text-left">Kullanıcı</th>
              <th className="px-3 py-1.5 text-left">İşlem</th>
              <th className="px-3 py-1.5 text-left">Gerekçe</th>
            </tr>
          </thead>
          <tbody>
            {kayitlar.map((k) => (
              <tr key={k.id} className="border-b border-slate-100">
                <td className="px-3 py-1.5 text-slate-600">{k.tarih}</td>
                <td className="px-3 py-1.5">{k.kullanici}</td>
                <td className="px-3 py-1.5">{k.islem}</td>
                <td className="px-3 py-1.5 text-slate-500">{k.gerekce ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
