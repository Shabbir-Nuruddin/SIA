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

// Parse 'YYYY-MM-DD' as a local date (midnight local), not UTC.
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

export function daysBetweenLocal(fromIso: string, toIso: string): number {
  const a = parseLocalDate(fromIso);
  const b = parseLocalDate(toIso);
  return Math.round((+b - +a) / 86400000);
}

export function daysFromTodayLocal(toIso: string): number {
  return daysBetweenLocal(getLocalDateString(), toIso);
}
