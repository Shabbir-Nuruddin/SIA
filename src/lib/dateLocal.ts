// Local-date helpers. NEVER use new Date().toISOString().slice(0,10) for "today" —
// that returns the UTC date and is off by one in timezones ahead of UTC (e.g. UAE, IST).

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDaysLocal(base: Date, n: number): Date {
  const x = new Date(base);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() + n);
  return x;
}

export function localDateAtOffset(n: number, base: Date = new Date()): string {
  return getLocalDateString(addDaysLocal(base, n));
}

// Parse 'YYYY-MM-DD' (or a full ISO timestamp) as a local date at midnight,
// so day-difference math is timezone-stable across stored formats.
export function parseLocalDate(iso: string): Date {
  if (!iso) return new Date(NaN);
  // Only the calendar date matters — strip any time/zone suffix.
  const datePart = iso.slice(0, 10);
  const [y, m, d] = datePart.split("-").map(Number);
  if (!y || !m || !d) return new Date(NaN);
  return new Date(y, m - 1, d);
}

export function daysBetweenLocal(fromIso: string, toIso: string): number {
  const a = parseLocalDate(fromIso);
  const b = parseLocalDate(toIso);
  if (isNaN(+a) || isNaN(+b)) return 0;
  return Math.round((+b - +a) / 86400000);
}

export function daysFromTodayLocal(toIso: string): number {
  return daysBetweenLocal(getLocalDateString(), toIso);
}
