import { cn, formatCurrency } from "@/lib/utils";

export function StatusBadge({
  label,
  variant = "neutral",
}: {
  label: string;
  variant?: "success" | "warning" | "danger" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded px-2 py-0.5 text-[11px] font-medium",
        variant === "success" && "bg-emerald-50 text-emerald-700",
        variant === "warning" && "bg-amber-50 text-amber-700",
        variant === "danger" && "bg-red-50 text-red-700",
        variant === "neutral" && "bg-slate-100 text-slate-600",
      )}
    >
      {label}
    </span>
  );
}

export interface BorcSatir {
  id: string;
  refNo?: string;
  donem: string;
  gelirKodu?: string;
  gelirAdi?: string;
  tutar: number;
  sonOdeme?: string;
}

export function BorcTablosu({
  rows,
  emptyMessage = "Borç kaydı bulunmuyor.",
}: {
  rows: BorcSatir[];
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead className="bg-slate-50 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          <tr className="border-b border-slate-200">
            <th className="px-3 py-2 text-left">Dönem</th>
            <th className="px-3 py-2 text-left">Gelir Kodu</th>
            <th className="px-3 py-2 text-left">Açıklama</th>
            <th className="px-3 py-2 text-left">Son Ödeme</th>
            <th className="px-3 py-2 text-right">Tutar</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id} className="h-10 border-b border-slate-100 hover:bg-slate-50/70">
                <td className="px-3 py-1.5 tabular-nums">{row.donem}</td>
                <td className="px-3 py-1.5 font-mono text-xs">{row.gelirKodu ?? "—"}</td>
                <td className="px-3 py-1.5">{row.gelirAdi ?? row.refNo ?? "—"}</td>
                <td className="px-3 py-1.5 text-slate-600">{row.sonOdeme ?? "—"}</td>
                <td className="px-3 py-1.5 text-right font-medium tabular-nums">
                  {formatCurrency(row.tutar)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
