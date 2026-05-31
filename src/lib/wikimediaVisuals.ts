import { supabase } from "@/integrations/supabase/client";

export interface TopicVisual {
  id: string;
  title: string;
  imageUrl: string;
  isOverview?: boolean;
}

export interface NotesVisualMap {
  overviewImage: TopicVisual | null;
  definitions: Record<number, TopicVisual>;
}

interface FetchNoteVisualsInput {
  board: string;
  subject: string;
  unitCode?: string;
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
    isOverview?: boolean;
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

const buildCacheKey = (input: FetchNoteVisualsInput) =>
  JSON.stringify({
    board: cleanText(input.board).toLowerCase(),
    subject: cleanText(input.subject).toLowerCase(),
    unit: input.unitNumber,
    topic: cleanText(input.topic).toLowerCase(),
  });

export async function fetchNotesVisuals(
  input: FetchNoteVisualsInput,
  signal?: AbortSignal,
): Promise<NotesVisualMap> {
  const empty: NotesVisualMap = { overviewImage: null, definitions: {} };

  if (!input.unitNumber) return empty;
  if (signal?.aborted) return empty;

  const cacheKey = buildCacheKey(input);
  const cached = visualsCache.get(cacheKey);
  if (cached && Date.now() - cached.savedAt < MEMORY_CACHE_TTL_MS) {
    return cached.value;
  }

  // Only pass the first 2 definitions to keep generation fast and accurate
  const candidates = input.definitions
    .slice(0, 2)
    .map((d, index) => ({
      index,
      term: cleanText(d.term),
      meaning: cleanText(d.meaning || ""),
    }))
    .filter(({ term }) => term.length >= 3);

  try {
    const { data, error } = await supabase.functions.invoke("ai-note-visuals", {
      body: {
        board: input.board,
        subject: input.subject,
        unit_code: input.unitCode || "",
        unit_number: input.unitNumber,
        topic: input.topic,
        definitions: candidates,
      },
    });

    if (signal?.aborted) return empty;
    if (error) {
      console.warn("AI note visuals failed", error);
      return empty;
    }

    const payload = (data || {}) as GeneratedVisualPayload;
    let overviewImage: TopicVisual | null = null;
    const definitions: Record<number, TopicVisual> = {};

    for (const item of payload.definitions || []) {
      const imageUrl = String(item.imageUrl || "");
      if (!imageUrl) continue;

      const visual: TopicVisual = {
        id: String(item.id || `${cleanText(input.topic)}-${item.index}`),
        title: String(item.title || input.topic),
        imageUrl,
        isOverview: item.isOverview,
      };

      if (item.isOverview || item.index === -1) {
        overviewImage = visual;
      } else {
        const index = Number(item.index);
        if (Number.isFinite(index)) definitions[index] = visual;
      }
    }

    const value: NotesVisualMap = { overviewImage, definitions };
    visualsCache.set(cacheKey, { savedAt: Date.now(), value });
    return value;
  } catch (err) {
    if ((err as Error).name !== "AbortError") {
      console.warn("AI note visuals fetch crashed", err);
    }
    return empty;
  }
}
