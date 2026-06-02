// Theme system — applies a CSS class to <html> that swaps the design tokens
// defined in src/index.css. Persists across sessions via localStorage AND
// the `profiles.theme` column when the user is signed in.

export type ThemeName =
  | "sia"        // SIA red + white (school default)
  | "midnight"   // default dark navy
  | "light"      // clean light
  | "ocean"      // dark teal
  | "forest"     // dark green
  | "rose"       // dark warm rose
  | "amber"      // dark warm amber
  | "paper"      // warm light paper
  | "notebook"   // cream notebook paper
  | "inkwell";   // dark notebook / chalkboard

export interface ThemeMeta {
  name: ThemeName;
  label: string;
  swatches: [string, string, string, string]; // hex for the picker preview
  isLight: boolean;
}

export const THEMES: ThemeMeta[] = [
  { name: "sia",      label: "SIA Red",    isLight: true,  swatches: ["#ffffff", "#fbeaec", "#c8102e", "#7a0a1c"] },
  { name: "notebook", label: "Notebook",   isLight: true,  swatches: ["#f7f0d9", "#ffffff", "#3b6fd8", "#dc2c5e"] },
  { name: "inkwell",  label: "Inkwell",    isLight: false, swatches: ["#161e2c", "#1d2636", "#f0b740", "#d8487a"] },
  { name: "midnight", label: "Midnight",   isLight: false, swatches: ["#0f1620", "#1a2332", "#3b6fb8", "#7aa8e8"] },
  { name: "ocean",    label: "Ocean",      isLight: false, swatches: ["#0a1f2a", "#13323f", "#2d8a9e", "#5cbdb9"] },
  { name: "forest",   label: "Forest",     isLight: false, swatches: ["#0f1d16", "#16291e", "#2d8a4e", "#7ad19e"] },
  { name: "rose",     label: "Rose Noir",  isLight: false, swatches: ["#1d1216", "#2a1a20", "#d96a8a", "#f0a8b8"] },
  { name: "amber",    label: "Ember",      isLight: false, swatches: ["#1a1410", "#2a1f18", "#d97706", "#f0b85a"] },
  { name: "light",    label: "Daylight",   isLight: true,  swatches: ["#f7f9fc", "#ffffff", "#3b6fb8", "#1f3a5f"] },
  { name: "paper",    label: "Warm Paper", isLight: true,  swatches: ["#f5f0e6", "#ffffff", "#a05a2c", "#3a2a1a"] },
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
