import { cn } from "@/lib/utils";

export function ReadOnlyInfoField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <span className="text-xs text-slate-500">{label}</span>
      <div className="mt-0.5 min-h-9 rounded border border-slate-200 bg-slate-50/80 px-2.5 py-1.5 text-sm font-medium text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
}

interface SicilBilgileriPanelProps {
  adSoyad: string;
  adres: string;
  sicilNo?: string;
  aboneNo?: string;
  className?: string;
}

export function SicilBilgileriPanel({
  adSoyad,
  adres,
  sicilNo,
  aboneNo,
  className,
}: SicilBilgileriPanelProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Sicil Bilgileri</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {aboneNo && <ReadOnlyInfoField label="Abone No" value={aboneNo} />}
        {sicilNo && <ReadOnlyInfoField label="Sicil No" value={sicilNo} />}
        <ReadOnlyInfoField label="Adı Soyadı (Ünvanı)" value={adSoyad} className="sm:col-span-2" />
        <ReadOnlyInfoField label="Adres" value={adres} className="sm:col-span-2" />
      </div>
    </div>
  );
}
