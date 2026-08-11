"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Construction } from "lucide-react";
import {
  getSuWorkspace,
  type SuWorkspaceConfig,
  type SuWorkspaceId,
} from "@/lib/su-workspaces";
import { cn } from "@/lib/utils";
import { IslemActionBar, SectionTabBar, WorkspaceTabBar } from "./shared";
import { useSuKlavye } from "./shared/useSuKlavye";

const onOdemeliSistemler = ["Baylan", "Cem"] as const;

interface SuWorkspaceShellProps {
  workspaceId: SuWorkspaceId;
}

function ShellTabContent({
  ws,
  tab,
  section,
  sistem,
}: {
  ws: SuWorkspaceConfig;
  tab: string;
  section: string | null;
  sistem?: string;
}) {
  const tabConfig = ws.tabs.find((t) => t.id === tab);
  const tabSections =
    ws.sections?.filter((s) => s.parentTab === tab).map((s) => ({ id: s.id, label: s.label })) ??
    [];

  return (
    <div className="p-4">
      {sistem && (
        <p className="mb-3 text-xs text-slate-500">
          Sistem: <span className="font-medium text-slate-700">{sistem}</span>
        </p>
      )}
      {tabSections.length > 0 && section && (
        <p className="mb-3 text-xs text-slate-500">
          Bölüm:{" "}
          <span className="font-medium text-slate-700">
            {tabSections.find((s) => s.id === section)?.label ?? section}
          </span>
        </p>
      )}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
        <Construction className="mb-3 h-8 w-8 text-slate-400" />
        <p className="text-sm font-medium text-slate-700">
          {tabConfig?.label ?? tab} — geliştirme aşamasında
        </p>
        <p className="mt-1 max-w-md text-xs text-slate-500">
          {ws.description}. Abone workspace referans pattern&apos;i ile uygulanacak. Backend
          entegrasyonu bekleniyor.
        </p>
      </div>
    </div>
  );
}

export function SuWorkspaceShell({ workspaceId }: SuWorkspaceShellProps) {
  const ws = getSuWorkspace(workspaceId)!;
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") ?? ws.tabs[0]?.id ?? "";
  const sectionParam = searchParams.get("section");
  const sistemParam = searchParams.get("sistem") ?? "Baylan";

  const [tab, setTab] = useState(tabParam);
  const [section, setSection] = useState<string | null>(sectionParam);
  const [sistem, setSistem] = useState(sistemParam);

  const tabSections =
    ws.sections?.filter((s) => s.parentTab === tab).map((s) => ({ id: s.id, label: s.label })) ??
    [];

  const setUrl = useCallback(
    (next: { tab?: string; section?: string | null; sistem?: string }) => {
      const p = new URLSearchParams(searchParams.toString());
      if (next.tab) p.set("tab", next.tab);
      if (next.section === null) p.delete("section");
      else if (next.section) p.set("section", next.section);
      if (next.sistem) p.set("sistem", next.sistem);
      router.replace(`${ws.route}?${p.toString()}`, { scroll: false });
    },
    [router, searchParams, ws.route],
  );

  useEffect(() => {
    setTab(tabParam);
    setSection(sectionParam);
    setSistem(sistemParam);
  }, [tabParam, sectionParam, sistemParam]);

  const handleTabChange = (id: string) => {
    setTab(id);
    const firstSection = ws.sections?.find((s) => s.parentTab === id)?.id ?? null;
    setSection(firstSection);
    setUrl({ tab: id, section: firstSection });
  };

  const handleIptal = useCallback(() => {
    const defaultTab = ws.tabs[0]?.id ?? "";
    setTab(defaultTab);
    setSection(null);
    setUrl({ tab: defaultTab, section: null });
  }, [setUrl, ws.tabs]);

  useSuKlavye({
    onIptal: handleIptal,
    onCikis: () => router.push("/su"),
    kaydetEnabled: false,
  });

  const isOnOdemeli = workspaceId === "on-odemeli-sayac";

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      {isOnOdemeli && (
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-2">
          <span className="text-xs font-medium text-slate-600">Sistem:</span>
          {onOdemeliSistemler.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSistem(s);
                setUrl({ sistem: s });
              }}
              className={cn(
                "rounded-md px-3 py-1 text-xs font-medium transition",
                sistem === s
                  ? "bg-[#1e40af] text-white"
                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <WorkspaceTabBar tabs={ws.tabs} active={tab} onChange={handleTabChange} />

      {tabSections.length > 0 && (
        <SectionTabBar
          sections={tabSections}
          active={section ?? tabSections[0]?.id ?? ""}
          onChange={(id) => {
            setSection(id);
            setUrl({ section: id });
          }}
        />
      )}

      <ShellTabContent
        ws={ws}
        tab={tab}
        section={section}
        sistem={isOnOdemeli ? sistem : undefined}
      />

      <IslemActionBar onIptal={handleIptal} cikisHref="/su" />
    </div>
  );
}
