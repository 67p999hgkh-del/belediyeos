"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { memurBirNetEslesmeleri, memurWorkspaces } from "@/lib/memur-workspaces";

export function MemurModuleSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLocaleLowerCase("tr");
    if (!q) return [];

    const workspaceHits = Object.values(memurWorkspaces)
      .filter(
        (w) =>
          w.title.toLocaleLowerCase("tr").includes(q) ||
          w.description.toLocaleLowerCase("tr").includes(q),
      )
      .map((w) => ({
        label: w.title,
        href: w.route,
        group: "Workspace",
      }));

    const birnetHits = memurBirNetEslesmeleri
      .filter(
        (b) =>
          b.birnetFonksiyon.toLocaleLowerCase("tr").includes(q) ||
          b.konum.toLocaleLowerCase("tr").includes(q),
      )
      .map((b) => ({
        label: b.birnetFonksiyon,
        href: memurWorkspaces[b.workspace as keyof typeof memurWorkspaces]?.route ?? "/personel/memur",
        group: b.konum,
      }));

    return [...workspaceHits, ...birnetHits].slice(0, 12);
  }, [query]);

  return (
    <div className="card p-5">
      <label htmlFor="memur-search" className="mb-3 block text-sm font-semibold text-slate-900">
        Modülde Ara
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="memur-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Örn: maaş, bordro, emeklilik, PÖG, geri dönüşüm…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
        />
      </div>

      {query.trim() && (
        <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">Sonuç bulunamadı.</li>
          ) : (
            results.map((item, i) => (
              <li key={`${item.href}-${item.label}-${i}`}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 transition hover:bg-indigo-50/50"
                >
                  <Search className="h-4 w-4 shrink-0 text-indigo-600" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.group}</p>
                  </div>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
