"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { isNavItemActive, navigation, platformBrand } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useApp();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname, setSidebarOpen]);

  useEffect(() => {
    const next: Record<string, boolean> = {};
    for (const group of navigation) {
      for (const item of group.items) {
        if (item.children && isNavItemActive(pathname, item.href)) {
          next[item.id] = true;
        }
      }
    }
    setExpanded((prev) => ({ ...prev, ...next }));
  }, [pathname]);

  const BrandIcon = platformBrand.icon;

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-3 border-b border-white/10 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1e40af]">
          <BrandIcon className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">{platformBrand.name}</p>
          <p className="truncate text-[11px] text-slate-400">{platformBrand.tagline}</p>
        </div>
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="ml-auto rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Menüyü kapat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {navigation.map((group) => (
          <div key={group.id} className="mb-6 last:mb-0">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isNavItemActive(pathname, item.href);
                const isExpanded = expanded[item.id];
                const hasChildren = item.children && item.children.length > 0;

                return (
                  <li key={item.id}>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className={cn(
                          "flex flex-1 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition",
                          active
                            ? "bg-[#1e40af]/90 font-medium text-white"
                            : "text-slate-300 hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <Icon className="h-4 w-4 shrink-0 opacity-80" />
                        <span className="truncate">{item.label}</span>
                      </Link>
                      {hasChildren && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpanded((prev) => ({
                              ...prev,
                              [item.id]: !prev[item.id],
                            }))
                          }
                          className={cn(
                            "mr-1 rounded p-1 text-slate-400 transition hover:bg-white/10 hover:text-white",
                            active && "text-white/70",
                          )}
                          aria-label={`${item.label} alt menü`}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </div>
                    {hasChildren && isExpanded && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-white/10 pl-3">
                        {item.children!.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <li key={child.id}>
                              <Link
                                href={child.href}
                                className={cn(
                                  "flex items-center justify-between rounded-md px-3 py-2 text-[13px] transition",
                                  childActive
                                    ? "bg-white/10 font-medium text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
                                )}
                              >
                                <span>{child.label}</span>
                                {child.shortcut && (
                                  <span className="text-[10px] text-slate-500">
                                    {child.shortcut}
                                  </span>
                                )}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-5 py-4">
        <p className="text-[11px] text-slate-500">Sürüm 0.2.0 · Enterprise</p>
      </div>
    </div>
  );

  return (
    <>
      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-label="Menüyü kapat"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] transition-transform duration-200 lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {content}
      </aside>
    </>
  );
}
