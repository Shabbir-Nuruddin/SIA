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
  // Keep legacy `light` class working for css that still targets html.light
  html.classList.remove("light");
  html.classList.add(`theme-${theme}`);
  if (THEMES.find(t => t.name === theme)?.isLight) html.classList.add("light");
  try { localStorage.setItem(STORAGE_KEY, theme); } catch {}
}

export function getStoredTheme(): ThemeName {
  try { return normalise(localStorage.getItem(STORAGE_KEY)); } catch { return "sia"; }
}

// Apply immediately on module import so first paint is themed.
if (typeof document !== "undefined") {
  applyTheme(getStoredTheme());
}
