"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

interface AboneNoInputProps {
  value: string[];
  onChange: (parts: string[]) => void;
  onEnter?: () => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export function AboneNoInput({
  value,
  onChange,
  onEnter,
  label = "Abone No",
  className,
  disabled,
}: AboneNoInputProps) {
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handlePart = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "").slice(0, 2);
    const next = [...value];
    next[index] = digits;
    onChange(next);
    if (digits.length >= 2 && index < 3) refs[index + 1].current?.focus();
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-sm text-slate-600">{label}:</span>
      <div className="flex items-center gap-1">
        {value.map((part, i) => (
          <span key={i} className="flex items-center gap-1">
            <input
              ref={refs[i]}
              type="text"
              inputMode="numeric"
              maxLength={2}
              disabled={disabled}
              value={part}
              onChange={(e) => handlePart(i, e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
              className="h-8 w-10 rounded border border-slate-200 bg-white px-1 text-center text-sm tabular-nums outline-none focus:border-[#1e40af] focus:ring-2 focus:ring-[#1e40af]/15 disabled:bg-slate-50"
            />
            {i < 3 && <span className="text-slate-400">-</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
