// Currency helpers shared across pricing surfaces.
// Base prices are stored in AED and converted to display currency at render time.

export type Currency = "AED" | "GBP" | "USD" | "INR";

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; code: string }> = {
  AED: { symbol: "AED", rate: 1, code: "AED" },
  GBP: { symbol: "£", rate: 0.2126, code: "GBP" },   // 39.99 AED ≈ £8.50
  USD: { symbol: "$", rate: 0.2723, code: "USD" },   // 39.99 AED ≈ $10.89
  INR: { symbol: "₹", rate: 23.0, code: "INR" },     // 39.99 AED ≈ ₹920
};

export const CURRENCY_OPTIONS: Currency[] = ["AED", "GBP", "USD", "INR"];

export const formatCurrency = (aed: number, currency: Currency): string => {
  const { symbol, rate } = CURRENCY_RATES[currency];
  if (aed === 0) return currency === "AED" ? "AED 0" : `${symbol}0`;
  const v = aed * rate;
  if (currency === "AED") return `AED ${v.toFixed(2)}`;
  if (currency === "INR") return `${symbol}${Math.round(v).toLocaleString("en-IN")}`;
  return `${symbol}${(Math.round(v * 100) / 100).toFixed(2)}`;
};

/**
 * Detect the user's preferred display currency.
 * Indian users see INR by default (never AED). Otherwise default to AED.
 */
export const detectDefaultCurrency = (): Currency => {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return "INR";
    const langs = [
      ...(navigator.languages || []),
      navigator.language || "",
    ].map((l) => l.toLowerCase());
    if (langs.some((l) => l.endsWith("-in") || l === "hi" || l.startsWith("hi-"))) return "INR";
  } catch {
    /* ignore */
  }
  return "AED";
};
