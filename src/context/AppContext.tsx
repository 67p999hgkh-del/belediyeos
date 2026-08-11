"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { municipalities, type Municipality } from "@/lib/modules";

interface AppContextValue {
  municipality: Municipality;
  setMunicipality: (m: Municipality) => void;
  user: { name: string; role: string; email: string };
  period: string;
  setPeriod: (p: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [municipality, setMunicipality] = useState<Municipality>(municipalities[0]);
  const [period, setPeriod] = useState("2026");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        municipality,
        setMunicipality,
        user: {
          name: "Ayşe Yılmaz",
          role: "Vezne Sorumlusu",
          email: "ayse@belediye.gov.tr",
        },
        period,
        setPeriod,
        sidebarOpen,
        setSidebarOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
