"use client";

import Link from "next/link";
import { LogOut, RotateCcw, Save } from "lucide-react";
import { cn } from "@/lib/utils";

interface IslemActionBarProps {
  onKaydet?: () => void;
  onIptal?: () => void;
  cikisHref?: string;
  kaydetLabel?: string;
  kaydetDisabled?: boolean;
  iptalDisabled?: boolean;
  kaydetLoading?: boolean;
  className?: string;
  extra?: React.ReactNode;
}

export function IslemActionBar({
  onKaydet,
  onIptal,
  cikisHref = "/su",
  kaydetLabel = "Kaydet",
  kaydetDisabled,
  iptalDisabled,
  kaydetLoading,
  className,
  extra,
}: IslemActionBarProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-slate-50/80 px-4 py-3",
        className,
      )}
    >
      <div className="flex flex-wrap gap-2">{extra}</div>
      <div className="flex flex-wrap gap-2">
        {onKaydet && (
          <button
            type="button"
            onClick={onKaydet}
            disabled={kaydetDisabled || kaydetLoading}
            className="btn-primary inline-flex"
          >
            <Save className="h-4 w-4" />
            {kaydetLabel}
            <kbd className="ml-1 rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-normal">F8</kbd>
          </button>
        )}
        {onIptal && (
          <button
            type="button"
            onClick={onIptal}
            disabled={iptalDisabled}
            className="btn-secondary inline-flex"
          >
            <RotateCcw className="h-4 w-4" />
            İptal
            <kbd className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
              F5
            </kbd>
          </button>
        )}
        <Link href={cikisHref} className="btn-ghost inline-flex">
          <LogOut className="h-4 w-4" />
          Çıkış
          <kbd className="ml-1 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-normal text-slate-500">
            F12
          </kbd>
        </Link>
      </div>
    </div>
  );
}
