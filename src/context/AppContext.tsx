"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { municipalities, type Municipality } from "@/lib/modules";

interface AppContextValue {
  municipality: Municipality;
  setMunicipality: (m: Municipality) => void;
  user: { name: string; role: string };
  period: string;
  setPeriod: (p: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [municipality, setMunicipality] = useState<Municipality>(municipalities[0]);
  const [period, setPeriod] = useState("2024");

  return (
    <AppContext.Provider
      value={{
        municipality,
        setMunicipality,
        user: { name: "Ayşe", role: "Admin" },
        period,
        setPeriod,
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
