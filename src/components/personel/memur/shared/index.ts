"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useMemurWorkspaceUrl(route: string) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const setUrl = useCallback(
    (next: Record<string, string | null | undefined>) => {
      const p = new URLSearchParams(searchParams.toString());
      Object.entries(next).forEach(([key, value]) => {
        if (value === null || value === undefined) p.delete(key);
        else p.set(key, value);
      });
      router.replace(`${route}?${p.toString()}`, { scroll: false });
    },
    [router, searchParams, route],
  );

  return { searchParams, setUrl };
}

export { useSuKlavye as useMemurKlavye } from "@/components/su/shared/useSuKlavye";
export { WorkspaceTabBar, SectionTabBar } from "@/components/su/shared/WorkspaceTabBar";
export { IslemActionBar } from "@/components/su/shared/IslemActionBar";
export { ReadOnlyInfoField } from "@/components/su/shared/ReadOnlyInfoField";
export {
  PersonelArama,
  PersonelSecici,
  DonemSecici,
  MemurBilgiOzeti,
  RaporFiltreSatiri,
  HesaplamaSonucTablosu,
  YetkiGuard,
  PrintPreviewPanel,
  MemurAuditLogPanel,
} from "./MemurShared";
