"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { searchMuhasebeItems } from "@/lib/muhasebe-module";
import { getMuhasebeGroupLabelForItem } from "@/lib/muhasebe-submenus";

export function MuhasebeModuleSearch() {
  const [query, setQuery] = useState("");

  const results = useMemo(() => searchMuhasebeItems(query), [query]);

  return (
    <div className="card p-5">
      <label htmlFor="muhasebe-search" className="mb-3 block text-sm font-semibold text-slate-900">
        Modülde Ara
      </label>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          id="muhasebe-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Örn: kasa, mahsup, bütçe, çek…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {query.trim() && (
        <ul className="mt-3 divide-y divide-slate-100 rounded-xl border border-slate-100">
          {results.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">Sonuç bulunamadı.</li>
          ) : (
            results.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 transition hover:bg-slate-100/80"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-700" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-900">{item.label}</p>
                      <p className="text-xs text-slate-500">
                        {getMuhasebeGroupLabelForItem(item)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
