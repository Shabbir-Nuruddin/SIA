export interface WikimediaVisual {
  id: string;
  title: string;
  imageUrl: string;
  pageUrl: string;
  license: string;
  licenseUrl?: string;
  author?: string;
  credit?: string;
}

export interface NotesVisualMap {
  definitions: Record<number, WikimediaVisual>;
}

interface FetchNoteVisualsInput {
  board: string;
  subject: string;
  unitLabel: string;
  topic: string;
  definitions: Array<{ term: string; meaning?: string }>;
}

const CACHE_PREFIX = "apex:wikimedia-definition-visuals:";
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;
const COMMONS_API = "https://commons.wikimedia.org/w/api.php";
const ALLOWED_LICENSES = [/^cc0\b/i, /^public domain$/i, /^pd\b/i, /^cc by\b/i, /^cc-by\b/i];
const BLOCKED_LICENSE_PARTS = ["-nc", " nc", "-nd", " nd", "noncommercial", "no derivatives"];

const stripHtml = (value?: string) =>
  String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

const normaliseTitle = (value: string) =>
  value
    .replace(/^File:/i, "")
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const cleanSearchText = (value: string) =>
  stripHtml(value)
    .replace(/\$[^$]*\$/g, " ")
    .replace(/\b(step|answer|therefore|because|calculate|explain|describe)\b/gi, " ")
    .replace(/[^a-z0-9\s-]/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 90);

const isAllowedLicense = (license: string) => {
  const normalized = license.toLowerCase();
  if (BLOCKED_LICENSE_PARTS.some((part) => normalized.includes(part))) return false;
  return ALLOWED_LICENSES.some((pattern) => pattern.test(license));
};

const cacheKey = (query: string) => `${CACHE_PREFIX}${query.toLowerCase()}`;

const readCache = (query: string): WikimediaVisual | null | undefined => {
  try {
    const raw = localStorage.getItem(cacheKey(query));
    if (!raw) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed || Date.now() - parsed.savedAt > CACHE_TTL_MS) return undefined;
    return parsed.visual ?? null;
  } catch {
    return undefined;
  }
};

const writeCache = (query: string, visual: WikimediaVisual | null) => {
  try {
    localStorage.setItem(cacheKey(query), JSON.stringify({ savedAt: Date.now(), visual }));
  } catch {
    // Ignore cache failures; Wikimedia results are progressive enhancement only.
  }
};

const buildSearchUrl = (query: string) => {
  const params = new URLSearchParams({
    action: "query",
    format: "json",
    origin: "*",
    generator: "search",
    gsrnamespace: "6",
    gsrlimit: "8",
    gsrsearch: query,
    prop: "imageinfo|info",
    inprop: "url",
    iiprop: "url|extmetadata|mime",
    iiurlwidth: "900",
  });
  return `${COMMONS_API}?${params.toString()}`;
};

export async function fetchWikimediaVisual(query: string, signal?: AbortSignal): Promise<WikimediaVisual | null> {
  const trimmed = cleanSearchText(query);
  if (trimmed.length < 4) return null;

  const cached = readCache(trimmed);
  if (cached !== undefined) return cached;

  try {
    const res = await fetch(buildSearchUrl(`${trimmed} diagram`), { signal });
    if (!res.ok) throw new Error(`Wikimedia request failed: ${res.status}`);
    const json = await res.json();
    const pages = Object.values(json?.query?.pages || {}) as any[];

    for (const page of pages) {
      const info = page?.imageinfo?.[0];
      const meta = info?.extmetadata || {};
      const license = stripHtml(meta.LicenseShortName?.value || meta.License?.value);
      const imageUrl = info?.thumburl || info?.url;
      const pageUrl = meta.ImageDescriptionUrl?.value || page?.fullurl;

      if (!imageUrl || !pageUrl || !license || !isAllowedLicense(license)) continue;
      if (String(info?.mime || "").startsWith("video/")) continue;

      const visual: WikimediaVisual = {
        id: String(page.pageid || page.title),
        title: normaliseTitle(page.title || meta.ObjectName?.value || trimmed),
        imageUrl,
        pageUrl,
        license,
        licenseUrl: meta.LicenseUrl?.value,
        author: stripHtml(meta.Artist?.value),
        credit: stripHtml(meta.Credit?.value),
      };
      writeCache(trimmed, visual);
      return visual;
    }
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.warn("Wikimedia visual lookup failed", err);
    }
  }

  writeCache(trimmed, null);
  return null;
}

export async function fetchNotesVisuals(input: FetchNoteVisualsInput, signal?: AbortSignal): Promise<NotesVisualMap> {
  const subject = cleanSearchText(input.subject);
  const board = cleanSearchText(input.board);
  const topic = cleanSearchText(input.topic);
  const definitions: Record<number, WikimediaVisual> = {};
  const seen = new Set<string>();

  const candidates = input.definitions
    .map((definition, index) => ({
      index,
      term: cleanSearchText(definition.term),
      meaning: cleanSearchText(definition.meaning || ""),
    }))
    .filter(({ term }) => term.length >= 4)
    .slice(0, 6);

  for (const candidate of candidates) {
    if (signal?.aborted) break;
    const visual = await fetchWikimediaVisual(
      [board, subject, topic, candidate.term, candidate.meaning].filter(Boolean).join(" "),
      signal
    );
    if (visual && !seen.has(visual.imageUrl)) {
      definitions[candidate.index] = visual;
      seen.add(visual.imageUrl);
    }
  }

  return { definitions };
}
