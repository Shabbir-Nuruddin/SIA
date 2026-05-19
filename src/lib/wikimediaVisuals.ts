import { supabase } from "@/integrations/supabase/client";

export interface WikimediaVisual {
  id: string;
  title: string;
  imageUrl: string;
  pageUrl: string;
}

export interface NotesVisualMap {
  definitions: Record<number, WikimediaVisual>;
}

interface FetchNoteVisualsInput {
  board: string;
  subject: string;
  unitLabel?: string;
  unitNumber?: number;
  topic: string;
  definitions: Array<{ term: string; meaning?: string }>;
}

interface GeneratedVisualPayload {
  definitions?: Array<{
    index: number;
    id?: string;
    title?: string;
    imageUrl?: string;
    pageUrl?: string;
  }>;
}

const MEMORY_CACHE_TTL_MS = 10 * 60 * 1000;
const visualsCache = new Map<string, { savedAt: number; value: NotesVisualMap }>();

const cleanText = (value: string) =>
  String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\$[^$]*\$/g, " ")
    .replace(/[^a-z0-9\s\-(),.]/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

const parseUnitNumber = (unitLabel?: string): number | undefined => {
  const match = String(unitLabel || "").match(/\d+/);
  if (!match) return undefined;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const buildCacheKey = (input: FetchNoteVisualsInput, unitNumber: number) =>
  JSON.stringify({
    board: cleanText(input.board).toLowerCase(),
    subject: cleanText(input.subject).toLowerCase(),
    unit: unitNumber,
    topic: cleanText(input.topic).toLowerCase(),
    defs: input.definitions
      .slice(0, 6)
      .map((definition) => ({
        term: cleanText(definition.term).toLowerCase(),
        meaning: cleanText(definition.meaning || "").toLowerCase(),
      })),
  });

export async function fetchNotesVisuals(
  input: FetchNoteVisualsInput,
  signal?: AbortSignal,
): Promise<NotesVisualMap> {
  const unitNumber = input.unitNumber ?? parseUnitNumber(input.unitLabel);
  if (!unitNumber) return { definitions: {} };

  const candidates = input.definitions
    .map((definition, index) => ({
      index,
      term: cleanText(definition.term),
      meaning: cleanText(definition.meaning || ""),
    }))
    .filter(({ term }) => term.length >= 3)
    .slice(0, 6);

  if (candidates.length === 0) return { definitions: {} };
  if (signal?.aborted) return { definitions: {} };

  const cacheKey = buildCacheKey(input, unitNumber);
  const cached = visualsCache.get(cacheKey);
  if (cached && Date.now() - cached.savedAt < MEMORY_CACHE_TTL_MS) {
    return cached.value;
  }

  try {
    const { data, error } = await supabase.functions.invoke("ai-note-visuals", {
      body: {
        board: input.board,
        subject: input.subject,
        unit_number: unitNumber,
        topic: input.topic,
        definitions: candidates,
      },
    });

    if (signal?.aborted) return { definitions: {} };
    if (error) {
      console.warn("AI note visuals failed", error);
      return { definitions: {} };
    }

    const payload = (data || {}) as GeneratedVisualPayload;
    const definitions: Record<number, WikimediaVisual> = {};
    const seenUrls = new Set<string>();

    for (const item of payload.definitions || []) {
      const index = Number(item.index);
      const imageUrl = String(item.imageUrl || "");
      if (!Number.isFinite(index) || !imageUrl || seenUrls.has(imageUrl)) continue;
      seenUrls.add(imageUrl);
      definitions[index] = {
        id: String(item.id || `${cleanText(input.topic)}-${index}`),
        title: String(item.title || candidates.find((c) => c.index === index)?.term || "AI diagram"),
        imageUrl,
        pageUrl: String(item.pageUrl || "https://huggingface.co/aiyouthalliance/Free-Image-Generation"),
      };
    }

    const value = { definitions };
    visualsCache.set(cacheKey, { savedAt: Date.now(), value });
    return value;
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.warn("AI note visuals fetch crashed", err);
    }
    return { definitions: {} };
  }
}
