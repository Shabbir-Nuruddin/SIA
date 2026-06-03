// Theme system — applies a CSS class to <html> that swaps the design tokens
// defined in src/index.css. Persists across sessions via localStorage AND
// the `profiles.theme` column when the user is signed in.

// SIA is a single-theme app: collegiate red + white only.
export type ThemeName = "sia";

export interface ThemeMeta {
  name: ThemeName;
  label: string;
  swatches: [string, string, string, string]; // hex for the picker preview
  isLight: boolean;
}

export const THEMES: ThemeMeta[] = [
  { name: "sia", label: "SIA Red", isLight: true, swatches: ["#ffffff", "#fbeaec", "#c8102e", "#7a0a1c"] },
];

const STORAGE_KEY = "apex_theme";
const ALL_CLASSES = THEMES.map(t => `theme-${t.name}`);

// Map legacy values from when "theme" was just "dark" | "light".
const normalise = (raw: string | null | undefined): ThemeName => {
  if (!raw) return "sia";
  if (raw === "dark") return "midnight";
  if (THEMES.some(t => t.name === raw)) return raw as ThemeName;
  return "sia";
};

export function applyTheme(name: string | null | undefined) {
  const theme = normalise(name);
  const html = document.documentElement;
  ALL_CLASSES.forEach(c => html.classList.remove(c));
  html.classList.add(`theme-${theme}`);
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
  // Light/dark is controlled separately by the mode (see applyMode).
}

export function getStoredTheme(): ThemeName {
  try { return normalise(localStorage.getItem(STORAGE_KEY)); } catch { return "sia"; }
}

// ── Light / Dark / Auto mode ────────────────────────────────────────────────
// The SIA brand stays the same; the mode just swaps light vs dark tokens. "auto"
// follows the OS preference and updates live when the OS theme changes.
export type ThemeMode = "light" | "dark" | "auto";
const MODE_KEY = "apex_mode";

export function getStoredMode(): ThemeMode {
  try {
    const m = localStorage.getItem(MODE_KEY);
    return m === "dark" || m === "auto" ? m : "light";
  } catch { return "light"; }
}

const prefersDark = () => {
  try { return window.matchMedia("(prefers-color-scheme: dark)").matches; } catch { return false; }
};

let modeMediaListener: ((e: MediaQueryListEvent) => void) | null = null;

export function applyMode(mode: ThemeMode) {
  const html = document.documentElement;
  const setDark = (dark: boolean) => {
    html.classList.toggle("dark", dark);
    html.classList.toggle("light", !dark);
  };
  setDark(mode === "dark" || (mode === "auto" && prefersDark()));
  try { localStorage.setItem(MODE_KEY, mode); } catch {}

  // Only listen to the OS in "auto" mode; tear down any previous listener first.
  try {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (modeMediaListener) { mq.removeEventListener("change", modeMediaListener); modeMediaListener = null; }
    if (mode === "auto") {
      modeMediaListener = (e) => setDark(e.matches);
      mq.addEventListener("change", modeMediaListener);
    }
  } catch { /* matchMedia unsupported — ignore */ }
}

// Apply immediately on module import so first paint is themed.
if (typeof document !== "undefined") {
  applyTheme(getStoredTheme());
  applyMode(getStoredMode());
}
