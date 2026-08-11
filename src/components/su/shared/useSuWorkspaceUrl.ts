"use client";

import { useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function useSuWorkspaceUrl(route: string) {
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
