import { createContext, useContext, useEffect, useState } from "react";

export type SidebarMode = "expanded" | "rail" | "hidden";

const KEY = "mmr-sidebar-mode";

interface Ctx {
  mode: SidebarMode;
  setMode: (m: SidebarMode) => void;
  cycle: () => void;
}

const SidebarCtx = createContext<Ctx | null>(null);

export const SidebarModeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<SidebarMode>(() => {
    try {
      const v = localStorage.getItem(KEY) as SidebarMode | null;
      return v ?? "expanded";
    } catch { return "expanded"; }
  });
  const setMode = (m: SidebarMode) => {
    setModeState(m);
    try { localStorage.setItem(KEY, m); } catch {}
  };
  const cycle = () => setMode(mode === "expanded" ? "rail" : mode === "rail" ? "hidden" : "expanded");
  useEffect(() => {
    document.documentElement.dataset.sidebar = mode;
  }, [mode]);
  return <SidebarCtx.Provider value={{ mode, setMode, cycle }}>{children}</SidebarCtx.Provider>;
};

export const useSidebarMode = () => {
  const ctx = useContext(SidebarCtx);
  if (!ctx) throw new Error("useSidebarMode must be used inside SidebarModeProvider");
  return ctx;
};
