"use client";

import { suDonemConfig } from "@/lib/su-fatura-mock";
import { cn } from "@/lib/utils";

interface DonemFiltreSatiriProps {
  yil: number;
  donem: number;
  onYilChange: (yil: number) => void;
  onDonemChange: (donem: number) => void;
  className?: string;
  yillar?: number[];
  donemSayisi?: number;
}

export function DonemFiltreSatiri({
  yil,
  donem,
  onYilChange,
  onDonemChange,
  className,
  yillar = suDonemConfig.yillar,
  donemSayisi = suDonemConfig.donemSayisi,
}: DonemFiltreSatiriProps) {
  const donemler = Array.from({ length: donemSayisi }, (_, i) => i + 1);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-4 border-b border-slate-200 bg-slate-50/80 px-4 py-2.5",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-600">Yıl:</span>
        <select
          className="input-field h-8 w-24 py-1 text-sm"
          value={yil}
          onChange={(e) => onYilChange(Number(e.target.value))}
        >
          {yillar.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-slate-600">Dönem:</span>
        <div className="flex gap-1">
          {donemler.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onDonemChange(d)}
              className={cn(
                "h-8 min-w-[2rem] rounded border px-2 text-xs font-medium transition",
                donem === d
                  ? "border-[#1e40af] bg-[#1e40af] text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50",
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </div>
      <span className="text-xs text-slate-500">
        Seçili: <span className="font-medium text-slate-700">{yil}/{donem}</span>
      </span>
    </div>
  );
}
