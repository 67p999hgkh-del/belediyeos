"use client";

import { useApp } from "@/context/AppContext";
import { TitleBar } from "./TitleBar";
import { ModuleNavBar } from "./ModuleNavBar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { municipality } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-slate-200">
      <TitleBar />
      <ModuleNavBar />

      <main className="relative flex-1 overflow-auto">
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden select-none"
          aria-hidden
        >
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: 4 }).map((__, col) => (
              <span
                key={`${row}-${col}`}
                className="absolute whitespace-nowrap text-2xl font-bold uppercase text-slate-400/20 sm:text-4xl"
                style={{
                  top: `${row * 22 + 5}%`,
                  left: `${col * 30 - 10}%`,
                  transform: "rotate(-30deg)",
                }}
              >
                {municipality.shortName.toUpperCase()} BELEDİYESİ
              </span>
            )),
          )}
        </div>

        <div className="relative min-h-full p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}
