"use client";

import { useEffect } from "react";

export function useSuKlavye(opts: {
  onKaydet?: () => void;
  onIptal?: () => void;
  onCikis?: () => void;
  onAra?: () => void;
  kaydetEnabled?: boolean;
}) {
  const { onKaydet, onIptal, onCikis, onAra, kaydetEnabled } = opts;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "F12") {
        e.preventDefault();
        onCikis?.();
        return;
      }
      if (e.key === "F5") {
        e.preventDefault();
        onIptal?.();
        return;
      }
      if (e.key === "F8" && kaydetEnabled !== false && onKaydet) {
        e.preventDefault();
        onKaydet();
        return;
      }
      if (e.key === "F9" && onAra) {
        e.preventDefault();
        onAra();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKaydet, onIptal, onCikis, onAra, kaydetEnabled]);
}
